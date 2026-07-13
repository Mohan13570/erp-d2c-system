import { Router } from 'express';
import { HRAttendanceEngine } from '../services/HRAttendanceEngine';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.post('/check-in', async (req, res) => {
  try {
    const result = await HRAttendanceEngine.gpsCheckIn(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.post('/overtime', async (req, res) => {
  try {
    const result = await HRAttendanceEngine.requestOvertime(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.get('/shifts', async (req, res) => {
  try {
    const shifts = await HRAttendanceEngine.getActiveShifts();
    res.json({ success: true, data: shifts });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/timesheet/:employeeId', async (req, res) => {
  try {
    const ts = await HRAttendanceEngine.getTimesheet(req.params.employeeId, 7, 2026);
    res.json({ success: true, data: ts });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
