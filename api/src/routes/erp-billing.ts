import express from 'express';
import { PrismaClient } from '@prisma/client';
import { BillingEngine } from '../services/BillingEngine';

const router = express.Router();
const prisma = new PrismaClient();

// Get Dashboard Metrics
router.get('/dashboard', async (req, res) => {
  try {
    const [totalRevenueResult, invoices] = await Promise.all([
      prisma.erpInvoice.aggregate({
        _sum: { grandTotal: true, amountPaid: true },
        where: { status: { notIn: ['CANCELLED', 'DRAFT'] } }
      }),
      prisma.erpInvoice.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: { history: true }
      })
    ]);

    const stats = {
      totalRevenue: totalRevenueResult._sum.grandTotal || 0,
      paidAmount: totalRevenueResult._sum.amountPaid || 0,
      outstandingAmount: (totalRevenueResult._sum.grandTotal || 0) - (totalRevenueResult._sum.amountPaid || 0)
    };

    res.json({ stats, recentInvoices: invoices });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// List Invoices
router.get('/', async (req, res) => {
  try {
    const invoices = await prisma.erpInvoice.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        items: true,
        charges: true,
        taxes: true
      }
    });
    res.json(invoices);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get Single Invoice
router.get('/:id', async (req, res) => {
  try {
    const invoice = await prisma.erpInvoice.findUnique({
      where: { id: req.params.id },
      include: {
        items: true,
        charges: true,
        taxes: true,
        history: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });
    
    if (!invoice) return res.status(404).json({ error: 'Not found' });
    res.json(invoice);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create Invoice
router.post('/', async (req, res) => {
  try {
    // In production, get user from req.user
    const createdBy = "admin_user";
    const invoice = await BillingEngine.createInvoice(req.body, createdBy);
    res.status(201).json(invoice);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Approve Invoice
router.post('/:id/approve', async (req, res) => {
  try {
    const approvedBy = "finance_manager";
    const invoice = await BillingEngine.approveInvoice(req.params.id, approvedBy);
    res.json(invoice);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
