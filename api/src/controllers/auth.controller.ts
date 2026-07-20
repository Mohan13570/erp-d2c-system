import { Request, Response } from 'express';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { asyncHandler } from '../middleware/asyncHandler';
import { AuthRequest } from '../middleware/auth.middleware';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-change-me';
const JWT_EXPIRES_IN = '1d';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  customerId: z.string().uuid(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const register = asyncHandler(async (req: Request, res: Response) => {
  const validatedData = registerSchema.parse(req.body);

  const existingUser = await prisma.portalUser.findUnique({
    where: { email: validatedData.email },
  });

  if (existingUser) {
    return res.status(400).json({ success: false, error: 'User with this email already exists' });
  }

  const existingCustomer = await prisma.customer.findUnique({
    where: { id: validatedData.customerId },
  });

  if (!existingCustomer) {
    return res.status(400).json({ success: false, error: 'Customer not found' });
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(validatedData.password, salt);

  const user = await prisma.portalUser.create({
    data: {
      email: validatedData.email,
      passwordHash,
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      customerId: validatedData.customerId,
    },
  });

  res.status(201).json({
    success: true,
    data: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      customerId: user.customerId,
      role: user.role,
    },
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const validatedData = loginSchema.parse(req.body);

  const user = await prisma.portalUser.findUnique({
    where: { email: validatedData.email },
  });

  if (!user) {
    return res.status(401).json({ success: false, error: 'Invalid credentials' });
  }

  const isMatch = await bcrypt.compare(validatedData.password, user.passwordHash);

  if (!isMatch) {
    return res.status(401).json({ success: false, error: 'Invalid credentials' });
  }

  if (!user.isActive) {
    return res.status(403).json({ success: false, error: 'Account is deactivated' });
  }

  await prisma.portalUser.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  const token = jwt.sign(
    { id: user.id, customerId: user.customerId, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  res.status(200).json({
    success: true,
    token,
  });
});

export const getMe = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ success: false, error: 'Not authenticated' });
  }

  const user = await prisma.portalUser.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      customerId: true,
      role: true,
      isActive: true,
      lastLoginAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    return res.status(404).json({ success: false, error: 'User not found' });
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});
