import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class VendorFinanceEngine {
  /**
   * Submit an invoice against a Purchase Order
   */
  static async submitInvoice(vendorId: string, purchaseOrderId: string, items: { description: string, quantity: number, unitPrice: number }[]) {
    // 1. Validate PO exists and is accepted
    const po = await prisma.purchaseOrder.findFirst({
      where: { id: purchaseOrderId, vendorId, status: 'Accepted' }
    });
    if (!po) throw new Error("Purchase Order not found or not accepted.");

    // 2. Calculate Totals
    let totalAmount = 0;
    const invoiceItems = items.map(item => {
      const totalPrice = item.quantity * item.unitPrice;
      totalAmount += totalPrice;
      return {
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice
      };
    });

    const taxAmount = totalAmount * 0.18; // 18% standard mock tax
    const grandTotal = totalAmount + taxAmount;

    // 3. Generate Unique Invoice Number
    const invoiceNumber = `INV-${Date.now()}`;

    // 4. Create Invoice
    const invoice = await prisma.vendorFinanceInvoice.create({
      data: {
        invoiceNumber,
        vendorId,
        purchaseOrderId,
        status: 'Pending Approval',
        totalAmount: grandTotal,
        taxAmount,
        items: {
          create: invoiceItems
        }
      },
      include: { items: true }
    });

    // 5. Post to Vendor Ledger (as an Unpaid Liability/Pending)
    await prisma.vendorFinanceLedger.create({
      data: {
        vendorId,
        type: 'Invoice',
        description: `Invoice Submitted: ${invoiceNumber}`,
        creditAmount: grandTotal,
        balanceAmount: grandTotal, // simplified rolling logic
        invoiceId: invoice.id
      }
    });

    return invoice;
  }

  /**
   * Get Vendor Dashboard Metrics
   */
  static async getMetrics(vendorId: string) {
    const invoices = await prisma.vendorFinanceInvoice.findMany({ where: { vendorId } });
    
    let outstandingAmount = 0;
    let paidAmount = 0;
    let overdueCount = 0;

    invoices.forEach(inv => {
      if (inv.status === 'Paid') {
        paidAmount += inv.totalAmount;
      } else if (inv.status !== 'Rejected') {
        outstandingAmount += inv.totalAmount;
        if (inv.dueDate && new Date(inv.dueDate) < new Date()) {
          overdueCount++;
        }
      }
    });

    return {
      outstandingAmount,
      paidAmount,
      overdueCount,
      totalInvoices: invoices.length
    };
  }
}
