import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  try {
    const grns = await prisma.goodsReceiptNote.findMany({
      include: { purchaseOrder: { include: { vendor: true } }, items: true },
      orderBy: { receivedDate: 'desc' }
    });
    res.json(grns);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { purchaseOrderId, warehouseId, receivedBy, notes, items } = req.body;
    
    const count = await prisma.goodsReceiptNote.count();
    const grnNumber = `GRN-${new Date().getFullYear()}-${(count + 1).toString().padStart(5, '0')}`;

    const grn = await prisma.goodsReceiptNote.create({
      data: {
        grnNumber,
        purchaseOrderId,
        warehouseId,
        receivedBy,
        notes,
        status: 'Posted',
        items: {
          create: items.map((i: any) => ({
            itemCode: i.itemCode,
            qtyReceived: i.qtyReceived,
            qtyAccepted: i.qtyAccepted || i.qtyReceived,
            qtyRejected: i.qtyRejected || 0,
            batchNumber: i.batchNumber,
            expiryDate: i.expiryDate ? new Date(i.expiryDate) : null
          }))
        }
      },
      include: { items: true }
    });

    // Update Inventory Stock (Simulation)
    for (const item of items) {
      if (item.qtyAccepted > 0 && warehouseId) {
        // Create an Inventory Transaction (Simulation of ledger update)
        /*
        await prisma.stockMovement.create({
          data: {
            itemId: item.itemCode,
            fromLocation: 'VENDOR',
            toLocation: warehouseId,
            quantity: item.qtyAccepted,
            type: 'IN',
            referenceId: grn.grnNumber,
            date: new Date()
          }
        });
        */
        
        // Update PO Item qtyReceived
        const poItem = await prisma.pOItem.findFirst({
           where: { purchaseOrderId: purchaseOrderId, itemCode: item.itemCode }
        });
        if(poItem) {
           await prisma.pOItem.update({
             where: { id: poItem.id },
             data: { qtyReceived: poItem.qtyReceived + item.qtyAccepted }
           });
        }
      }
    }

    // Update PO Status to Partial or Complete Receipt
    await prisma.purchaseOrder.update({
       where: { id: purchaseOrderId },
       data: { status: 'Partial_Receipt' }
    });

    res.status(201).json(grn);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
