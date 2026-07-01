import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  try {
    const claims = await prisma.roadClaim.findMany({
      where: { isDeleted: false },
      include: { booking: true },
      orderBy: { timestamp: 'desc' }
    });
    res.json(claims);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch claims' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { bookingId, type, description, claimAmount, currency } = req.body;
    const claim = await prisma.roadClaim.create({
      data: { bookingId, type, description, claimAmount: parseFloat(claimAmount), currency }
    });
    res.json(claim);
  } catch (error) {
    res.status(500).json({ error: 'Failed to log claim' });
  }
});

router.put('/:id/status', async (req, res) => {
  try {
    const { status, approvedAmount } = req.body;
    const claim = await prisma.roadClaim.update({
      where: { id: req.params.id },
      data: { status, approvedAmount: approvedAmount ? parseFloat(approvedAmount) : undefined }
    });
    res.json(claim);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update claim' });
  }
});

export default router;
