import express from 'express';
import { PrismaClient } from '@prisma/client';
import { TreasuryEngine } from '../services/TreasuryEngine';

const router = express.Router();
const prisma = new PrismaClient();

// Get Payment Dashboard Metrics
router.get('/dashboard', async (req, res) => {
  try {
    const receipts = await prisma.erpPaymentReceipt.aggregate({
       _sum: { amount: true },
       where: { status: 'UNRECONCILED' }
    });
    
    const bankBal = await prisma.erpBankAccount.aggregate({ _sum: { currentBalance: true } });
    
    res.json({
       totalCashInTransit: receipts._sum.amount || 0,
       totalBankBalance: bankBal._sum.currentBalance || 0
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create Receipt
router.post('/receipts', async (req, res) => {
  try {
    const receipt = await TreasuryEngine.receivePayment(req.body);
    res.status(201).json(receipt);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// List Receipts
router.get('/receipts', async (req, res) => {
  try {
    const receipts = await prisma.erpPaymentReceipt.findMany({
       orderBy: { createdAt: 'desc' }
    });
    res.json(receipts);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Seed Bank Accounts & Dummy Statement Data
router.post('/seed', async (req, res) => {
  try {
     let account = await prisma.erpBankAccount.findFirst();
     if (!account) {
        account = await prisma.erpBankAccount.create({
           data: {
              bankName: 'JPMorgan Chase (Operating)',
              accountNumber: '9900223311',
              currentBalance: 154200.50
           }
        });
        
        await prisma.erpBankStatementItem.createMany({
           data: [
             { bankAccountId: account.id, transactionDate: new Date(), description: 'WIRE IN - CUST-1049', amount: 5000 },
             { bankAccountId: account.id, transactionDate: new Date(), description: 'ACH - MISC', amount: 1200 },
           ]
        });
     }
     res.json({ message: "Treasury Seed complete" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get Bank Recon View (Left Pane: Statements, Right Pane: Receipts)
router.get('/recon-view', async (req, res) => {
  try {
    const unmatchedStatements = await prisma.erpBankStatementItem.findMany({
       where: { isReconciled: false },
       orderBy: { transactionDate: 'desc' }
    });
    
    const unmatchedReceipts = await prisma.erpPaymentReceipt.findMany({
       where: { status: 'UNRECONCILED' },
       orderBy: { receivedDate: 'desc' }
    });
    
    res.json({ unmatchedStatements, unmatchedReceipts });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Run Auto-Reconcile
router.post('/auto-reconcile', async (req, res) => {
  try {
    const result = await TreasuryEngine.autoReconcile();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
