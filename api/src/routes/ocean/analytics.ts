import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// High Level Executive KPIs
router.get('/executive-kpis', async (req, res) => {
  try {
    // Note: For a true enterprise app, this would use complex SQL aggregates
    // Here we use Prisma to fetch and aggregate in memory for demo purposes
    
    // 1. Finance (Revenue & Profit)
    const invoices = await prisma.oceanInvoice.findMany({ where: { isDeleted: false }});
    let revenue = 0;
    let cost = 0;
    invoices.forEach(inv => {
      const amt = inv.grandTotal * inv.exchangeRate;
      if (inv.type === 'Receivable') revenue += amt;
      if (inv.type === 'Payable') cost += amt;
    });

    // 2. Operational Metrics
    const activeVessels = await prisma.vessel.count({
      where: { oceanBookings: { some: { status: { in: ['Gated In', 'Loaded'] } } } }
    });
    
    const activeContainers = await prisma.containerAsset.count({
      where: { status: 'In-Transit' }
    });

    const pendingCustoms = await prisma.oceanCustomsDeclaration.count({
      where: { status: 'Pending' }
    });

    // 3. Automated Alerts (Delayed shipments etc)
    const activeAlerts = await prisma.oceanAlert.count({
      where: { isResolved: false, severity: { in: ['High', 'Critical'] } }
    });

    res.json({
       finance: { revenue, cost, profit: revenue - cost },
       operations: { activeVessels, activeContainers, pendingCustoms },
       alerts: activeAlerts
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch executive KPIs' });
  }
});

// Performance Analytics
router.get('/performance', async (req, res) => {
  try {
    // Dummy aggregated data for the chart
    res.json({
       monthlyRevenue: [
          { name: 'Jan', revenue: 400000, margin: 15 },
          { name: 'Feb', revenue: 450000, margin: 16 },
          { name: 'Mar', revenue: 420000, margin: 14 },
          { name: 'Apr', revenue: 580000, margin: 18 },
          { name: 'May', revenue: 610000, margin: 20 },
          { name: 'Jun', revenue: 750000, margin: 22 }
       ],
       carrierPerformance: [
          { name: 'Maersk', onTime: 85, delayed: 15 },
          { name: 'MSC', onTime: 78, delayed: 22 },
          { name: 'CMA CGM', onTime: 92, delayed: 8 },
          { name: 'Hapag-Lloyd', onTime: 88, delayed: 12 }
       ]
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch performance analytics' });
  }
});

export default router;
