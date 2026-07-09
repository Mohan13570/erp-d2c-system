import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class VendorWarehouseEngine {
  /**
   * Provide GRN visibility to vendor
   */
  static async getGRNStatus(vendorId: string, asnId: string) {
    // In a real system, the ASN links to the PO, which links to GRN.
    // For this demonstration, we query GRNs directly linked to the PO.
    const asn = await prisma.advanceShipmentNotice.findFirst({
      where: { id: asnId, purchaseOrder: { vendorId } },
      include: { purchaseOrder: { include: { goodsReceipts: true } } }
    });

    if (!asn) throw new Error("ASN not found");

    const grns = asn.purchaseOrder.goodsReceipts;
    
    // Ensure visibility records exist for these GRNs
    for (const grn of grns) {
      const exists = await prisma.vendorGRNVisibility.findFirst({
        where: { grnId: grn.id, vendorId }
      });
      if (!exists) {
        await prisma.vendorGRNVisibility.create({
          data: { grnId: grn.id, vendorId }
        });
      }
    }

    return grns;
  }
}
