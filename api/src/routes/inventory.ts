import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { authenticateToken, checkPermission, AuthRequest } from '../middleware/auth';
import { logAudit } from '../utils/audit';
import { checkAndGenerateLowStockAlert } from '../utils/inventoryHelper';

const router = Router();
const prisma = new PrismaClient();

// GET ALL ITEMS
router.get('/items', authenticateToken, checkPermission('Inventory'), async (req: AuthRequest, res: Response) => {
  try {
    const isD2c = req.query.d2c === 'true';
    const paginate = req.query.paginate === 'true';

    const where: any = {};
    if (isD2c) {
      where.isD2cVisible = true;
    }

    if (paginate) {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;
      const search = req.query.search as string;
      const itemGroup = req.query.itemGroup as string;

      if (itemGroup && itemGroup !== 'All') {
        where.itemGroup = itemGroup;
      }
      if (search) {
        where.OR = [
          { itemCode: { contains: search } },
          { itemName: { contains: search } }
        ];
      }

      const [items, total] = await Promise.all([
        prisma.item.findMany({
          where,
          skip,
          take: limit,
          orderBy: { itemCode: 'asc' }
        }),
        prisma.item.count({ where })
      ]);

      res.json({
        items,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      });
    } else {
      const items = await prisma.item.findMany({
        where
      });
      res.json(items);
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

// GET ITEM BY CODE
router.get('/items/:itemCode', authenticateToken, checkPermission('Inventory'), async (req: AuthRequest, res: Response) => {
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
router.post('/items', authenticateToken, checkPermission('Inventory'), async (req: AuthRequest, res: Response) => {
  try {
    const { itemCode, itemName, itemGroup, standardRate, valuationRate, initialStock, warehouseName, isD2cVisible, imageBase64, minimum_stock } = req.body;
    
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
        minimum_stock: Number(minimum_stock) || 0,
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

      // Trigger low stock check
      await checkAndGenerateLowStockAlert(itemCode, warehouseName);
    }

    // Log Audit
    await logAudit(
      req.user?.id || null,
      'CREATE',
      'Item',
      newItem.itemCode,
      null,
      newItem,
      req.ip || req.socket.remoteAddress
    );

    res.json(newItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create item' });
  }
});

// GET STOCK LEVELS
router.get('/stock-levels', authenticateToken, checkPermission('Inventory'), async (req: AuthRequest, res: Response) => {
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
router.patch('/stock-levels/:id/reserve', authenticateToken, checkPermission('Inventory'), async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const { qtyReserved } = req.body;
    const level = await prisma.stockLevel.findUnique({ where: { id } });
    if (!level) return res.status(404).json({ error: 'Stock level not found' });
    const qtyAvailable = level.qtyOnHand - Number(qtyReserved);
    
    const updatedLevel = await prisma.stockLevel.update({
      where: { id },
      data: { qtyReserved: Number(qtyReserved), qtyAvailable }
    });

    // Trigger low stock check
    await checkAndGenerateLowStockAlert(level.itemCode, level.warehouseName);

    // Audit Log
    await logAudit(
      req.user?.id || null,
      'UPDATE',
      'StockLevel',
      level.id,
      level,
      updatedLevel,
      req.ip || req.socket.remoteAddress
    );

    res.json({ success: true, stockLevel: updatedLevel });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update reserved qty' });
  }
});

// ADJUST STOCK LEVEL
router.post('/stock-levels/adjust', authenticateToken, checkPermission('Inventory'), async (req: AuthRequest, res: Response) => {
  try {
    const { itemCode, warehouseName, qtyChange, reason } = req.body;
    
    if (!itemCode || !warehouseName || isNaN(Number(qtyChange))) {
      return res.status(400).json({ error: 'Item code, warehouse name, and numeric quantity change are required.' });
    }

    const change = Number(qtyChange);

    // Ensure item exists
    const item = await prisma.item.findUnique({ where: { itemCode } });
    if (!item) return res.status(404).json({ error: 'Item not found' });

    // Ensure warehouse exists
    await prisma.warehouse.upsert({
      where: { name: warehouseName },
      update: {},
      create: { name: warehouseName, companyName: 'Aura' }
    });

    // Check if stock level exists
    const existingLevel = await prisma.stockLevel.findUnique({
      where: { itemCode_warehouseName: { itemCode, warehouseName } }
    });

    let updatedLevel;
    const oldVal = existingLevel ? { ...existingLevel } : null;

    if (existingLevel) {
      const newQtyOnHand = existingLevel.qtyOnHand + change;
      const newQtyAvailable = newQtyOnHand - existingLevel.qtyReserved;
      
      updatedLevel = await prisma.stockLevel.update({
        where: { id: existingLevel.id },
        data: {
          qtyOnHand: newQtyOnHand,
          qtyAvailable: newQtyAvailable
        }
      });
    } else {
      updatedLevel = await prisma.stockLevel.create({
        data: {
          itemCode,
          warehouseName,
          qtyOnHand: change,
          qtyAvailable: change,
          qtyReserved: 0
        }
      });
    }

    // Create Stock Ledger Entry
    const ledger = await prisma.stockLedgerEntry.create({
      data: {
        itemCode,
        warehouse: warehouseName,
        qty: change,
        voucherType: 'Stock Adjustment',
        voucherNo: `ADJ-${Date.now()}`
      }
    });

    // Trigger low stock check
    await checkAndGenerateLowStockAlert(itemCode, warehouseName);

    // Audit Log
    await logAudit(
      req.user?.id || null,
      'UPDATE',
      'StockLevel',
      updatedLevel.id,
      oldVal,
      { stockLevel: updatedLevel, reason, ledger },
      req.ip || req.socket.remoteAddress
    );

    res.json({ success: true, stockLevel: updatedLevel, ledger });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Failed to adjust stock level', details: error.message });
  }
});

// GET STOCK LEDGERS
router.get('/stock-ledgers', authenticateToken, checkPermission('Inventory'), async (req: AuthRequest, res: Response) => {
  try {
    const paginate = req.query.paginate === 'true';
    
    if (paginate) {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;
      const search = req.query.search as string;
      const warehouse = req.query.warehouse as string;

      const where: any = {};
      if (warehouse && warehouse !== 'All') {
        where.warehouse = warehouse;
      }
      if (search) {
        where.OR = [
          { itemCode: { contains: search } },
          { voucherNo: { contains: search } },
          { voucherType: { contains: search } },
          { item: { itemName: { contains: search } } }
        ];
      }

      const [ledgers, total] = await Promise.all([
        prisma.stockLedgerEntry.findMany({
          where,
          include: {
            item: true,
            warehouseRef: true
          },
          orderBy: {
            postingDate: 'desc'
          },
          skip,
          take: limit
        }),
        prisma.stockLedgerEntry.count({ where })
      ]);

      res.json({
        ledgers,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      });
    } else {
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
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stock ledgers' });
  }
});

// GET WAREHOUSES
router.get('/warehouses', authenticateToken, checkPermission('Inventory'), async (req: AuthRequest, res: Response) => {
  try {
    const warehouses = await prisma.warehouse.findMany();
    res.json(warehouses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch warehouses' });
  }
});

// DELETE ITEM
router.delete('/items/:itemCode', authenticateToken, checkPermission('Inventory'), async (req: AuthRequest, res: Response) => {
  try {
    const itemCode = req.params.itemCode as string;
    
    // Check if item is used in sales orders
    const orderItems = await prisma.salesOrderItem.findFirst({ where: { itemCode } });
    if (orderItems) {
      return res.status(400).json({ error: 'Cannot delete item because it is referenced in one or more Sales Orders.' });
    }
    
    const itemToDelete = await prisma.item.findUnique({ where: { itemCode } });
    if (!itemToDelete) return res.status(404).json({ error: 'Item not found' });

    // Delete related stock records first
    await prisma.stockLedgerEntry.deleteMany({ where: { itemCode } });
    await prisma.stockLevel.deleteMany({ where: { itemCode } });
    
    // Delete the item
    await prisma.item.delete({ where: { itemCode } });

    // Audit Log
    await logAudit(
      req.user?.id || null,
      'DELETE',
      'Item',
      itemCode,
      itemToDelete,
      null,
      req.ip || req.socket.remoteAddress
    );

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

// GET LOW STOCK ITEMS
router.get('/low-stock', authenticateToken, checkPermission('Inventory'), async (req: AuthRequest, res: Response) => {
  try {
    const stockLevels = await prisma.stockLevel.findMany({
      include: {
        item: true,
        warehouse: true
      }
    });

    const lowStock = stockLevels.filter(sl => sl.item.minimum_stock > 0 && sl.qtyAvailable < sl.item.minimum_stock);
    res.json(lowStock);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch low stock levels' });
  }
});

// UPDATE ITEM (PATCH /items/:itemCode)
router.patch('/items/:itemCode', authenticateToken, checkPermission('Inventory'), async (req: AuthRequest, res: Response) => {
  try {
    const itemCode = req.params.itemCode as string;
    const { minimum_stock, standardRate, valuationRate, itemName } = req.body;

    const existing = await prisma.item.findUnique({ where: { itemCode } });
    if (!existing) return res.status(404).json({ error: 'Item not found' });

    const updatedItem = await prisma.item.update({
      where: { itemCode },
      data: {
        minimum_stock: minimum_stock !== undefined ? Number(minimum_stock) : undefined,
        standardRate: standardRate !== undefined ? Number(standardRate) : undefined,
        valuationRate: valuationRate !== undefined ? Number(valuationRate) : undefined,
        itemName: itemName !== undefined ? itemName : undefined
      }
    });

    if (minimum_stock !== undefined) {
      const stockLevels = await prisma.stockLevel.findMany({ where: { itemCode } });
      for (const sl of stockLevels) {
        await checkAndGenerateLowStockAlert(itemCode, sl.warehouseName);
      }
    }

    // Log Audit
    await logAudit(
      req.user?.id || null,
      'UPDATE',
      'Item',
      itemCode,
      existing,
      updatedItem,
      req.ip || req.socket.remoteAddress
    );

    res.json(updatedItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update item' });
  }
});

export default router;
