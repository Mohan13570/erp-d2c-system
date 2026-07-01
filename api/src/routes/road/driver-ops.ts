import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Start Driver Shift
router.post('/shifts/start', async (req, res) => {
  try {
    const { driverId } = req.body;
    const shift = await prisma.roadDriverShift.create({
      data: { driverId, shiftStart: new Date() }
    });
    await prisma.roadDriver.update({ where: { id: driverId }, data: { status: 'On-Trip' }});
    res.json(shift);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to start shift' });
  }
});

// End Driver Shift
router.post('/shifts/end', async (req, res) => {
  try {
    const { shiftId, drivingHours, breakHours, isFatigued } = req.body;
    const shift = await prisma.roadDriverShift.update({
      where: { id: shiftId },
      data: { 
        shiftEnd: new Date(),
        drivingHours: parseFloat(drivingHours) || 0,
        breakHours: parseFloat(breakHours) || 0,
        isFatigued: Boolean(isFatigued)
      }
    });
    await prisma.roadDriver.update({ where: { id: shift.driverId }, data: { status: 'Rest' }});
    res.json(shift);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to end shift' });
  }
});

// Log Violation
router.post('/violations', async (req, res) => {
  try {
    const { driverId, type, severity, description } = req.body;
    const violation = await prisma.roadDriverViolation.create({
      data: { driverId, type, severity, description }
    });
    res.json(violation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to log violation' });
  }
});

export default router;
