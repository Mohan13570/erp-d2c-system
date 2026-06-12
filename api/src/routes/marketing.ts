import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/campaigns', async (_req: Request, res: Response) => {
  try {
    const campaigns = await prisma.marketingCampaign.findMany({ orderBy: { startDate: 'desc' } });
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch campaigns' });
  }
});

router.post('/campaigns', async (req: Request, res: Response) => {
  try {
    const campaign = await prisma.marketingCampaign.create({ data: req.body });
    res.status(201).json(campaign);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create campaign' });
  }
});

router.delete('/campaigns/:id', async (req: Request, res: Response) => {
  try {
    await prisma.marketingCampaign.delete({ where: { id: req.params.id as string } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete campaign' });
  }
});

export default router;
