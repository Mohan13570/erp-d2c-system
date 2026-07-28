import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// ==========================================
// Phase 6.7: Customer Tracking Portal API
// ==========================================

// GET /api/v1/public/tracking/:trackingNumber
// Fetch public-facing shipment details using tracking number
router.get('/public/tracking/:trackingNumber', async (req, res) => {
  try {
    const { trackingNumber } = req.params;

    const shipment = await prisma.shipment.findFirst({
      where: { 
        OR: [
          { trackingNumber: trackingNumber },
          { id: trackingNumber }
        ]
      },
      include: {
        cargo: true,
        timeline: {
          orderBy: { timestamp: 'desc' }
        },
        routeProgress: true
      }
    });

    if (!shipment) {
      return res.status(404).json({ error: 'Shipment not found or invalid tracking number.' });
    }

    // Sanitize data for public view (e.g., hide financial charges, internal notes)
    const publicData = {
      trackingNumber: shipment.trackingNumber,
      status: shipment.status,
      origin: shipment.shipper,
      destination: shipment.consignee,
      expectedDelivery: shipment.expectedDelivery,
      cargo: shipment.cargo.map(c => ({ description: c.description, packages: c.packagesCount })),
      timeline: shipment.timeline.map(t => ({
        status: t.status,
        timestamp: t.timestamp,
        location: t.location,
        remarks: t.remarks
      })),
      routeProgress: shipment.routeProgress
    };

    res.json(publicData);
  } catch (error) {
    console.error('Error fetching public tracking:', error);
    res.status(500).json({ error: 'Failed to fetch public tracking data' });
  }
});

export default router;
