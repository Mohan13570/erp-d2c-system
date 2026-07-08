import express from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// GET entire organization hierarchy tree
router.get('/tree', requireAuth, async (req, res) => {
  try {
    // In a production environment, this would be a recursive CTE or we fetch all and build the tree in-memory
    const allNodes = await prisma.organizationHierarchy.findMany({
      include: {
        children: true
      }
    });

    // Build hierarchical tree mapping
    const map = new Map();
    const roots: any[] = [];

    allNodes.forEach(node => {
      map.set(node.id, { ...node, children: [] });
    });

    allNodes.forEach(node => {
      if (node.parentId) {
        const parent = map.get(node.parentId);
        if (parent) {
          parent.children.push(map.get(node.id));
        }
      } else {
        roots.push(map.get(node.id));
      }
    });

    res.json(roots);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch organization hierarchy' });
  }
});

// GET branches list
router.get('/branches', requireAuth, async (req, res) => {
  try {
    const branches = await prisma.branch.findMany({
      include: {
        departments: true,
        costCenters: true
      }
    });
    res.json(branches);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch branches' });
  }
});

// GET departments list
router.get('/departments', requireAuth, async (req, res) => {
  try {
    const departments = await prisma.department.findMany({
      include: {
        subDepartments: true,
        employees: true
      }
    });
    res.json(departments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch departments' });
  }
});

// POST generate new org node
router.post('/node', requireAuth, async (req, res) => {
  try {
    const { nodeName, nodeType, companyId, parentId } = req.body;
    const node = await prisma.organizationHierarchy.create({
      data: { nodeName, nodeType, companyId, parentId }
    });
    res.status(201).json(node);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create organization node' });
  }
});

export const organizationRouter = router;
