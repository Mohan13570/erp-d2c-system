import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all devices
router.get('/devices', async (req, res) => {
  try {
    const devices = await prisma.gPSDevice.findMany({
      include: {
        vehicle: true,
        configuration: true
      },
      orderBy: { lastPing: 'desc' }
    });
    res.json(devices);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch GPS devices' });
  }
});

// Get a single device
router.get('/devices/:id', async (req, res) => {
  try {
    const device = await prisma.gPSDevice.findUnique({
      where: { id: req.params.id },
      include: {
        vehicle: true,
        configuration: true,
        logs: {
          take: 10,
          orderBy: { timestamp: 'desc' }
        }
      }
    });
    if (!device) return res.status(404).json({ error: 'Not found' });
    res.json(device);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch device' });
  }
});

// Register new device
router.post('/devices', async (req, res) => {
  try {
    const data = req.body;
    const newDevice = await prisma.$transaction(async (tx) => {
      const dev = await tx.gPSDevice.create({
        data: {
          imei: data.imei,
          simNumber: data.simNumber,
          simProvider: data.simProvider,
          firmwareVersion: data.firmwareVersion || '1.0.0',
          vehicleId: data.vehicleId || null
        }
      });
      
      // Auto-create default configuration
      await tx.gPSConfiguration.create({
        data: {
          deviceId: dev.id,
          pollingRateSec: 5,
          dataCompression: true
        }
      });
      
      await tx.gPSLog.create({
        data: {
          deviceId: dev.id,
          type: 'Registration',
          message: 'Device provisioned on platform.'
        }
      });
      
      return dev;
    });
    res.status(201).json(newDevice);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Hardware Command: Restart
router.post('/devices/:id/restart', async (req, res) => {
  try {
    // In a real system, this would send an MQTT/SMS command to the physical hardware
    const log = await prisma.gPSLog.create({
      data: {
        deviceId: req.params.id,
        type: 'Reboot',
        message: 'Remote restart command issued.'
      }
    });
    res.json({ success: true, message: 'Restart command sent', log });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Hardware Command: Firmware Update
router.post('/devices/:id/firmware', async (req, res) => {
  try {
    const { version } = req.body;
    await prisma.gPSDevice.update({
      where: { id: req.params.id },
      data: { firmwareVersion: version }
    });
    
    const log = await prisma.gPSLog.create({
      data: {
        deviceId: req.params.id,
        type: 'FirmwareUpdate',
        message: `OTA Firmware update to ${version} initiated.`
      }
    });
    res.json({ success: true, message: 'Firmware update pushed', log });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Get tracking history for a device
router.get('/tracking/:deviceId/history', async (req, res) => {
  try {
    const history = await prisma.vehicleTelemetry.findMany({
      where: { deviceId: req.params.deviceId },
      orderBy: { timestamp: 'asc' },
      take: 100 // Limit for map rendering buffer
    });
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

export default router;
