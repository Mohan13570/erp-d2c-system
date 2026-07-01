import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get workshop dashboard data
router.get('/dashboard', async (req, res) => {
  try {
    const workshops = await prisma.roadWorkshop.findMany({
      where: { isDeleted: false },
      include: {
        bays: { include: { jobCards: { where: { status: { in: ['Open', 'In-Progress', 'QA'] } } } } },
        mechanics: true,
        jobCards: {
          where: { isDeleted: false, status: { not: 'Closed' } },
          include: { vehicle: true, mechanic: true, bay: true }
        }
      }
    });
    res.json(workshops);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch workshop dashboard' });
  }
});

// Update Job Card Status
router.put('/job-cards/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const jobCard = await prisma.roadJobCard.update({
      where: { id: req.params.id },
      data: { status }
    });
    res.json(jobCard);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update job card' });
  }
});

export default router;
