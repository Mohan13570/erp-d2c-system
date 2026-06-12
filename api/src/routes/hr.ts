import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/employees', async (req: Request, res: Response) => {
  try {
    const employees = await prisma.employee.findMany();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

router.post('/employees', async (req: Request, res: Response) => {
  try {
    const employee = await prisma.employee.create({ data: req.body });
    res.status(201).json(employee);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create employee' });
  }
});

router.delete('/employees/:id', async (req: Request, res: Response) => {
  try {
    await prisma.employee.delete({ where: { employee: req.params.id as string } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete employee' });
  }
});

// Payroll
router.get('/payroll', async (_req: Request, res: Response) => {
  const payrolls = await prisma.payrollRun.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(payrolls);
});

router.post('/payroll', async (req: Request, res: Response) => {
  try {
    const payroll = await prisma.payrollRun.create({ data: req.body });
    res.status(201).json(payroll);
  } catch (error) {
    res.status(500).json({ error: 'Failed to run payroll' });
  }
});

// Attendance
router.get('/attendance', async (_req: Request, res: Response) => {
  const attendance = await prisma.attendanceLog.findMany({ include: { employee: true }, orderBy: { date: 'desc' } });
  res.json(attendance);
});

router.post('/attendance', async (req: Request, res: Response) => {
  try {
    const log = await prisma.attendanceLog.create({ 
      data: {
        ...req.body,
        date: new Date(req.body.date)
      } 
    });
    res.status(201).json(log);
  } catch (error) {
    res.status(500).json({ error: 'Failed to log attendance' });
  }
});

export default router;
