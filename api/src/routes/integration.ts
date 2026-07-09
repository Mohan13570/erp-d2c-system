import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { AIEngine } from '../services/AIEngine';

const router = Router();
const prisma = new PrismaClient();

// ==========================================
// AI PLATFORM ENDPOINTS
// ==========================================

router.get('/ai/providers', async (req, res) => {
  try {
    const providers = await prisma.aIProvider.findMany({ include: { models: true }});
    res.json(providers);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/ai/query', async (req, res) => {
  try {
    const { prompt, model } = req.body;
    const result = await AIEngine.query(prompt, model || 'gemini-1.5-pro', req.user?.id);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/ai/logs', async (req, res) => {
  try {
    const logs = await prisma.aIRequest.findMany({
      orderBy: { timestamp: 'desc' },
      take: 50,
      include: { provider: true, model: true }
    });
    res.json(logs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// API GATEWAY & WEBHOOK ENDPOINTS
// ==========================================

router.get('/webhooks', async (req, res) => {
  try {
    const webhooks = await prisma.webhook.findMany();
    res.json(webhooks);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/webhooks/logs', async (req, res) => {
  try {
    const logs = await prisma.webhookHistory.findMany({
      orderBy: { timestamp: 'desc' },
      take: 50,
      include: { webhook: true }
    });
    res.json(logs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/gateways', async (req, res) => {
  try {
    // Return mocked API Gateway registered routes for now
    res.json([
      { id: '1', name: 'ERP Core API', version: 'v1', status: 'Active', rateLimit: 1000 },
      { id: '2', name: 'Logistics API', version: 'v2', status: 'Active', rateLimit: 5000 },
      { id: '3', name: 'Finance API', version: 'v1', status: 'Maintenance', rateLimit: 500 }
    ]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// AUDIT CENTER
// ==========================================

router.get('/audit', async (req, res) => {
  try {
    // Combine ActivityLog and SystemLog for a unified Audit feed
    const activities = await prisma.activityLog.findMany({ orderBy: { timestamp: 'desc' }, take: 25 });
    const system = await prisma.systemLog.findMany({ orderBy: { timestamp: 'desc' }, take: 25 });
    
    const combined = [...activities, ...system].sort((a: any, b: any) => b.timestamp.getTime() - a.timestamp.getTime());
    res.json(combined);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
