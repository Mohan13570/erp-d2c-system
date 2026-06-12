import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// GET ALL SALES ORDERS
router.get('/', async (_req: Request, res: Response) => {
  try {
    const orders = await prisma.salesOrder.findMany({
      include: { items: { include: { item: true } }, customer: true, d2cCustomer: true }
    });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch sales orders' });
  }
});

// GET SINGLE ORDER
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const order = await prisma.salesOrder.findUnique({
      where: { id: req.params.id as string },
      include: { items: { include: { item: true } }, customer: true }
    });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// CREATE SALES ORDER (from D2C checkout)
router.post('/', async (req: Request, res: Response) => {
  const { customerName, items } = req.body;
  try {
    let customer = await prisma.customer.findFirst({ where: { customerName } });
    if (!customer) {
      customer = await prisma.customer.create({ data: { customerName } });
    }

    let grandTotal = 0;
    const orderItemsData: { itemCode: string; qty: number; rate: number; amount: number }[] = [];

    for (const item of items) {
      const product = await prisma.item.findUnique({ where: { itemCode: item.itemCode as string } });
      if (!product) continue;
      const rate = product.standardRate;
      const amount = rate * item.qty;
      grandTotal += amount;
      orderItemsData.push({ itemCode: product.itemCode, qty: item.qty, rate, amount });
    }

    const salesOrder = await prisma.salesOrder.create({
      data: {
        customerId: customer.id,
        grandTotal,
        status: 'To Deliver and Bill',
        channel: 'D2C',
        items: { create: orderItemsData }
      },
      include: { items: true, customer: true }
    });

    res.status(201).json(salesOrder);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Failed to process sales order' });
  }
});

// UPDATE ORDER STATUS
router.patch('/:id/status', async (req: Request, res: Response) => {
  try {
    const order = await prisma.salesOrder.update({
      where: { id: req.params.id as string },
      data: { status: req.body.status }
    });
    res.json(order);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update order status' });
  }
});

// DELETE ORDER
router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  // Delete line items first due to foreign key constraints
  await prisma.salesOrderItem.deleteMany({ where: { salesOrderId: id as string } });
  // Delete the order
  await prisma.salesOrder.delete({ where: { id: id as string } });
  res.json({ success: true });
});

export default router;
