import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// ==========================================
// Phase 10: Executive Analytics & BI APIs
// ==========================================

// Seed Mock BI Data for the Command Center if empty
async function seedAnalyticsIfNeeded() {
  const kpiCount = await prisma.shipmentKPI.count();
  if (kpiCount === 0) {
    await prisma.shipmentKPI.create({
      data: {
        totalShipments: 12450,
        activeShipments: 842,
        completedShipments: 11400,
        delayedShipments: 180,
        cancelledShipments: 28,
        onTimeDeliveryPct: 94.5,
        avgTransitTimeDays: 3.2,
        totalRevenue: 4500000,
        totalCost: 3100000,
        grossProfit: 1400000,
        netProfit: 1150000,
      }
    });

    const categories = [
      { cat: 'STATUS', metrics: { 'In Transit': 400, 'Warehouse': 250, 'Out for Delivery': 192 } },
      { cat: 'TRANSPORT', metrics: { 'Road': 4500, 'Air': 2100, 'Ocean': 3800, 'Rail': 2050 } },
      { cat: 'EXCEPTION', metrics: { 'Traffic Delay': 80, 'Weather Delay': 40, 'Vehicle Breakdown': 15, 'Missing Docs': 45 } },
    ];

    for (const c of categories) {
      for (const [name, val] of Object.entries(c.metrics)) {
        await prisma.shipmentAnalytics.create({
          data: { category: c.cat, metricName: name, metricValue: val }
        });
      }
    }
  }
}

// GET /api/v1/executive/analytics/kpis
router.get('/kpis', async (req, res) => {
  try {
    await seedAnalyticsIfNeeded();
    const kpi = await prisma.shipmentKPI.findFirst({ orderBy: { createdAt: 'desc' } });
    res.json(kpi);
  } catch (error) {
    console.error('Error fetching KPIs:', error);
    res.status(500).json({ error: 'Failed to fetch executive KPIs' });
  }
});

// GET /api/v1/executive/analytics/charts
router.get('/charts', async (req, res) => {
  try {
    await seedAnalyticsIfNeeded();
    const analytics = await prisma.shipmentAnalytics.findMany();
    
    // Group by category for easy consumption by Recharts
    const grouped = analytics.reduce((acc, curr) => {
      if (!acc[curr.category]) acc[curr.category] = [];
      acc[curr.category].push({ name: curr.metricName, value: curr.metricValue });
      return acc;
    }, {} as Record<string, any[]>);

    res.json(grouped);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics charts' });
  }
});

// POST /api/v1/executive/analytics/export
router.post('/export', async (req, res) => {
  try {
    const { reportType, format, filters } = req.body;

    const report = await prisma.shipmentReport.create({
      data: {
        reportType,
        format,
        filters: JSON.stringify(filters),
        generatedBy: 'ExecutiveUser',
        status: 'COMPLETED',
        fileUrl: \`/downloads/reports/\${reportType.toLowerCase()}-\${Date.now()}.\${format.toLowerCase()}\`
      }
    });

    res.json({ message: 'Report generated', report });
  } catch (error) {
    console.error('Error exporting report:', error);
    res.status(500).json({ error: 'Failed to generate export' });
  }
});

export default router;
