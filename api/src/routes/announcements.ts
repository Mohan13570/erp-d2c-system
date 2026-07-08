import express from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// GET all active announcements
router.get('/', requireAuth, async (req, res) => {
  try {
    const announcements = await prisma.announcement.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20
    });
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch announcements' });
  }
});

// POST new announcement
router.post('/', requireAuth, async (req, res) => {
  try {
    const { title, content, type, targetAudience, isPinned, validUntil } = req.body;
    const authorId = (req as any).user?.id || 'system';

    const announcement = await prisma.announcement.create({
      data: {
        title,
        content,
        type,
        targetAudience,
        isPinned,
        validUntil: validUntil ? new Date(validUntil) : null,
        authorId
      }
    });
    res.status(201).json(announcement);
  } catch (error) {
    res.status(400).json({ error: 'Failed to broadcast announcement' });
  }
});

export const announcementsRouter = router;
