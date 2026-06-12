import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/vendors', async (_req: Request, res: Response) => {
  const vendors = await prisma.vendor.findMany({ include: { supplier: true } });
  res.json(vendors);
});
router.post('/vendors', async (req: Request, res: Response) => {
  const { name, email, phone, country, paymentTerms } = req.body;
  try {
    const vendor = await prisma.vendor.create({
      data: { name, email, phone, country, paymentTerms }
    });
    res.status(201).json(vendor);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create vendor' });
  }
});
router.delete('/vendors/:id', async (req: Request, res: Response) => {
  const id = req.params.id as string;
  try {
    const hasPOs = await prisma.purchaseOrder.findFirst({ where: { vendorId: id } });
    if (hasPOs) return res.status(400).json({ error: 'Cannot delete vendor with existing Purchase Orders' });
    await prisma.vendor.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete vendor' });
  }
});
router.get('/purchase-orders', async (_req: Request, res: Response) => {
  const pos = await prisma.purchaseOrder.findMany({ include: { vendor: true, items: { include: { item: true } } } });
  res.json(pos);
});
router.post('/purchase-orders', async (req: Request, res: Response) => {
  const { vendorId, items, expectedDate } = req.body;
  let grandTotal = 0;
  const poItems = items.map((i: any) => { grandTotal += i.rate * i.qty; return { itemCode: i.itemCode, qty: i.qty, rate: i.rate, amount: i.rate * i.qty }; });
  const po = await prisma.purchaseOrder.create({
    data: { vendorId, grandTotal, expectedDate: expectedDate ? new Date(expectedDate) : undefined, items: { create: poItems } },
    include: { items: true }
  });
  res.status(201).json(po);
});
router.get('/grns', async (_req: Request, res: Response) => {
  const grns = await prisma.goodsReceiptNote.findMany({ include: { purchaseOrder: { include: { vendor: true } }, items: { include: { item: true } } } });
  res.json(grns);
});
router.post('/grns', async (req: Request, res: Response) => {
  const { purchaseOrderId } = req.body;
  try {
    const po = await prisma.purchaseOrder.findUnique({ where: { id: purchaseOrderId }, include: { items: true } });
    if(!po) return res.status(404).json({ error: 'PO not found' });
    const grn = await prisma.goodsReceiptNote.create({
      data: {
        purchaseOrderId,
        status: 'Received',
        items: {
          create: po.items.map((i: any) => ({
            itemCode: i.itemCode,
            qtyReceived: i.qty,
            qtyRejected: 0
          }))
        }
      }
    });
    await prisma.purchaseOrder.update({ where: { id: purchaseOrderId }, data: { status: 'Received' } });
    res.status(201).json(grn);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create GRN' });
  }
});

export default router;
