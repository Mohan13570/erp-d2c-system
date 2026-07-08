import express from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// GET all assigned tasks
router.get('/', requireAuth, async (req, res) => {
  try {
    const tasks = await prisma.workflowTask.findMany({
      include: {
        assignments: true,
        comments: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// PATCH update task status
router.patch('/:id/status', requireAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const task = await prisma.workflowTask.update({
      where: { id: req.params.id },
      data: { status }
    });
    res.json(task);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update task' });
  }
});

export const tasksRouter = router;
