import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/devices', async (req, res) => {
  try { res.json(await prisma.trackingDevice.findMany()); } catch (error) { res.status(500).json({ error: 'Failed' }); }
});
router.post('/devices', async (req, res) => {
  try { res.json(await prisma.trackingDevice.create({ data: req.body })); } catch (err: any) { res.status(400).json({ error: err.message }); }
});

export default router;
