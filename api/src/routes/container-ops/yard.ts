import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get Yard Zones with Capacity
router.get('/zones', async (req, res) => {
  try {
    const zones = await prisma.containerYardZone.findMany({
      where: { isDeleted: false },
      include: {
        slots: { where: { isDeleted: false } }
      }
    });
    res.json(zones);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch yard zones' });
  }
});

// Assign Container to Slot
router.post('/slots/assign', async (req, res) => {
  try {
    const { zoneId, block, row, stack, tier, containerId } = req.body;
    
    // Check if slot exists or create it
    let slot = await prisma.containerYardSlot.findFirst({
      where: { zoneId, block, row, stack, tier }
    });

    if (slot && slot.status === 'Occupied') {
      return res.status(400).json({ error: 'Slot is already occupied' });
    }

    if (!slot) {
      slot = await prisma.containerYardSlot.create({
        data: { zoneId, block, row, stack, tier, containerId, status: 'Occupied' }
      });
    } else {
      slot = await prisma.containerYardSlot.update({
        where: { id: slot.id },
        data: { containerId, status: 'Occupied' }
      });
    }

    // Update Zone occupancy
    await prisma.containerYardZone.update({
      where: { id: zoneId },
      data: { occupied: { increment: 1 } }
    });

    // Update Container Lifecycle to "At Yard"
    await prisma.container.update({
      where: { id: containerId },
      data: { status: 'At Yard' }
    });
    
    await prisma.containerLifecycle.create({
      data: { containerId, status: 'At Yard', location: `Block ${block}, Row ${row}, Stack ${stack}` }
    });

    res.json(slot);
  } catch (error) {
    res.status(500).json({ error: 'Failed to assign yard slot' });
  }
});

export default router;
