import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class VendorNegotiationEngine {
  /**
   * Add a negotiation message or counter-offer to a Quotation
   */
  static async addMessage(quotationId: string, authorId: string, authorType: 'Vendor' | 'Buyer', message: string, attachmentUrl?: string) {
    const quotation = await prisma.vendorQuotation.findUnique({
      where: { id: quotationId }
    });

    if (!quotation) throw new Error("Quotation not found");

    // Add message
    const msg = await prisma.vendorNegotiation.create({
      data: {
        quotationId,
        authorType,
        authorId,
        message,
        attachmentUrl
      }
    });

    // Change status to UnderNegotiation if it was just Submitted
    if (quotation.status === 'Submitted') {
      await prisma.vendorQuotation.update({
        where: { id: quotationId },
        data: { status: 'UnderNegotiation' }
      });
    }

    return msg;
  }

  /**
   * Fetch negotiation timeline
   */
  static async getTimeline(quotationId: string) {
    return prisma.vendorNegotiation.findMany({
      where: { quotationId },
      orderBy: { timestamp: 'asc' }
    });
  }
}
