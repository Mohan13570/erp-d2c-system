import express from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// GET all lookup categories with their nested values
router.get('/', requireAuth, async (req, res) => {
  try {
    const lookups = await prisma.lookupCategory.findMany({
      include: {
        values: {
          orderBy: { sequence: 'asc' }
        }
      }
    });
    res.json(lookups);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch lookups' });
  }
});

// GET values by category code (used dynamically by frontend dropdowns)
router.get('/:categoryCode/values', requireAuth, async (req, res) => {
  try {
    const categoryCode = req.params.categoryCode as string;
    const category = await prisma.lookupCategory.findUnique({
      where: { code: categoryCode },
      include: {
        values: {
          where: { status: 'Active' },
          orderBy: { sequence: 'asc' }
        }
      }
    });
    
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.json(category.values);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch lookup values' });
  }
});

export const lookupsRouter = router;
