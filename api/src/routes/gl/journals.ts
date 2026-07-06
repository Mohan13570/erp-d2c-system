import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// ==========================================
// GL JOURNALS ENGINE
// ==========================================
router.get('/', async (req: Request, res: Response) => {
  try {
    const journals = await prisma.gLJournalEntry.findMany({ include: { lines: true } });
    res.json(journals);
  } catch (error: any) { res.status(500).json({ error: error.message }); }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { postingDate, narration, lines } = req.body;
    
    // Double-Entry Validation
    let totalDebit = 0;
    let totalCredit = 0;
    
    lines.forEach((line: any) => {
      totalDebit += Number(line.debit || 0);
      totalCredit += Number(line.credit || 0);
    });

    if (totalDebit !== totalCredit) {
      return res.status(400).json({ error: `Double-entry validation failed: Debits (${totalDebit}) do not equal Credits (${totalCredit})` });
    }

    const journal = await prisma.gLJournalEntry.create({
      data: {
        journalNo: `JV-${Date.now()}`,
        postingDate: new Date(postingDate),
        narration,
        totalDebit,
        totalCredit,
        lines: {
          create: lines.map((l: any) => ({
            accountId: l.accountId,
            debit: Number(l.debit || 0),
            credit: Number(l.credit || 0)
          }))
        }
      },
      include: { lines: true }
    });

    res.status(201).json(journal);
  } catch (error: any) { res.status(500).json({ error: error.message }); }
});

// ==========================================
// TRIAL BALANCE ENGINE
// ==========================================
router.get('/trial-balance', async (req: Request, res: Response) => {
  try {
    // Generate Trial Balance from GL Journal Lines
    const lines = await prisma.gLJournalLine.groupBy({
      by: ['accountId'],
      _sum: { debit: true, credit: true }
    });
    
    const accounts = await prisma.chartOfAccount.findMany();
    const accountMap = new Map(accounts.map(a => [a.id, a]));

    const trialBalance = lines.map(l => {
      const acc = accountMap.get(l.accountId);
      const deb = l._sum.debit || 0;
      const cre = l._sum.credit || 0;
      return {
        accountCode: acc?.accountCode,
        accountName: acc?.accountName,
        debit: deb > cre ? deb - cre : 0,
        credit: cre > deb ? cre - deb : 0
      };
    });

    res.json(trialBalance);
  } catch (error: any) { res.status(500).json({ error: error.message }); }
});

export default router;
