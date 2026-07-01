import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Update trip execution status & timeline
router.post('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, action, location, remarks } = req.body;
    
    // Update trip status
    const updateData: any = { status };
    if (action === 'START') updateData.actualStart = new Date();
    if (action === 'COMPLETE') updateData.actualEnd = new Date();

    const trip = await prisma.roadTrip.update({
      where: { id },
      data: updateData
    });

    // Log to execution timeline
    const log = await prisma.roadTripLog.create({
      data: {
        tripId: id,
        action, // Dispatched, Started, Paused, Resumed, Completed
        location,
        remarks
      }
    });

    res.json({ trip, log });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update trip status' });
  }
});

// Upload Trip Document / Proof of Delivery (POD)
router.post('/:id/documents', async (req, res) => {
  try {
    const { id } = req.params;
    const { type, url, uploadedBy } = req.body;
    
    const doc = await prisma.roadTripDocument.create({
      data: { tripId: id, type, url, uploadedBy }
    });
    res.json(doc);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to upload document' });
  }
});

// Get Trip Timeline
router.get('/:id/timeline', async (req, res) => {
  try {
    const logs = await prisma.roadTripLog.findMany({
      where: { tripId: req.params.id, isDeleted: false },
      orderBy: { timestamp: 'desc' }
    });
    res.json(logs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch timeline' });
  }
});

export default router;
