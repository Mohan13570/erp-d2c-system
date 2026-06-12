import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  try {
    const docs = await prisma.document.findMany({ include: { versions: true } });
    res.json(docs);
  } catch (error) { res.status(500).json({ error: 'Failed' }); }
});

router.post('/', async (req, res) => {
  try {
    const doc = await prisma.document.create({ data: req.body });
    res.json(doc);
  } catch (err: any) { res.status(400).json({ error: err.message }); }
});

router.post('/versions', async (req, res) => {
  try {
    const v = await prisma.documentVersion.create({ data: req.body });
    res.json(v);
  } catch (err: any) { res.status(400).json({ error: err.message }); }
});

export default router;
