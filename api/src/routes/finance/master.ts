import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// ==========================================
// COST CENTERS
// ==========================================
router.get('/cost-centers', async (req: Request, res: Response) => {
  try {
    const costCenters = await prisma.financeCostCenter.findMany();
    res.json(costCenters);
  } catch (error: any) { res.status(500).json({ error: error.message }); }
});

router.post('/cost-centers', async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const costCenter = await prisma.financeCostCenter.create({ data });
    res.status(201).json(costCenter);
  } catch (error: any) { res.status(500).json({ error: error.message }); }
});

// ==========================================
// PROFIT CENTERS
// ==========================================
router.get('/profit-centers', async (req: Request, res: Response) => {
  try {
    const profitCenters = await prisma.financeProfitCenter.findMany();
    res.json(profitCenters);
  } catch (error: any) { res.status(500).json({ error: error.message }); }
});

router.post('/profit-centers', async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const profitCenter = await prisma.financeProfitCenter.create({ data });
    res.status(201).json(profitCenter);
  } catch (error: any) { res.status(500).json({ error: error.message }); }
});

// ==========================================
// BANK ACCOUNTS
// ==========================================
router.get('/banks', async (req: Request, res: Response) => {
  try {
    const banks = await prisma.financeBankMaster.findMany({
      include: {
        branches: {
          include: { accounts: true }
        }
      }
    });
    res.json(banks);
  } catch (error: any) { res.status(500).json({ error: error.message }); }
});

router.post('/banks', async (req: Request, res: Response) => {
  try {
    const { bankCode, bankName, branches } = req.body;
    const bank = await prisma.financeBankMaster.create({
      data: {
        bankCode,
        bankName,
        branches: {
          create: branches?.map((b: any) => ({
            branchName: b.branchName,
            ifscCode: b.ifscCode,
            accounts: {
              create: b.accounts?.map((a: any) => ({
                accountNumber: a.accountNumber,
                accountType: a.accountType,
                currency: a.currency
              }))
            }
          }))
        }
      }
    });
    res.status(201).json(bank);
  } catch (error: any) { res.status(500).json({ error: error.message }); }
});

export default router;
