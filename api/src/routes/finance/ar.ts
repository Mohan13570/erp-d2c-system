import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// ==========================================
// CUSTOMER INVOICES (AR)
// ==========================================
router.get('/invoices', async (req: Request, res: Response) => {
  try {
    const invoices = await prisma.aRInvoice.findMany({ include: { items: true, payments: true } });
    res.json(invoices);
  } catch (error: any) { res.status(500).json({ error: error.message }); }
});

router.post('/invoices', async (req: Request, res: Response) => {
  try {
    const { invoiceNo, customerId, invoiceDate, dueDate, totalAmount, currency, invoiceType, items } = req.body;
    const invoice = await prisma.aRInvoice.create({
      data: {
        invoiceNo,
        customerId,
        invoiceDate: new Date(invoiceDate),
        dueDate: new Date(dueDate),
        totalAmount: Number(totalAmount),
        currency,
        invoiceType: invoiceType || 'Standard',
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
// CUSTOMER RECEIPTS
// ==========================================
router.get('/receipts', async (req: Request, res: Response) => {
  try {
    const payments = await prisma.aRPayment.findMany({ include: { invoice: true } });
    res.json(payments);
  } catch (error: any) { res.status(500).json({ error: error.message }); }
});

router.post('/receipts', async (req: Request, res: Response) => {
  try {
    const { invoiceId, amount, paymentMode, referenceNo } = req.body;
    
    const payment = await prisma.aRPayment.create({
      data: {
        receiptNo: `REC-${Date.now()}`,
        invoiceId,
        amount: Number(amount),
        paymentMode,
        referenceNo
      }
    });
    
    const invoice = await prisma.aRInvoice.findUnique({ where: { id: invoiceId } });
    if (invoice) {
      const newPaid = invoice.paidAmount + Number(amount);
      const newStatus = newPaid >= invoice.totalAmount ? 'Paid' : 'Partially Paid';
      await prisma.aRInvoice.update({
        where: { id: invoiceId },
        data: { paidAmount: newPaid, status: newStatus }
      });
    }

    res.status(201).json(payment);
  } catch (error: any) { res.status(500).json({ error: error.message }); }
});

export default router;
