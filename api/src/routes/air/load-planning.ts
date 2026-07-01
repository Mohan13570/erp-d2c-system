import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();
const asyncHandler = (fn: Function) => (req: any, res: any, next: any) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/', asyncHandler(async (req: any, res: any) => {
  const { flightScheduleId, uldManifestId, position, deck } = req.body;

  const plan = await prisma.aircraftLoadingPlan.create({
    data: {
      flightScheduleId,
      uldManifestId,
      position,
      deck
    },
    include: { uldManifest: true }
  });
  res.status(201).json(plan);
}));

router.get('/:flightId', asyncHandler(async (req: any, res: any) => {
  const plan = await prisma.aircraftLoadingPlan.findMany({
    where: { flightScheduleId: req.params.flightId, isDeleted: false },
    include: { uldManifest: { include: { uldType: true } } }
  });
  res.json(plan);
}));

// Mark as loaded (Ramp Operation)
router.post('/:id/load', asyncHandler(async (req: any, res: any) => {
  const plan = await prisma.aircraftLoadingPlan.update({
    where: { id: req.params.id },
    data: { status: 'Loaded', loadedAt: new Date() }
  });
  res.json(plan);
}));

export default router;
