import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const router = Router();
const prisma = new PrismaClient();

// GET ALL ITEMS
router.get('/items', async (req: Request, res: Response) => {
  try {
    const isD2c = req.query.d2c === 'true';
    const items = await prisma.item.findMany({
      where: isD2c ? { isD2cVisible: true } : undefined
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

// GET ITEM BY CODE
router.get('/items/:itemCode', async (req: Request, res: Response) => {
  try {
    const itemCode = req.params.itemCode as string;
    const item = await prisma.item.findUnique({ where: { itemCode } });
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch item' });
  }
});

// CREATE NEW ITEM
router.post('/items', async (req: Request, res: Response) => {
  try {
    const { itemCode, itemName, itemGroup, standardRate, valuationRate, initialStock, warehouseName, isD2cVisible, imageBase64 } = req.body;
    
    // Save image if provided
    if (imageBase64) {
      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
      const imagePath = path.join(__dirname, '../../../store/public/images', `${itemCode}.png`);
      
      // Ensure directory exists
      fs.mkdirSync(path.dirname(imagePath), { recursive: true });
      fs.writeFileSync(imagePath, base64Data, 'base64');
    }

    const newItem = await prisma.item.create({
      data: {
        itemCode,
        itemName,
        itemGroup: itemGroup || 'Products',
        standardRate: Number(standardRate) || 0,
        valuationRate: Number(valuationRate) || 0,
        companyName: 'Aura',
        isD2cVisible: isD2cVisible ?? true,
      }
    });

    if (initialStock > 0 && warehouseName) {
      // Ensure warehouse exists
      await prisma.warehouse.upsert({
        where: { name: warehouseName },
        update: {},
        create: { name: warehouseName, companyName: 'Aura' }
      });

      await prisma.stockLevel.create({
        data: {
          itemCode,
          warehouseName,
          qtyOnHand: Number(initialStock),
          qtyAvailable: Number(initialStock)
        }
      });
      
      await prisma.stockLedgerEntry.create({
        data: {
          itemCode,
          warehouse: warehouseName,
          qty: Number(initialStock),
          voucherType: 'Initial Stock',
          voucherNo: `INIT-${itemCode}`
        }
      });
    }

    res.json(newItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create item' });
  }
});

// GET STOCK LEVELS
router.get('/stock-levels', async (req: Request, res: Response) => {
  try {
    const stockLevels = await prisma.stockLevel.findMany({
      include: {
        item: true,
        warehouse: true
      }
    });
    res.json(stockLevels);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stock levels' });
  }
});

// UPDATE RESERVED QTY
router.patch('/stock-levels/:id/reserve', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { qtyReserved } = req.body;
    const level = await prisma.stockLevel.findUnique({ where: { id } });
    if (!level) return res.status(404).json({ error: 'Stock level not found' });
    const qtyAvailable = level.qtyOnHand - Number(qtyReserved);
    await prisma.stockLevel.update({
      where: { id },
      data: { qtyReserved: Number(qtyReserved), qtyAvailable }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update reserved qty' });
  }
});

// GET STOCK LEDGERS
router.get('/stock-ledgers', async (req: Request, res: Response) => {
  try {
    const ledgers = await prisma.stockLedgerEntry.findMany({
      include: {
        item: true,
        warehouseRef: true
      },
      orderBy: {
        postingDate: 'desc'
      }
    });
    res.json(ledgers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stock ledgers' });
  }
});

// GET WAREHOUSES
router.get('/warehouses', async (req: Request, res: Response) => {
  try {
    const warehouses = await prisma.warehouse.findMany();
    res.json(warehouses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch warehouses' });
  }
});

// DELETE ITEM
router.delete('/items/:itemCode', async (req: Request, res: Response) => {
  try {
    const itemCode = req.params.itemCode as string;
    
    // Check if item is used in sales orders
    const orderItems = await prisma.salesOrderItem.findFirst({ where: { itemCode } });
    if (orderItems) {
      return res.status(400).json({ error: 'Cannot delete item because it is referenced in one or more Sales Orders.' });
    }
    
    // Delete related stock records first
    await prisma.stockLedgerEntry.deleteMany({ where: { itemCode } });
    await prisma.stockLevel.deleteMany({ where: { itemCode } });
    // Delete the item
    await prisma.item.delete({ where: { itemCode } });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

export default router;
