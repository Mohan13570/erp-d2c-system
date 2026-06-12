import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Unified Login for Admin, Employee, Customer
router.post('/login', async (req: Request, res: Response) => {
  const { email, password, type } = req.body;

  try {
    let userRecord = null;
    let role = 'User';

    if (type === 'Customer') {
      userRecord = await prisma.d2CCustomer.findUnique({ where: { email } });
    } else {
      userRecord = await prisma.user.findUnique({ 
        where: { email },
        include: { 
          role: {
            include: { permissions: true }
          }
        }
      });
      if (userRecord && (userRecord as any).role) {
        role = (userRecord as any).role.name;
      }
    }

    if (!userRecord || !userRecord.passwordHash) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const validPassword = await bcrypt.compare(password, userRecord.passwordHash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Update last login
    if (type !== 'Customer') {
      await prisma.user.update({
        where: { id: userRecord.id },
        data: { lastLogin: new Date() }
      });

      // Create Audit Log for login
      await prisma.auditLog.create({
        data: {
          userId: userRecord.id,
          action: 'Login',
          tableName: 'User',
          recordId: userRecord.id,
          oldValue: null,
          newValue: 'Successful Login',
          ipAddress: req.ip || req.socket.remoteAddress
        }
      });
    } else {
      // Create Audit Log for D2C Customer login
      await prisma.auditLog.create({
        data: {
          userId: null,
          action: 'Login',
          tableName: 'D2CCustomer',
          recordId: userRecord.id,
          oldValue: null,
          newValue: 'Successful Login',
          ipAddress: req.ip || req.socket.remoteAddress
        }
      });
    }

    const token = jwt.sign(
      { 
        id: userRecord.id, 
        email: userRecord.email, 
        role: role,
        type: type 
      }, 
      JWT_SECRET, 
      { expiresIn: '24h' }
    );
    res.json({
      token,
      user: {
        id: userRecord.id,
        email: userRecord.email,
        firstName: userRecord.firstName,
        lastName: userRecord.lastName,
        role: role,
        type: type,
        permissions: type !== 'Customer' && (userRecord as any).role?.permissions ? (userRecord as any).role.permissions.map((p: any) => p.module) : []
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get Current User Profile
router.get('/me', authenticateToken, async (req: AuthRequest, res: Response) => {
  res.json({ user: req.user });
});

// Register D2C Customer
router.post('/register-customer', async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    
    // Check if customer exists
    const existing = await prisma.d2CCustomer.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const customer = await prisma.d2CCustomer.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        tier: 'Bronze'
      }
    });

    const token = jwt.sign(
      { 
        id: customer.id, 
        email: customer.email, 
        role: 'Customer',
        type: 'Customer' 
      }, 
      JWT_SECRET, 
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: {
        id: customer.id,
        email: customer.email,
        firstName: customer.firstName,
        lastName: customer.lastName,
        role: 'Customer',
        type: 'Customer'
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to register customer' });
  }
});

export default router;
