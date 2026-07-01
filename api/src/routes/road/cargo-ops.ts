import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Scan Cargo at Stop (Loading/Unloading)
router.post('/scan', async (req, res) => {
  try {
    const { stopId, bookingItemId, scanType, status, weightVerified, sealVerified, remarks } = req.body;
    
    // Update Stop Actual Time if first scan
    await prisma.roadTripStop.update({
      where: { id: stopId },
      data: { status: 'Arrived', actualTime: new Date() }
    });

    const log = await prisma.cargoOperationLog.create({
      data: {
        stopId,
        bookingItemId,
        scanType, // Barcode, QRCode
        status, // Loaded, Unloaded, Damaged
        weightVerified: weightVerified ? parseFloat(weightVerified) : undefined,
        sealVerified: Boolean(sealVerified),
        remarks
      }
    });
    
    res.json(log);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Cargo scan failed' });
  }
});

export default router;
