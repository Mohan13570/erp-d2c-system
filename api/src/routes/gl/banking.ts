import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// ==========================================
// BANKING & RECONCILIATION
// ==========================================
router.get('/reconciliations', async (req: Request, res: Response) => {
  try {
    const recons = await prisma.bankReconciliation.findMany();
    res.json(recons);
  } catch (error: any) { res.status(500).json({ error: error.message }); }
});

router.post('/reconciliations', async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const recon = await prisma.bankReconciliation.create({
      data: {
        ...data,
        statementDate: new Date(data.statementDate)
      }
    });
    res.status(201).json(recon);
  } catch (error: any) { res.status(500).json({ error: error.message }); }
});

// ==========================================
// FUND TRANSFERS
// ==========================================
router.post('/transfer', async (req: Request, res: Response) => {
  try {
    const { fromAccountId, toAccountId, amount, transferDate, reference } = req.body;
    
    const transfer = await prisma.fundTransfer.create({
      data: {
        transferNo: `TRF-${Date.now()}`,
        fromAccountId,
        toAccountId,
        amount: Number(amount),
        transferDate: new Date(transferDate),
        reference
      }
    });

    res.status(201).json(transfer);
  } catch (error: any) { res.status(500).json({ error: error.message }); }
});

export default router;
