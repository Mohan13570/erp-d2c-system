import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/vessels', async (req, res) => {
  try {
    const vessels = await prisma.vessel.findMany({ include: { voyages: true } });
    res.json(vessels);
  } catch (error) { res.status(500).json({ error: 'Failed' }); }
});

router.post('/vessels', async (req, res) => {
  try {
    const vessel = await prisma.vessel.create({ data: req.body });
    res.json(vessel);
  } catch (err: any) { res.status(400).json({ error: err.message }); }
});

router.get('/voyages', async (req, res) => {
  try {
    const voyages = await prisma.voyage.findMany({ include: { vessel: true } });
    res.json(voyages);
  } catch (error) { res.status(500).json({ error: 'Failed' }); }
});

router.post('/voyages', async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.etd) data.etd = new Date(data.etd);
    if (data.eta) data.eta = new Date(data.eta);
    const v = await prisma.voyage.create({ data });
    res.json(v);
  } catch (err: any) { res.status(400).json({ error: err.message }); }
});

router.get('/containers', async (req, res) => {
  try {
    const cons = await prisma.container.findMany({ include: { lifecycles: true } });
    res.json(cons);
  } catch (error) { res.status(500).json({ error: 'Failed' }); }
});

router.post('/containers', async (req, res) => {
  try {
    const c = await prisma.container.create({ data: req.body });
    res.json(c);
  } catch (err: any) { res.status(400).json({ error: err.message }); }
});

router.post('/containers/movements', async (req, res) => {
  try {
    const movement = await prisma.containerLifecycle.create({ data: req.body });
    res.json(movement);
  } catch (err: any) { res.status(400).json({ error: err.message }); }
});

export default router;
