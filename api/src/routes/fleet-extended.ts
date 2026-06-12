import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/performance', async (req, res) => {
  try {
    const records = await prisma.driverPerformance.findMany({ include: { driver: true } });
    res.json(records);
  } catch (error) { res.status(500).json({ error: 'Failed' }); }
});

router.post('/performance', async (req, res) => {
  try {
    const perf = await prisma.driverPerformance.create({ data: req.body });
    res.json(perf);
  } catch (err: any) { res.status(400).json({ error: err.message }); }
});

router.get('/maintenance', async (req, res) => {
  try {
    const logs = await prisma.vehicleMaintenance.findMany({ include: { vehicle: true } });
    res.json(logs);
  } catch (error) { res.status(500).json({ error: 'Failed' }); }
});

router.post('/maintenance', async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.date) data.date = new Date(data.date);
    const m = await prisma.vehicleMaintenance.create({ data });
    res.json(m);
  } catch (err: any) { res.status(400).json({ error: err.message }); }
});

router.get('/fuel', async (req, res) => {
  try {
    const fuel = await prisma.fuelLog.findMany({ include: { vehicle: true } });
    res.json(fuel);
  } catch (error) { res.status(500).json({ error: 'Failed' }); }
});

router.post('/fuel', async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.date) data.date = new Date(data.date);
    const f = await prisma.fuelLog.create({ data });
    res.json(f);
  } catch (err: any) { res.status(400).json({ error: err.message }); }
});

export default router;
