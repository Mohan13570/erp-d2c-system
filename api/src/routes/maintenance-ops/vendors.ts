import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get Service Vendors
router.get('/', async (req, res) => {
  try {
    const vendors = await prisma.roadServiceVendor.findMany({
      where: { isDeleted: false },
      orderBy: { rating: 'desc' }
    });
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch vendors' });
  }
});

export default router;
