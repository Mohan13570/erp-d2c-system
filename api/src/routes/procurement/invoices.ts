import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  try {
    const invoices = await prisma.vendorInvoice.findMany({
      include: { purchaseOrder: true },
      orderBy: { invoiceDate: 'desc' }
    });
    res.json(invoices);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/match', async (req, res) => {
  try {
    const { invoiceNumber, vendorId, purchaseOrderId, totalAmount, invoiceDate, dueDate } = req.body;
    
    // Perform 3-Way Matching Logic
    const po = await prisma.purchaseOrder.findUnique({
      where: { id: purchaseOrderId },
      include: { items: true, grns: { include: { items: true } } }
    });

    if (!po) return res.status(404).json({ error: 'PO not found for matching.' });

    let matchStatus = 'Pending';
    let notes = '';

    // Calculate total accepted across all GRNs
    let totalGrnValue = 0;
    po.grns.forEach(grn => {
      grn.items.forEach(grnItem => {
         const poItem = po.items.find(i => i.itemCode === grnItem.itemCode);
         if (poItem) {
           totalGrnValue += (grnItem.qtyAccepted * poItem.rate);
         }
      });
    });

    // Tolerance check (e.g. 5% tolerance)
    const diff = Math.abs(totalAmount - totalGrnValue);
    if (diff <= (totalGrnValue * 0.05)) {
      matchStatus = '3-Way-Matched';
      notes = 'Invoice matched with PO and GRN within tolerance.';
    } else {
      matchStatus = 'Discrepancy';
      notes = `Discrepancy: Invoice Amount ${totalAmount} vs GRN Value ${totalGrnValue}`;
    }

    const invoice = await prisma.vendorInvoice.create({
      data: {
        invoiceNumber,
        vendorId,
        purchaseOrderId,
        totalAmount,
        invoiceDate: new Date(invoiceDate),
        dueDate: new Date(dueDate),
        status: matchStatus === 'Discrepancy' ? 'Hold' : 'Approved',
        matchStatus,
        notes
      }
    });

    res.status(201).json(invoice);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
