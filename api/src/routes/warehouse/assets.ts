import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// ==========================================
// EQUIPMENT & LOADING BAYS
// ==========================================
router.post('/:warehouseName/equipment', async (req, res) => {
  try {
    const { equipmentCode, type, lastServiceDate } = req.body;
    const equip = await prisma.warehouseEquipment.create({
      data: {
        equipmentCode,
        warehouseName: req.params.warehouseName,
        type,
        lastServiceDate: lastServiceDate ? new Date(lastServiceDate) : undefined
      }
    });
    res.status(201).json(equip);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:warehouseName/bays', async (req, res) => {
  try {
    const { bayCode, type } = req.body;
    const bay = await prisma.loadingBay.create({
      data: {
        bayCode,
        warehouseName: req.params.warehouseName,
        type
      }
    });
    res.status(201).json(bay);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
