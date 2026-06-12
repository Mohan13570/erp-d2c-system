import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  try {
    const w = await prisma.warehouse.findMany({ include: { locations: true } });
    res.json(w);
  } catch (error) { res.status(500).json({ error: 'Failed' }); }
});

router.post('/', async (req, res) => {
  try {
    const data = req.body;
    if (!data.companyName) {
      const c = await prisma.company.findFirst();
      if (c) data.companyName = c.name;
    }
    const w = await prisma.warehouse.create({ data });
    res.json(w);
  } catch (err: any) { res.status(400).json({ error: err.message }); }
});

router.post('/locations', async (req, res) => {
  try {
    const l = await prisma.warehouseLocation.create({ data: req.body });
    res.json(l);
  } catch (err: any) { res.status(400).json({ error: err.message }); }
});

router.get('/picks', async (req, res) => {
  try {
    const picks = await prisma.pickList.findMany();
    res.json(picks);
  } catch (error) { res.status(500).json({ error: 'Failed' }); }
});

router.post('/picks', async (req, res) => {
  try {
    const p = await prisma.pickList.create({ data: req.body });
    res.json(p);
  } catch (err: any) { res.status(400).json({ error: err.message }); }
});

router.get('/packs', async (req, res) => {
  try {
    const packs = await prisma.packingList.findMany();
    res.json(packs);
  } catch (error) { res.status(500).json({ error: 'Failed' }); }
});

router.post('/packs', async (req, res) => {
  try {
    const p = await prisma.packingList.create({ data: req.body });
    res.json(p);
  } catch (err: any) { res.status(400).json({ error: err.message }); }
});

export default router;
