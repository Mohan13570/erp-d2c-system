import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// ==========================================
// 1. GET WAREHOUSE MASTER & SPATIAL TREE
// ==========================================
router.get('/', async (req, res) => {
  try {
    const warehouses = await prisma.warehouse.findMany({
      include: {
        company: true,
        zones: {
          include: {
            blocks: {
              include: {
                aisles: {
                  include: { racks: { include: { shelves: { include: { bins: true } } } } }
                }
              }
            }
          }
        },
        equipments: true,
        loadingBays: true,
        shifts: true,
        holidays: true,
        settings: true
      }
    });
    res.json(warehouses);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 1.5 GET PICKS (LEGACY COMPATIBILITY)
// ==========================================
router.get('/picks', async (req, res) => {
  try {
    const picks = await prisma.pickList.findMany();
    res.json(picks);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/picks', async (req, res) => {
  try {
    const pick = await prisma.pickList.create({ data: req.body });
    res.status(201).json(pick);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 2. CREATE WAREHOUSE
// ==========================================
router.post('/', async (req, res) => {
  try {
    const { name, code, companyName, category, type, capacity, storageConditions, gpsCoordinates, managerName } = req.body;
    const warehouse = await prisma.warehouse.create({
      data: {
        name,
        code,
        companyName,
        category,
        type,
        capacity,
        storageConditions,
        gpsCoordinates,
        managerName,
        settings: {
          create: {
            barcodeConfig: 'CODE128',
            pickingRule: 'FIFO'
          }
        }
      },
      include: { settings: true }
    });
    res.status(201).json(warehouse);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 3. CREATE SPATIAL ENTITIES
// ==========================================
router.post('/:warehouseName/zones', async (req, res) => {
  try {
    const { zoneCode, type, temperature } = req.body;
    const zone = await prisma.warehouseZone.create({
      data: {
        zoneCode,
        warehouseName: req.params.warehouseName,
        type,
        temperature
      }
    });
    res.status(201).json(zone);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
