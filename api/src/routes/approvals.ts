import express from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// GET all pending approvals
router.get('/pending', requireAuth, async (req, res) => {
  try {
    const approvals = await prisma.approval.findMany({
      where: { status: 'Pending' },
      include: {
        steps: { where: { status: 'Pending' } },
        execution: { include: { workflow: true } }
      }
    });
    res.json(approvals);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch pending approvals' });
  }
});

// POST submit approval decision
router.post('/:id/decide', requireAuth, async (req, res) => {
  try {
    const { action, comments, stepId, actorId } = req.body;
    // action: 'Approved' | 'Rejected' | 'Delegated'
    
    await prisma.$transaction(async (tx) => {
      // 1. Update step status
      await tx.approvalStep.update({
        where: { id: stepId },
        data: { status: action, comments, actedAt: new Date() }
      });
      
      // 2. Add history log
      await tx.approvalHistory.create({
        data: {
          approvalId: req.params.id,
          action,
          actorId,
          comments
        }
      });
      
      // 3. Update main approval status
      await tx.approval.update({
        where: { id: req.params.id },
        data: { status: action === 'Approved' ? 'Approved' : 'Rejected' } // Simplified for MVP
      });
    });

    res.json({ message: 'Approval processed successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to process approval decision' });
  }
});

export const approvalsRouter = router;
