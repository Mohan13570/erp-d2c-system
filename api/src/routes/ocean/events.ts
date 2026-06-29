import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get Events for an Asset
router.get('/:containerId', async (req, res) => {
  try {
    const events = await prisma.containerEvent.findMany({
      where: { containerId: req.params.containerId, isDeleted: false },
      orderBy: { createdAt: 'desc' }
    });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Log a new Gate In / Out or Operations Event
router.post('/', async (req, res) => {
  try {
    const { containerId, eventType, description, location, performedBy, sealNumber } = req.body;
    
    // 1. Create the event
    const event = await prisma.containerEvent.create({
      data: { containerId, eventType, description, location, performedBy, sealNumber }
    });

    // 2. Automatically update the container asset status based on the event
    let newStatus = undefined;
    let newCondition = undefined;

    switch (eventType) {
      case 'Gate In': newStatus = 'Available'; break;
      case 'Gate Out': newStatus = 'In-Transit'; break;
      case 'Stuffing': newStatus = 'Stuffed'; break;
      case 'Damage Inspected': newCondition = 'Damaged'; newStatus = 'Under Repair'; break;
      case 'Repaired': newCondition = 'Sound'; newStatus = 'Available'; break;
    }

    if (newStatus || newCondition) {
      await prisma.containerAsset.update({
        where: { id: containerId },
        data: {
           ...(newStatus && { status: newStatus }),
           ...(newCondition && { condition: newCondition })
        }
      });
    }

    res.status(201).json(event);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
