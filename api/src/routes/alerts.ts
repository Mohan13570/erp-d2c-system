import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get active alerts
router.get('/', async (req, res) => {
  try {
    const alerts = await prisma.trackingAlert.findMany({
      include: { vehicle: true, rule: true, escalations: true },
      orderBy: { timestamp: 'desc' },
      take: 50
    });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});

// Acknowledge/Resolve Alert
router.put('/:id/status', async (req, res) => {
  try {
    const alert = await prisma.trackingAlert.update({
      where: { id: req.params.id },
      data: { status: req.body.status }
    });
    res.json(alert);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update alert status' });
  }
});

// Get Alert Rules
router.get('/rules', async (req, res) => {
  try {
    const rules = await prisma.alertRule.findMany();
    res.json(rules);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch rules' });
  }
});

// Create Alert Rule
router.post('/rules', async (req, res) => {
  try {
    const rule = await prisma.alertRule.create({
      data: {
        name: req.body.name,
        eventType: req.body.eventType,
        condition: req.body.condition,
        threshold: req.body.threshold,
        escalationType: req.body.escalationType,
        contactIds: JSON.stringify(req.body.contactIds || [])
      }
    });
    res.status(201).json(rule);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
