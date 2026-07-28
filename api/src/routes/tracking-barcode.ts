import express from 'express';
import QRCode from 'qrcode';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// ==========================================
// Phase 6.6: QR & Barcode Tracking API
// ==========================================

// GET /api/v1/shipments/:shipmentId/labels/qr
// Generate a base64 Data URI for a QR code linking to the customer portal
router.get('/shipments/:shipmentId/labels/qr', async (req, res) => {
  try {
    const { shipmentId } = req.params;

    const shipment = await prisma.shipment.findUnique({
      where: { id: shipmentId },
      select: { trackingNumber: true }
    });

    if (!shipment) {
      return res.status(404).json({ error: 'Shipment not found' });
    }

    // URL to the public tracking portal
    const trackingUrl = 'http://localhost:5173/tracking?ref=' + shipment.trackingNumber;
    
    // Generate QR code as Base64 Image
    const qrCodeDataUri = await QRCode.toDataURL(trackingUrl, {
      width: 400,
      margin: 2,
      color: {
        dark: '#0f172a',  // Slate 900
        light: '#ffffff'
      }
    });

    res.json({
      trackingNumber: shipment.trackingNumber,
      qrCodeDataUri,
      trackingUrl
    });
  } catch (error) {
    console.error('Error generating QR code:', error);
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
});

export default router;
