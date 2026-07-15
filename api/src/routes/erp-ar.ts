import express from 'express';
import { PrismaClient } from '@prisma/client';
import { AccountsReceivableEngine } from '../services/AccountsReceivableEngine';

const router = express.Router();
const prisma = new PrismaClient();

// Get Dashboard AR Metrics
router.get('/dashboard', async (req, res) => {
  try {
    const invoices = await prisma.erpInvoice.aggregate({
       _sum: { grandTotal: true, amountPaid: true },
       where: { status: { in: ['APPROVED', 'SENT', 'PARTIALLY_PAID', 'OVERDUE'] } }
    });
    
    const aging = await AccountsReceivableEngine.calculateAging();
    
    const outstanding = (invoices._sum.grandTotal || 0) - (invoices._sum.amountPaid || 0);
    
    res.json({
       totalOutstanding: outstanding,
       aging,
       avgCollectionDays: 42 // Simulated metric
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Seed Profile & Ledger (Utility)
router.post('/seed', async (req, res) => {
  try {
     let profile = await prisma.arCustomerProfile.findUnique({ where: { customerId: 'CUST-1049' } });
     if (!profile) {
        profile = await prisma.arCustomerProfile.create({
           data: {
              customerId: 'CUST-1049',
              creditLimit: 50000,
              usedCredit: 12500,
              availableCredit: 37500
           }
        });
        
        await prisma.arLedgerEntry.create({
           data: {
              profileId: profile.id,
              transactionType: 'INVOICE',
              referenceId: 'INV-2026-0001',
              description: 'Initial Opening Balance via Invoice',
              debitAmount: 12500,
              runningBalance: 12500
           }
        });
     }
     res.json({ message: "AR Seed complete" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get Customer Ledger
router.get('/ledger/:customerId', async (req, res) => {
  try {
    const profile = await prisma.arCustomerProfile.findUnique({
       where: { customerId: req.params.customerId },
       include: {
          ledgers: { orderBy: { createdAt: 'desc' } }
       }
    });
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    res.json(profile);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get Open Invoices for Allocation
router.get('/open-invoices', async (req, res) => {
  try {
    const invoices = await prisma.erpInvoice.findMany({
       where: { status: { in: ['APPROVED', 'SENT', 'PARTIALLY_PAID', 'OVERDUE'] } },
       orderBy: { dueDate: 'asc' }
    });
    res.json(invoices);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Allocate Payment
router.post('/allocate', async (req, res) => {
  try {
    const allocatedBy = "finance_clerk";
    const result = await AccountsReceivableEngine.allocatePayment({ ...req.body, allocatedBy });
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Get Collections Dashboard Data
router.get('/collections', async (req, res) => {
  try {
    const activities = await prisma.arCollectionActivity.findMany({
       include: { profile: true },
       orderBy: { createdAt: 'desc' },
       take: 50
    });
    res.json(activities);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
