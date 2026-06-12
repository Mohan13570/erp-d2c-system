import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// GET BI & Analytics
router.get('/dashboard', async (req: Request, res: Response) => {
  try {
    // Basic aggregation
    const totalOrders = await prisma.salesOrder.count();
    const totalRevenue = await prisma.salesOrder.aggregate({ _sum: { grandTotal: true } });
    
    // Group by channel
    const channelSales = await prisma.salesOrder.groupBy({
      by: ['channel'],
      _sum: { grandTotal: true },
      _count: true
    });

    const recentOrders = await prisma.salesOrder.findMany({
      take: 10,
      orderBy: { transactionDate: 'desc' },
      include: { customer: true, d2cCustomer: true }
    });

    res.json({
      totalOrders,
      totalRevenue: totalRevenue._sum.grandTotal || 0,
      channelSales,
      recentOrders
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

export default router;
