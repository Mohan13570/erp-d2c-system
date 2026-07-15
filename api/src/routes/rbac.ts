import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, checkPermission, AuthRequest } from '../middleware/auth';
import { logAudit } from '../utils/audit';

const router = Router();
const prisma = new PrismaClient();

// GET users, roles, audit logs
router.get('/users', authenticateToken, checkPermission('Auth & RBAC'), async (req: AuthRequest, res: Response) => {
  try {
    const users = await prisma.user.findMany({ include: { role: true } });
    const roles = await prisma.role.findMany({ include: { permissions: true } });
    
    const logPage = parseInt(req.query.logPage as string) || 1;
    const logLimit = parseInt(req.query.logLimit as string) || 10;
    const skip = (logPage - 1) * logLimit;
    const logSearch = req.query.logSearch as string;
    const logTable = req.query.logTable as string;

    const logsWhere: any = {};
    if (logTable && logTable !== 'All') {
      logsWhere.tableName = logTable;
    }
    if (logSearch) {
      logsWhere.OR = [
        { tableName: { contains: logSearch } },
        { action: { contains: logSearch } },
        { recordId: { contains: logSearch } },
        { oldValue: { contains: logSearch } },
        { newValue: { contains: logSearch } },
        { user: { email: { contains: logSearch } } }
      ];
    }

    const [logs, totalLogs] = await Promise.all([
      prisma.auditLog.findMany({
        where: logsWhere,
        include: { user: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: logLimit
      }),
      prisma.auditLog.count({ where: logsWhere })
    ]);
    
    // Enrich logs with D2C Customer data
    const d2cCustomerIds = logs.filter(l => l.tableName === 'D2CCustomer' && l.action === 'Login').map(l => l.recordId);
    let d2cCustomers: any[] = [];
    if (d2cCustomerIds.length > 0) {
       d2cCustomers = await prisma.d2CCustomer.findMany({ where: { id: { in: d2cCustomerIds } } });
    }
    
    const enrichedLogs = logs.map(l => {
       if (l.tableName === 'D2CCustomer') {
          const customer = d2cCustomers.find(c => c.id === l.recordId);
          return { ...l, d2cCustomer: customer };
       }
       return l;
    });

    res.json({
      users,
      roles,
      logs: enrichedLogs,
      logsPagination: {
        total: totalLogs,
        page: logPage,
        limit: logLimit,
        totalPages: Math.ceil(totalLogs / logLimit)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch RBAC data' });
  }
});

import bcrypt from 'bcryptjs';

// CREATE Employee
router.post('/users', authenticateToken, checkPermission('Auth & RBAC'), async (req: AuthRequest, res: Response) => {
  try {
    const { email, password, firstName, lastName, roleId } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, passwordHash, firstName, lastName, roleId }
    });

    // Audit Log
    await logAudit(
      req.user?.id || null,
      'CREATE',
      'User',
      user.id,
      null,
      { email, firstName, lastName, roleId },
      req.ip || req.socket.remoteAddress
    );

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// UPDATE Employee Role
router.put('/users/:id/role', authenticateToken, checkPermission('Auth & RBAC'), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { roleId } = req.body;
    
    const oldUser = await prisma.user.findUnique({ where: { id: id as string } });
    if (!oldUser) return res.status(404).json({ error: 'User not found' });

    const user = await prisma.user.update({
      where: { id: id as string },
      data: { roleId: roleId as string }
    });

    // Audit Log
    await logAudit(
      req.user?.id || null,
      'UPDATE',
      'User',
      user.id,
      oldUser,
      user,
      req.ip || req.socket.remoteAddress
    );

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user role' });
  }
});

// DELETE Employee
router.delete('/users/:id', authenticateToken, checkPermission('Auth & RBAC'), async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    // Prevent deleting the main admin
    const user = await prisma.user.findUnique({ where: { id: id as string } });
    if (user?.email === 'admin@aura.com') {
      return res.status(403).json({ error: 'Cannot delete the system admin account' });
    }
    
    if (!user) return res.status(404).json({ error: 'User not found' });

    await prisma.user.delete({ where: { id: id as string } });

    // Audit Log
    await logAudit(
      req.user?.id || null,
      'DELETE',
      'User',
      id,
      user,
      null,
      req.ip || req.socket.remoteAddress
    );

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// CREATE Role & Policies
router.post('/roles', authenticateToken, checkPermission('Auth & RBAC'), async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, policies } = req.body;
    const role = await prisma.role.create({
      data: {
        name,
        description,
        permissions: {
          create: policies.map((p: any) => ({ module: p.module, action: p.action }))
        }
      },
      include: { permissions: true }
    });

    // Audit Log
    await logAudit(
      req.user?.id || null,
      'CREATE',
      'Role',
      role.id,
      null,
      role,
      req.ip || req.socket.remoteAddress
    );

    res.status(201).json(role);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create role' });
  }
});

// DELETE Role
router.delete('/roles/:id', authenticateToken, checkPermission('Auth & RBAC'), async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const role = await prisma.role.findUnique({ where: { id: id as string }, include: { permissions: true } });
    if (role?.isSystem) {
      return res.status(403).json({ error: 'Cannot delete system roles' });
    }
    
    if (!role) return res.status(404).json({ error: 'Role not found' });
    
    // Delete permissions first
    await prisma.permission.deleteMany({ where: { roleId: id as string } });
    // Clear user role references
    await prisma.user.updateMany({ where: { roleId: id as string }, data: { roleId: null } });
    
    await prisma.role.delete({ where: { id: id as string } });

    // Audit Log
    await logAudit(
      req.user?.id || null,
      'DELETE',
      'Role',
      id,
      role,
      null,
      req.ip || req.socket.remoteAddress
    );

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete role' });
  }
});

// UPDATE Role Policies
router.put('/roles/:id/permissions', authenticateToken, checkPermission('Auth & RBAC'), async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const { policies } = req.body;
    
    // Prevent modifying System Admin
    const role = await prisma.role.findUnique({ where: { id: id as string }, include: { permissions: true } });
    if (!role) return res.status(404).json({ error: 'Role not found' });
    if (role?.name === 'System Admin') {
      return res.status(403).json({ error: 'Cannot modify System Admin policies' });
    }

    // Delete existing permissions and recreate
    await prisma.permission.deleteMany({ where: { roleId: id as string } });
    
    if (policies && policies.length > 0) {
      await prisma.permission.createMany({
        data: policies.map((p: any) => ({
          roleId: id as string,
          module: p.module,
          action: p.action || 'All'
        }))
      });
    }
    
    const updatedRole = await prisma.role.findUnique({ where: { id: id as string }, include: { permissions: true } });

    // Audit Log
    await logAudit(
      req.user?.id || null,
      'UPDATE',
      'Role',
      id,
      role,
      updatedRole,
      req.ip || req.socket.remoteAddress
    );

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update policies' });
  }
});

export default router;
