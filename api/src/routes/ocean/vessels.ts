import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all Vessels
router.get('/', async (req, res) => {
  try {
    const vessels = await prisma.vessel.findMany({
       include: { voyages: true }
    });
    res.json(vessels);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch vessels' });
  }
});

// Create Vessel
router.post('/', async (req, res) => {
  try {
    const vessel = await prisma.vessel.create({
      data: req.body
    });
    res.status(201).json(vessel);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Soft Delete Vessel
router.delete('/:id', async (req, res) => {
  try {
    await prisma.vessel.delete({
      where: { id: req.params.id }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete vessel' });
  }
});

export default router;
