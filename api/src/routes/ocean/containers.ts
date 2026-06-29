import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all Container Types
router.get('/', async (req, res) => {
  try {
    const types = await prisma.containerType.findMany({
       where: { isDeleted: false },
       include: { sizes: true }
    });
    res.json(types);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch container types' });
  }
});

// Create Container Type
router.post('/', async (req, res) => {
  try {
    const type = await prisma.containerType.create({
      data: req.body
    });
    res.status(201).json(type);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
