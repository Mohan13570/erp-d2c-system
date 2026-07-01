import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get Telemetry (GPS & Reefer)
router.get('/:containerId', async (req, res) => {
  try {
    const { containerId } = req.params;
    const gps = await prisma.containerTracking.findMany({ where: { containerId }, orderBy: { timestamp: 'desc' }, take: 100 });
    const reefer = await prisma.containerReeferLog.findMany({ where: { containerId }, orderBy: { timestamp: 'desc' }, take: 100 });
    res.json({ gps, reefer });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch telemetry' });
  }
});

// Post GPS Telemetry (Simulates IoT device pushing data)
router.post('/gps', async (req, res) => {
  try {
    const data = req.body;
    const tracking = await prisma.containerTracking.create({ data });
    // Broadcast to UI via Socket.io
    req.app.get('io').emit('gps-update', tracking);
    res.json(tracking);
  } catch (error) {
    res.status(500).json({ error: 'Failed to record GPS telemetry' });
  }
});

// Post Reefer Telemetry (Simulates IoT device pushing data)
router.post('/reefer', async (req, res) => {
  try {
    const data = req.body;
    // Auto-detect alarm condition
    if (data.temperature > -18.0 || data.powerStatus === 'Error') {
      data.hasAlarm = true;
      data.alarmDetails = data.powerStatus === 'Error' ? 'Power failure' : 'Temperature excursion';
    }
    const log = await prisma.containerReeferLog.create({ data });
    // Broadcast to UI
    req.app.get('io').emit('reefer-update', log);
    res.json(log);
  } catch (error) {
    res.status(500).json({ error: 'Failed to record Reefer telemetry' });
  }
});

export default router;
