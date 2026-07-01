import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();
const asyncHandler = (fn: Function) => (req: any, res: any, next: any) => Promise.resolve(fn(req, res, next)).catch(next);

// Recalculate Margin for a booking
async function calculateMargin(bookingId: string) {
  const charges = await prisma.airChargeLine.findMany({ where: { bookingId, isDeleted: false } });
  
  let totalRevenue = 0;
  let totalCost = 0;
  
  for (const c of charges) {
    if (c.type === 'REVENUE') totalRevenue += c.baseAmount;
    if (c.type === 'COST') totalCost += c.baseAmount;
  }
  
  const grossMargin = totalRevenue - totalCost;
  const marginPercentage = totalRevenue > 0 ? (grossMargin / totalRevenue) * 100 : 0;
  
  await prisma.airShipmentFinancials.upsert({
    where: { bookingId },
    create: { bookingId, totalRevenue, totalCost, grossMargin, marginPercentage },
    update: { totalRevenue, totalCost, grossMargin, marginPercentage }
  });
}

// 1. Add a Charge Line
router.post('/:bookingId/charges', asyncHandler(async (req: any, res: any) => {
  const { chargeCode, chargeName, type, amount, currency, exchangeRate } = req.body;
  const baseAmount = amount * exchangeRate;
  
  const charge = await prisma.airChargeLine.create({
    data: {
      bookingId: req.params.bookingId,
      chargeCode, chargeName, type, amount, currency, exchangeRate, baseAmount
    }
  });
  
  await calculateMargin(req.params.bookingId);
  res.status(201).json(charge);
}));

// 2. Get Financials for a Booking
router.get('/:bookingId', asyncHandler(async (req: any, res: any) => {
  const financials = await prisma.airShipmentFinancials.findUnique({
    where: { bookingId: req.params.bookingId }
  });
  const charges = await prisma.airChargeLine.findMany({
    where: { bookingId: req.params.bookingId, isDeleted: false }
  });
  res.json({ financials, charges });
}));

// 3. Generate Customer Invoice
router.post('/:bookingId/invoice', asyncHandler(async (req: any, res: any) => {
  const { customerId, chargeLineIds, currency } = req.body;
  
  // Calculate total from selected charge lines
  const lines = await prisma.airChargeLine.findMany({ where: { id: { in: chargeLineIds } } });
  const totalAmount = lines.reduce((acc: number, l: any) => acc + (l.type === 'REVENUE' ? l.amount : 0), 0);
  
  const invoice = await prisma.airInvoice.create({
    data: {
      bookingId: req.params.bookingId,
      invoiceNumber: `INV-${Math.floor(Math.random() * 100000)}`,
      customerId,
      totalAmount,
      currency,
      chargeLines: { connect: chargeLineIds.map((id: string) => ({ id })) }
    },
    include: { chargeLines: true }
  });
  
  res.status(201).json(invoice);
}));

export default router;
