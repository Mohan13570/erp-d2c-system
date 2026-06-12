import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/vehicles', async (req, res) => {
  try {
    const v = await prisma.vehicle.findMany({ include: { trips: true } });
    res.json(v);
  } catch (error) { res.status(500).json({ error: 'Failed' }); }
});

router.post('/vehicles', async (req, res) => {
  try {
    const v = await prisma.vehicle.create({ data: req.body });
    res.json(v);
  } catch (err: any) { res.status(400).json({ error: err.message }); }
});

router.get('/drivers', async (req, res) => {
  try {
    const d = await prisma.driver.findMany({ include: { trips: true } });
    res.json(d);
  } catch (error) { res.status(500).json({ error: 'Failed' }); }
});

router.post('/drivers', async (req, res) => {
  try {
    const d = await prisma.driver.create({ data: req.body });
    res.json(d);
  } catch (err: any) { res.status(400).json({ error: err.message }); }
});

router.get('/trips', async (req, res) => {
  try {
    const trips = await prisma.trip.findMany({ include: { vehicle: true, driver: true, events: true } });
    res.json(trips);
  } catch (error) { res.status(500).json({ error: 'Failed' }); }
});

router.post('/trips', async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.startTime) data.startTime = new Date(data.startTime);
    if (data.endTime) data.endTime = new Date(data.endTime);
    const trip = await prisma.trip.create({ data });
    res.json(trip);
  } catch (err: any) { res.status(400).json({ error: err.message }); }
});

router.post('/trips/events', async (req, res) => {
  try {
    const ev = await prisma.tripEvent.create({ data: req.body });
    res.json(ev);
  } catch (err: any) { res.status(400).json({ error: err.message }); }
});

export default router;
