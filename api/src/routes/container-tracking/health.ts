import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get Health
router.get('/', async (req, res) => {
  try {
    const health = await prisma.containerHealth.findMany({
      include: { container: true }
    });
    res.json(health);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch health records' });
  }
});

// Update Health
router.post('/', async (req, res) => {
  try {
    const { containerId, structuralCondition, floorCondition, needsCleaning, needsFumigation } = req.body;
    
    // Calculate simple health score
    let score = 100;
    if (structuralCondition !== 'Good') score -= 30;
    if (floorCondition !== 'Good') score -= 20;
    if (needsCleaning) score -= 10;
    if (needsFumigation) score -= 20;

    const health = await prisma.containerHealth.upsert({
      where: { containerId },
      update: { structuralCondition, floorCondition, needsCleaning, needsFumigation, healthScore: score, lastInspection: new Date() },
      create: { containerId, structuralCondition, floorCondition, needsCleaning, needsFumigation, healthScore: score, lastInspection: new Date() }
    });
    res.json(health);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update health' });
  }
});

export default router;
