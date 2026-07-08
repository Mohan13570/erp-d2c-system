import express from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth';
import crypto from 'crypto';

const router = express.Router();
const prisma = new PrismaClient();

const userSchema = z.object({
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  roleId: z.string().optional(),
  status: z.string().default('Pending'),
});

// GET all users with their active sessions and devices
router.get('/', requireAuth, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        role: true,
        devices: true,
        sessions: {
          where: { status: 'Active' }
        },
        employeeProfile: true
      }
    });
    // Remove password hashes from response
    const safeUsers = users.map(u => {
      const { passwordHash, ...safeUser } = u;
      return safeUser;
    });
    res.json(safeUsers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// POST create user manually
router.post('/', requireAuth, async (req, res) => {
  try {
    const data = userSchema.parse(req.body);
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) return res.status(400).json({ error: 'Email already registered' });

    const user = await prisma.user.create({
      data: {
        ...data,
        passwordHash: crypto.createHash('sha256').update('TempPass123!').digest('hex') // In prod use bcrypt
      }
    });

    const { passwordHash, ...safeUser } = user;
    res.status(201).json(safeUser);
  } catch (error) {
    res.status(400).json({ error: 'Invalid payload' });
  }
});

// GET user sessions
router.get('/:id/sessions', requireAuth, async (req, res) => {
  try {
    const sessions = await prisma.userSession.findMany({
      where: { userId: req.params.id }
    });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

// DELETE forcefully terminate all user sessions
router.delete('/:id/sessions', requireAuth, async (req, res) => {
  try {
    await prisma.userSession.updateMany({
      where: { userId: req.params.id, status: 'Active' },
      data: { status: 'Terminated' }
    });
    res.json({ message: 'All sessions terminated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to terminate sessions' });
  }
});

export const usersRouter = router;
