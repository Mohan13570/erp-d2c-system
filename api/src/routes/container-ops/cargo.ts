import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get Cargo Operations
router.get('/', async (req, res) => {
  try {
    const ops = await prisma.containerCargoOperation.findMany({
      where: { isDeleted: false },
      include: { container: true },
      orderBy: { timestamp: 'desc' }
    });
    res.json(ops);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cargo operations' });
  }
});

// Record Cargo Operation (Weight, Temp, DG)
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    const op = await prisma.containerCargoOperation.create({ data });
    res.json(op);
  } catch (error) {
    res.status(500).json({ error: 'Failed to record cargo operation' });
  }
});

export default router;
