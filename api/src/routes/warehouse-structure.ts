import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// ==========================================
// WMS Phase 2: Warehouse Structure API
// ==========================================

// GET /api/v1/warehouse-structure/:warehouseId/tree
// Fetch the massive nested hierarchy tree
router.get('/:warehouseId/tree', async (req, res) => {
  try {
    const { warehouseId } = req.params;
    
    // Using a massive nested include to build the tree.
    // In production at hyperscale, this might be split, but for the React tree view, this is perfect.
    const blocks = await prisma.warehouseBlock.findMany({
      where: { warehouseId },
      include: {
        zones: {
          include: {
            aisles: {
              include: {
                racks: {
                  include: {
                    shelves: {
                      include: {
                        bins: true
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    res.json(blocks);
  } catch (error) {
    console.error('Error fetching hierarchy tree:', error);
    res.status(500).json({ error: 'Failed to fetch hierarchy tree' });
  }
});

// GET /api/v1/warehouse-structure/:warehouseId/capacity
router.get('/:warehouseId/capacity', async (req, res) => {
  try {
    const capacity = await prisma.warehouseCapacity.findUnique({
      where: { warehouseId: req.params.warehouseId }
    });
    // Return mock data if aggregation hasn't run yet
    if (!capacity) {
      return res.json({
        totalCapacity: 1000000, usedCapacity: 450000, availableCapacity: 550000, occupancyPercent: 45,
        totalBins: 15000, availableBins: 8200, occupiedBins: 6500, blockedBins: 100, reservedBins: 200
      });
    }
    res.json(capacity);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch capacity metrics' });
  }
});

// POST /api/v1/warehouse-structure/blocks
router.post('/blocks', async (req, res) => {
  try {
    const block = await prisma.warehouseBlock.create({ data: req.body });
    res.status(201).json(block);
  } catch (error: any) {
    if (error.code === 'P2002') return res.status(409).json({ error: 'Block Code must be unique.' });
    res.status(500).json({ error: 'Failed to create block' });
  }
});

// POST /api/v1/warehouse-structure/zones
router.post('/zones', async (req, res) => {
  try {
    const zone = await prisma.warehouseZone.create({ data: req.body });
    res.status(201).json(zone);
  } catch (error: any) {
    if (error.code === 'P2002') return res.status(409).json({ error: 'Zone Code must be unique.' });
    res.status(500).json({ error: 'Failed to create zone' });
  }
});

// POST /api/v1/warehouse-structure/bins
router.post('/bins', async (req, res) => {
  try {
    const bin = await prisma.warehouseBin.create({ data: req.body });
    res.status(201).json(bin);
  } catch (error: any) {
    if (error.code === 'P2002') return res.status(409).json({ error: 'Bin Code/Barcode/QR must be unique.' });
    res.status(500).json({ error: 'Failed to create bin' });
  }
});

// DELETE endpoints enforcing RESTRICT via Prisma.
// The DB layer naturally throws an error if children exist.
router.delete('/blocks/:id', async (req, res) => {
  try {
    await prisma.warehouseBlock.delete({ where: { id: req.params.id } });
    res.json({ message: 'Block deleted successfully' });
  } catch (error: any) {
    if (error.code === 'P2003') return res.status(409).json({ error: 'Cannot delete block: Contains active zones.' });
    res.status(500).json({ error: 'Failed to delete block' });
  }
});

router.delete('/zones/:id', async (req, res) => {
  try {
    await prisma.warehouseZone.delete({ where: { id: req.params.id } });
    res.json({ message: 'Zone deleted successfully' });
  } catch (error: any) {
    if (error.code === 'P2003') return res.status(409).json({ error: 'Cannot delete zone: Contains active aisles.' });
    res.status(500).json({ error: 'Failed to delete zone' });
  }
});

export default router;
