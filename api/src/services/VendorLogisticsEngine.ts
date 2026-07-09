import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class VendorLogisticsEngine {
  /**
   * Submit an ASN against an accepted PO
   */
  static async submitASN(vendorId: string, purchaseOrderId: string, expectedArrival: Date, carrier: string, containerNumber?: string, sealNumber?: string) {
    // Basic validation
    const po = await prisma.purchaseOrder.findFirst({
      where: { id: purchaseOrderId, vendorId, status: 'Accepted' }
    });

    if (!po) throw new Error("Purchase Order not found or not accepted.");

    // Generate ASN
    const asnNumber = `ASN-${Date.now()}`;
    const asn = await prisma.advanceShipmentNotice.create({
      data: {
        asnNumber,
        purchaseOrderId,
        status: 'Pending',
        expectedArrival,
        carrier
      }
    });

    // Create interaction record
    await prisma.vendorASNInteraction.create({
      data: {
        asnId: asn.id,
        vendorId,
        status: 'Pending',
        containerNumber,
        sealNumber,
        remarks: 'ASN Submitted by Vendor'
      }
    });

    // Initial Tracking Event
    await prisma.vendorShipmentTracking.create({
      data: {
        asnId: asn.id,
        vendorId,
        event: 'ASN Submitted',
        location: 'Vendor Origin'
      }
    });

    return asn;
  }

  /**
   * Book a Dock Appointment
   */
  static async bookDock(vendorId: string, asnId: string, dockScheduleId: string, driverName?: string, vehiclePlate?: string) {
    const asn = await prisma.advanceShipmentNotice.findFirst({
      where: { id: asnId, purchaseOrder: { vendorId } }
    });
    if (!asn) throw new Error("ASN not found or unauthorized");

    const schedule = await prisma.dockSchedule.findUnique({ where: { id: dockScheduleId } });
    if (!schedule || schedule.status !== 'Available') throw new Error("Dock is not available");

    // Book the slot
    const appointment = await prisma.vendorDeliveryAppointment.create({
      data: {
        asnId,
        vendorId,
        dockScheduleId,
        status: 'Scheduled',
        driverName,
        vehiclePlate
      }
    });

    // Update Dock Schedule
    await prisma.dockSchedule.update({
      where: { id: dockScheduleId },
      data: { status: 'Booked' }
    });

    // Tracking Event
    await prisma.vendorShipmentTracking.create({
      data: {
        asnId,
        vendorId,
        event: 'Dock Appointment Booked',
        location: 'Warehouse Dock'
      }
    });

    return appointment;
  }
}
