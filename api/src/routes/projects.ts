import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/projects', async (_req: Request, res: Response) => {
  const projects = await prisma.project.findMany({ include: { tasks: true } });
  res.json(projects);
});
router.get('/projects/:id/tasks', async (req: Request, res: Response) => {
  const tasks = await prisma.task.findMany({ where: { projectId: req.params.id as string } });
  res.json(tasks);
});
router.post('/projects', async (req: Request, res: Response) => {
  try {
    const { name, status, budget, startDate, endDate } = req.body;
    const project = await prisma.project.create({ 
      data: {
        name,
        status: status || 'Open',
        budget: Number(budget),
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined
      }
    });
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create project' });
  }
});
router.post('/projects/:id/tasks', async (req: Request, res: Response) => {
  try {
    const { subject, priority, assignedTo, dueDate } = req.body;
    const task = await prisma.task.create({
      data: {
        projectId: req.params.id as string,
        subject,
        priority: priority || 'Medium',
        assignedTo,
        dueDate: dueDate ? new Date(dueDate) : undefined
      }
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' });
  }
});

export default router;
