import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// ==========================================
// BATCH & SERIAL TRACKING (TRACEABILITY)
// ==========================================
router.get('/batches', async (req: Request, res: Response) => {
  try {
    const batches = await prisma.inventoryBatch.findMany({ include: { item: true } });
    res.json(batches);
  } catch (error: any) { res.status(500).json({ error: error.message }); }
});

router.get('/serials', async (req: Request, res: Response) => {
  try {
    const serials = await prisma.inventorySerial.findMany({ include: { item: true } });
    res.json(serials);
  } catch (error: any) { res.status(500).json({ error: error.message }); }
});

// ==========================================
// INVENTORY ADJUSTMENTS
// ==========================================
router.get('/adjustments', async (req: Request, res: Response) => {
  try {
    const adjustments = await prisma.inventoryAdjustment.findMany({ include: { item: true } });
    res.json(adjustments);
  } catch (error: any) { res.status(500).json({ error: error.message }); }
});

router.post('/adjustments', async (req: Request, res: Response) => {
  try {
    const { itemCode, warehouseName, adjustmentQty, reason, adjustedBy } = req.body;
    
    // Create adjustment record
    const adj = await prisma.inventoryAdjustment.create({
      data: { itemCode, warehouseName, adjustmentQty: Number(adjustmentQty), reason, adjustedBy, status: 'Posted' }
    });

    // Update Stock Level
    const stock = await prisma.stockLevel.findUnique({
      where: { itemCode_warehouseName: { itemCode, warehouseName } }
    });
    
    if (stock) {
      await prisma.stockLevel.update({
        where: { id: stock.id },
        data: { 
          qtyOnHand: stock.qtyOnHand + Number(adjustmentQty),
          qtyAvailable: stock.qtyAvailable + Number(adjustmentQty)
        }
      });
    }

    res.status(201).json(adj);
  } catch (error: any) { res.status(500).json({ error: error.message }); }
});

// ==========================================
// INVENTORY TRANSFERS
// ==========================================
router.get('/transfers', async (req: Request, res: Response) => {
  try {
    const transfers = await prisma.inventoryTransfer.findMany({ include: { item: true } });
    res.json(transfers);
  } catch (error: any) { res.status(500).json({ error: error.message }); }
});

router.post('/transfers', async (req: Request, res: Response) => {
  try {
    const { itemCode, fromWarehouse, toWarehouse, qty, initiatedBy } = req.body;
    const transfer = await prisma.inventoryTransfer.create({
      data: {
        transferId: `TRF-${Date.now()}`,
        itemCode,
        fromWarehouse,
        toWarehouse,
        qty: Number(qty),
        initiatedBy,
        status: 'In-Transit',
        shippedDate: new Date()
      }
    });
    res.status(201).json(transfer);
  } catch (error: any) { res.status(500).json({ error: error.message }); }
});

// ==========================================
// CYCLE COUNTS
// ==========================================
router.get('/cycle-counts', async (req: Request, res: Response) => {
  try {
    const counts = await prisma.cycleCount.findMany({ include: { items: true } });
    res.json(counts);
  } catch (error: any) { res.status(500).json({ error: error.message }); }
});

router.post('/cycle-counts', async (req: Request, res: Response) => {
  try {
    const { warehouseName, scheduledDate, assignedTo } = req.body;
    const count = await prisma.cycleCount.create({
      data: {
        countId: `CC-${Date.now()}`,
        warehouseName,
        scheduledDate: new Date(scheduledDate),
        assignedTo,
        status: 'Scheduled'
      }
    });
    res.status(201).json(count);
  } catch (error: any) { res.status(500).json({ error: error.message }); }
});

// ==========================================
// VALUATION SNAPSHOTS
// ==========================================
router.get('/valuation', async (req: Request, res: Response) => {
  try {
    const snapshots = await prisma.inventoryValuationSnapshot.findMany();
    res.json(snapshots);
  } catch (error: any) { res.status(500).json({ error: error.message }); }
});

export default router;
