import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const router = Router();
const prisma = new PrismaClient();

// Get all Container Assets
router.get('/', async (req, res) => {
  try {
    const assets = await prisma.containerAsset.findMany({
      where: { isDeleted: false },
      include: {
        containerType: true,
        containerSize: true,
        currentPort: true,
        yardLocation: true
      }
    });
    res.json(assets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch container assets' });
  }
});

// Create Container Asset
router.post('/', async (req, res) => {
  try {
    const assetData = req.body;
    // Generate a unique QR Code URL for the asset
    const uniqueHash = crypto.randomBytes(8).toString('hex');
    assetData.qrCode = `https://aura-erp.com/asset/${uniqueHash}`;

    const newAsset = await prisma.containerAsset.create({
      data: assetData,
      include: { containerType: true, containerSize: true }
    });
    res.status(201).json(newAsset);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Update Asset Status/Condition
router.put('/:id', async (req, res) => {
  try {
    const updated = await prisma.containerAsset.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(updated);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
