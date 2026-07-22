import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// ==========================================
// Phase 6.4: Route Progress API
// ==========================================

// GET /api/v1/shipments/:shipmentId/tracking/route
// Fetch route progress calculations
router.get('/shipments/:shipmentId/tracking/route', async (req, res) => {
  try {
    const { shipmentId } = req.params;

    let route = await prisma.shipmentRouteProgress.findUnique({
      where: { shipmentId }
    });

    if (!route) {
      // For demonstration in 6.4, auto-seed a mock route if none exists
      // In production, this would be initialized during Dispatch
      route = await prisma.shipmentRouteProgress.create({
        data: {
          shipmentId,
          origin: 'New York, USA',
          destination: 'Los Angeles, USA',
          intermediateStops: JSON.stringify(['Chicago, IL', 'Denver, CO']),
          distanceCovered: 1250.5,
          distanceRemaining: 1530.2,
          estimatedArrival: new Date(Date.now() + 48 * 60 * 60 * 1000), // +48 hours
          delayMinutes: 0
        }
      });
    }

    res.json(route);
  } catch (error) {
    console.error('Error fetching route progress:', error);
    res.status(500).json({ error: 'Failed to fetch route progress' });
  }
});

// PUT /api/v1/shipments/:shipmentId/tracking/route
// Update route progress manually or via background worker
router.put('/shipments/:shipmentId/tracking/route', async (req, res) => {
  try {
    const { shipmentId } = req.params;
    const { distanceCovered, distanceRemaining, delayMinutes } = req.body;

    const route = await prisma.shipmentRouteProgress.update({
      where: { shipmentId },
      data: {
        distanceCovered: distanceCovered !== undefined ? parseFloat(distanceCovered) : undefined,
        distanceRemaining: distanceRemaining !== undefined ? parseFloat(distanceRemaining) : undefined,
        delayMinutes: delayMinutes !== undefined ? parseInt(delayMinutes) : undefined,
      }
    });

    res.json(route);
  } catch (error) {
    console.error('Error updating route progress:', error);
    res.status(500).json({ error: 'Failed to update route progress' });
  }
});

export default router;
