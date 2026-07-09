import { Router } from 'react-router-dom';
import express from 'express';
import { PrismaClient } from '@prisma/client';
import { MonitoringEngine } from '../services/MonitoringEngine';

const router = express.Router();
const prisma = new PrismaClient();

// Get Live System Health
router.get('/health', async (req, res) => {
  const health = await MonitoringEngine.getHealthStatus();
  res.json(health);
});

// Get Server Metrics (Live & Historical)
router.get('/metrics/server', async (req, res) => {
  const live = MonitoringEngine.getSystemMetrics();
  const history = await prisma.serverMetrics.findMany({
    take: 50,
    orderBy: { timestamp: 'desc' }
  });
  res.json({ live, history: history.reverse() });
});

// Get Database Metrics
router.get('/metrics/database', async (req, res) => {
  const live = await MonitoringEngine.getDatabaseMetrics();
  const history = await prisma.databaseMetrics.findMany({
    take: 50,
    orderBy: { timestamp: 'desc' }
  });
  res.json({ live, history: history.reverse() });
});

// Get Queue Metrics (BullMQ)
router.get('/metrics/queues', async (req, res) => {
  // Mocked for now until Redis/BullMQ is fully connected
  res.json([
    { queueName: 'email-queue', activeJobs: 2, waitingJobs: 15, completedJobs: 1205, failedJobs: 3 },
    { queueName: 'report-queue', activeJobs: 1, waitingJobs: 5, completedJobs: 430, failedJobs: 0 },
    { queueName: 'webhook-queue', activeJobs: 0, waitingJobs: 0, completedJobs: 8900, failedJobs: 12 }
  ]);
});

// Get System Logs
router.get('/logs/system', async (req, res) => {
  const logs = await prisma.systemLog.findMany({
    take: 100,
    orderBy: { timestamp: 'desc' }
  });
  // If empty, return some mocks for UI demonstration
  if (logs.length === 0) {
    return res.json([
      { id: '1', timestamp: new Date(), level: 'INFO', service: 'ApiServer', message: 'Server started successfully' },
      { id: '2', timestamp: new Date(Date.now() - 60000), level: 'WARN', service: 'QueueWorker', message: 'High memory usage in worker process' },
      { id: '3', timestamp: new Date(Date.now() - 120000), level: 'ERROR', service: 'Database', message: 'Query timeout exceeded' },
    ]);
  }
  res.json(logs);
});

// Get API Logs
router.get('/logs/api', async (req, res) => {
  const logs = await prisma.apiLog.findMany({
    take: 100,
    orderBy: { timestamp: 'desc' }
  });
  if (logs.length === 0) {
    return res.json([
      { id: '1', timestamp: new Date(), method: 'GET', path: '/api/company', statusCode: 200, durationMs: 45, ipAddress: '192.168.1.1' },
      { id: '2', timestamp: new Date(), method: 'POST', path: '/api/auth/login', statusCode: 401, durationMs: 120, ipAddress: '10.0.0.5' },
    ]);
  }
  res.json(logs);
});

// Get Settings
router.get('/settings', async (req, res) => {
  const settings = await prisma.environmentSetting.findMany();
  res.json(settings);
});

// Save Settings
router.post('/settings', async (req, res) => {
  const { key, value, description } = req.body;
  const setting = await prisma.environmentSetting.upsert({
    where: { key },
    update: { value, description },
    create: { key, value, description }
  });
  res.json(setting);
});

export default router;
