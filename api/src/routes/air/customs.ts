import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();
const asyncHandler = (fn: Function) => (req: any, res: any, next: any) => Promise.resolve(fn(req, res, next)).catch(next);

// File Customs Declaration
router.post('/', asyncHandler(async (req: any, res: any) => {
  const { bookingId, declarationType, hsCode, declaredValue, currency, dutyCalculated } = req.body;
  
  const decl = await prisma.airCustomsDeclaration.create({
    data: {
      bookingId,
      declarationType,
      hsCode,
      declaredValue,
      currency,
      dutyCalculated,
      declarationNum: `CUS-${Math.floor(Math.random() * 1000000)}`
    }
  });

  // Log milestone
  await prisma.airShipmentMilestone.create({
    data: {
      bookingId,
      milestoneCode: 'CCD',
      description: `Customs Declaration Submitted (${declarationType})`
    }
  });

  res.status(201).json(decl);
}));

// Update Customs Status
router.patch('/:id/status', asyncHandler(async (req: any, res: any) => {
  const { status, remarks } = req.body;
  
  let updateData: any = { status, remarks };
  if (status === 'Cleared') updateData.clearedDate = new Date();
  if (status === 'Under Inspection') updateData.inspectionDate = new Date();

  const decl = await prisma.airCustomsDeclaration.update({
    where: { id: req.params.id },
    data: updateData
  });

  if (status === 'Cleared') {
    await prisma.airShipmentMilestone.create({
      data: {
        bookingId: decl.bookingId,
        milestoneCode: 'CCL',
        description: 'Customs Cleared'
      }
    });
  }

  res.json(decl);
}));

export default router;
