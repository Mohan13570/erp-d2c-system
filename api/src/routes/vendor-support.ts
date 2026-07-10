import { Router } from 'express';
import { VendorSupportEngine } from '../services/VendorSupportEngine';
import { VendorChatEngine } from '../services/VendorChatEngine';
import { VendorAnalyticsEngine } from '../services/VendorAnalyticsEngine';

const router = Router();
const mockVendorId = "mock-vendor-id"; // production: derived from JWT

// --- Support Ticketing ---
router.post('/tickets', async (req, res) => {
  try {
    const ticket = await VendorSupportEngine.createTicket(mockVendorId, req.body);
    res.json(ticket);
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

router.get('/tickets', async (req, res) => {
  try {
    const tickets = await VendorSupportEngine.getTickets(mockVendorId);
    res.json(tickets);
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

// --- Chat ---
router.post('/chat', async (req, res) => {
  try {
    const msg = await VendorChatEngine.sendMessage(mockVendorId, req.body.sender, req.body.message);
    res.json(msg);
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

router.get('/chat', async (req, res) => {
  try {
    const history = await VendorChatEngine.getHistory(mockVendorId);
    res.json(history);
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

// --- Analytics & KB ---
router.get('/performance', async (req, res) => {
  try {
    const data = await VendorAnalyticsEngine.getPerformanceMetrics(mockVendorId);
    res.json(data);
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

router.get('/knowledge-base', async (req, res) => {
  try {
    const kb = await VendorAnalyticsEngine.getKnowledgeBase();
    res.json(kb);
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

export default router;
