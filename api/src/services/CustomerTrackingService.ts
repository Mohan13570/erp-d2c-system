import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class CustomerTrackingService {
  
  /**
   * Initializes a tracking record for a confirmed booking
   */
  static async initializeTracking(bookingId: string) {
    const tracking = await prisma.customerShipmentTracking.create({
      data: {
        bookingId,
        status: 'PENDING',
        currentPhase: 'PRE_TRANSIT'
      }
    });

    await prisma.customerTrackingEvent.create({
       data: {
          trackingId: tracking.id,
          eventType: 'TRACKING_INITIALIZED',
          description: 'Shipment tracking initialized and awaiting carrier allocation.',
          location: 'System Hub'
       }
    });

    return tracking;
  }

  /**
   * Post a new GPS location ping (typically called by fleet devices or mobile apps)
   */
  static async updateGPSLocation(trackingId: string, lat: number, lng: number, speed?: number, heading?: number) {
    const loc = await prisma.customerGPSLocation.create({
      data: {
        trackingId,
        latitude: lat,
        longitude: lng,
        speedKmH: speed,
        heading
      }
    });

    // In a production system, this would broadcast via Socket.IO
    // global.io.to(`tracking_${trackingId}`).emit('gps_update', loc);

    return loc;
  }

  /**
   * Log a major milestone event (Port Arrival, Cleared Customs, etc.)
   */
  static async logMilestone(trackingId: string, eventType: string, description: string, location: string) {
    const event = await prisma.customerTrackingEvent.create({
      data: {
        trackingId,
        eventType,
        description,
        location
      }
    });

    // Automatically trigger an Alert if there's a delay
    if (eventType === 'DELAY') {
       await prisma.customerTrackingAlert.create({
          data: {
             trackingId,
             alertType: 'DELAY',
             message: `Attention: ${description}`
          }
       });
    }

    return event;
  }

  /**
   * Fetch complete timeline for the frontend
   */
  static async getShipmentTimeline(trackingId: string) {
    const tracking = await prisma.customerShipmentTracking.findUnique({
      where: { id: trackingId },
      include: {
        events: {
          orderBy: { timestamp: 'desc' }
        },
        alerts: {
           where: { isRead: false }
        }
      }
    });
    return tracking;
  }
}
