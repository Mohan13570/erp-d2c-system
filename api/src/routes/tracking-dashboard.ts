import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// ==========================================
// Phase 6.1: Tracking Dashboard API
// ==========================================

// GET /api/v1/shipments/tracking/dashboard/kpis
// Retrieve high-level operational KPIs for the tracking dashboard
router.get('/shipments/tracking/dashboard/kpis', async (req, res) => {
  try {
    const totalActive = await prisma.shipment.count({
      where: { status: { notIn: ['Delivered', 'Completed', 'Cancelled'] } }
    });

    const delayed = await prisma.shipment.count({
      where: { status: 'Delayed' }
    });

    const todayDeliveries = await prisma.shipment.count({
      where: { 
        expectedDelivery: {
          gte: new Date(new Date().setHours(0,0,0,0)),
          lte: new Date(new Date().setHours(23,59,59,999))
        }
      }
    });

    const completed = await prisma.shipment.count({
      where: { status: { in: ['Delivered', 'Completed'] } }
    });

    const inTransit = await prisma.shipment.count({
      where: { status: 'In Transit' }
    });

    const pickupPending = await prisma.shipment.count({
      where: { status: 'Pickup Scheduled' }
    });

    res.json({
      activeShipments: totalActive,
      delayedShipments: delayed,
      todayDeliveries,
      completed,
      inTransit,
      pickupPending
    });
  } catch (error) {
    console.error('Error fetching tracking dashboard KPIs:', error);
    res.status(500).json({ error: 'Failed to fetch tracking KPIs' });
  }
});

// GET /api/v1/shipments/:shipmentId/tracking/context
// Retrieve the root shipment tracking context (Number, Transport Mode, Driver, etc)
router.get('/shipments/:shipmentId/tracking/context', async (req, res) => {
  try {
    const { shipmentId } = req.params;

    const shipment = await prisma.shipment.findUnique({
      where: { id: shipmentId },
      include: {
        customer: true,
        locations: true, // for origin/dest mapping
      }
    });

    if (!shipment) return res.status(404).json({ error: 'Shipment not found' });

    res.json(shipment);
  } catch (error) {
    console.error('Error fetching tracking context:', error);
    res.status(500).json({ error: 'Failed to fetch tracking context' });
  }
});

export default router;
