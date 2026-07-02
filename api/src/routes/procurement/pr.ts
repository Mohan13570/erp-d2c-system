import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all Purchase Requisitions
router.get('/', async (req, res) => {
  try {
    const prs = await prisma.purchaseRequisition.findMany({
      include: {
        items: { include: { item: true } }
      },
      orderBy: { requestDate: 'desc' }
    });
    res.json(prs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create PR
router.post('/', async (req, res) => {
  try {
    const { department, projectId, warehouseId, type, priority, costCenter, items, comments } = req.body;
    
    // Auto Generate PR Number
    const count = await prisma.purchaseRequisition.count();
    const prNumber = `PR-${new Date().getFullYear()}-${(count + 1).toString().padStart(5, '0')}`;

    const totalEstAmount = items.reduce((sum: number, i: any) => sum + (i.quantity * (i.estPrice || 0)), 0);

    const pr = await prisma.purchaseRequisition.create({
      data: {
        prNumber,
        department,
        projectId,
        warehouseId,
        type,
        priority,
        costCenter,
        totalEstAmount,
        comments,
        status: 'Submitted',
        items: {
          create: items.map((i: any) => ({
            itemCode: i.itemCode,
            description: i.description,
            quantity: i.quantity,
            uom: i.uom,
            estPrice: i.estPrice
          }))
        }
      },
      include: { items: true }
    });

    // Auto route to Approval Queue if over $5k
    if (totalEstAmount > 5000) {
      await prisma.approvalQueue.create({
        data: {
          entityType: 'PR_APPROVAL',
          entityId: pr.id,
          requestedBy: department || 'SYSTEM',
          status: 'Pending'
        }
      });
      await prisma.purchaseRequisition.update({ where: { id: pr.id }, data: { status: 'Pending_Approval' }});
    } else {
      await prisma.purchaseRequisition.update({ where: { id: pr.id }, data: { status: 'Approved' }});
    }

    res.status(201).json(pr);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get PR by ID
router.get('/:id', async (req, res) => {
  try {
    const pr = await prisma.purchaseRequisition.findUnique({
      where: { id: req.params.id },
      include: { items: { include: { item: true } } }
    });
    if (!pr) return res.status(404).json({ error: 'PR not found' });
    res.json(pr);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
