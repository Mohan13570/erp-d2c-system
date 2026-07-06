import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// ==========================================
// TAX MASTER
// ==========================================
router.get('/master', async (req: Request, res: Response) => {
  try {
    const taxes = await prisma.taxMaster.findMany();
    res.json(taxes);
  } catch (error: any) { res.status(500).json({ error: error.message }); }
});

router.post('/master', async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const tax = await prisma.taxMaster.create({ data });
    res.status(201).json(tax);
  } catch (error: any) { res.status(500).json({ error: error.message }); }
});

// ==========================================
// GST TRANSACTIONS
// ==========================================
router.get('/gst', async (req: Request, res: Response) => {
  try {
    const gsts = await prisma.gSTTransaction.findMany();
    res.json(gsts);
  } catch (error: any) { res.status(500).json({ error: error.message }); }
});

export default router;
