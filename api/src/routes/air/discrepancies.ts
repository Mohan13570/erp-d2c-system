import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();
const asyncHandler = (fn: Function) => (req: any, res: any, next: any) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/', asyncHandler(async (req: any, res: any) => {
  const { bookingItemId, discrepancyType, severity, description, photoUrls } = req.body;

  const doc = await prisma.airCargoDiscrepancy.create({
    data: {
      bookingItemId,
      discrepancyType,
      severity,
      description,
      photoUrls
    }
  });

  res.status(201).json(doc);
}));

export default router;
