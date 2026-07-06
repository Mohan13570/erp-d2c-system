import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// ==========================================
// SETTINGS & CONFIG
// ==========================================
router.patch('/:warehouseName/settings', async (req, res) => {
  try {
    const { pickingRule, packingRule, dispatchRule, barcodeConfig, qrConfig, rfidConfig, stockReservation } = req.body;
    const settings = await prisma.warehouseSetting.update({
      where: { warehouseName: req.params.warehouseName },
      data: {
        pickingRule,
        packingRule,
        dispatchRule,
        barcodeConfig,
        qrConfig,
        rfidConfig,
        stockReservation
      }
    });
    res.json(settings);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
