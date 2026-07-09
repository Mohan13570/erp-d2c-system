import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class VendorProcurementEngine {
  /**
   * Submit a new Quotation from a Vendor for an active RFQ
   */
  static async submitQuotation(vendorId: string, rfqId: string, items: any[], remarks?: string) {
    // Validate RFQ
    const rfq = await prisma.procurementRFQ.findUnique({ where: { id: rfqId } });
    if (!rfq || rfq.status !== 'Open') {
      throw new Error('RFQ is not open for quotations');
    }

    // Check if quotation already exists for this vendor and RFQ
    let quotation = await prisma.vendorQuotation.findFirst({
      where: { vendorId, rfqId }
    });

    if (quotation) {
      if (quotation.status === 'Accepted' || quotation.status === 'Rejected') {
        throw new Error('Quotation cannot be modified at this stage');
      }
      // Delete existing items to replace
      await prisma.vendorQuotationItem.deleteMany({ where: { quotationId: quotation.id } });
    } else {
      quotation = await prisma.vendorQuotation.create({
        data: { vendorId, rfqId, status: 'Draft' }
      });
    }

    // Insert Items and calculate total
    let totalAmount = 0;
    const itemRecords = await Promise.all(items.map(async (item) => {
      const totalPrice = (item.quantity * item.unitPrice) + item.taxAmount + item.freightAmount - item.discountAmount;
      totalAmount += totalPrice;
      
      return prisma.vendorQuotationItem.create({
        data: {
          quotationId: quotation!.id,
          rfqItemId: item.rfqItemId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          taxAmount: item.taxAmount,
          freightAmount: item.freightAmount,
          discountAmount: item.discountAmount,
          totalPrice,
          remarks: item.remarks
        }
      });
    }));

    // Update Quotation Status
    const finalQuotation = await prisma.vendorQuotation.update({
      where: { id: quotation.id },
      data: {
        status: 'Submitted',
        totalAmount,
        remarks,
        updatedAt: new Date()
      }
    });

    return finalQuotation;
  }

  /**
   * Vendor action: Accept or Reject a Purchase Order
   */
  static async respondToPO(purchaseOrderId: string, vendorId: string, action: 'Accepted' | 'Rejected', remarks?: string) {
    const po = await prisma.purchaseOrder.findFirst({
      where: { id: purchaseOrderId, vendorId }
    });

    if (!po) throw new Error('Purchase Order not found or unauthorized');

    // Update PO Status
    await prisma.purchaseOrder.update({
      where: { id: purchaseOrderId },
      data: { status: action } // Pending, Accepted, Rejected
    });

    // Record Interaction
    await prisma.vendorPOInteraction.create({
      data: {
        purchaseOrderId,
        vendorId,
        action,
        remarks
      }
    });

    // Notification Logic would go here
    return true;
  }
}
