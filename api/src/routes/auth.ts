import express from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const passwordHash = crypto.createHash('sha256').update(password).digest('hex');

    const user = await prisma.user.findUnique({ 
      where: { email },
      include: {
        mfas: true,
        userRoles: { include: { role: true } }
      }
    });

    if (!user || user.passwordHash !== passwordHash) {
      if (user) {
        await prisma.loginHistory.create({
          data: {
            userId: user.id,
            status: 'Failed',
            failureReason: 'Invalid Credentials',
            ipAddress: req.ip
          }
        });
      }
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (user.status === 'Locked' || user.status === 'Suspended') {
      return res.status(403).json({ error: `Account is ${user.status}` });
    }

    // Check MFA
    const mfa = user.mfas.find(m => m.isEnabled);
    if (mfa) {
      // In production, return an MFA token requiring the client to hit /verify-mfa
      return res.status(202).json({ message: 'MFA Required', mfaToken: 'temp_mfa_token' });
    }

    // Generate Tokens
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    
    // Log successful session
    await prisma.userSession.create({
      data: {
        userId: user.id,
        token: token,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        expiresAt: new Date(Date.now() + 60 * 60 * 1000)
      }
    });

    await prisma.loginHistory.create({
      data: { userId: user.id, status: 'Success', ipAddress: req.ip }
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    });

    res.json({ token, user: { id: user.id, email: user.email, roles: user.userRoles.map(ur => ur.role.name) } });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(400).json({ error: 'Invalid payload or server error' });
  }
});

// Logout endpoint
router.post('/logout', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    await prisma.userSession.updateMany({
      where: { token },
      data: { status: 'Terminated' }
    });
  }
  res.json({ message: 'Logged out successfully' });
});

export const authRouter = router;
