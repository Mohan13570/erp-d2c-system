import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();
const asyncHandler = (fn: Function) => (req: any, res: any, next: any) => Promise.resolve(fn(req, res, next)).catch(next);

// Executive Dashboard Aggregation
router.get('/kpi', asyncHandler(async (req: any, res: any) => {
  // Aggregate revenue and margins from AirShipmentFinancials
  const financials = await prisma.airShipmentFinancials.findMany({ where: { isDeleted: false }});
  
  let totalRevenue = 0;
  let totalCost = 0;
  financials.forEach((f: any) => {
    totalRevenue += f.totalRevenue;
    totalCost += f.totalCost;
  });

  const grossProfit = totalRevenue - totalCost;
  const overallMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;

  // Active bookings count
  const activeBookings = await prisma.airBooking.count({
    where: { status: { notIn: ['Delivered', 'Cancelled'] } }
  });

  // ULD Utilization logic mock (usually derived from NetWeight vs MaxPayload)
  const avgUldUtilization = 78.5; // percent mock

  res.json({
    revenueMTD: totalRevenue,
    profitMTD: grossProfit,
    marginPct: overallMargin,
    activeShipments: activeBookings,
    avgUldUtilization
  });
}));

// Daily Revenue Chart Data
router.get('/revenue-trend', asyncHandler(async (req: any, res: any) => {
  // Mock trend data for chart
  res.json([
    { day: 'Mon', revenue: 45000, cost: 32000 },
    { day: 'Tue', revenue: 52000, cost: 34000 },
    { day: 'Wed', revenue: 48000, cost: 33000 },
    { day: 'Thu', revenue: 61000, cost: 41000 },
    { day: 'Fri', revenue: 59000, cost: 39000 },
    { day: 'Sat', revenue: 30000, cost: 22000 },
    { day: 'Sun', revenue: 25000, cost: 18000 }
  ]);
}));

export default router;
