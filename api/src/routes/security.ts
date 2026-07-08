import express from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// GET Global Security Metrics for Dashboard
router.get('/dashboard', requireAuth, async (req, res) => {
  try {
    const [
      activeSessions,
      lockedUsers,
      failedLogins,
      mfaUsers
    ] = await Promise.all([
      prisma.userSession.count({ where: { status: 'Active' } }),
      prisma.user.count({ where: { status: 'Locked' } }),
      prisma.loginHistory.count({ where: { status: 'Failed', loginAt: { gte: new Date(Date.now() - 24*60*60*1000) } } }),
      prisma.mFA.count({ where: { isEnabled: true } })
    ]);

    const alerts = await prisma.securityAlert.findMany({
      where: { isResolved: false },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    res.json({
      metrics: { activeSessions, lockedUsers, failedLogins24h: failedLogins, mfaEnabledUsers: mfaUsers },
      recentAlerts: alerts
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch security metrics' });
  }
});

// GET Audit Logs
router.get('/audit', requireAuth, async (req, res) => {
  try {
    const logs = await prisma.auditLog.findMany({
      include: { user: { select: { email: true, firstName: true } } },
      orderBy: { createdAt: 'desc' },
      take: 100
    });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
});

// GET Global Security Policy
router.get('/policy', requireAuth, async (req, res) => {
  try {
    let policy = await prisma.securityPolicy.findFirst({ where: { userId: null } });
    if (!policy) {
      policy = await prisma.securityPolicy.create({ data: {} });
    }
    res.json(policy);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch security policy' });
  }
});

export const securityRouter = router;
