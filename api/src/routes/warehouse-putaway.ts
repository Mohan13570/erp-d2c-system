import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// ==========================================
// WMS Phase 4: Putaway Management
// ==========================================

// GET /api/v1/warehouse-putaway/:id
router.get('/:id', async (req, res) => {
  try {
    const task = await prisma.putawayTask.findUnique({
      where: { id: req.params.id },
      include: {
        items: true,
        location: true,
        rules: true,
        assignment: true,
        execution: true,
        exceptions: true
      }
    });
    if (!task) return res.status(404).json({ error: 'Putaway Task not found' });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch putaway task' });
  }
});

// POST /api/v1/warehouse-putaway/:id/suggest (Location Suggestion Engine)
router.post('/:id/suggest', async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Validate Task
    const task = await prisma.putawayTask.findUnique({ where: { id } });
    if (!task) return res.status(404).json({ error: 'Task not found' });

    // 2. MOCK BULLMQ LOCATION ENGINE
    // In production, we push to a BullMQ queue: locationEngineQueue.add('calculate-bin', { taskId: id })
    console.log(\`[BullMQ Engine] Analyzing storage rules for Task \${id}...\`);
    
    setTimeout(async () => {
      try {
        // Engine Result Mock
        const suggestedLocation = await prisma.putawayLocation.upsert({
          where: { taskId: id },
          update: {
            suggestedBlock: 'BLK-A (Dry)',
            suggestedZone: 'ZON-A1 (Fast Moving)',
            suggestedAisle: 'ASL-04',
            suggestedRack: 'RCK-12',
            suggestedShelf: 'SHF-L2',
            suggestedBin: 'BIN-12-L2-05',
            availableCapacity: 50,
            remainingCapacity: 20,
            storageType: 'PALLET',
            suggestionScore: 98.5
          },
          create: {
            taskId: id,
            suggestedBlock: 'BLK-A (Dry)',
            suggestedZone: 'ZON-A1 (Fast Moving)',
            suggestedAisle: 'ASL-04',
            suggestedRack: 'RCK-12',
            suggestedShelf: 'SHF-L2',
            suggestedBin: 'BIN-12-L2-05',
            availableCapacity: 50,
            remainingCapacity: 20,
            storageType: 'PALLET',
            suggestionScore: 98.5
          }
        });
        
        await prisma.putawayTask.update({
          where: { id },
          data: { status: 'SUGGESTED' }
        });

        // MOCK SOCKET.IO EMISSION
        console.log(\`[Socket.IO] Emitted putaway_suggested: \${suggestedLocation.suggestedBin}\`);
      } catch (err) {
        console.error('[BullMQ Engine] Calculation Failed', err);
      }
    }, 2500); // 2.5s delay to simulate heavy rule-engine computation

    res.json({ message: 'Suggestion calculation dispatched to BullMQ engine.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to dispatch suggestion engine' });
  }
});

// POST /api/v1/warehouse-putaway/:id/assign
router.post('/:id/assign', async (req, res) => {
  try {
    const { id } = req.params;
    const { operatorId, operatorName, equipmentType, equipmentId } = req.body;
    
    await prisma.putawayAssignment.upsert({
      where: { taskId: id },
      update: { operatorId, operatorName, equipmentType, equipmentId },
      create: { taskId: id, operatorId, operatorName, equipmentType, equipmentId, estimatedDuration: 15 }
    });

    const task = await prisma.putawayTask.update({
      where: { id },
      data: { status: 'ASSIGNED' }
    });

    res.json({ message: 'Task assigned successfully', task });
  } catch (error) {
    res.status(500).json({ error: 'Failed to assign task' });
  }
});

// POST /api/v1/warehouse-putaway/:id/confirm
router.post('/:id/confirm', async (req, res) => {
  try {
    const { id } = req.params;
    const { confirmedBy, finalBin, finalQuantity, barcodeScanned } = req.body;
    
    if (!barcodeScanned) {
      return res.status(400).json({ error: 'Barcode/QR verification is strictly required for confirmation.' });
    }

    await prisma.putawayExecution.upsert({
      where: { taskId: id },
      update: { confirmedBy, finalBin, finalQuantity, barcodeScanned, endTime: new Date() },
      create: { taskId: id, confirmedBy, finalBin, finalQuantity, barcodeScanned, endTime: new Date() }
    });

    const task = await prisma.putawayTask.update({
      where: { id },
      data: { status: 'COMPLETED' }
    });
    
    // In production, this would trigger an Inventory module update.
    console.log(\`[WMS Engine] Inventory logic bypassed per rules. Putaway \${id} completed.\`);

    res.json({ message: 'Putaway confirmed successfully', task });
  } catch (error) {
    res.status(500).json({ error: 'Failed to confirm putaway' });
  }
});

export default router;
