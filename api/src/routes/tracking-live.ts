import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// ==========================================
// Phase 6.3: Live Tracking Engine API
// ==========================================

// GET /api/v1/shipments/:shipmentId/tracking/live
// Retrieve the latest tracking context and history for a shipment
router.get('/shipments/:shipmentId/tracking/live', async (req, res) => {
  try {
    const { shipmentId } = req.params;
    const { limit = 50 } = req.query;

    const trackingHistory = await prisma.shipmentLiveTracking.findMany({
      where: { shipmentId },
      orderBy: { timestamp: 'desc' },
      take: Number(limit)
    });

    res.json({
      shipmentId,
      status: 'active',
      latest: trackingHistory.length > 0 ? trackingHistory[0] : null,
      history: trackingHistory
    });
  } catch (error) {
    console.error('Error fetching live tracking data:', error);
    res.status(500).json({ error: 'Failed to fetch live tracking data' });
  }
});

// POST /api/v1/shipments/:shipmentId/tracking/telemetry
// Ingest high-velocity telemetry payload from a GPS device or Driver App
router.post('/shipments/:shipmentId/tracking/telemetry', async (req, res) => {
  try {
    const { shipmentId } = req.params;
    const { 
      latitude, 
      longitude, 
      speed, 
      heading, 
      altitude, 
      driverStatus, 
      vehicleStatus 
    } = req.body;

    // Validate essential telemetry data
    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({ error: 'Latitude and Longitude are strictly required for telemetry ingestion.' });
    }

    const telemetry = await prisma.shipmentLiveTracking.create({
      data: {
        shipmentId,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        speed: speed ? parseFloat(speed) : null,
        heading: heading ? parseFloat(heading) : null,
        altitude: altitude ? parseFloat(altitude) : null,
        driverStatus: driverStatus || 'ACTIVE',
        vehicleStatus: vehicleStatus || 'MOVING'
      }
    });

    // In a production environment with Socket.IO, we would broadcast this payload to connected clients here.
    const io = req.app.get('io');
    if (io) {
      io.to(`shipment_${shipmentId}`).emit('telemetry_update', telemetry);
    }

    res.status(201).json({
      message: 'Telemetry payload ingested successfully',
      data: telemetry
    });
  } catch (error) {
    console.error('Error ingesting telemetry:', error);
    res.status(500).json({ error: 'Failed to ingest telemetry payload' });
  }
});

export default router;
