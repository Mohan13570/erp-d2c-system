import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();
const asyncHandler = (fn: Function) => (req: any, res: any, next: any) => Promise.resolve(fn(req, res, next)).catch(next);

// Create ULD Manifest
router.post('/', asyncHandler(async (req: any, res: any) => {
  const { uldNumber, uldTypeId, flightScheduleId } = req.body;
  const uld = await prisma.airULDManifest.create({
    data: { uldNumber, uldTypeId, flightScheduleId }
  });
  res.status(201).json(uld);
}));

// Load Items into ULD
router.post('/:id/items', asyncHandler(async (req: any, res: any) => {
  const { itemIds } = req.body; // array of AirBookingItem IDs
  
  // Calculate aggregate weights from the items
  const items = await prisma.airBookingItem.findMany({ where: { id: { in: itemIds } } });
  const totalNet = items.reduce((sum: number, item: any) => sum + item.grossWeight, 0);

  const uld = await prisma.airULDManifest.update({
    where: { id: req.params.id },
    data: {
      items: { connect: itemIds.map((id: string) => ({ id })) },
      netWeight: { increment: totalNet },
      grossWeight: { increment: totalNet } // (tare is usually added manually later)
    },
    include: { items: true }
  });
  res.json(uld);
}));

router.get('/', asyncHandler(async (req: any, res: any) => {
  const ulds = await prisma.airULDManifest.findMany({
    where: { isDeleted: false },
    include: { uldType: true, flightSchedule: true, items: true }
  });
  res.json(ulds);
}));

export default router;
