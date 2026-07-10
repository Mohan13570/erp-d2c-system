import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { VendorFinanceEngine } from '../services/VendorFinanceEngine';

const router = Router();
const prisma = new PrismaClient();

const mockVendorId = "mock-vendor-id"; // In production, derived from JWT

router.get('/metrics', async (req, res) => {
  try {
    const metrics = await VendorFinanceEngine.getMetrics(mockVendorId);
    res.json(metrics);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/invoices', async (req, res) => {
  try {
    const invoices = await prisma.vendorFinanceInvoice.findMany({
      where: { vendorId: mockVendorId },
      include: { purchaseOrder: true, items: true },
      orderBy: { submittedAt: 'desc' }
    });
    res.json(invoices);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/invoice', async (req, res) => {
  try {
    const { purchaseOrderId, items } = req.body;
    const invoice = await VendorFinanceEngine.submitInvoice(mockVendorId, purchaseOrderId, items);
    res.json(invoice);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/payments', async (req, res) => {
  try {
    const payments = await prisma.vendorFinancePayment.findMany({
      where: { vendorId: mockVendorId },
      include: { invoice: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(payments);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/ledger', async (req, res) => {
  try {
    const ledger = await prisma.vendorFinanceLedger.findMany({
      where: { vendorId: mockVendorId },
      orderBy: { transactionDate: 'desc' },
      include: { invoice: true, payment: true }
    });
    res.json(ledger);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
