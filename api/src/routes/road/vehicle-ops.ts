import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Submit Vehicle Inspection Checklist
router.post('/inspections', async (req, res) => {
  try {
    const { vehicleId, tripId, type, isPassed, notes, inspectorId } = req.body;
    const inspection = await prisma.vehicleInspection.create({
      data: { vehicleId, tripId, type, isPassed, notes, inspectorId }
    });
    res.json(inspection);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to submit inspection' });
  }
});

// Maintenance Alerts
router.get('/alerts', async (req, res) => {
  try {
    const alerts = await prisma.maintenanceAlert.findMany({
      where: { isDeleted: false, status: { not: 'Resolved' } },
      include: { vehicle: true }
    });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});

router.post('/alerts', async (req, res) => {
  try {
    const { vehicleId, severity, issue } = req.body;
    const alert = await prisma.maintenanceAlert.create({
      data: { vehicleId, severity, issue }
    });
    res.json(alert);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create alert' });
  }
});

export default router;
