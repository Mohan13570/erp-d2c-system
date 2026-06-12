import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/declarations', async (req, res) => {
  try {
    const decls = await prisma.customsDeclaration.findMany({ include: { duties: true } });
    res.json(decls);
  } catch (error) { res.status(500).json({ error: 'Failed' }); }
});

router.post('/declarations', async (req, res) => {
  try {
    const d = await prisma.customsDeclaration.create({ data: req.body });
    res.json(d);
  } catch (err: any) { res.status(400).json({ error: err.message }); }
});

router.get('/rules', async (req, res) => {
  try {
    const rules = await prisma.complianceRule.findMany();
    res.json(rules);
  } catch (error) { res.status(500).json({ error: 'Failed' }); }
});

router.post('/rules', async (req, res) => {
  try {
    const r = await prisma.complianceRule.create({ data: req.body });
    res.json(r);
  } catch (err: any) { res.status(400).json({ error: err.message }); }
});

export default router;
