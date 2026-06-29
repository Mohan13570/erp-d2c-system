import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all trips
router.get('/', async (req, res) => {
  try {
    const trips = await prisma.trip.findMany({
      include: {
        vehicle: true,
        driver: true,
        stops: { orderBy: { sequence: 'asc' } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(trips);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch trips' });
  }
});

// Get a single trip detail
router.get('/:id', async (req, res) => {
  try {
    const trip = await prisma.trip.findUnique({
      where: { id: req.params.id },
      include: {
        vehicle: { include: { GPSDevice: true } },
        driver: true,
        stops: { orderBy: { sequence: 'asc' } },
        events: { orderBy: { timestamp: 'desc' } },
        auditLogs: { orderBy: { timestamp: 'desc' } }
      }
    });
    if (!trip) return res.status(404).json({ error: 'Not found' });
    res.json(trip);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch trip' });
  }
});

// Create new trip with stops
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    const newTrip = await prisma.$transaction(async (tx) => {
      const trip = await tx.trip.create({
        data: {
          vehicleId: data.vehicleId,
          driverId: data.driverId,
          origin: data.origin,
          destination: data.destination,
          status: 'Planned',
          totalDistanceKm: data.totalDistanceKm || 0,
          estimatedHours: data.estimatedHours || 0,
          revenue: data.revenue || 0,
        }
      });
      
      // Create Stops
      if (data.stops && Array.isArray(data.stops)) {
         for(let i=0; i<data.stops.length; i++) {
            await tx.tripStop.create({
               data: {
                  tripId: trip.id,
                  type: data.stops[i].type,
                  locationName: data.stops[i].locationName,
                  latitude: data.stops[i].latitude,
                  longitude: data.stops[i].longitude,
                  sequence: i + 1
               }
            });
         }
      }
      
      await tx.tripAuditLog.create({
        data: {
          tripId: trip.id,
          action: 'Created',
          description: `Trip planned from ${data.origin} to ${data.destination}.`
        }
      });
      
      return trip;
    });
    res.status(201).json(newTrip);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Update Status
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    const updateData: any = { status };
    if (status === 'Dispatched') updateData.startTime = new Date();
    if (status === 'Completed') updateData.endTime = new Date();

    const t = await prisma.trip.update({
      where: { id: req.params.id },
      data: {
         ...updateData,
         auditLogs: {
            create: {
               action: 'StatusChanged',
               description: `Trip status updated to ${status}.`
            }
         }
      }
    });
    res.json(t);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Add Expenses
router.post('/:id/expenses', async (req, res) => {
  try {
    const t = await prisma.trip.update({
      where: { id: req.params.id },
      data: {
         fuelCost: { increment: req.body.fuelCost || 0 },
         tollExpenses: { increment: req.body.tollExpenses || 0 },
         otherExpenses: { increment: req.body.otherExpenses || 0 },
         auditLogs: {
            create: {
               action: 'ExpenseAdded',
               description: `Expenses added: Fuel($${req.body.fuelCost || 0}) Toll($${req.body.tollExpenses || 0})`
            }
         }
      }
    });
    res.json(t);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
