import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { asyncHandler } from '../middleware/asyncHandler';
import { AuthRequest } from '../middleware/auth.middleware';

const prisma = new PrismaClient();

export const createPortalBooking = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ success: false, error: 'Not authenticated' });
  }

  const { customerId } = req.user;
  const { origin, destination, shipmentType, serviceType, cargoDescription } = req.body;

  // Basic validation
  if (!origin || !destination || !shipmentType || !serviceType) {
    return res.status(400).json({ success: false, error: 'Missing required booking fields' });
  }

  // Verify customer exists
  const customer = await prisma.customer.findUnique({
    where: { id: customerId }
  });

  if (!customer) {
    return res.status(400).json({ success: false, error: 'Associated customer not found' });
  }

  // Generate a unique booking number
  const bookingNumber = `PBK-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

  // Create booking
  const newBooking = await prisma.customerBooking.create({
    data: {
      bookingNumber,
      bookingDate: new Date(),
      status: 'SUBMITTED',
      bookingSource: 'Customer Portal',
      customerId,
      origin,
      destination,
      shipmentType,
      serviceType,
      createdBy: req.user.id,
      cargo: {
        create: {
          cargoDescription: cargoDescription || 'No description provided'
        }
      }
    },
    include: {
      cargo: true,
      customer: true
    }
  });

  res.status(201).json({
    success: true,
    data: newBooking
  });
});
