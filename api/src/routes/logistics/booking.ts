import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Utility to generate a booking number
const generateBookingNumber = async () => {
  const count = await prisma.customerBooking.count();
  const nextNumber = count + 1;
  return `BKG-${new Date().getFullYear()}-${nextNumber.toString().padStart(4, '0')}`;
};

// CREATE a new complete booking
router.post('/', async (req, res) => {
  try {
    const {
      bookingInfo,
      senderDetails,
      receiverDetails,
      notifyParty,
      billToParty,
      cargoInformation,
    } = req.body;

    const bookingNumber = await generateBookingNumber();

    const newBooking = await prisma.customerBooking.create({
      data: {
        bookingNumber,
        bookingDate: new Date(),
        bookingStatus: 'Draft',
        bookingType: bookingInfo.bookingType || 'Standard',
        serviceType: bookingInfo.serviceType || 'Ocean Freight',
        tradeType: bookingInfo.tradeType || 'Export',
        expectedPickup: bookingInfo.expectedPickup ? new Date(bookingInfo.expectedPickup) : null,
        expectedDelivery: bookingInfo.expectedDelivery ? new Date(bookingInfo.expectedDelivery) : null,
        currency: bookingInfo.currency || 'USD',
        paymentTerms: bookingInfo.paymentTerms,
        bookingNotes: bookingInfo.bookingNotes,
        specialInstructions: bookingInfo.specialInstructions,
        priority: bookingInfo.priority || 'Normal',

        sender: {
          create: {
            companyName: senderDetails.companyName,
            contactPerson: senderDetails.contactPerson,
            email: senderDetails.email,
            phone: senderDetails.phone,
            line1: senderDetails.line1,
            city: senderDetails.city,
            country: senderDetails.country,
            postalCode: senderDetails.postalCode,
          }
        },
        receiver: {
          create: {
            companyName: receiverDetails.companyName,
            contactPerson: receiverDetails.contactPerson,
            email: receiverDetails.email,
            phone: receiverDetails.phone,
            line1: receiverDetails.line1,
            city: receiverDetails.city,
            country: receiverDetails.country,
            postalCode: receiverDetails.postalCode,
          }
        },
        notifyParty: {
          create: {
            companyName: notifyParty.companyName || receiverDetails.companyName,
            contactPerson: notifyParty.contactPerson,
            email: notifyParty.email,
            phone: notifyParty.phone,
            notificationPreference: notifyParty.notificationPreference || 'Email'
          }
        },
        billTo: {
          create: {
            billingCompany: billToParty.billingCompany || senderDetails.companyName,
            financeContact: billToParty.financeContact,
            invoiceEmail: billToParty.invoiceEmail,
            paymentTerms: billToParty.paymentTerms,
          }
        },
        cargos: {
          create: cargoInformation.map((c: any) => ({
            commodity: c.commodity,
            description: c.description,
            hsCode: c.hsCode,
            packageType: c.packageType,
            numberOfPackages: parseInt(c.numberOfPackages) || 1,
            grossWeight: parseFloat(c.grossWeight) || 0,
            volumeCBM: parseFloat(c.volumeCBM) || 0,
            isDangerousGoods: c.isDangerousGoods || false,
            isTemperatureControlled: c.isTemperatureControlled || false,
            containerType: c.containerType,
            containerSize: c.containerSize,
            containerQuantity: parseInt(c.containerQuantity) || 0
          }))
        }
      },
      include: {
        sender: true,
        receiver: true,
        notifyParty: true,
        billTo: true,
        cargos: true
      }
    });

    res.status(201).json({ success: true, data: newBooking });
  } catch (error: any) {
    console.error('Booking Creation Error:', error);
    res.status(500).json({ success: false, error: 'Failed to create booking', details: error.message });
  }
});

// READ all bookings (with pagination & basic filtering)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 50, search, status } = req.query;
    
    const whereClause: any = {};
    if (search) {
      whereClause.OR = [
        { bookingNumber: { contains: String(search) } },
        { sender: { companyName: { contains: String(search) } } },
        { receiver: { companyName: { contains: String(search) } } }
      ];
    }
    if (status) {
      whereClause.bookingStatus = status;
    }

    const bookings = await prisma.customerBooking.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      take: Number(limit),
      skip: (Number(page) - 1) * Number(limit),
      include: {
        sender: true,
        receiver: true,
        cargos: true
      }
    });

    const total = await prisma.customerBooking.count({ where: whereClause });

    res.json({
      success: true,
      data: bookings,
      meta: { total, page: Number(page), limit: Number(limit) }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Failed to fetch bookings', details: error.message });
  }
});

// GET single booking
router.get('/:id', async (req, res) => {
  try {
    const booking = await prisma.customerBooking.findUnique({
      where: { id: req.params.id },
      include: {
        sender: true,
        receiver: true,
        notifyParty: true,
        billTo: true,
        cargos: true
      }
    });
    
    if (!booking) return res.status(404).json({ success: false, error: 'Booking not found' });
    res.json({ success: true, data: booking });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Failed to fetch booking', details: error.message });
  }
});

export default router;
