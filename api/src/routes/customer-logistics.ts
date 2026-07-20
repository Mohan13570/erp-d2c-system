import { Router } from 'express';
import { CustomerLogisticsEngine } from '../services/CustomerLogisticsEngine';

const router = Router();

// Create a new Booking (V2 - from new UI)
router.post('/v2/bookings', async (req, res) => {
  try {
    const data = req.body;
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    const bookingNumber = `BKG-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;

    const booking = await prisma.customerBooking.create({
      data: {
        bookingNumber,
        bookingType: data.orderType,
        serviceType: data.transportMode,
        tradeType: data.operation,
        bookingDate: new Date(data.bookingDate || Date.now()),
        currency: data.shipmentCurrency || 'USD',
        shipmentValue: data.shipmentValue,
        incoterms: data.incoterms,
        insurance: data.insurance,
        expectedPickup: data.etdDate ? new Date(data.etdDate) : null,
        expectedDelivery: data.etaDate ? new Date(data.etaDate) : null,
        customerRef: data.referenceNo,
        
        sender: {
          create: {
            companyName: data.shipperCompany,
            contactPerson: data.shipperContact,
            country: data.shipperCountry,
            city: data.shipperCity,
            line1: data.shipperAddress,
            pickupInstructions: data.pickupInstruction,
            pickupDate: data.etdDate ? new Date(data.etdDate) : null
          }
        },
        receiver: {
          create: {
            companyName: data.consigneeCompany,
            contactPerson: data.consigneeContact,
            country: data.consigneeCountry,
            city: data.consigneeCity,
            line1: data.consigneeAddress,
            deliveryInstructions: data.deliveryInstruction,
            deliveryDate: data.etaDate ? new Date(data.etaDate) : null
          }
        },
        cargos: {
          create: [{
            commodity: data.commodity,
            hsCode: data.hsCode,
            packageType: data.packageType,
            numberOfPackages: data.pieces,
            grossWeight: data.grossWeight,
            volumeCBM: data.volumeCbm,
            chargeableWeight: data.chargeableWeight || Math.max(data.grossWeight, data.volumeCbm * 167),
            isStackable: data.stackable,
            temperatureControl: data.temperatureControl,
            isDangerousGoods: data.dgCargo,
            insuranceValue: data.insuranceValue,
            remarks: data.remarks
          }]
        }
      }
    });

    res.status(201).json({ success: true, data: booking });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create a new Booking (V1)
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
