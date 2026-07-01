import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.post('/', async (req, res) => {
  try {
    const { stopId, type, payloadUrl, remarks, status } = req.body;
    
    const pod = await prisma.roadProofOfDelivery.create({
      data: { stopId, type, payloadUrl, remarks, status }
    });

    // Automatically mark the stop as Completed if POD is accepted
    if (status === 'ACCEPTED') {
      await prisma.roadTripStop.update({
        where: { id: stopId },
        data: { status: 'Completed' }
      });
    }

    res.json(pod);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to upload POD' });
  }
});

router.get('/:stopId', async (req, res) => {
  try {
    const pods = await prisma.roadProofOfDelivery.findMany({
      where: { stopId: req.params.stopId, isDeleted: false }
    });
    res.json(pods);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch PODs' });
  }
});

export default router;
