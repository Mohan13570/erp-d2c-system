import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// VEHICLES (from old fleet module)
router.get('/vehicles', async (req, res) => {
  try {
    const vehicles = await prisma.vehicle.findMany();
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch vehicles' });
  }
});

// TRIPS (from old fleet module)
router.get('/trips', async (req, res) => {
  try {
    const trips = await prisma.trip.findMany();
    res.json(trips);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch trips' });
  }
});

// CARRIERS (Module 5)
router.get('/carriers', async (req, res) => {
  try {
    const carriers = await prisma.carrier.findMany({ include: { contracts: true } });
    res.json(carriers);
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

router.post('/carriers', async (req, res) => {
  try {
    const carrier = await prisma.carrier.create({ data: req.body });
    res.json(carrier);
  } catch (err: any) { res.status(400).json({ error: err.message }); }
});

router.delete('/carriers/:id', async (req, res) => {
  try {
    const id = req.params.id as string;
    await prisma.carrierContract.deleteMany({ where: { carrierId: id } });
    await prisma.booking.deleteMany({ where: { carrierId: id } });
    await prisma.carrier.delete({ where: { id } });
    res.json({ success: true });
  } catch (err: any) { res.status(400).json({ error: err.message }); }
});

// BOOKINGS (Module 5)
router.get('/bookings', async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({ include: { carrier: true, items: true } });
    res.json(bookings);
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

router.post('/bookings', async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.departure) data.departure = new Date(data.departure);
    if (data.arrival) data.arrival = new Date(data.arrival);
    const booking = await prisma.booking.create({ data });
    res.json(booking);
  } catch (err: any) { res.status(400).json({ error: err.message }); }
});

router.delete('/bookings/:id', async (req, res) => {
  try {
    const id = req.params.id as string;
    await prisma.bookingItem.deleteMany({ where: { bookingId: id } });
    await prisma.booking.delete({ where: { id } });
    res.json({ success: true });
  } catch (err: any) { res.status(400).json({ error: err.message }); }
});

export default router;
