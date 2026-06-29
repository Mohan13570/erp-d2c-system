import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all Invoices (AP/AR)
router.get('/invoices', async (req, res) => {
  try {
    const invoices = await prisma.oceanInvoice.findMany({
      where: { isDeleted: false },
      include: { booking: true, currency: true, lines: true, payments: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch invoices' });
  }
});

// Create Invoice
router.post('/invoices', async (req, res) => {
  try {
    const { lines, ...invoiceData } = req.body;
    invoiceData.invoiceNumber = `INV-${Math.floor(Math.random() * 1000000)}`;

    const newInvoice = await prisma.oceanInvoice.create({
      data: {
        ...invoiceData,
        lines: { create: lines || [] }
      },
      include: { lines: true }
    });
    res.status(201).json(newInvoice);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Profitability Analysis
router.get('/profitability/:bookingId', async (req, res) => {
  try {
    const invoices = await prisma.oceanInvoice.findMany({
      where: { bookingId: req.params.bookingId, isDeleted: false }
    });

    let totalRevenue = 0;
    let totalCost = 0;

    invoices.forEach(inv => {
       const amount = inv.grandTotal * inv.exchangeRate; // Normalizing to base currency
       if (inv.type === 'Receivable' || inv.type === 'Debit Note') {
           totalRevenue += amount;
       } else if (inv.type === 'Payable' || inv.type === 'Credit Note') {
           totalCost += amount;
       }
    });

    res.json({
        bookingId: req.params.bookingId,
        revenue: totalRevenue,
        cost: totalCost,
        margin: totalRevenue - totalCost,
        marginPercentage: totalRevenue > 0 ? ((totalRevenue - totalCost) / totalRevenue) * 100 : 0
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
