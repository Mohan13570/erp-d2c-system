import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get Repairs
router.get('/', async (req, res) => {
  try {
    const repairs = await prisma.containerRepair.findMany({
      where: { isDeleted: false },
      include: { container: true },
      orderBy: { requestedAt: 'desc' }
    });
    res.json(repairs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch repairs' });
  }
});

// Create Repair Request
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    const repair = await prisma.containerRepair.create({ data });
    // Update container status
    await prisma.container.update({
      where: { id: data.containerId },
      data: { status: 'Under Repair' }
    });
    res.json(repair);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create repair request' });
  }
});

export default router;
