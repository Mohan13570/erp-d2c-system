import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { VendorLogisticsEngine } from '../services/VendorLogisticsEngine';
import { VendorWarehouseEngine } from '../services/VendorWarehouseEngine';

const router = Router();
const prisma = new PrismaClient();

// ==========================================
// VENDOR LOGISTICS & ASN
// ==========================================

const mockVendorId = "mock-vendor-id"; 

router.get('/asns', async (req, res) => {
  try {
    const asns = await prisma.advanceShipmentNotice.findMany({
      where: { purchaseOrder: { vendorId: mockVendorId } },
      include: { purchaseOrder: true, vendorTrackings: true }
    });
    res.json(asns);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/asn', async (req, res) => {
  try {
    const { purchaseOrderId, expectedArrival, carrier, containerNumber, sealNumber } = req.body;
    const asn = await VendorLogisticsEngine.submitASN(mockVendorId, purchaseOrderId, new Date(expectedArrival), carrier, containerNumber, sealNumber);
    res.json(asn);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/docks/available', async (req, res) => {
  try {
    const docks = await prisma.dockSchedule.findMany({
      where: { status: 'Available' },
      include: { loadingBay: true },
      take: 20
    });
    res.json(docks);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/dock/book', async (req, res) => {
  try {
    const { asnId, dockScheduleId, driverName, vehiclePlate } = req.body;
    const appointment = await VendorLogisticsEngine.bookDock(mockVendorId, asnId, dockScheduleId, driverName, vehiclePlate);
    res.json(appointment);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/grns/:asnId', async (req, res) => {
  try {
    const grns = await VendorWarehouseEngine.getGRNStatus(mockVendorId, req.params.asnId);
    res.json(grns);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
