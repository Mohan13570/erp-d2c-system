import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class BillingEngine {
  
  static async generateInvoiceNumber(type: string): Promise<string> {
    const prefix = type === 'PROFORMA' ? 'PRO' : type === 'CREDIT' ? 'CRD' : 'INV';
    const year = new Date().getFullYear();
    const count = await prisma.erpInvoice.count({
      where: {
        invoiceNumber: {
          startsWith: `${prefix}-${year}-`
        }
      }
    });
    
    return `${prefix}-${year}-${String(count + 1).padStart(4, '0')}`;
  }

  static async calculateTotals(items: any[], charges: any[], taxes: any[], discountTotal: number = 0) {
    let subtotal = 0;
    
    // Calculate items
    for (const item of items) {
      const lineAmount = (item.quantity * item.unitPrice) - (item.discountAmount || 0);
      subtotal += lineAmount;
    }

    let freightTotal = 0;
    // Calculate freight charges
    for (const charge of charges) {
      freightTotal += charge.amount;
    }

    const taxableAmount = subtotal + freightTotal - discountTotal;

    let taxTotal = 0;
    // Calculate taxes on taxable amount
    for (const tax of taxes) {
      const taxAmount = (taxableAmount * tax.taxPercent) / 100;
      tax.taxAmount = taxAmount;
      taxTotal += taxAmount;
    }

    const grandTotal = taxableAmount + taxTotal;

    return {
      subtotal,
      freightTotal,
      taxTotal,
      discountTotal,
      grandTotal
    };
  }

  static async createInvoice(data: any, createdBy: string) {
    const invoiceNumber = await this.generateInvoiceNumber(data.invoiceType || 'SHIPMENT');
    
    const totals = await this.calculateTotals(
      data.items || [], 
      data.charges || [], 
      data.taxes || [], 
      data.discountTotal || 0
    );

    return await prisma.erpInvoice.create({
      data: {
        invoiceNumber,
        customerId: data.customerId,
        invoiceType: data.invoiceType,
        status: 'DRAFT',
        billingAddress: data.billingAddress,
        shippingAddress: data.shippingAddress,
        gstNumber: data.gstNumber,
        dueDate: new Date(data.dueDate),
        currency: data.currency,
        exchangeRate: data.exchangeRate || 1.0,
        paymentTerms: data.paymentTerms,
        salesPerson: data.salesPerson,
        referenceNumber: data.referenceNumber,
        shipmentNumber: data.shipmentNumber,
        
        ...totals,
        
        items: {
          create: data.items.map((item: any) => ({
            description: item.description,
            quantity: item.quantity,
            unit: item.unit,
            unitPrice: item.unitPrice,
            discountPercent: item.discountPercent,
            discountAmount: item.discountAmount,
            hsnCode: item.hsnCode,
            amount: (item.quantity * item.unitPrice) - (item.discountAmount || 0)
          }))
        },
        charges: {
          create: data.charges.map((charge: any) => ({
            chargeType: charge.chargeType,
            description: charge.description,
            amount: charge.amount
          }))
        },
        taxes: {
          create: data.taxes.map((tax: any) => ({
            taxType: tax.taxType,
            taxPercent: tax.taxPercent,
            taxAmount: tax.taxAmount
          }))
        },
        history: {
          create: {
            action: 'CREATED',
            notes: 'Draft invoice created',
            performedBy: createdBy
          }
        }
      },
      include: {
        items: true,
        charges: true,
        taxes: true,
        history: true
      }
    });
  }

  static async approveInvoice(invoiceId: string, approvedBy: string) {
    const invoice = await prisma.erpInvoice.findUnique({ where: { id: invoiceId } });
    if (!invoice) throw new Error("Invoice not found");
    if (invoice.status !== 'DRAFT' && invoice.status !== 'PENDING_APPROVAL') {
      throw new Error("Invoice cannot be approved in current state.");
    }

    return await prisma.erpInvoice.update({
      where: { id: invoiceId },
      data: {
        status: 'APPROVED',
        history: {
          create: {
            action: 'APPROVED',
            notes: 'Invoice formally approved',
            performedBy: approvedBy
          }
        }
      }
    });
  }
}
