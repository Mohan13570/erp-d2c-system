import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Vehicles
router.get('/vehicles', async (req, res) => {
  try {
    const vehicles = await prisma.roadVehicle.findMany({ where: { isDeleted: false } });
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch vehicles' });
  }
});

router.post('/vehicles', async (req, res) => {
  try {
    const vehicle = await prisma.roadVehicle.create({ data: req.body });
    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create vehicle' });
  }
});

// Drivers
router.get('/drivers', async (req, res) => {
  try {
    const drivers = await prisma.roadDriver.findMany({ where: { isDeleted: false } });
    res.json(drivers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch drivers' });
  }
});

router.post('/drivers', async (req, res) => {
  try {
    const driver = await prisma.roadDriver.create({ data: req.body });
    res.json(driver);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create driver' });
  }
});

// Routes
router.get('/routes', async (req, res) => {
  try {
    const routes = await prisma.roadRoute.findMany({ where: { isDeleted: false } });
    res.json(routes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch routes' });
  }
});

export default router;
