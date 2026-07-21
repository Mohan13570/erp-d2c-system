import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router({ mergeParams: true });
const prisma = new PrismaClient();

// Helper to log timeline events
async function logTimelineEvent(shipmentId: string, eventTitle: string, description: string, location?: string) {
  await prisma.shipmentTimelineEvent.create({
    data: {
      shipmentId,
      timestamp: new Date(),
      status: eventTitle, // Using status as title in legacy model
      description,
      location: location || 'System'
    }
  });
}

// GET all operational data for a shipment
router.get('/shipments/:shipmentId/operations', async (req, res) => {
  try {
    const shipment = await prisma.shipment.findUnique({
      where: { id: req.params.shipmentId },
      include: {
        pickupRequest: {
          include: { documents: true }
        },
        deliverySchedule: {
          include: { proofOfDelivery: true, exceptions: true, photos: true }
        },
        timeline: {
          orderBy: { timestamp: 'desc' }
        }
      }
    });
    if (!shipment) return res.status(404).json({ error: 'Shipment not found' });
    res.json(shipment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch operations data' });
  }
});

// POST update pickup operations
router.post('/shipments/:shipmentId/operations/pickup', async (req, res) => {
  const { shipmentId } = req.params;
  const { pickupData } = req.body;

  try {
    const pickup = await prisma.pickupRequest.upsert({
      where: { shipmentId },
      update: pickupData,
      create: { ...pickupData, shipmentId }
    });
    res.status(200).json(pickup);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update pickup' });
  }
});

// POST update delivery operations & POD
router.post('/shipments/:shipmentId/operations/delivery', async (req, res) => {
  const { shipmentId } = req.params;
  const { deliveryData, podData } = req.body;

  try {
    const delivery = await prisma.$transaction(async (tx) => {
      const schedule = await tx.deliverySchedule.upsert({
        where: { shipmentId },
        update: deliveryData,
        create: { ...deliveryData, shipmentId }
      });

      if (podData && podData.receiverSignature) {
        await tx.proofOfDelivery.upsert({
          where: { deliveryScheduleId: schedule.id },
          update: podData,
          create: { ...podData, deliveryScheduleId: schedule.id, deliveryTimestamp: new Date() }
        });
      }
      return schedule;
    });

    res.status(200).json(delivery);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update delivery' });
  }
});

// POST advance shipment status & inject timeline event
router.post('/shipments/:shipmentId/operations/status', async (req, res) => {
  const { shipmentId } = req.params;
  const { newStatus, description, location } = req.body;

  try {
    const updated = await prisma.$transaction(async (tx) => {
      // 1. Update master status
      const shipment = await tx.shipment.update({
        where: { id: shipmentId },
        data: { status: newStatus }
      });

      // 2. Inject timeline event
      await tx.shipmentTimelineEvent.create({
        data: {
          shipmentId,
          timestamp: new Date(),
          status: newStatus,
          description: description || `Shipment status changed to \${newStatus}`,
          location: location || 'Warehouse'
        }
      });

      return shipment;
    });

    res.status(200).json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to advance status' });
  }
});

export default router;
