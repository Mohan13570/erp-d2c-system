import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/devices', async (req, res) => {
  try { res.json(await prisma.gPSDevice.findMany()); } catch (error) { res.status(500).json({ error: 'Failed' }); }
});
router.post('/devices', async (req, res) => {
  try { res.json(await prisma.gPSDevice.create({ data: req.body })); } catch (err: any) { res.status(400).json({ error: err.message }); }
});

export default router;
