import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get lifecycle events for a specific container
router.get('/:containerId', async (req, res) => {
  try {
    const events = await prisma.containerLifecycle.findMany({
      where: { containerId: req.params.containerId, isDeleted: false },
      orderBy: { timestamp: 'desc' }
    });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch lifecycle events' });
  }
});

// Record a new lifecycle event and update container status
router.post('/:containerId', async (req, res) => {
  try {
    const { containerId } = req.params;
    const { status, location, referenceId, notes } = req.body;

    const event = await prisma.$transaction(async (tx) => {
      await tx.container.update({
        where: { id: containerId },
        data: { status }
      });

      return tx.containerLifecycle.create({
        data: { containerId, status, location, referenceId, notes }
      });
    });

    res.json(event);
  } catch (error) {
    res.status(500).json({ error: 'Failed to record lifecycle event' });
  }
});

export default router;
