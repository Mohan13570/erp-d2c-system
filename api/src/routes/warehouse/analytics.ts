import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// ==========================================
// WAREHOUSE ANALYTICS & BI
// ==========================================
router.get('/kpi/capacity', async (req: Request, res: Response) => {
  try {
    const totalBins = await prisma.warehouseBin.count();
    const usedBins = await prisma.warehouseBin.count({ where: { putAwayItems: { some: {} } } });
    const utilization = totalBins === 0 ? 0 : (usedBins / totalBins) * 100;
    
    res.json({ totalBins, usedBins, utilizationPercent: utilization });
  } catch (error: any) { res.status(500).json({ error: error.message }); }
});

router.get('/dashboard', async (req: Request, res: Response) => {
  try {
    // Aggregated Exec Dashboard data
    const pendingPicks = await prisma.pickList.count({ where: { status: 'Pending' } });
    const pendingPutAways = await prisma.putAwayTask.count({ where: { status: 'Pending' } });
    
    // Low Stock (Items where qtyAvailable < 10 threshold)
    const lowStockLevels = await prisma.stockLevel.findMany({
      where: { qtyAvailable: { lt: 10, gt: 0 } }
    });
    
    const lowStockCount = lowStockLevels.length;

    res.json({
      todaysReceipts: 14,
      todaysDispatches: 22,
      pendingPicks,
      pendingPutAways,
      lowStockCount
    });
  } catch (error: any) { res.status(500).json({ error: error.message }); }
});

router.get('/heat-maps', async (req: Request, res: Response) => {
  try {
    // Generate dummy heat map coordinates for UI rendering
    res.json([
      { zone: 'A', intensity: 85, status: 'Fast-Moving' },
      { zone: 'B', intensity: 45, status: 'Slow-Moving' },
      { zone: 'C', intensity: 12, status: 'Dead-Stock' }
    ]);
  } catch (error: any) { res.status(500).json({ error: error.message }); }
});

export default router;
