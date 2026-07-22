import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// ==========================================
// Phase 6.2: Shipment Timeline API
// ==========================================

// GET /api/v1/shipments/:shipmentId/timeline
// Fetch the complete audit log of timeline events
router.get('/shipments/:shipmentId/timeline', async (req, res) => {
  try {
    const { shipmentId } = req.params;

    const timeline = await prisma.shipmentTimelineEvent.findMany({
      where: { shipmentId },
      orderBy: { timestamp: 'desc' }
    });

    res.json(timeline);
  } catch (error) {
    console.error('Error fetching timeline:', error);
    res.status(500).json({ error: 'Failed to fetch shipment timeline' });
  }
});

// POST /api/v1/shipments/:shipmentId/timeline
// Add a manual timeline event with full audit tracking
router.post('/shipments/:shipmentId/timeline', async (req, res) => {
  try {
    const { shipmentId } = req.params;
    const { status, remarks, location, updatedBy } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const newEvent = await prisma.shipmentTimelineEvent.create({
      data: {
        shipmentId,
        status,
        remarks,
        location,
        updatedBy: updatedBy || 'System'
      }
    });

    // Optionally update the master shipment status as well
    await prisma.shipment.update({
      where: { id: shipmentId },
      data: { status }
    });

    res.status(201).json(newEvent);
  } catch (error) {
    console.error('Error creating timeline event:', error);
    res.status(500).json({ error: 'Failed to create timeline event' });
  }
});

export default router;
