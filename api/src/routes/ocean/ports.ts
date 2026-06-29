import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all Ports
router.get('/', async (req, res) => {
  try {
    const ports = await prisma.port.findMany({
       include: { Terminal: true }
    });
    res.json(ports);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch ports' });
  }
});

// Create Port
router.post('/', async (req, res) => {
  try {
    const port = await prisma.port.create({
      data: req.body
    });
    res.status(201).json(port);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Soft Delete Port
router.delete('/:id', async (req, res) => {
  try {
    await prisma.port.delete({
      where: { id: req.params.id }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete port' });
  }
});

export default router;
