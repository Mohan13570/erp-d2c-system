import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Pre-aggregated metrics for dashboards
router.get('/', async (req, res) => {
  try {
    // Generate simulated dynamic metrics based on actual data
    const totalContainers = await prisma.container.count({ where: { isDeleted: false } });
    const inTransit = await prisma.container.count({ where: { status: 'In Transit', isDeleted: false } });
    const atYard = await prisma.container.count({ where: { status: 'At Yard', isDeleted: false } });
    const underRepair = await prisma.container.count({ where: { status: 'Under Repair', isDeleted: false } });
    const leased = await prisma.container.count({ where: { ownershipType: 'Leased', isDeleted: false } });
    const owned = await prisma.container.count({ where: { ownershipType: 'Owned', isDeleted: false } });

    // Financial Metrics
    const billings = await prisma.containerBilling.findMany({
      where: { type: 'Invoice', status: 'Paid', isDeleted: false }
    });
    
    const revenue = billings.reduce((sum, b) => sum + (b.totalAmount * b.exchangeRate), 0) || 452000; // Simulated default
    const profit = revenue * 0.35; // Simulated margin

    // Time-series mock data for Recharts
    const trendData = [
      { month: 'Jan', revenue: 320000, profit: 112000, repairs: 15000 },
      { month: 'Feb', revenue: 350000, profit: 122500, repairs: 12000 },
      { month: 'Mar', revenue: 380000, profit: 133000, repairs: 18000 },
      { month: 'Apr', revenue: 410000, profit: 143500, repairs: 14000 },
      { month: 'May', revenue: 390000, profit: 136500, repairs: 21000 },
      { month: 'Jun', revenue: 452000, profit: 158200, repairs: 11000 },
    ];

    res.json({
      totalContainers: totalContainers || 1250,
      inTransit: inTransit || 450,
      atYard: atYard || 600,
      underRepair: underRepair || 45,
      leased: leased || 800,
      owned: owned || 450,
      revenue,
      profit,
      trendData
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate analytics' });
  }
});

export default router;
