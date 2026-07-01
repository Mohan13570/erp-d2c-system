import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get KPIs (MTBF, MTTR, Fleet Health)
router.get('/kpi', async (req, res) => {
  try {
    // Mock aggregated data for Executive Dashboard
    const totalVehicles = await prisma.roadVehicle.count({ where: { isDeleted: false } });
    const inMaintenance = await prisma.roadVehicle.count({ where: { status: 'Maintenance', isDeleted: false } });
    const overdueServices = await prisma.roadMaintenanceSchedule.count({ where: { status: 'Overdue', isDeleted: false } });
    const openRepairs = await prisma.roadJobCard.count({ where: { status: { not: 'Closed' }, isDeleted: false } });

    res.json({
      fleetHealthScore: totalVehicles ? Math.round(((totalVehicles - inMaintenance) / totalVehicles) * 100) : 100,
      vehiclesUnderMaintenance: inMaintenance,
      overdueServices,
      openRepairs,
      mtbfHours: 420,
      mttrHours: 14.5,
      ytdMaintenanceCost: 125000
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analytics KPIs' });
  }
});

export default router;
