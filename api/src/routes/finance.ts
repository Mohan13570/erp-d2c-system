import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/coa', async (req, res) => {
  try { res.json(await prisma.account.findMany()); } catch (error) { res.status(500).json({ error: 'Failed' }); }
});
router.post('/coa', async (req, res) => {
  try { 
    // Default values for required fields on Account model
    const data = {...req.body, accountType: req.body.type || 'Asset', rootType: 'Asset'};
    res.json(await prisma.account.create({ data })); 
  } catch (err: any) { res.status(400).json({ error: err.message }); }
});

router.get('/journals', async (req, res) => {
  try { res.json(await prisma.journalEntry.findMany()); } catch (error) { res.status(500).json({ error: 'Failed' }); }
});
router.post('/journals', async (req, res) => {
  try { res.json(await prisma.journalEntry.create({ data: req.body })); } catch (err: any) { res.status(400).json({ error: err.message }); }
});

router.get('/summary', async (req, res) => {
  try {
    const totalOrders = await prisma.salesOrder.count();
    
    const revenueSum = await prisma.salesOrder.aggregate({
      _sum: { grandTotal: true },
      where: { status: { not: 'Cancelled' } }
    });
    const totalRevenue = revenueSum._sum.grandTotal || 0;
    
    const totalEmployees = await prisma.employee.count();
    const totalItems = await prisma.item.count();
    
    const pendingPOs = await prisma.purchaseOrder.count({
      where: { status: { not: 'Completed' } }
    });
    
    const openReturns = await prisma.return.count({
      where: { status: { notIn: ['Completed', 'Refunded', 'Resolved'] } }
    });
    
    const stockLevelsForSummary = await prisma.stockLevel.findMany({
      include: { item: true }
    });
    const lowStockCount = stockLevelsForSummary.filter(
      (sl) => sl.item.minimum_stock > 0 && sl.qtyAvailable < sl.item.minimum_stock
    ).length;

    const topSalesItems = await prisma.salesOrderItem.groupBy({
      by: ['itemCode'],
      _sum: { qty: true },
      orderBy: { _sum: { qty: 'desc' } },
      take: 5
    });

    const topProducts = await Promise.all(
      topSalesItems.map(async (si) => {
        const item = await prisma.item.findUnique({ where: { itemCode: si.itemCode } });
        return {
          itemCode: si.itemCode,
          itemName: item?.itemName || si.itemCode,
          totalQty: si._sum.qty || 0,
          standardRate: item?.standardRate || 0,
          totalSalesValue: (si._sum.qty || 0) * (item?.standardRate || 0)
        };
      })
    );

    res.json({
      totalOrders,
      totalRevenue,
      totalEmployees,
      totalItems,
      pendingPOs,
      openReturns,
      lowStockCount,
      topProducts
    });
  } catch (error: any) {
    console.error('[Summary API Error]:', error);
    res.status(500).json({ error: 'Failed to generate financial summary', details: error.message });
  }
});

export default router;
