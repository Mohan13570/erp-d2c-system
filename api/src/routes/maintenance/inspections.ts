import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get recent inspections
router.get('/', async (req, res) => {
  try {
    const inspections = await prisma.vehicleInspection.findMany({
      where: { isDeleted: false },
      include: { vehicle: true },
      orderBy: { timestamp: 'desc' }
    });
    res.json(inspections);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch inspections' });
  }
});

// Submit a checklist inspection
router.post('/', async (req, res) => {
  try {
    const { vehicleId, type, isPassed, notes, checklistJson } = req.body;
    const inspection = await prisma.vehicleInspection.create({
      data: {
        vehicleId,
        type,
        isPassed: Boolean(isPassed),
        notes,
        checklistJson: JSON.stringify(checklistJson)
      }
    });
    res.json(inspection);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to submit inspection' });
  }
});

export default router;
