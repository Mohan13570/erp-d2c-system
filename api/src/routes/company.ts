import express from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Validation Schema
const companySchema = z.object({
  companyCode: z.string().optional(),
  name: z.string(),
  legalName: z.string().optional(),
  tradeName: z.string().optional(),
  isHoldingCompany: z.boolean().optional(),
  corporateWebsite: z.string().optional(),
  officialEmail: z.string().email().optional(),
  status: z.string().optional()
});

// GET all companies
router.get('/', requireAuth, async (req, res) => {
  try {
    const companies = await prisma.company.findMany({
      include: {
        companyAddresses: true,
        companyContacts: true,
        businessUnits: true,
        branches: true,
      }
    });
    res.json(companies);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch companies' });
  }
});

// GET single company
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const company = await prisma.company.findUnique({
      where: { id: req.params.id },
      include: {
        companyAddresses: true,
        companyContacts: true,
        companyBranding: true,
        businessUnits: true,
        branches: true,
      }
    });
    if (!company) return res.status(404).json({ error: 'Company not found' });
    res.json(company);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch company' });
  }
});

// POST create company
router.post('/', requireAuth, async (req, res) => {
  try {
    const data = companySchema.parse(req.body);
    
    // Check duplicates
    const existing = await prisma.company.findUnique({ where: { name: data.name } });
    if (existing) {
      return res.status(400).json({ error: 'Company with this name already exists' });
    }

    const company = await prisma.company.create({
      data: {
        ...data,
        companyCode: data.companyCode || `CMP-${Math.floor(Math.random() * 10000)}`
      }
    });
    res.status(201).json(company);
  } catch (error) {
    res.status(400).json({ error: 'Invalid data or creation failed' });
  }
});

// PUT update company
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const data = companySchema.partial().parse(req.body);
    const company = await prisma.company.update({
      where: { id: req.params.id },
      data
    });
    res.json(company);
  } catch (error) {
    res.status(400).json({ error: 'Update failed' });
  }
});

export const companyRouter = router;
