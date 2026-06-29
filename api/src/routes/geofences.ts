import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  try {
    const fences = await prisma.geofence.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(fences);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch geofences' });
  }
});

router.post('/', async (req, res) => {
  try {
    const data = req.body;
    const fence = await prisma.geofence.create({
      data: {
        name: data.name,
        category: data.category || 'Warehouse',
        type: data.type || 'Polygon',
        coordinates: JSON.stringify(data.coordinates),
        radiusMeter: data.radiusMeter || null,
        color: data.color || '#6366f1'
      }
    });
    res.status(201).json(fence);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await prisma.geofence.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete' });
  }
});

export default router;
