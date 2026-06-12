import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// GET users, roles, audit logs
router.get('/users', async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({ include: { role: true } });
    const roles = await prisma.role.findMany({ include: { permissions: true } });
    const logs = await prisma.auditLog.findMany({ 
      include: { user: true },
      orderBy: { createdAt: 'desc' },
      take: 100
    });
    
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

    res.json({ users, roles, logs: enrichedLogs });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch RBAC data' });
  }
});

import bcrypt from 'bcryptjs';

// CREATE Employee
router.post('/users', async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName, roleId } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, passwordHash, firstName, lastName, roleId }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// UPDATE Employee Role
router.put('/users/:id/role', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { roleId } = req.body;
    const user = await prisma.user.update({
      where: { id: id as string },
      data: { roleId: roleId as string }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user role' });
  }
});

// DELETE Employee
router.delete('/users/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  // Prevent deleting the main admin
  const user = await prisma.user.findUnique({ where: { id: id as string } });
  if (user?.email === 'admin@aura.com') {
    return res.status(403).json({ error: 'Cannot delete the system admin account' });
  }
  
  await prisma.user.delete({ where: { id: id as string } });
  res.json({ success: true });
});

// CREATE Role & Policies
router.post('/roles', async (req: Request, res: Response) => {
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
    res.status(201).json(role);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create role' });
  }
});

// DELETE Role
router.delete('/roles/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const role = await prisma.role.findUnique({ where: { id: id as string } });
    if (role?.isSystem) {
      return res.status(403).json({ error: 'Cannot delete system roles' });
    }
    
    // Delete permissions first
    await prisma.permission.deleteMany({ where: { roleId: id as string } });
    // Clear user role references
    await prisma.user.updateMany({ where: { roleId: id as string }, data: { roleId: null } });
    
    await prisma.role.delete({ where: { id: id as string } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete role' });
  }
});

// UPDATE Role Policies
router.put('/roles/:id/permissions', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { policies } = req.body;
    
    // Prevent modifying System Admin
    const role = await prisma.role.findUnique({ where: { id: id as string } });
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
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update policies' });
  }
});

export default router;
