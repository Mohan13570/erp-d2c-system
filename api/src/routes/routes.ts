import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get AI Optimized Route Plans
router.get('/', async (req, res) => {
  try {
    const routes = await prisma.routeLog.findMany({
      include: { vehicle: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(routes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch route logs' });
  }
});

// Simulate AI Route Optimization Save
router.post('/optimize', async (req, res) => {
  try {
    const { vehicleId, origin, destination, distance, time, waypoints } = req.body;
    const route = await prisma.routeLog.create({
      data: {
        vehicleId, origin, destination,
        plannedDistance: distance,
        plannedTimeHrs: time,
        waypoints: JSON.stringify(waypoints)
      }
    });
    res.status(201).json(route);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
