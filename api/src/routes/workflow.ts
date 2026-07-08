import express from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// GET all workflows
router.get('/', requireAuth, async (req, res) => {
  try {
    const workflows = await prisma.workflow.findMany({
      include: {
        versions: {
          orderBy: { version: 'desc' },
          take: 1
        },
        _count: { select: { executions: true } }
      }
    });
    res.json(workflows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch workflows' });
  }
});

// POST save workflow definition (from ReactFlow JSON)
router.post('/', requireAuth, async (req, res) => {
  try {
    const { name, category, description, nodes, edges } = req.body;
    
    // Create new workflow & v1 version
    const workflow = await prisma.workflow.create({
      data: {
        name,
        category,
        description,
        versions: {
          create: {
            version: 1,
            status: 'Published',
            nodes: {
              create: nodes.map((n: any) => ({
                id: n.id,
                type: n.type,
                label: n.data?.label || 'Node',
                positionX: n.position?.x || 0,
                positionY: n.position?.y || 0,
                config: JSON.stringify(n.data || {})
              }))
            },
            edges: {
              create: edges.map((e: any) => ({
                id: e.id,
                sourceId: e.source,
                targetId: e.target,
                label: e.label || '',
                condition: JSON.stringify(e.data || {})
              }))
            }
          }
        }
      },
      include: { versions: { include: { nodes: true, edges: true } } }
    });
    
    res.status(201).json(workflow);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Failed to create workflow' });
  }
});

// GET specific workflow layout
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const workflow = await prisma.workflow.findUnique({
      where: { id: req.params.id },
      include: {
        versions: {
          orderBy: { version: 'desc' },
          take: 1,
          include: { nodes: true, edges: true }
        }
      }
    });
    res.json(workflow);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch workflow' });
  }
});

export const workflowRouter = router;
