import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get upcoming and overdue maintenance schedules
router.get('/schedules', async (req, res) => {
  try {
    const schedules = await prisma.roadMaintenanceSchedule.findMany({
      where: { isDeleted: false },
      include: {
        vehicle: true,
        plan: true
      },
      orderBy: { nextDueDate: 'asc' }
    });
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch schedules' });
  }
});

// Update schedule status (e.g. mark as completed)
router.put('/schedules/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const schedule = await prisma.roadMaintenanceSchedule.update({
      where: { id: req.params.id },
      data: { status }
    });
    res.json(schedule);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update schedule status' });
  }
});

export default router;
