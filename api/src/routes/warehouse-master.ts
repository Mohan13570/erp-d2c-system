import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// ==========================================
// WMS Phase 1: Warehouse Master API
// ==========================================

// GET /api/v1/warehouses (List & Search)
router.get('/', async (req, res) => {
  try {
    const { search, status } = req.query;
    
    const where: any = {};
    if (status) where.status = String(status);
    if (search) {
      where.OR = [
        { code: { contains: String(search), mode: 'insensitive' } },
        { name: { contains: String(search), mode: 'insensitive' } }
      ];
    }

    const warehouses = await prisma.warehouse.findMany({
      where,
      include: {
        location: true,
        contact: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(warehouses);
  } catch (error) {
    console.error('Error fetching warehouses:', error);
    res.status(500).json({ error: 'Failed to fetch warehouses' });
  }
});

// GET /api/v1/warehouses/:id (Fetch full profile)
router.get('/:id', async (req, res) => {
  try {
    const warehouse = await prisma.warehouse.findUnique({
      where: { id: req.params.id },
      include: {
        location: true,
        contact: true,
        services: true,
        safety: true,
        operatingHours: true,
        documents: true
      }
    });

    if (!warehouse) return res.status(404).json({ error: 'Warehouse not found' });
    res.json(warehouse);
  } catch (error) {
    console.error('Error fetching warehouse:', error);
    res.status(500).json({ error: 'Failed to fetch warehouse' });
  }
});

// POST /api/v1/warehouses (Create Warehouse)
router.post('/', async (req, res) => {
  try {
    const { code, name, type, category, capacity, area, ...rest } = req.body;

    // Strict uniqueness check enforced natively by Prisma @unique on code and name.
    const warehouse = await prisma.warehouse.create({
      data: {
        code,
        name,
        type,
        category,
        capacity: Number(capacity),
        area: Number(area),
        status: 'ACTIVE',
        // Optional nested creates based on payload
        location: req.body.location ? { create: req.body.location } : undefined,
        contact: req.body.contact ? { create: req.body.contact } : undefined,
        services: req.body.services ? { create: req.body.services } : { create: {} },
        safety: req.body.safety ? { create: req.body.safety } : { create: {} },
        operatingHours: req.body.operatingHours ? { create: req.body.operatingHours } : { create: {} }
      },
      include: { location: true, contact: true }
    });

    res.status(201).json({ message: 'Warehouse created successfully', warehouse });
  } catch (error: any) {
    console.error('Error creating warehouse:', error);
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Warehouse Code or Name already exists.' });
    }
    res.status(500).json({ error: 'Failed to create warehouse' });
  }
});

// PUT /api/v1/warehouses/:id (Update full profile)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { location, contact, services, safety, operatingHours, documents, ...baseData } = req.body;

    const warehouse = await prisma.warehouse.update({
      where: { id },
      data: {
        ...baseData,
        location: location ? { upsert: { create: location, update: location } } : undefined,
        contact: contact ? { upsert: { create: contact, update: contact } } : undefined,
        services: services ? { upsert: { create: services, update: services } } : undefined,
        safety: safety ? { upsert: { create: safety, update: safety } } : undefined,
        operatingHours: operatingHours ? { upsert: { create: operatingHours, update: operatingHours } } : undefined,
      }
    });

    res.json({ message: 'Warehouse updated successfully', warehouse });
  } catch (error: any) {
    console.error('Error updating warehouse:', error);
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Warehouse Code or Name already exists.' });
    }
    res.status(500).json({ error: 'Failed to update warehouse' });
  }
});

// PATCH /api/v1/warehouses/:id/status (Toggle status)
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body; // ACTIVE, INACTIVE, MAINTENANCE
    if (!status) return res.status(400).json({ error: 'Status is required' });

    const warehouse = await prisma.warehouse.update({
      where: { id: req.params.id },
      data: { status }
    });

    res.json({ message: \`Warehouse marked as \${status}\`, warehouse });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ error: 'Failed to update warehouse status' });
  }
});

export default router;
