import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/boms', async (_req: Request, res: Response) => {
  const boms = await prisma.bOM.findMany({ include: { item: true, bomItems: { include: { item: true } } } });
  res.json(boms);
});
router.get('/work-orders', async (_req: Request, res: Response) => {
  const wos = await prisma.workOrder.findMany({ include: { bom: { include: { item: true } } } });
  res.json(wos);
});
router.post('/boms', async (req: Request, res: Response) => {
  try {
    const { itemCode, quantity, items } = req.body;
    const bomItems = items.map((i: any) => ({ itemCode: i.itemCode, qty: i.qty, uom: i.uom || 'Nos' }));
    const bom = await prisma.bOM.create({
      data: { itemCode, quantity: Number(quantity), bomItems: { create: bomItems } }
    });
    res.status(201).json(bom);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create BOM' });
  }
});
router.post('/work-orders', async (req: Request, res: Response) => {
  try {
    const { bomId, plannedQty, plannedStart, plannedEnd } = req.body;
    const wo = await prisma.workOrder.create({
      data: { 
        bomId, 
        plannedQty: Number(plannedQty), 
        plannedStart: plannedStart ? new Date(plannedStart) : null,
        plannedEnd: plannedEnd ? new Date(plannedEnd) : null
      }
    });
    res.status(201).json(wo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create Work Order' });
  }
});

export default router;
