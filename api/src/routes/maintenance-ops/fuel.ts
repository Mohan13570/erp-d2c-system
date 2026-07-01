import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get Fuel Logs
router.get('/', async (req, res) => {
  try {
    const logs = await prisma.roadFuelLog.findMany({
      where: { isDeleted: false },
      include: { vehicle: true },
      orderBy: { timestamp: 'desc' }
    });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch fuel logs' });
  }
});

// Add Fuel Log
router.post('/', async (req, res) => {
  try {
    const { vehicleId, quantityLiters, cost, odometerReading, stationName } = req.body;
    const log = await prisma.roadFuelLog.create({
      data: { vehicleId, quantityLiters: Number(quantityLiters), cost: Number(cost), odometerReading: Number(odometerReading), stationName }
    });
    res.json(log);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add fuel log' });
  }
});

export default router;
