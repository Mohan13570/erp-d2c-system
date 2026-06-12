import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/assets', async (_req: Request, res: Response) => {
  const assets = await prisma.asset.findMany();
  res.json(assets);
});
router.post('/assets', async (req: Request, res: Response) => {
  try {
    const data = { ...req.body };
    if (data.purchaseDate) {
      data.purchaseDate = new Date(data.purchaseDate);
    } else {
      delete data.purchaseDate;
    }
    const asset = await prisma.asset.create({ data });
    res.status(201).json(asset);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create asset' });
  }
});

export default router;
