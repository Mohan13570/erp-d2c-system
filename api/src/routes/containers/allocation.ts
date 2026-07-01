import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all allocations
router.get('/', async (req, res) => {
  try {
    const allocations = await prisma.containerAllocation.findMany({
      where: { isDeleted: false, releasedAt: null },
      include: { container: true },
      orderBy: { allocatedAt: 'desc' }
    });
    res.json(allocations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch allocations' });
  }
});

// Allocate a container
router.post('/', async (req, res) => {
  try {
    const { containerId, allocationType, referenceId, sealNumber } = req.body;
    
    const allocation = await prisma.$transaction(async (tx) => {
      // Mark container as Allocated
      await tx.container.update({
        where: { id: containerId },
        data: { status: 'Allocated' }
      });
      return tx.containerAllocation.create({
        data: { containerId, allocationType, referenceId, sealNumber }
      });
    });

    res.json(allocation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to allocate container' });
  }
});

// Release an allocation
router.post('/:id/release', async (req, res) => {
  try {
    const allocation = await prisma.$transaction(async (tx) => {
      const alloc = await tx.containerAllocation.update({
        where: { id: req.params.id },
        data: { releasedAt: new Date() }
      });
      
      await tx.container.update({
        where: { id: alloc.containerId },
        data: { status: 'Available' }
      });

      return alloc;
    });

    res.json(allocation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to release allocation' });
  }
});

export default router;
