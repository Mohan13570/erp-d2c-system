import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// ==========================================
// ADVANCE SHIPMENT NOTICE (ASN)
// ==========================================
router.get('/asn', async (req, res) => {
  try {
    const asns = await prisma.advanceShipmentNotice.findMany({ include: { vendor: true, purchaseOrder: true } });
    res.json(asns);
  } catch (error: any) { res.status(500).json({ error: error.message }); }
});

router.post('/asn', async (req, res) => {
  try {
    const asn = await prisma.advanceShipmentNotice.create({ data: req.body });
    res.status(201).json(asn);
  } catch (error: any) { res.status(500).json({ error: error.message }); }
});

// ==========================================
// DOCK SCHEDULING
// ==========================================
router.get('/dock', async (req, res) => {
  try {
    const schedules = await prisma.dockSchedule.findMany({ include: { bay: true } });
    res.json(schedules);
  } catch (error: any) { res.status(500).json({ error: error.message }); }
});

router.post('/dock', async (req, res) => {
  try {
    const { bayId, asnNumber, scheduledDate, startTime, endTime } = req.body;
    const schedule = await prisma.dockSchedule.create({
      data: { bayId, asnNumber, scheduledDate: new Date(scheduledDate), startTime, endTime }
    });
    res.status(201).json(schedule);
  } catch (error: any) { res.status(500).json({ error: error.message }); }
});

// ==========================================
// GATE ENTRY (TRUCK ARRIVAL)
// ==========================================
router.get('/gate', async (req, res) => {
  try {
    const gates = await prisma.gateEntry.findMany({ include: { asn: true } });
    res.json(gates);
  } catch (error: any) { res.status(500).json({ error: error.message }); }
});

router.post('/gate', async (req, res) => {
  try {
    const gate = await prisma.gateEntry.create({ data: req.body });
    res.status(201).json(gate);
  } catch (error: any) { res.status(500).json({ error: error.message }); }
});

// ==========================================
// GOODS RECEIPT NOTE (GRN)
// ==========================================
router.get('/grn', async (req, res) => {
  try {
    const grns = await prisma.goodsReceiptNote.findMany({ include: { items: true, inspections: true } });
    res.json(grns);
  } catch (error: any) { res.status(500).json({ error: error.message }); }
});

router.post('/grn', async (req, res) => {
  try {
    const { purchaseOrderId, warehouseId, receivedBy, notes, items } = req.body;
    const grn = await prisma.goodsReceiptNote.create({
      data: {
        grnNumber: `GRN-${Date.now()}`,
        purchaseOrderId,
        warehouseId,
        receivedBy,
        notes,
        items: {
          create: items.map((i: any) => ({
            itemCode: i.itemCode,
            qtyReceived: i.qtyReceived,
            batchNumber: i.batchNumber,
            serialNumber: i.serialNumber,
            lotNumber: i.lotNumber,
            expiryDate: i.expiryDate ? new Date(i.expiryDate) : undefined
          }))
        }
      },
      include: { items: true }
    });
    res.status(201).json(grn);
  } catch (error: any) { res.status(500).json({ error: error.message }); }
});

// ==========================================
// PUT AWAY PLANNER
// ==========================================
router.post('/put-away/plan', async (req, res) => {
  try {
    const { grnId, assignedTo } = req.body;
    
    // Fetch GRN items
    const grn = await prisma.goodsReceiptNote.findUnique({
      where: { id: grnId },
      include: { items: true }
    });
    
    if (!grn) return res.status(404).json({ error: "GRN not found" });

    // Dummy Allocation Logic: Get first available bins
    const availableBins = await prisma.warehouseBin.findMany({ take: grn.items.length });
    
    if (availableBins.length === 0) return res.status(400).json({ error: "No available bins found for Put Away" });

    const putAwayTask = await prisma.putAwayTask.create({
      data: {
        taskId: `PA-${Date.now()}`,
        grnId,
        assignedTo,
        items: {
          create: grn.items.map((item, index) => ({
            itemCode: item.itemCode,
            qty: item.qtyReceived,
            targetBinId: availableBins[index % availableBins.length].id
          }))
        }
      },
      include: { items: true }
    });

    res.status(201).json(putAwayTask);
  } catch (error: any) { res.status(500).json({ error: error.message }); }
});

export default router;
