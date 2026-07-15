import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, checkPermission, AuthRequest } from '../middleware/auth';
import { logAudit } from '../utils/audit';

const router = Router();
const prisma = new PrismaClient();

// GET ALL SALES ORDERS
router.get('/', authenticateToken, checkPermission('Sales Orders'), async (req: AuthRequest, res: Response) => {
  try {
    const paginate = req.query.paginate === 'true';

    if (paginate) {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;
      const search = req.query.search as string;
      const status = req.query.status as string;
      const channel = req.query.channel as string;

      const where: any = {};
      if (status && status !== 'All') {
        where.status = status;
      }
      if (channel && channel !== 'All') {
        where.channel = channel;
      }
      if (search) {
        where.OR = [
          { id: { contains: search } },
          { customer: { customerName: { contains: search } } },
          { d2cCustomer: { firstName: { contains: search } } },
          { d2cCustomer: { lastName: { contains: search } } }
        ];
      }

      const [orders, total] = await Promise.all([
        prisma.salesOrder.findMany({
          where,
          include: { items: { include: { item: true } }, customer: true, d2cCustomer: true },
          orderBy: { transactionDate: 'desc' },
          skip,
          take: limit
        }),
        prisma.salesOrder.count({ where })
      ]);

      res.json({
        orders,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      });
    } else {
      const orders = await prisma.salesOrder.findMany({
        include: { items: { include: { item: true } }, customer: true, d2cCustomer: true },
        orderBy: { transactionDate: 'desc' }
      });
      res.json(orders);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch sales orders' });
  }
});

// GET SINGLE ORDER
router.get('/:id', authenticateToken, checkPermission('Sales Orders'), async (req: AuthRequest, res: Response) => {
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

// CREATE SALES ORDER (from D2C checkout or Admin B2B create)
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
        status: 'Pending', // New default status is Pending
        channel: req.body.channel || 'D2C',
        items: { create: orderItemsData }
      },
      include: { items: true, customer: true }
    });

    // Parse token if available to log user id in audit log
    let userId = null;
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token) {
      try {
        const jwt = require('jsonwebtoken');
        const { JWT_SECRET } = require('../middleware/auth');
        const decoded = jwt.verify(token, JWT_SECRET);
        userId = decoded.id;
      } catch (e) {}
    }

    // Log Audit
    await logAudit(
      userId,
      'CREATE',
      'SalesOrder',
      salesOrder.id,
      null,
      salesOrder,
      req.ip || req.socket.remoteAddress
    );

    res.status(201).json(salesOrder);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Failed to process sales order' });
  }
});

// UPDATE ORDER STATUS
router.patch('/:id/status', authenticateToken, checkPermission('Sales Orders'), async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const { status } = req.body;

    const oldOrder = await prisma.salesOrder.findUnique({ where: { id } });
    if (!oldOrder) return res.status(404).json({ error: 'Order not found' });

    const order = await prisma.salesOrder.update({
      where: { id },
      data: { status }
    });

    // Log Audit
    await logAudit(
      req.user?.id || null,
      'UPDATE',
      'SalesOrder',
      order.id,
      oldOrder,
      order,
      req.ip || req.socket.remoteAddress
    );

    res.json(order);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update order status' });
  }
});

// DELETE ORDER
router.delete('/:id', authenticateToken, checkPermission('Sales Orders'), async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    
    const oldOrder = await prisma.salesOrder.findUnique({
      where: { id },
      include: { items: true }
    });
    if (!oldOrder) return res.status(404).json({ error: 'Order not found' });

    // Delete line items first due to foreign key constraints
    await prisma.salesOrderItem.deleteMany({ where: { salesOrderId: id as string } });
    // Delete the order
    await prisma.salesOrder.delete({ where: { id: id as string } });

    // Log Audit
    await logAudit(
      req.user?.id || null,
      'DELETE',
      'SalesOrder',
      id,
      oldOrder,
      null,
      req.ip || req.socket.remoteAddress
    );

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete order' });
  }
});

export default router;
