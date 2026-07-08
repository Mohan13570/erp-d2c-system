import express from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Allowed entities for the universal router to prevent arbitrary table access
const ALLOWED_ENTITIES = [
  'country', 'state', 'city', 'port', 'currency', 'incoterm',
  'cargoType', 'containerType', 'hSCode'
];

// Helper to get the correct Prisma delegate
const getDelegate = (entity: string) => {
  if (!ALLOWED_ENTITIES.includes(entity)) {
    throw new Error('Invalid MDM entity');
  }
  return (prisma as any)[entity];
};

// GET all records for a specific MDM entity
router.get('/:entity', requireAuth, async (req, res) => {
  try {
    const delegate = getDelegate(req.params.entity as string);
    const records = await delegate.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100 // Hard limit for safety
    });
    res.json(records);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// GET single record
router.get('/:entity/:id', requireAuth, async (req, res) => {
  try {
    const delegate = getDelegate(req.params.entity as string);
    const record = await delegate.findUnique({
      where: { id: req.params.id }
    });
    if (!record) return res.status(404).json({ error: 'Record not found' });
    res.json(record);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// POST create record
router.post('/:entity', requireAuth, async (req, res) => {
  try {
    const delegate = getDelegate(req.params.entity as string);
    const record = await delegate.create({
      data: req.body
    });
    res.status(201).json(record);
  } catch (error: any) {
    res.status(400).json({ error: 'Failed to create record. Duplicate code?' });
  }
});

// PUT update record
router.put('/:entity/:id', requireAuth, async (req, res) => {
  try {
    const delegate = getDelegate(req.params.entity as string);
    const record = await delegate.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(record);
  } catch (error: any) {
    res.status(400).json({ error: 'Failed to update record' });
  }
});

// DELETE (Soft delete via status update if supported)
router.delete('/:entity/:id', requireAuth, async (req, res) => {
  try {
    const delegate = getDelegate(req.params.entity);
    // Real MDM should use Soft Delete, updating status to "Archived"
    const record = await delegate.update({
      where: { id: req.params.id },
      data: { status: 'Archived' }
    });
    res.json({ message: 'Record archived safely', id: record.id });
  } catch (error: any) {
    res.status(400).json({ error: 'Failed to archive record' });
  }
});

export const mdmRouter = router;
