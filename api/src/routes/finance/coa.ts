import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// ==========================================
// ACCOUNT GROUPS
// ==========================================
router.get('/groups', async (req: Request, res: Response) => {
  try {
    const groups = await prisma.financeAccountGroup.findMany();
    res.json(groups);
  } catch (error: any) { res.status(500).json({ error: error.message }); }
});

router.post('/groups', async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const group = await prisma.financeAccountGroup.create({ data });
    res.status(201).json(group);
  } catch (error: any) { res.status(500).json({ error: error.message }); }
});

// ==========================================
// CHART OF ACCOUNTS
// ==========================================
router.get('/', async (req: Request, res: Response) => {
  try {
    // Return flat list, frontend will build hierarchy
    const accounts = await prisma.chartOfAccount.findMany({
      include: { group: true }
    });
    res.json(accounts);
  } catch (error: any) { res.status(500).json({ error: error.message }); }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const account = await prisma.chartOfAccount.create({ data });
    res.status(201).json(account);
  } catch (error: any) { res.status(500).json({ error: error.message }); }
});

export default router;
