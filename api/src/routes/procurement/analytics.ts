import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// ==========================================
// EXECUTIVE DASHBOARD ANALYTICS
// ==========================================
router.get('/dashboard', async (req, res) => {
  try {
    // 1. Total Spend (Simulated by summing all paid vendor bills)
    const totalSpendRes = await prisma.procurementVendorBill.aggregate({
      _sum: { totalAmount: true },
      where: { status: 'Paid' }
    });
    
    // 2. Pending Payments (Simulated by summing unpaid bills)
    const pendingPaymentsRes = await prisma.procurementVendorBill.aggregate({
      _sum: { totalAmount: true },
      where: { status: 'Unpaid' }
    });

    // 3. Open PRs
    const openPRs = await prisma.purchaseRequisition.count({
      where: { status: 'Pending_Approval' }
    });
    
    // 4. Monthly Spend Trend (Simulated via SpendAnalysis)
    const spendTrend = await prisma.spendAnalysis.groupBy({
      by: ['periodMonth'],
      _sum: { spendAmount: true },
      orderBy: { periodMonth: 'asc' }
    });

    // 5. Top Vendors (By Spend)
    const topVendors = await prisma.spendAnalysis.groupBy({
      by: ['vendorId'],
      _sum: { spendAmount: true },
      orderBy: { _sum: { spendAmount: 'desc' } },
      take: 5
    });

    // Resolve vendor names
    const vendorIds = topVendors.map(v => v.vendorId).filter(id => id !== null) as string[];
    const vendors = await prisma.vendor.findMany({
      where: { id: { in: vendorIds } },
      select: { id: true, name: true }
    });

    const topVendorsFormatted = topVendors.map(tv => ({
       vendorName: vendors.find(v => v.id === tv.vendorId)?.name || 'Unknown',
       spend: tv._sum.spendAmount || 0
    }));

    res.json({
      kpis: {
        totalSpendThisYear: totalSpendRes._sum.totalAmount || 0,
        pendingPayments: pendingPaymentsRes._sum.totalAmount || 0,
        openPRs,
        budgetUtilization: '74%' // Simulated KPI
      },
      monthlySpend: spendTrend.map(st => ({
        month: st.periodMonth,
        spend: st._sum.spendAmount || 0
      })),
      topVendors: topVendorsFormatted
    });

  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// SPEND ANALYSIS ENGINE
// ==========================================
router.get('/spend', async (req, res) => {
  try {
    const spend = await prisma.spendAnalysis.findMany({
       orderBy: { periodMonth: 'desc' },
       take: 50
    });
    res.json(spend);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
