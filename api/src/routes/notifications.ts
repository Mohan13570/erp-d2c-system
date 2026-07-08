import express from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// GET all active notifications for the current user (In-App)
router.get('/my', requireAuth, async (req, res) => {
  try {
    const userId = (req as any).user?.id || 'unknown';
    const notifications = await prisma.notificationRecipient.findMany({
      where: { userId },
      include: { notification: { include: { category: true } } },
      orderBy: { notification: { createdAt: 'desc' } },
      take: 50
    });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user notifications' });
  }
});

// GET Notification Dashboard Metrics
router.get('/dashboard', requireAuth, async (req, res) => {
  try {
    const [
      sentCount,
      failedCount,
      queuedCount
    ] = await Promise.all([
      prisma.notificationDelivery.count({ where: { status: 'Delivered' } }),
      prisma.notificationDelivery.count({ where: { status: 'Failed' } }),
      prisma.notification.count({ where: { status: 'Pending' } })
    ]);

    const recentLogs = await prisma.notificationDelivery.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: { notification: true }
    });

    res.json({
      metrics: { sentCount, failedCount, queuedCount, successRate: sentCount / (sentCount + failedCount || 1) * 100 },
      recentLogs
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notification metrics' });
  }
});

// POST Manual Dispatch (simulates triggering BullMQ)
router.post('/dispatch', requireAuth, async (req, res) => {
  try {
    const { title, message, channel, targetIds } = req.body;
    
    // Create the central notification record
    const notification = await prisma.notification.create({
      data: {
        title,
        message,
        status: 'Sent',
        recipients: {
          create: targetIds.map((id: string) => ({ userId: id }))
        }
      }
    });

    // In a real environment, we'd drop this into BullMQ:
    // await notificationQueue.add('dispatch', { notificationId: notification.id, channel });

    // Mock Delivery Logs
    await prisma.notificationDelivery.create({
      data: {
        notificationId: notification.id,
        channel,
        status: 'Delivered',
        deliveredAt: new Date()
      }
    });

    res.status(201).json({ message: 'Notification queued for delivery', id: notification.id });
  } catch (error) {
    res.status(400).json({ error: 'Dispatch failed' });
  }
});

export const notificationsRouter = router;
