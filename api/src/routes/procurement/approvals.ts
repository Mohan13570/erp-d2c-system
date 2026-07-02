import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Approval Queue Endpoints

router.get('/', async (req, res) => {
  try {
    const queue = await prisma.approvalQueue.findMany({
      include: {
        logs: { orderBy: { actionDate: 'desc' } }
      },
      orderBy: { requestDate: 'desc' }
    });
    res.json(queue);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:id/approve', async (req, res) => {
  try {
    const { approverId, comments } = req.body;
    
    // Log the approval action
    await prisma.approvalLog.create({
      data: {
        queueId: req.params.id,
        approverId: approverId || 'SYSTEM_MANAGER',
        action: 'Approved',
        comments
      }
    });
    
    // Check if next level is required based on rules, for now we auto-approve
    const queue = await prisma.approvalQueue.update({
      where: { id: req.params.id },
      data: { status: 'Approved' }
    });
    
    res.json(queue);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:id/reject', async (req, res) => {
  try {
    const { approverId, comments } = req.body;
    
    await prisma.approvalLog.create({
      data: {
        queueId: req.params.id,
        approverId: approverId || 'SYSTEM_MANAGER',
        action: 'Rejected',
        comments
      }
    });
    
    const queue = await prisma.approvalQueue.update({
      where: { id: req.params.id },
      data: { status: 'Rejected' }
    });
    
    res.json(queue);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
