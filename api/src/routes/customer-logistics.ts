import { Router } from 'express';
import { CustomerLogisticsEngine } from '../services/CustomerLogisticsEngine';

const router = Router();

// Create a new Booking
router.post('/bookings', async (req, res) => {
  try {
    const booking = await CustomerLogisticsEngine.createBooking(req.body);
    res.status(201).json({ success: true, data: booking });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Convert Booking to RFQ
router.post('/bookings/:id/rfq', async (req, res) => {
  try {
    const { vendorIds, notes } = req.body;
    const rfq = await CustomerLogisticsEngine.generateRFQ(req.params.id, vendorIds, notes);
    res.status(201).json({ success: true, data: rfq });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Submit Quotation (Vendor Side -> RFQ)
router.post('/rfqs/:id/quotations', async (req, res) => {
  try {
    const quote = await CustomerLogisticsEngine.receiveQuotation({ ...req.body, rfqId: req.params.id });
    res.status(201).json({ success: true, data: quote });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Award Quotation
router.put('/quotations/:id/award', async (req, res) => {
  try {
    const awardedQuote = await CustomerLogisticsEngine.awardQuotation(req.params.id);
    res.status(200).json({ success: true, data: awardedQuote });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// For Demo/Dashboard purposes, get summary
router.get('/dashboard-stats', async (req, res) => {
  // In a real app, use auth middleware to get customerId
  // Here we just return mock aggregation for the frontend UI
  res.json({
    success: true,
    data: {
      activeBookings: 12,
      pendingQuotations: 5,
      upcomingPickups: 3,
      recentActivity: [
        { id: 1, action: "Quotation received from OceanLink", time: "2h ago" },
        { id: 2, action: "Pickup Scheduled for BKG-4820", time: "5h ago" }
      ]
    }
  });
});

export default router;
