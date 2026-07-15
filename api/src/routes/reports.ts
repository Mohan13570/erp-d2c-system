import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, checkPermission, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Sales Report
router.get('/sales', authenticateToken, checkPermission('Finance'), async (req: AuthRequest, res: Response) => {
  try {
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : new Date();

    const orders = await prisma.salesOrder.findMany({
      where: {
        transactionDate: {
          gte: startDate,
          lte: endDate,
        },
        status: { not: 'Cancelled' }
      },
      include: { customer: true, d2cCustomer: true, items: true },
      orderBy: { transactionDate: 'desc' }
    });

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + o.grandTotal, 0);
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    res.json({
      summary: {
        totalOrders,
        totalRevenue,
        avgOrderValue,
        startDate,
        endDate
      },
      data: orders
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to generate sales report', details: error.message });
  }
});

// Orders Report
router.get('/orders', authenticateToken, checkPermission('Sales Orders'), async (req: AuthRequest, res: Response) => {
  try {
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : new Date();

    const orders = await prisma.salesOrder.findMany({
      where: {
        transactionDate: {
          gte: startDate,
          lte: endDate,
        }
      },
      include: { customer: true, d2cCustomer: true },
      orderBy: { transactionDate: 'desc' }
    });

    const statusCounts: Record<string, number> = {};
    const channelCounts: Record<string, number> = {};

    orders.forEach(o => {
      statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
      channelCounts[o.channel] = (channelCounts[o.channel] || 0) + 1;
    });

    res.json({
      summary: {
        totalOrders: orders.length,
        statusCounts,
        channelCounts,
        startDate,
        endDate
      },
      data: orders
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to generate orders report', details: error.message });
  }
});

// Inventory Valuation Report
router.get('/inventory', authenticateToken, checkPermission('Inventory'), async (req: AuthRequest, res: Response) => {
  try {
    const stockLevels = await prisma.stockLevel.findMany({
      include: {
        item: true,
        warehouse: true
      }
    });

    const reportData = stockLevels.map(sl => {
      const value = (sl.qtyOnHand || 0) * (sl.item?.valuationRate || 0);
      return {
        itemCode: sl.itemCode,
        itemName: sl.item?.itemName || 'Unknown Item',
        itemGroup: sl.item?.itemGroup || 'Products',
        warehouse: sl.warehouseName,
        qtyOnHand: sl.qtyOnHand,
        qtyReserved: sl.qtyReserved,
        qtyAvailable: sl.qtyAvailable,
        valuationRate: sl.item?.valuationRate || 0,
        standardRate: sl.item?.standardRate || 0,
        totalValuation: value
      };
    });

    const totalValuation = reportData.reduce((sum, r) => sum + r.totalValuation, 0);
    const totalItems = reportData.length;

    res.json({
      summary: {
        totalItems,
        totalValuation
      },
      data: reportData
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to generate inventory report', details: error.message });
  }
});

export default router;
