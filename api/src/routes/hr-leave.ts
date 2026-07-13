import { Router } from 'express';
import { HRLeaveEngine } from '../services/HRLeaveEngine';
import { PrismaClient } from '@prisma/client';

const router = Router();

router.post('/apply', async (req, res) => {
  try {
    const result = await HRLeaveEngine.applyLeave(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.get('/balance/:employeeId', async (req, res) => {
  try {
    const result = await HRLeaveEngine.getLeaveBalances(req.params.employeeId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/holidays', async (req, res) => {
  try {
    const result = await HRLeaveEngine.getHolidays();
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/workforce-plan', async (req, res) => {
  try {
    const { departmentId, date } = req.body;
    const result = await HRLeaveEngine.predictWorkforceCapacity(departmentId, date);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
