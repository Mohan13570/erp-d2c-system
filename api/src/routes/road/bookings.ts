import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await prisma.roadBooking.findMany({
      where: { isDeleted: false },
      include: {
        items: true,
        tripStops: {
          include: { trip: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Create booking
router.post('/', async (req, res) => {
  try {
    const { bookingNumber, loadType, totalGrossWeight, totalVolume, isHazardous, items } = req.body;
    
    const booking = await prisma.roadBooking.create({
      data: {
        bookingNumber,
        loadType,
        totalGrossWeight: parseFloat(totalGrossWeight) || 0,
        totalVolume: parseFloat(totalVolume) || 0,
        isHazardous: Boolean(isHazardous),
        items: {
          create: items?.map((i: any) => ({
            description: i.description,
            quantity: parseInt(i.quantity) || 1,
            grossWeight: parseFloat(i.grossWeight) || 0,
            volume: parseFloat(i.volume) || 0,
            packageType: i.packageType || 'Pallet'
          })) || []
        }
      },
      include: { items: true }
    });
    
    res.json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

export default router;
