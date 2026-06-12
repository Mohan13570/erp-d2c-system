import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/policies', async (req, res) => {
  try { res.json(await prisma.insurancePolicy.findMany()); } catch (error) { res.status(500).json({ error: 'Failed' }); }
});
router.post('/policies', async (req, res) => {
  try { 
    const data = {...req.body};
    if (data.validUntil) data.validUntil = new Date(data.validUntil);
    res.json(await prisma.insurancePolicy.create({ data })); 
  } catch (err: any) { res.status(400).json({ error: err.message }); }
});

router.get('/claims', async (req, res) => {
  try { res.json(await prisma.insuranceClaim.findMany({ include: { policy: true } })); } catch (error) { res.status(500).json({ error: 'Failed' }); }
});
router.post('/claims', async (req, res) => {
  try { res.json(await prisma.insuranceClaim.create({ data: req.body })); } catch (err: any) { res.status(400).json({ error: err.message }); }
});

export default router;
