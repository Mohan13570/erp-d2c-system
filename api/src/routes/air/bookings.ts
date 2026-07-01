import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

const asyncHandler = (fn: Function) => (req: any, res: any, next: any) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Utility: Volumetric Weight Calculator
function calculateVolumetricWeight(length: number, width: number, height: number, qty: number): number {
  // Standard IATA Volumetric Divisor is 6000 (cm3 / kg)
  return ((length * width * height) / 6000) * qty;
}

// Get all Air Bookings
router.get('/', asyncHandler(async (req: any, res: any) => {
  const bookings = await prisma.airBooking.findMany({
    where: { isDeleted: false },
    include: {
      originAirport: true,
      destAirport: true,
      items: true,
      routings: { include: { fromAirport: true, toAirport: true, flightSchedule: true } },
      milestones: { orderBy: { timestamp: 'desc' } }
    },
    orderBy: { createdAt: 'desc' }
  });
  res.json(bookings);
}));

// Get specific Air Booking
router.get('/:id', asyncHandler(async (req: any, res: any) => {
  const booking = await prisma.airBooking.findUnique({
    where: { id: req.params.id },
    include: {
      originAirport: true,
      destAirport: true,
      items: true,
      routings: { include: { fromAirport: true, toAirport: true, flightSchedule: { include: { airline: true } } } },
      waybills: true,
      documents: true,
      milestones: { orderBy: { timestamp: 'desc' } }
    }
  });
  if (!booking) return res.status(404).json({ error: 'Not Found' });
  res.json(booking);
}));

// Create Air Booking (Complex with items and routing)
router.post('/', asyncHandler(async (req: any, res: any) => {
  const { originAirportId, destAirportId, shipperId, consigneeId, items, routings } = req.body;
  
  // Calculate Totals
  let totalGrossWeight = 0;
  let totalVolume = 0;
  let totalChargeableWeight = 0;
  let isDGR = false;
  let isPER = false;

  const processedItems = (items || []).map((item: any) => {
    const volume = (item.length * item.width * item.height) / 1000000; // in cbm
    const volWeight = calculateVolumetricWeight(item.length, item.width, item.height, item.quantity);
    const chargeable = Math.max(item.grossWeight, volWeight);
    
    totalGrossWeight += item.grossWeight;
    totalVolume += volume * item.quantity;
    totalChargeableWeight += chargeable;

    if (item.iataCode === 'DGR') isDGR = true;
    if (item.iataCode === 'PER') isPER = true;

    return { ...item, volume, chargeableWeight: chargeable };
  });

  const booking = await prisma.airBooking.create({
    data: {
      bookingNumber: `AB-${Math.floor(Math.random() * 1000000)}`,
      originAirportId,
      destAirportId,
      shipperId,
      consigneeId,
      status: 'Requested',
      totalGrossWeight,
      totalVolume,
      totalChargeableWeight,
      isDangerousGoods: isDGR,
      isPerishable: isPER,
      items: {
        create: processedItems
      },
      routings: {
        create: (routings || []).map((r: any, idx: number) => ({ ...r, sequence: idx + 1 }))
      },
      milestones: {
        create: [
          { milestoneCode: 'BKD', description: 'Booking Requested' }
        ]
      }
    },
    include: { items: true, routings: true }
  });

  res.status(201).json(booking);
}));

// Update Milestone
router.post('/:id/milestones', asyncHandler(async (req: any, res: any) => {
  const { milestoneCode, description, location } = req.body;
  
  const milestone = await prisma.airShipmentMilestone.create({
    data: {
      bookingId: req.params.id,
      milestoneCode,
      description,
      location
    }
  });
  
  // Optionally update booking status based on milestone (e.g. 'DEP' -> 'In Transit')
  if (['DEP', 'RCS'].includes(milestoneCode)) {
    await prisma.airBooking.update({
      where: { id: req.params.id },
      data: { status: 'In Transit' }
    });
  }

  res.status(201).json(milestone);
}));

export default router;
