import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class CustomerFinanceEngine {
  
  /**
   * Generates a new Customer Invoice based on a Booking or Container
   */
  static async generateInvoice(payload: { customerId: string, bookingId?: string, items: any[] }) {
    // Calculate totals
    const subtotal = payload.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const taxAmount = subtotal * 0.18; // Assume 18% standard tax
    const totalAmount = subtotal + taxAmount;
    
    // Create Invoice with Line Items
    const invoice = await prisma.customerInvoice.create({
      data: {
        invoiceNumber: `INV-${Date.now()}`,
        customerId: payload.customerId,
        bookingId: payload.bookingId,
        status: 'GENERATED',
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Net 30
        subtotal,
        taxAmount,
        totalAmount,
        items: {
          create: payload.items.map(i => ({
            chargeType: i.chargeType,
            description: i.description,
            quantity: i.quantity,
            unitPrice: i.unitPrice,
            total: i.quantity * i.unitPrice
          }))
        }
      },
      include: { items: true }
    });

    // Automatically post to Customer Ledger (DEBIT)
    await this.postLedgerEntry(payload.customerId, 'DEBIT', `Invoice Generated: ${invoice.invoiceNumber}`, totalAmount, invoice.id);

    return invoice;
  }

  /**
   * Processes a successful Payment Gateway transaction
   */
  static async processPayment(payload: { customerId: string, invoiceId: string, amount: number, paymentMethod: string, gatewayRef: string }) {
    // 1. Record the Payment Transaction
    const payment = await prisma.paymentTransaction.create({
      data: {
        transactionRef: payload.gatewayRef,
        customerId: payload.customerId,
        invoiceId: payload.invoiceId,
        amount: payload.amount,
        paymentMethod: payload.paymentMethod,
        paymentGateway: 'Simulated Gateway',
        status: 'SUCCESS'
      }
    });

    // 2. Update the Invoice amountPaid and status
    const invoice = await prisma.customerInvoice.findUnique({ where: { id: payload.invoiceId } });
    if (invoice) {
       const newAmountPaid = invoice.amountPaid + payload.amount;
       const newStatus = newAmountPaid >= invoice.totalAmount ? 'PAID' : 'PARTIALLY_PAID';
       
       await prisma.customerInvoice.update({
          where: { id: invoice.id },
          data: { amountPaid: newAmountPaid, status: newStatus }
       });
    }

    // 3. Post to Customer Ledger (CREDIT)
    await this.postLedgerEntry(payload.customerId, 'CREDIT', `Payment Received: ${payload.gatewayRef}`, payload.amount, payment.id);

    return payment;
  }

  /**
   * Helper to write to Ledger and calculate running balance
   */
  private static async postLedgerEntry(customerId: string, type: 'DEBIT' | 'CREDIT', description: string, amount: number, referenceId: string) {
    // Get last ledger entry for running balance
    const lastEntry = await prisma.customerLedger.findFirst({
      where: { customerId },
      orderBy: { createdAt: 'desc' }
    });

    let newBalance = lastEntry ? lastEntry.runningBalance : 0.0;
    if (type === 'DEBIT') newBalance += amount; // Increases amount owed
    if (type === 'CREDIT') newBalance -= amount; // Decreases amount owed

    return await prisma.customerLedger.create({
      data: {
        customerId,
        type,
        description,
        amount,
        runningBalance: newBalance,
        referenceId
      }
    });
  }

  /**
   * Fetch Dashboard Aggregations
   */
  static async getDashboardMetrics(customerId: string) {
    const invoices = await prisma.customerInvoice.findMany({ where: { customerId } });
    
    const outstanding = invoices.filter(i => i.status !== 'PAID').reduce((sum, i) => sum + (i.totalAmount - i.amountPaid), 0);
    const revenue = invoices.filter(i => i.status === 'PAID').reduce((sum, i) => sum + i.totalAmount, 0);
    const overdueCount = invoices.filter(i => i.status === 'OVERDUE').length;

    const limit = await prisma.customerCreditLimit.findUnique({ where: { customerId } });

    return {
      outstandingBalance: outstanding,
      availableCredit: limit ? limit.availableCredit : 50000,
      creditLimit: limit ? limit.approvedLimit : 50000,
      paidRevenue: revenue,
      overdueInvoices: overdueCount
    };
  }
}
