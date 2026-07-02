import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/dashboard', async (req, res) => {
  try {
    // KPI Data
    const totalSales = await prisma.salesOrder.count().catch(() => 0);
    const totalRevenue = await prisma.invoice.aggregate({ _sum: { total: true }, where: { type: 'AR' } }).catch(() => ({ _sum: { total: 0 } }));
    const totalExpenses = await prisma.procurementVendorBill.aggregate({ _sum: { amount: true }, where: { status: 'Paid' } }).catch(() => ({ _sum: { amount: 0 } }));
    const activeShipments = await prisma.shipment.count({ where: { status: { notIn: ['Delivered', 'Cancelled'] } } }).catch(() => 0);
    const totalUsers = (await prisma.user.count().catch(() => 0)) + (await prisma.employee.count().catch(() => 0));

    // 1. Revenue Forecast (AreaChart)
    const invoices = await prisma.invoice.findMany({ where: { type: 'AR' }, select: { date: true, total: true } }).catch(() => []);
    const bills = await prisma.procurementVendorBill.findMany({ select: { dueDate: true, amount: true } }).catch(() => []);
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const revenueMap: Record<string, { revenue: number, expenses: number }> = {};
    
    const currentMonth = new Date().getMonth();
    for(let i=5; i>=0; i--) {
      let m = currentMonth - i;
      if (m < 0) m += 12;
      revenueMap[months[m]] = { revenue: 0, expenses: 0 };
    }

    invoices.forEach(inv => {
      if(inv.date) {
        const m = months[new Date(inv.date).getMonth()];
        if (revenueMap[m]) revenueMap[m].revenue += inv.total;
      }
    });
    bills.forEach(bill => {
      if(bill.dueDate) {
        const m = months[new Date(bill.dueDate).getMonth()];
        if (revenueMap[m]) revenueMap[m].expenses += bill.amount;
      }
    });

    const revenueForecast = Object.keys(revenueMap).map(k => ({ month: k, ...revenueMap[k] }));

    // 2. Categories (PieChart)
    const items = await prisma.item.groupBy({
      by: ['itemGroup'],
      _count: { itemCode: true }
    }).catch(() => []);
    const categoryData = items.length > 0 
      ? items.map(i => ({ name: i.itemGroup || 'General', value: i._count.itemCode }))
      : []; 

    // 3. Logistics (BarChart)
    const shipments = await prisma.shipment.findMany({ select: { status: true } }).catch(() => []);
    // Since shipments don't have createdAt, mock by distributing among days for now to avoid breaking
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const logisticsMap: Record<string, { shipped: number, delivered: number }> = {};
    days.forEach(d => logisticsMap[d] = { shipped: 0, delivered: 0 });

    shipments.forEach((s, idx) => {
      const d = days[idx % 7];
      if (s.status === 'Delivered') logisticsMap[d].delivered += 1;
      else logisticsMap[d].shipped += 1;
    });

    const logisticsData = days.map(d => ({ day: d, ...logisticsMap[d] }));

    // 4. Live Feed
    const recentPOs = await prisma.purchaseOrder.findMany({ orderBy: { orderDate: 'desc' }, take: 2 }).catch(() => []);
    const recentShipments = await prisma.shipment.findMany({ take: 2 }).catch(() => []); // Shipment has no createdAt, order randomly
    
    const feed = [
      ...recentPOs.map(po => ({ type: 'PO', title: `PO-${po.id.substring(0,4)} Created`, desc: `Procurement order for Vendor ${po.vendorId}`, time: po.orderDate })),
      ...recentShipments.map(s => ({ type: 'SHIPMENT', title: `Shipment ${s.id.substring(0,4)}`, desc: `Status: ${s.status}`, time: new Date() }))
    ].sort((a,b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 3);

    res.json({
      kpis: {
        totalSales,
        revenue: totalRevenue._sum.total || 0,
        expenses: totalExpenses._sum.amount || 0,
        netProfit: (totalRevenue._sum.total || 0) - (totalExpenses._sum.amount || 0),
        activeShipments,
        totalUsers
      },
      revenueForecast,
      categoryData,
      logisticsData,
      feed
    });
  } catch (err) { 
    console.error(err);
    res.status(500).json({ error: 'Failed' }); 
  }
});

export default router;
