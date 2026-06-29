import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all Bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await prisma.oceanBooking.findMany({
      where: { isDeleted: false },
      include: {
        pol: true,
        pod: true,
        vessel: true,
        shippingLine: true,
        cargos: true,
        containers: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Get Single Booking
router.get('/:id', async (req, res) => {
  try {
    const booking = await prisma.oceanBooking.findUnique({
      where: { id: req.params.id },
      include: {
        pol: true,
        pod: true,
        finalDest: true,
        vessel: true,
        voyage: true,
        shippingLine: true,
        cargos: { include: { cargoType: true, dgClass: true, tempClass: true, packageType: true } },
        containers: { include: { containerType: true, containerSize: true } },
        documents: true,
        events: { orderBy: { createdAt: 'desc' } }
      }
    });
    if (!booking) return res.status(404).json({ error: 'Not found' });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch booking details' });
  }
});

// Create Booking
router.post('/', async (req, res) => {
  try {
    const { cargos, containers, ...bookingData } = req.body;
    
    // Generate Booking Number
    bookingData.bookingNumber = `BKG-${Math.floor(Math.random() * 1000000)}`;

    const newBooking = await prisma.oceanBooking.create({
      data: {
        ...bookingData,
        cargos: { create: cargos || [] },
        containers: { create: containers || [] },
        events: {
          create: [{ status: 'Draft', description: 'Booking Draft Created', performedBy: 'System' }]
        }
      },
      include: { cargos: true, containers: true }
    });
    res.status(201).json(newBooking);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Approve Booking Workflow
router.post('/:id/approve', async (req, res) => {
  try {
    const booking = await prisma.oceanBooking.update({
      where: { id: req.params.id },
      data: {
        status: 'Confirmed',
        events: {
          create: [{ status: 'Confirmed', description: 'Booking Approved and Confirmed', performedBy: 'Admin' }]
        }
      }
    });
    res.json(booking);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Generate Document (Mock for MBL/HBL)
router.post('/:id/documents', async (req, res) => {
  try {
    const { documentType, payload } = req.body;
    const documentNumber = `${documentType}-${Math.floor(Math.random() * 100000)}`;
    
    const doc = await prisma.oceanDocument.create({
      data: {
        bookingId: req.params.id,
        documentType,
        documentNumber,
        issuedDate: new Date(),
        payload: JSON.stringify(payload)
      }
    });

    await prisma.oceanBookingEvent.create({
      data: {
        bookingId: req.params.id,
        status: 'Document Issued',
        description: `Generated ${documentType} (${documentNumber})`,
        performedBy: 'System'
      }
    });

    res.status(201).json(doc);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
