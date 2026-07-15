import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class TreasuryEngine {
  
  static async receivePayment(params: {
    customerId: string;
    paymentMethod: string;
    referenceNumber: string;
    amount: number;
    currency?: string;
  }) {
    const { customerId, paymentMethod, referenceNumber, amount, currency = "USD" } = params;

    // Generate unique receipt number
    const receiptCount = await prisma.erpPaymentReceipt.count();
    const receiptNumber = `REC-${new Date().getFullYear()}-${(receiptCount + 1).toString().padStart(4, '0')}`;

    const receipt = await prisma.erpPaymentReceipt.create({
      data: {
        receiptNumber,
        customerId,
        paymentMethod,
        referenceNumber,
        amount,
        currency,
        status: 'UNRECONCILED'
      }
    });

    return receipt;
  }

  static async autoReconcile() {
    // Basic automatic reconciliation: matches UNRECONCILED Bank Statement rows 
    // against UNRECONCILED Receipts with EXACT same amount.
    
    const unmatchedStatements = await prisma.erpBankStatementItem.findMany({
      where: { isReconciled: false, amount: { gt: 0 } }
    });

    const unmatchedReceipts = await prisma.erpPaymentReceipt.findMany({
      where: { status: 'UNRECONCILED' }
    });

    let matchedCount = 0;

    for (const statement of unmatchedStatements) {
       // Find a receipt with exact same amount
       const match = unmatchedReceipts.find(r => r.amount === statement.amount);
       
       if (match) {
          await prisma.erpBankReconciliation.create({
            data: {
              statementItemId: statement.id,
              receiptId: match.id,
              matchedBy: 'SYSTEM_AUTO'
            }
          });

          await prisma.erpBankStatementItem.update({
            where: { id: statement.id },
            data: { isReconciled: true }
          });

          await prisma.erpPaymentReceipt.update({
            where: { id: match.id },
            data: { status: 'RECONCILED' }
          });

          // Remove from local array so it doesn't match twice
          unmatchedReceipts.splice(unmatchedReceipts.indexOf(match), 1);
          matchedCount++;
       }
    }

    return { matchedCount };
  }

}
