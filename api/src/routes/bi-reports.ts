import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/dashboard', async (req, res) => {
  try {
    // Generate complex aggregations for the BI Dashboard
    const totalSales = await prisma.salesOrder.count();
    const totalRevenue = await prisma.invoice.aggregate({ _sum: { total: true }, where: { type: 'Customer' } });
    const totalExpenses = await prisma.vendorBill.aggregate({ _sum: { amount: true } });
    
    const activeShipments = await prisma.shipment.count({ where: { status: { not: 'Delivered' } } });
    const activeVehicles = await prisma.vehicle.count();

    const revenueForecast = [
      { month: 'Jan', revenue: 45000 }, { month: 'Feb', revenue: 52000 },
      { month: 'Mar', revenue: 48000 }, { month: 'Apr', revenue: 61000 },
      { month: 'May', revenue: 59000 }, { month: 'Jun', revenue: 75000 },
    ];

    res.json({
      kpis: {
        totalSales,
        revenue: totalRevenue._sum.total || 0,
        expenses: totalExpenses._sum.amount || 0,
        netProfit: (totalRevenue._sum.total || 0) - (totalExpenses._sum.amount || 0),
        activeShipments,
        activeVehicles
      },
      revenueForecast
    });
  } catch (err) { res.status(500).json({ error: 'Failed' }); }
});

export default router;
