import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// ==========================================
// EXPENSE MANAGEMENT
// ==========================================
router.get('/expenses', async (req: Request, res: Response) => {
  try {
    const expenses = await prisma.expenseClaim.findMany({ include: { category: true } });
    res.json(expenses);
  } catch (error: any) { res.status(500).json({ error: error.message }); }
});

router.post('/expenses', async (req: Request, res: Response) => {
  try {
    const { categoryId, amount, claimDate } = req.body;
    const expense = await prisma.expenseClaim.create({
      data: {
        claimNo: `EXP-${Date.now()}`,
        categoryId,
        amount: Number(amount),
        claimDate: claimDate ? new Date(claimDate) : new Date()
      }
    });
    res.status(201).json(expense);
  } catch (error: any) { res.status(500).json({ error: error.message }); }
});

// ==========================================
// REVENUE FORECASTING (MOCK)
// ==========================================
router.get('/revenue-forecast', async (req: Request, res: Response) => {
  try {
    res.json([
      { month: 'Jan', actual: 120000, projected: 125000 },
      { month: 'Feb', actual: 145000, projected: 130000 },
      { month: 'Mar', actual: 0, projected: 150000 }
    ]);
  } catch (error: any) { res.status(500).json({ error: error.message }); }
});

export default router;
