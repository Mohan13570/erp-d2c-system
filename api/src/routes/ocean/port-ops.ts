import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get Yard Locations
router.get('/yard', async (req, res) => {
  try {
    const locations = await prisma.yardLocation.findMany({
      where: { isDeleted: false },
      include: { port: true, assets: true }
    });
    res.json(locations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch yard locations' });
  }
});

// Create Port Operation (Berth Call)
router.post('/calls', async (req, res) => {
  try {
    const call = await prisma.portOperationCall.create({
      data: req.body
    });
    res.status(201).json(call);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Get Port Operations
router.get('/calls', async (req, res) => {
  try {
    const calls = await prisma.portOperationCall.findMany({
      where: { isDeleted: false },
      include: { port: true, vessel: true, voyage: true, terminal: true, berth: true },
      orderBy: { eta: 'asc' }
    });
    res.json(calls);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch port calls' });
  }
});

export default router;
