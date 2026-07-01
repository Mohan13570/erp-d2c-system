import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all trips
router.get('/trips', async (req, res) => {
  try {
    const trips = await prisma.roadTrip.findMany({
      where: { isDeleted: false },
      include: {
        driver: true,
        vehicle: true,
        trailer: true,
        stops: {
          include: { booking: true },
          orderBy: { sequence: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(trips);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch trips' });
  }
});

// Create a trip with assigned stops
router.post('/trips', async (req, res) => {
  try {
    const { tripNumber, driverId, vehicleId, trailerId, plannedStart, stops } = req.body;
    
    const trip = await prisma.roadTrip.create({
      data: {
        tripNumber,
        driverId,
        vehicleId,
        trailerId,
        plannedStart: plannedStart ? new Date(plannedStart) : undefined,
        stops: {
          create: stops?.map((s: any, idx: number) => ({
            sequence: idx + 1,
            type: s.type, // Pickup, Delivery, CrossDock
            locationName: s.locationName,
            locationAddress: s.locationAddress,
            bookingId: s.bookingId
          })) || []
        }
      },
      include: {
        stops: true
      }
    });
    
    res.json(trip);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create trip' });
  }
});

export default router;
