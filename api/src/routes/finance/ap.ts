import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// ==========================================
// VENDOR BILLS (AP INVOICES)
// ==========================================
router.get('/invoices', async (req: Request, res: Response) => {
  try {
    const invoices = await prisma.aPInvoice.findMany({ include: { items: true, payments: true } });
    res.json(invoices);
  } catch (error: any) { res.status(500).json({ error: error.message }); }
});

router.post('/invoices', async (req: Request, res: Response) => {
  try {
    const { invoiceNo, vendorId, invoiceDate, dueDate, totalAmount, currency, items } = req.body;
    const invoice = await prisma.aPInvoice.create({
      data: {
        invoiceNo,
        vendorId,
        invoiceDate: new Date(invoiceDate),
        dueDate: new Date(dueDate),
        totalAmount: Number(totalAmount),
        currency,
        items: {
          create: items?.map((i: any) => ({
            description: i.description,
            quantity: Number(i.quantity),
            unitPrice: Number(i.unitPrice),
            total: Number(i.quantity) * Number(i.unitPrice)
          }))
        }
      },
      include: { items: true }
    });
    res.status(201).json(invoice);
  } catch (error: any) { res.status(500).json({ error: error.message }); }
});

// ==========================================
// VENDOR PAYMENTS
// ==========================================
router.get('/payments', async (req: Request, res: Response) => {
  try {
    const payments = await prisma.aPPayment.findMany({ include: { invoice: true } });
    res.json(payments);
  } catch (error: any) { res.status(500).json({ error: error.message }); }
});

router.post('/payments', async (req: Request, res: Response) => {
  try {
    const { invoiceId, amount, paymentMode, referenceNo } = req.body;
    
    // 1. Create Payment
    const payment = await prisma.aPPayment.create({
      data: {
        paymentNo: `PAY-${Date.now()}`,
        invoiceId,
        amount: Number(amount),
        paymentMode,
        referenceNo
      }
    });
    
    // 2. Update Invoice Paid Amount
    const invoice = await prisma.aPInvoice.findUnique({ where: { id: invoiceId } });
    if (invoice) {
      const newPaid = invoice.paidAmount + Number(amount);
      const newStatus = newPaid >= invoice.totalAmount ? 'Paid' : 'Partially Paid';
      await prisma.aPInvoice.update({
        where: { id: invoiceId },
        data: { paidAmount: newPaid, status: newStatus }
      });
    }

    res.status(201).json(payment);
  } catch (error: any) { res.status(500).json({ error: error.message }); }
});

export default router;
