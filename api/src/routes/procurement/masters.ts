import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Masters (Categories, Types, Groups, Approval Rules)
router.get('/categories', async (req, res) => {
  try {
    const categories = await prisma.vendorCategory.findMany();
    res.json(categories);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/categories', async (req, res) => {
  try {
    const category = await prisma.vendorCategory.create({ data: req.body });
    res.status(201).json(category);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/groups', async (req, res) => {
  try {
    const groups = await prisma.vendorGroup.findMany();
    res.json(groups);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/groups', async (req, res) => {
  try {
    const group = await prisma.vendorGroup.create({ data: req.body });
    res.status(201).json(group);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/types', async (req, res) => {
  try {
    const types = await prisma.vendorType.findMany();
    res.json(types);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
