import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Simulated AI endpoints using mocked logic based on DB data
router.post('/query', async (req, res) => {
  try {
    const { query } = req.body;
    let response = "I am an AI. I have analyzed your request.";
    let module = "General";

    if (query.toLowerCase().includes('shipment')) {
      const count = await prisma.shipment.count({ where: { status: { not: 'Delivered' } }});
      response = `There are currently ${count} active shipments in transit. No major delays are detected on current routes.`;
      module = "Shipments";
    } else if (query.toLowerCase().includes('forecast') || query.toLowerCase().includes('revenue')) {
      response = "Based on the past 6 months of invoice data, Q3 revenue is projected to grow by 14.5%, reaching approximately $220,000.";
      module = "Forecasting";
    } else if (query.toLowerCase().includes('route')) {
      response = "The optimal route for Vehicle V-102 avoids I-95 due to construction, saving an estimated 42 minutes.";
      module = "Routing";
    } else {
      response = "I can help you analyze shipments, forecast revenue, and optimize your supply chain routes. How can I assist?";
    }

    const log = await prisma.aIQueryLog.create({
      data: { query, response, module }
    });

    res.json(log);
  } catch (err) { res.status(500).json({ error: 'Failed to process AI query' }); }
});

router.get('/logs', async (req, res) => {
  try {
    res.json(await prisma.aIQueryLog.findMany({ orderBy: { timestamp: 'desc' }, take: 20 }));
  } catch (error) { res.status(500).json({ error: 'Failed' }); }
});

export default router;
