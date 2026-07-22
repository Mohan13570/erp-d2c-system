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

router.get('/dashboard', async (req, res) => {
  try {
    const activeTrips = await prisma.trip.count({ where: { status: { in: ['Scheduled', 'Assigned', 'In Transit'] } } });
    const delayedTrips = await prisma.trip.count({ where: { status: 'Delayed' } });
    const completedTrips = await prisma.trip.count({ where: { status: 'Completed' } });
    
    // Find unassigned shipments
    const pendingDeliveries = await prisma.shipment.count({
      where: { transportPlanId: null, status: 'Pending' }
    });

    const totalVehicles = await prisma.vehicle.count();
    const availableVehicles = await prisma.vehicle.count({ where: { status: 'Available' } });
    const utilization = totalVehicles ? ((totalVehicles - availableVehicles) / totalVehicles * 100).toFixed(1) : 0;

    res.json({
      activeTrips,
      delayedTrips,
      completedTrips,
      pendingDeliveries,
      vehicleUtilization: utilization,
      transportCost: 15420.50 // Mocked cost for now
    });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

router.post('/plans', async (req, res) => {
  try {
    const { pickupLocation, deliveryLocation, vehicleReq, priority, shipmentIds } = req.body;
    const plan = await prisma.transportPlan.create({
      data: {
        pickupLocation,
        deliveryLocation,
        vehicleReq,
        priority,
        shipments: {
          connect: (shipmentIds || []).map((id: string) => ({ id }))
        }
      },
      include: { shipments: true }
    });
    res.json(plan);
  } catch (err: any) { res.status(400).json({ error: err.message }); }
});

router.get('/plans', async (req, res) => {
  try {
    const plans = await prisma.transportPlan.findMany({ include: { shipments: true, trip: true } });
    res.json(plans);
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

router.put('/trips/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const trip = await prisma.trip.update({
      where: { id: req.params.id },
      data: { status }
    });
    res.json(trip);
  } catch (err: any) { res.status(400).json({ error: err.message }); }
});

export default router;
