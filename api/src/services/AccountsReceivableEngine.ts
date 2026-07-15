import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AccountsReceivableEngine {
  
  static async getCustomerBalance(customerId: string) {
     const profile = await prisma.arCustomerProfile.findUnique({
       where: { customerId }
     });
     
     if (!profile) return { balance: 0, creditLimit: 0, available: 0 };
     return {
        balance: profile.usedCredit,
        creditLimit: profile.creditLimit,
        available: profile.availableCredit,
        onHold: profile.isOnCreditHold
     };
  }

  static async allocatePayment(params: {
    paymentRefId: string;
    invoiceId: string;
    allocatedAmount: number;
    allocatedBy: string;
  }) {
     const { paymentRefId, invoiceId, allocatedAmount, allocatedBy } = params;

     const invoice = await prisma.erpInvoice.findUnique({ where: { id: invoiceId } });
     if (!invoice) throw new Error("Invoice not found.");

     const profile = await prisma.arCustomerProfile.findUnique({ where: { customerId: invoice.customerId } });
     if (!profile) throw new Error("Customer AR profile not found.");

     // 1. Double Entry Ledger Credit (Decreases debt)
     const newUsedCredit = Math.max(0, profile.usedCredit - allocatedAmount);
     const newAvailable = profile.creditLimit - newUsedCredit;

     const ledgerEntry = await prisma.arLedgerEntry.create({
        data: {
           profileId: profile.id,
           transactionType: 'PAYMENT',
           referenceId: paymentRefId,
           description: `Payment allocation against Invoice ${invoice.invoiceNumber}`,
           creditAmount: allocatedAmount,
           debitAmount: 0,
           runningBalance: newUsedCredit,
           currency: invoice.currency
        }
     });

     // 2. Update Customer Profile
     await prisma.arCustomerProfile.update({
        where: { id: profile.id },
        data: { usedCredit: newUsedCredit, availableCredit: newAvailable }
     });

     // 3. Create Allocation Record
     await prisma.arPaymentAllocation.create({
        data: {
           paymentRefId,
           invoiceId,
           allocatedAmount,
           allocatedBy,
           currency: invoice.currency
        }
     });

     // 4. Update Invoice Status
     const newPaid = invoice.amountPaid + allocatedAmount;
     let newStatus = invoice.status;
     if (newPaid >= invoice.grandTotal) {
        newStatus = 'PAID';
     } else if (newPaid > 0) {
        newStatus = 'PARTIALLY_PAID';
     }

     await prisma.erpInvoice.update({
        where: { id: invoiceId },
        data: { amountPaid: newPaid, status: newStatus }
     });

     return { success: true, ledgerEntry };
  }

  static async calculateAging(customerId?: string) {
     const query = customerId ? { customerId, status: { in: ['APPROVED', 'SENT', 'PARTIALLY_PAID', 'OVERDUE'] } } 
                              : { status: { in: ['APPROVED', 'SENT', 'PARTIALLY_PAID', 'OVERDUE'] } };
                              
     const openInvoices = await prisma.erpInvoice.findMany({ where: query });
     
     const buckets = {
        current: 0,
        days_1_30: 0,
        days_31_60: 0,
        days_61_90: 0,
        days_90_plus: 0
     };
     
     const now = new Date().getTime();
     
     for (const inv of openInvoices) {
        const balance = inv.grandTotal - inv.amountPaid;
        const due = new Date(inv.dueDate).getTime();
        const diffDays = Math.floor((now - due) / (1000 * 60 * 60 * 24));
        
        if (diffDays <= 0) buckets.current += balance;
        else if (diffDays <= 30) buckets.days_1_30 += balance;
        else if (diffDays <= 60) buckets.days_31_60 += balance;
        else if (diffDays <= 90) buckets.days_61_90 += balance;
        else buckets.days_90_plus += balance;
     }
     
     return buckets;
  }
}
