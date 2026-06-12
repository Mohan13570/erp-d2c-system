import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/flights', async (req, res) => {
  try {
    const flights = await prisma.flight.findMany({ include: { shipments: true } });
    res.json(flights);
  } catch (error) { res.status(500).json({ error: 'Failed' }); }
});

router.post('/flights', async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.departure) data.departure = new Date(data.departure);
    if (data.arrival) data.arrival = new Date(data.arrival);
    const f = await prisma.flight.create({ data });
    res.json(f);
  } catch (err: any) { res.status(400).json({ error: err.message }); }
});

router.get('/awbs', async (req, res) => {
  try {
    const awbs = await prisma.airWaybill.findMany({ include: { shipments: true } });
    res.json(awbs);
  } catch (error) { res.status(500).json({ error: 'Failed' }); }
});

router.post('/awbs', async (req, res) => {
  try {
    const awb = await prisma.airWaybill.create({ data: req.body });
    res.json(awb);
  } catch (err: any) { res.status(400).json({ error: err.message }); }
});

router.get('/shipments', async (req, res) => {
  try {
    const ships = await prisma.airShipment.findMany({ include: { awb: true, flight: true } });
    res.json(ships);
  } catch (error) { res.status(500).json({ error: 'Failed' }); }
});

router.post('/shipments', async (req, res) => {
  try {
    const ship = await prisma.airShipment.create({ data: req.body });
    res.json(ship);
  } catch (err: any) { res.status(400).json({ error: err.message }); }
});

export default router;
