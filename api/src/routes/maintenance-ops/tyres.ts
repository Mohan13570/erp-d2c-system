import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get Tyre Inventory
router.get('/', async (req, res) => {
  try {
    const tyres = await prisma.roadTyreInventory.findMany({
      where: { isDeleted: false },
      include: { vehicle: true },
      orderBy: { timestamp: 'desc' }
    });
    res.json(tyres);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tyres' });
  }
});

// Update Tyre Status / Position
router.put('/:id', async (req, res) => {
  try {
    const { status, vehicleId, position, treadDepth } = req.body;
    const tyre = await prisma.roadTyreInventory.update({
      where: { id: req.params.id },
      data: { status, vehicleId, position, treadDepth: treadDepth ? Number(treadDepth) : undefined }
    });
    res.json(tyre);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update tyre' });
  }
});

export default router;
