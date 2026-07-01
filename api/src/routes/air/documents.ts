import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

const asyncHandler = (fn: Function) => (req: any, res: any, next: any) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Generate/Add Document
router.post('/', asyncHandler(async (req: any, res: any) => {
  const { bookingId, documentType, documentNumber, fileUrl } = req.body;
  
  const doc = await prisma.airDocument.create({
    data: {
      bookingId,
      documentType,
      documentNumber,
      fileUrl
    }
  });

  res.status(201).json(doc);
}));

// Generate Air Waybill (HAWB / MAWB)
router.post('/waybill', asyncHandler(async (req: any, res: any) => {
  const { bookingId, awbType } = req.body;
  
  // Basic mockup for AWB generation (Format: XXX-XXXXXXX)
  const airlinePrefix = Math.floor(Math.random() * 900 + 100);
  const serial = Math.floor(Math.random() * 9000000 + 1000000);
  const awbNumber = `${airlinePrefix}-${serial}`;

  const awb = await prisma.airWaybill.create({
    data: {
      bookingId,
      awbType,
      awbNumber
    }
  });

  // Also log a milestone
  await prisma.airShipmentMilestone.create({
    data: {
      bookingId,
      milestoneCode: 'FWB',
      description: `${awbType} Generated (${awbNumber})`
    }
  });

  res.status(201).json(awb);
}));

export default router;
