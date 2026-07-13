import { Router } from 'express';
import { CustomerSupportEngine } from '../services/CustomerSupportEngine';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

const MOCK_CUSTOMER_ID = 'CUST-1001';

router.post('/tickets', async (req, res) => {
  try {
    const ticket = await CustomerSupportEngine.createTicket({
      customerId: MOCK_CUSTOMER_ID,
      ...req.body
    });
    res.status(201).json({ success: true, data: ticket });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/tickets', async (req, res) => {
  try {
    const tickets = await prisma.supportTicket.findMany({
      where: { customerId: MOCK_CUSTOMER_ID },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: tickets });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/analytics', async (req, res) => {
  try {
    const analytics = await CustomerSupportEngine.computeAnalytics(MOCK_CUSTOMER_ID);
    res.json({ success: true, data: analytics });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/ai/chat', async (req, res) => {
  try {
    const { prompt } = req.body;
    const response = await CustomerSupportEngine.processAIQuery(MOCK_CUSTOMER_ID, prompt);
    res.json({ success: true, data: { response } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
