import express from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// GET all Roles
router.get('/roles', requireAuth, async (req, res) => {
  try {
    const roles = await prisma.role.findMany({
      include: {
        permissions: { include: { permission: true } },
        _count: { select: { userRoles: true } }
      }
    });
    res.json(roles);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch roles' });
  }
});

// POST Create Role
router.post('/roles', requireAuth, async (req, res) => {
  try {
    const { name, description, category, permissionIds } = req.body;
    
    const role = await prisma.role.create({
      data: { name, description, category }
    });

    if (permissionIds && permissionIds.length > 0) {
      await prisma.rolePermission.createMany({
        data: permissionIds.map((pid: string) => ({
          roleId: role.id,
          permissionId: pid
        }))
      });
    }

    res.status(201).json(role);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create role' });
  }
});

// GET Permission Matrix
router.get('/permissions/matrix', requireAuth, async (req, res) => {
  try {
    const categories = await prisma.permissionCategory.findMany({
      include: {
        permissions: {
          include: { roles: { include: { role: true } } }
        }
      }
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate permission matrix' });
  }
});

// POST Assign Role to User
router.post('/assign', requireAuth, async (req, res) => {
  try {
    const { userId, roleId, entityType, entityId } = req.body;
    const assignment = await prisma.userRole.create({
      data: { userId, roleId, entityType, entityId }
    });
    res.json(assignment);
  } catch (error) {
    res.status(400).json({ error: 'Role assignment failed' });
  }
});

export const rbacRouter = router;
