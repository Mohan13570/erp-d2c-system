import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get all shipments
router.get('/', async (req, res) => {
  try {
    const shipments = await prisma.shipment.findMany({
      include: {
        customer: true,
        items: true,
        milestones: true,
        trackingEvents: true,
        statuses: true
      }
    });
    res.json(shipments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch shipments' });
  }
});

// Create shipment
router.post('/', async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.departureDate) data.departureDate = new Date(data.departureDate);
    if (data.arrivalDate) data.arrivalDate = new Date(data.arrivalDate);
    const newShipment = await prisma.shipment.create({ data });
    res.json(newShipment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create shipment' });
  }
});

// Delete shipment
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id as string;
    await prisma.shipmentItem.deleteMany({ where: { shipmentId: id } });
    await prisma.shipmentMilestone.deleteMany({ where: { shipmentId: id } });
    await prisma.trackingEvent.deleteMany({ where: { shipmentId: id } });
    await prisma.shipmentStatus.deleteMany({ where: { shipmentId: id } });
    await prisma.shipment.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete shipment' });
  }
});

export default router;
