import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/kpi', async (req, res) => {
  try {
    const [trips, vehicles, drivers, invoices, claims] = await Promise.all([
      prisma.roadTrip.count({ where: { isDeleted: false } }),
      prisma.roadVehicle.count({ where: { isDeleted: false, status: 'Active' } }),
      prisma.roadDriver.count({ where: { isDeleted: false, status: 'Active' } }),
      prisma.roadInvoice.aggregate({ _sum: { totalAmount: true }, where: { isDeleted: false } }),
      prisma.roadClaim.count({ where: { isDeleted: false, status: 'OPEN' } })
    ]);

    res.json({
      totalTrips: trips,
      activeVehicles: vehicles,
      activeDrivers: drivers,
      totalRevenue: invoices._sum.totalAmount || 0,
      openClaims: claims
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch analytics KPI' });
  }
});

export default router;
