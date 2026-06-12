import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  try {
    const statuses = await prisma.containerStatus.findMany({ orderBy: { timestamp: 'desc' } });
    res.json(statuses);
  } catch (error) { res.status(500).json({ error: 'Failed' }); }
});

router.post('/', async (req, res) => {
  try {
    const s = await prisma.containerStatus.create({ data: req.body });
    res.json(s);
  } catch (err: any) { res.status(400).json({ error: err.message }); }
});

export default router;
