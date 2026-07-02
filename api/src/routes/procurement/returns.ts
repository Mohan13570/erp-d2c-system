import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  try {
    const returns = await prisma.purchaseReturn.findMany({
      include: { purchaseOrder: true, items: { include: { item: true } } },
      orderBy: { returnDate: 'desc' }
    });
    res.json(returns);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { purchaseOrderId, vendorId, reason, type, items } = req.body;
    
    const count = await prisma.purchaseReturn.count();
    const returnNumber = `PRTN-${new Date().getFullYear()}-${(count + 1).toString().padStart(5, '0')}`;

    const returnData = await prisma.purchaseReturn.create({
      data: {
        returnNumber,
        purchaseOrderId,
        vendorId,
        reason,
        type,
        status: 'Draft',
        items: {
          create: items.map((i: any) => ({
            itemCode: i.itemCode,
            qtyReturned: i.qtyReturned,
            uom: i.uom,
            unitPrice: i.unitPrice
          }))
        }
      },
      include: { items: true }
    });

    res.status(201).json(returnData);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
