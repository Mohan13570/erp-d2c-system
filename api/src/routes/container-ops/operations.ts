import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get recent operations
router.get('/', async (req, res) => {
  try {
    const operations = await prisma.containerOperation.findMany({
      where: { isDeleted: false },
      include: { container: true },
      orderBy: { timestamp: 'desc' }
    });
    res.json(operations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch operations' });
  }
});

// Trigger a new operation
router.post('/', async (req, res) => {
  try {
    const { containerId, type, location, performedBy, notes } = req.body;
    
    const operation = await prisma.$transaction(async (tx) => {
      // Sync Container master status logically based on operation type
      if (type === 'GateIn') {
        await tx.container.update({ where: { id: containerId }, data: { status: 'At Yard' } });
      } else if (type === 'GateOut') {
        await tx.container.update({ where: { id: containerId }, data: { status: 'In Transit' } });
      }

      return tx.containerOperation.create({
        data: { containerId, type, location, performedBy, notes, status: 'Completed' }
      });
    });

    res.json(operation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to record operation' });
  }
});

export default router;
