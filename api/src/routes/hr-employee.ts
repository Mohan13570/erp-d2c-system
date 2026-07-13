import { Router } from 'express';
import { HREmployeeEngine } from '../services/HREmployeeEngine';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.post('/register', async (req, res) => {
  try {
    const employee = await HREmployeeEngine.registerEmployee(req.body);
    res.status(201).json({ success: true, data: employee });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.get('/directory', async (req, res) => {
  try {
    const directory = await HREmployeeEngine.getDirectory();
    res.json({ success: true, data: directory });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/org-chart', async (req, res) => {
  try {
    const chart = await HREmployeeEngine.getOrganizationChart();
    res.json({ success: true, data: chart });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
