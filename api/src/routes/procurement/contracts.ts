import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Contracts Endpoints

router.get('/', async (req, res) => {
  try {
    const contracts = await prisma.vendorContract.findMany({
      include: {
        vendor: true,
        _count: { select: { versions: true } }
      },
      orderBy: { endDate: 'asc' }
    });
    res.json(contracts);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const contract = await prisma.vendorContract.create({
      data: req.body
    });
    res.status(201).json(contract);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const contract = await prisma.vendorContract.findUnique({
      where: { id: req.params.id },
      include: { vendor: true, versions: { orderBy: { versionNum: 'desc' } } }
    });
    if (!contract) return res.status(404).json({ error: 'Contract not found' });
    res.json(contract);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
