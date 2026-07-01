import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();
const asyncHandler = (fn: Function) => (req: any, res: any, next: any) => Promise.resolve(fn(req, res, next)).catch(next);

// Log an operation (Acceptance, Screening)
router.post('/log', asyncHandler(async (req: any, res: any) => {
  const { bookingItemId, operationType, location, barcodeScanned, remarks } = req.body;

  const operation = await prisma.airCargoOperation.create({
    data: {
      bookingItemId,
      operationType,
      location,
      barcodeScanned,
      remarks
    },
    include: { bookingItem: { include: { booking: true } } }
  });

  // If this is an Acceptance scan, log a milestone on the parent booking
  if (operationType === 'Acceptance' && operation.bookingItem.bookingId) {
    await prisma.airShipmentMilestone.create({
      data: {
        bookingId: operation.bookingItem.bookingId,
        milestoneCode: 'RCS',
        description: 'Cargo Received from Shipper',
        location
      }
    });
  }

  res.status(201).json(operation);
}));

router.get('/:bookingItemId', asyncHandler(async (req: any, res: any) => {
  const ops = await prisma.airCargoOperation.findMany({
    where: { bookingItemId: req.params.bookingItemId, isDeleted: false },
    orderBy: { timestamp: 'desc' }
  });
  res.json(ops);
}));

export default router;
