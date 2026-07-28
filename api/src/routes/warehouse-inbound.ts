import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// ==========================================
// WMS Phase 3: Inbound Operations & GRN
// ==========================================

// GET /api/v1/warehouse-inbound/:id (Fetch full receiving state)
router.get('/:id', async (req, res) => {
  try {
    const receiving = await prisma.warehouseReceiving.findUnique({
      where: { id: req.params.id },
      include: {
        vehicle: true,
        shipment: true,
        items: true,
        inspection: true,
        grn: true,
        documents: true,
        putawayRequest: true
      }
    });
    if (!receiving) return res.status(404).json({ error: 'Receiving record not found' });
    res.json(receiving);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch receiving data' });
  }
});

// POST /api/v1/warehouse-inbound (Create Receiving)
router.post('/', async (req, res) => {
  try {
    const receiving = await prisma.warehouseReceiving.create({
      data: req.body,
      include: { items: true, vehicle: true, shipment: true }
    });
    res.status(201).json(receiving);
  } catch (error: any) {
    if (error.code === 'P2002') return res.status(409).json({ error: 'Receiving Number must be unique.' });
    res.status(500).json({ error: 'Failed to create receiving record' });
  }
});

// PUT /api/v1/warehouse-inbound/:id/items (Update Item quantities)
router.put('/:id/items', async (req, res) => {
  try {
    const { items } = req.body;
    
    // Process bulk upsert/updates for items
    const updatedItems = await Promise.all(
      items.map((item: any) => 
        prisma.receivingItem.upsert({
          where: { id: item.id || 'new' }, // 'new' will fail finding, triggering create
          update: {
            receivedQty: item.receivedQty,
            acceptedQty: item.acceptedQty,
            rejectedQty: item.rejectedQty
          },
          create: {
            ...item,
            receivingId: req.params.id
          }
        })
      )
    );
    
    res.json({ message: 'Items updated successfully', items: updatedItems });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update receiving items' });
  }
});

// POST /api/v1/warehouse-inbound/:id/grn (Generate GRN)
router.post('/:id/grn', async (req, res) => {
  try {
    const { id } = req.params;
    const { warehouseId, supplier, receivedBy } = req.body;
    
    // Verify receiving exists and isn't already GRN generated
    const receiving = await prisma.warehouseReceiving.findUnique({ where: { id } });
    if (!receiving) return res.status(404).json({ error: 'Receiving record not found' });
    if (receiving.status === 'GRN_GENERATED' || receiving.status === 'APPROVED') {
      return res.status(400).json({ error: 'GRN already generated for this receiving' });
    }

    const grn = await prisma.goodsReceiptNote.create({
      data: {
        grnNumber: \`GRN-\${Date.now()}\`,
        receivingId: id,
        warehouseId,
        supplier,
        receivedBy,
        status: 'GENERATED'
      }
    });

    await prisma.warehouseReceiving.update({
      where: { id },
      data: { status: 'GRN_GENERATED' }
    });

    res.json({ message: 'GRN generated successfully', grn });
  } catch (error: any) {
    if (error.code === 'P2002') return res.status(409).json({ error: 'GRN Number must be unique.' });
    res.status(500).json({ error: 'Failed to generate GRN' });
  }
});

// POST /api/v1/warehouse-inbound/:id/approve (Approve GRN & Dispatch Putaway Job)
router.post('/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    const { approvedBy } = req.body;

    // 1. Update GRN and Receiving Status
    const grn = await prisma.goodsReceiptNote.update({
      where: { receivingId: id },
      data: { status: 'APPROVED', approvedBy }
    });

    await prisma.warehouseReceiving.update({
      where: { id },
      data: { status: 'APPROVED' }
    });

    // 2. MOCK BULLMQ ASYNC WORKER PIPELINE
    // In production, we'd do: putawayQueue.add('generate-putaway', { receivingId: id })
    // Here we simulate the worker generating the PutawayRequest asynchronously.
    setTimeout(async () => {
      try {
        console.log(\`[BullMQ Worker] Generating Putaway Request for Receiving ID: \${id}\`);
        
        const putaway = await prisma.putawayRequest.create({
          data: {
            putawayNumber: \`PWR-\${Date.now()}\`,
            receivingId: id,
            priority: 'NORMAL',
            status: 'PENDING'
          }
        });
        
        // MOCK SOCKET.IO EMISSION
        // io.to(warehouseId).emit('putaway_generated', putaway);
        console.log(\`[Socket.IO] Emitted putaway_generated: \${putaway.putawayNumber}\`);
      } catch (err) {
        console.error('[BullMQ Worker] Putaway Generation Failed', err);
      }
    }, 2000); // 2 second delay to simulate heavy processing

    res.json({ 
      message: 'Receiving approved. Putaway generation job dispatched to BullMQ worker.',
      grn 
    });
  } catch (error) {
    console.error('Error approving receiving:', error);
    res.status(500).json({ error: 'Failed to approve receiving' });
  }
});

export default router;
