import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// ==========================================
// 1. VENDOR BILLING (AP)
// ==========================================
router.get('/bills', async (req, res) => {
  try {
    const bills = await prisma.procurementVendorBill.findMany({
      include: { vendor: true, purchaseOrder: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(bills);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/bills', async (req, res) => {
  try {
    const { vendorId, purchaseOrderId, amount, taxAmount, dueDate } = req.body;
    
    const count = await prisma.procurementVendorBill.count();
    const billNumber = `VB-${new Date().getFullYear()}-${(count + 1).toString().padStart(5, '0')}`;
    const totalAmount = amount + taxAmount;

    const bill = await prisma.procurementVendorBill.create({
      data: {
        billNumber,
        vendorId,
        purchaseOrderId,
        amount,
        taxAmount,
        totalAmount,
        dueDate: new Date(dueDate),
        status: 'Unpaid'
      }
    });

    // Credit the Vendor Ledger (AP Liability Increases)
    await prisma.vendorLedger.create({
      data: {
        vendorId,
        transactionType: 'Invoice',
        referenceId: bill.billNumber,
        credit: totalAmount,
        balance: totalAmount, // Simplification for demo
        description: `Vendor Bill generated against PO ${purchaseOrderId || 'N/A'}`
      }
    });

    res.status(201).json(bill);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 2. PAYMENTS
// ==========================================
router.get('/payments', async (req, res) => {
  try {
    const payments = await prisma.procurementPayment.findMany({
      include: { vendor: true, vendorBill: true },
      orderBy: { paymentDate: 'desc' }
    });
    res.json(payments);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/payments', async (req, res) => {
  try {
    const { vendorBillId, vendorId, amount, method, reference } = req.body;
    
    const count = await prisma.procurementPayment.count();
    const paymentNumber = `PAY-${new Date().getFullYear()}-${(count + 1).toString().padStart(5, '0')}`;

    const payment = await prisma.procurementPayment.create({
      data: {
        paymentNumber,
        vendorBillId,
        vendorId,
        amount,
        method,
        reference,
        status: 'Completed'
      }
    });

    // Debit the Vendor Ledger (AP Liability Decreases)
    await prisma.vendorLedger.create({
      data: {
        vendorId,
        transactionType: 'Payment',
        referenceId: payment.paymentNumber,
        debit: amount,
        balance: -amount, // Simplification for demo
        description: `Payment via ${method} for Bill ${vendorBillId}`
      }
    });

    // Update Bill Status
    const bill = await prisma.procurementVendorBill.findUnique({ where: { id: vendorBillId } });
    if (bill && bill.amount <= amount) {
      await prisma.procurementVendorBill.update({
        where: { id: vendorBillId },
        data: { status: 'Paid' }
      });
    } else {
      await prisma.procurementVendorBill.update({
        where: { id: vendorBillId },
        data: { status: 'Partial' }
      });
    }

    res.status(201).json(payment);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 3. BUDGET MANAGEMENT
// ==========================================
router.get('/budgets', async (req, res) => {
  try {
    const budgets = await prisma.budgetMaster.findMany({
      orderBy: { fiscalYear: 'desc' }
    });
    res.json(budgets);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/budgets', async (req, res) => {
  try {
    const { department, fiscalYear, totalBudget } = req.body;
    
    const budget = await prisma.budgetMaster.create({
      data: {
        department,
        fiscalYear,
        totalBudget,
        allocatedAmount: totalBudget
      }
    });

    res.status(201).json(budget);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
