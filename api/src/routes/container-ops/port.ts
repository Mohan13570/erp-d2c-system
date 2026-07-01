import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get Port Operations
router.get('/', async (req, res) => {
  try {
    const ops = await prisma.containerPortOperation.findMany({
      where: { isDeleted: false },
      include: { container: true },
      orderBy: { timestamp: 'desc' }
    });
    res.json(ops);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch port operations' });
  }
});

// Record Port Terminal Assignment/Operation
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    const op = await prisma.containerPortOperation.create({ data });
    res.json(op);
  } catch (error) {
    res.status(500).json({ error: 'Failed to record port operation' });
  }
});

export default router;
