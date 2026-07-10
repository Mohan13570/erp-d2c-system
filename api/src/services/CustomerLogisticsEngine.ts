import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class CustomerLogisticsEngine {
  
  /**
   * Complex transactional creation of a Shipment Booking along with its Cargo and Pickup requirements.
   */
  static async createBooking(payload: any) {
    const {
      customerId,
      shipmentType,
      transportMode,
      origin,
      destination,
      items,
      cargo,
      pickupRequest,
      containerBooking
    } = payload;

    // Generate unique booking number
    const bookingNumber = `BKG-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;

    return await prisma.$transaction(async (tx) => {
      // 1. Create Core Booking
      const booking = await tx.customerShipmentBooking.create({
        data: {
          bookingNumber,
          customerId,
          shipmentType,
          transportMode,
          origin,
          destination,
          status: 'PENDING',
          items: {
            create: items || []
          }
        }
      });

      // 2. Create Cargo Details if provided
      if (cargo) {
        await tx.customerCargo.create({
          data: {
            bookingId: booking.id,
            cargoType: cargo.cargoType,
            commodity: cargo.commodity,
            hsCode: cargo.hsCode,
            totalWeight: cargo.totalWeight,
            totalVolume: cargo.totalVolume,
            isDangerousGoods: cargo.isDangerousGoods || false,
            packages: {
              create: cargo.packages || []
            }
          }
        });
      }

      // 3. Create Pickup Request if requested
      if (pickupRequest) {
        await tx.customerPickupRequest.create({
          data: {
            bookingId: booking.id,
            address: pickupRequest.address,
            contactName: pickupRequest.contactName,
            contactPhone: pickupRequest.contactPhone,
            status: 'REQUESTED'
          }
        });
      }

      // 4. Create Container Booking if applicable (Ocean Freight)
      if (containerBooking) {
         await tx.customerContainerBooking.create({
            data: {
               bookingId: booking.id,
               containerType: containerBooking.containerType,
               containerSize: containerBooking.containerSize,
               quantity: containerBooking.quantity,
               status: 'REQUESTED'
            }
         });
      }

      // 5. Log Timeline
      await tx.customerBookingTimeline.create({
        data: {
          bookingId: booking.id,
          statusUpdate: 'BOOKING_CREATED',
          description: `Booking ${bookingNumber} created by customer.`
        }
      });

      return booking;
    });
  }

  /**
   * Convert an existing Booking into an RFQ (Request for Quotation) targeted at specific vendors
   */
  static async generateRFQ(bookingId: string, vendorIds: string[], notes?: string) {
    const rfqNumber = `RFQ-${Date.now().toString().slice(-6)}`;

    return await prisma.$transaction(async (tx) => {
      // Create the RFQ
      const rfq = await tx.customerRFQ.create({
        data: {
          rfqNumber,
          bookingId,
          status: 'OPEN',
          notes,
          vendors: {
            create: vendorIds.map(vid => ({
              vendorId: vid,
              status: 'PENDING'
            }))
          }
        }
      });

      return rfq;
    });
  }

  /**
   * Receive a quotation from a vendor against an RFQ
   */
  static async receiveQuotation(payload: any) {
    const { rfqId, vendorId, amount, currency, validUntil, transitTimeDays, notes } = payload;
    const quotationNumber = `QTN-${Date.now().toString().slice(-6)}`;

    const quote = await prisma.customerQuotation.create({
      data: {
        quotationNumber,
        rfqId,
        vendorId,
        amount,
        currency,
        validUntil: new Date(validUntil),
        status: 'PENDING',
        transitTimeDays,
        notes
      }
    });

    // In a real system, trigger a BullMQ job to notify the customer
    return quote;
  }

  /**
   * Award a Quotation
   */
  static async awardQuotation(quotationId: string) {
    return await prisma.$transaction(async (tx) => {
      const quote = await tx.customerQuotation.update({
        where: { id: quotationId },
        data: { status: 'ACCEPTED' },
        include: { rfq: true }
      });

      // Mark RFQ as awarded
      await tx.customerRFQ.update({
        where: { id: quote.rfqId },
        data: { status: 'AWARDED' }
      });

      // Mark all other quotes for this RFQ as REJECTED
      await tx.customerQuotation.updateMany({
        where: { 
          rfqId: quote.rfqId,
          id: { not: quotationId }
        },
        data: { status: 'REJECTED' }
      });

      // Log timeline on the booking
      await tx.customerBookingTimeline.create({
         data: {
            bookingId: quote.rfq.bookingId,
            statusUpdate: 'QUOTATION_AWARDED',
            description: `Quotation ${quote.quotationNumber} awarded for ${quote.currency} ${quote.amount}.`
         }
      });

      return quote;
    });
  }
}
