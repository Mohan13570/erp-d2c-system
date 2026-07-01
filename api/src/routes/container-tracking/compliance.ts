import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get Compliance
router.get('/', async (req, res) => {
  try {
    const compliance = await prisma.containerCompliance.findMany({
      where: { isDeleted: false },
      include: { container: true },
      orderBy: { expiryDate: 'asc' }
    });
    res.json(compliance);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch compliance' });
  }
});

// Add Compliance Certificate
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    const cert = await prisma.containerCompliance.create({ data });
    res.json(cert);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add compliance' });
  }
});

export default router;
