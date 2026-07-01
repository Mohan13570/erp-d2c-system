import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Add a Charge Line (Revenue or Expense)
router.post('/charges', async (req, res) => {
  try {
    const { bookingId, tripId, type, chargeCode, amount, currency, description } = req.body;
    const charge = await prisma.roadChargeLine.create({
      data: { bookingId, tripId, type, chargeCode, amount: parseFloat(amount), currency, description }
    });
    res.json(charge);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add charge' });
  }
});

// Generate Customer Invoice
router.post('/invoices', async (req, res) => {
  try {
    const { bookingId, invoiceNumber, currency } = req.body;
    const charges = await prisma.roadChargeLine.findMany({ where: { bookingId, type: 'REVENUE' } });
    const totalAmount = charges.reduce((sum, c) => sum + c.amount, 0);
    
    const invoice = await prisma.roadInvoice.create({
      data: { bookingId, invoiceNumber, totalAmount, currency, status: 'DRAFT', type: 'CUSTOMER_INVOICE', dueDate: new Date(Date.now() + 30*24*60*60*1000) }
    });
    res.json(invoice);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate invoice' });
  }
});

// Get Trip Profitability
router.get('/profitability/:tripId', async (req, res) => {
  try {
    const { tripId } = req.params;
    const trip = await prisma.roadTrip.findUnique({
      where: { id: tripId },
      include: {
        stops: { include: { booking: true } },
        chargeLines: true
      }
    });

    if (!trip) return res.status(404).json({ error: 'Trip not found' });

    // Aggregate booking revenues
    const bookingIds = trip.stops.map(s => s.bookingId).filter(id => id !== null) as string[];
    const revenues = await prisma.roadChargeLine.findMany({
      where: { bookingId: { in: bookingIds }, type: 'REVENUE' }
    });
    
    const totalRevenue = revenues.reduce((s, c) => s + c.amount, 0);
    const totalExpense = trip.chargeLines.filter(c => c.type === 'EXPENSE').reduce((s, c) => s + c.amount, 0);

    res.json({
      tripId,
      totalRevenue,
      totalExpense,
      profit: totalRevenue - totalExpense,
      margin: totalRevenue > 0 ? ((totalRevenue - totalExpense) / totalRevenue) * 100 : 0
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to calculate profitability' });
  }
});

export default router;
