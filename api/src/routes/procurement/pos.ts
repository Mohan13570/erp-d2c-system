import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/pos', async (req, res) => {
  try { res.json(await prisma.purchaseOrder.findMany({ include: { vendor: true } })); } catch (error) { res.status(500).json({ error: 'Failed' }); }
});
router.post('/pos', async (req, res) => {
  try { res.json(await prisma.purchaseOrder.create({ data: req.body })); } catch (err: any) { res.status(400).json({ error: err.message }); }
});

router.get('/requisitions', async (req, res) => {
  try { res.json(await prisma.purchaseRequisition.findMany()); } catch (error) { res.status(500).json({ error: 'Failed' }); }
});
router.post('/requisitions', async (req, res) => {
  try { res.json(await prisma.purchaseRequisition.create({ data: req.body })); } catch (err: any) { res.status(400).json({ error: err.message }); }
});

export default router;
