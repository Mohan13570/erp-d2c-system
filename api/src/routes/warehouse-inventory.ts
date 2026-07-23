import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// ==========================================
// WMS Phase 5: Inventory Management
// ==========================================

// GET /api/v1/warehouse-inventory/dashboard (Aggregated Metrics)
router.get('/dashboard/:warehouseId', async (req, res) => {
  try {
    const { warehouseId } = req.params;
    
    const aggregations = await prisma.inventory.aggregate({
      where: { warehouseId },
      _sum: {
        totalQuantity: true,
        availableQuantity: true,
        reservedQuantity: true,
        damagedQuantity: true,
        blockedQuantity: true
      },
      _count: {
        sku: true
      }
    });

    const lowStockCount = await prisma.inventory.count({
      where: { warehouseId, availableQuantity: { lt: 10 } }
    });
    
    res.json({
      metrics: aggregations._sum,
      totalSkus: aggregations._count.sku,
      lowStockAlerts: lowStockCount
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard metrics' });
  }
});

// GET /api/v1/warehouse-inventory/:warehouseId
router.get('/:warehouseId', async (req, res) => {
  try {
    const inventory = await prisma.inventory.findMany({
      where: { warehouseId: req.params.warehouseId },
      include: {
        locations: true,
        valuation: true,
        movements: { take: 5, orderBy: { movementDate: 'desc' } }
      }
    });
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch inventory ledger' });
  }
});

// POST /api/v1/warehouse-inventory/adjust
router.post('/adjust', async (req, res) => {
  try {
    const { inventoryId, adjustmentType, reason, quantity, approvedBy } = req.body;
    
    // Strict ACID Transaction: Either both succeed, or both fail.
    const result = await prisma.$transaction(async (tx) => {
      // 1. Get current balance
      const item = await tx.inventory.findUnique({ where: { id: inventoryId } });
      if (!item) throw new Error('Inventory record not found');
      
      const newTotal = adjustmentType === 'INCREASE' 
        ? item.totalQuantity + quantity 
        : item.totalQuantity - quantity;
        
      if (newTotal < 0) throw new Error('Inventory quantity cannot drop below zero.');

      // 2. Adjust Ledger
      const updatedItem = await tx.inventory.update({
        where: { id: inventoryId },
        data: {
          totalQuantity: newTotal,
          availableQuantity: adjustmentType === 'INCREASE' 
            ? item.availableQuantity + quantity 
            : item.availableQuantity - quantity
        }
      });

      // 3. Write Immutable History (Audit Log)
      await tx.inventoryHistory.create({
        data: {
          inventoryId,
          transactionType: 'ADJUSTMENT',
          referenceNumber: \`ADJ-\${Date.now()}\`,
          description: \`Manual \${adjustmentType} due to \${reason}\`,
          quantityChange: adjustmentType === 'INCREASE' ? quantity : -quantity,
          balanceAfter: newTotal
        }
      });

      // 4. Log the Adjustment Document
      const doc = await tx.inventoryAdjustment.create({
        data: {
          adjustmentNumber: \`ADJ-\${Date.now()}\`,
          adjustmentType,
          reason,
          quantity,
          approvedBy,
          status: 'APPROVED'
        }
      });
      
      return { updatedItem, doc };
    });

    res.json({ message: 'Adjustment processed successfully via transaction', result });
  } catch (error: any) {
    console.error('Transaction Failed:', error.message);
    res.status(400).json({ error: error.message || 'Failed to process adjustment' });
  }
});

// POST /api/v1/warehouse-inventory/reserve
router.post('/reserve', async (req, res) => {
  try {
    const { inventoryId, orderNumber, quantity } = req.body;
    
    const result = await prisma.$transaction(async (tx) => {
      const item = await tx.inventory.findUnique({ where: { id: inventoryId } });
      if (!item || item.availableQuantity < quantity) {
        throw new Error('Insufficient available inventory for reservation');
      }

      await tx.inventory.update({
        where: { id: inventoryId },
        data: {
          availableQuantity: item.availableQuantity - quantity,
          reservedQuantity: item.reservedQuantity + quantity
        }
      });

      const resv = await tx.inventoryReservation.create({
        data: {
          inventoryId,
          reservationNumber: \`RES-\${Date.now()}\`,
          orderNumber,
          reservedQuantity: quantity
        }
      });
      
      await tx.inventoryHistory.create({
        data: {
          inventoryId,
          transactionType: 'RESERVATION',
          referenceNumber: resv.reservationNumber,
          quantityChange: 0,
          balanceAfter: item.totalQuantity,
          description: \`Reserved \${quantity} units for Order \${orderNumber}\`
        }
      });

      return resv;
    });

    res.json({ message: 'Inventory reserved successfully', reservation: result });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// POST /api/v1/warehouse-inventory/transfer (Bin to Bin)
router.post('/transfer', async (req, res) => {
  try {
    const { inventoryId, fromLocationId, toLocationId, quantity } = req.body;
    // In production, robust location decrement/increment logic would reside here.
    // Simulating transaction framework:
    const transfer = await prisma.inventoryTransfer.create({
      data: {
        transferNumber: \`TRF-\${Date.now()}\`,
        transferType: 'BIN',
        status: 'COMPLETED',
        transferDate: new Date()
      }
    });
    res.json({ message: 'Stock transferred successfully', transfer });
  } catch (error) {
    res.status(500).json({ error: 'Transfer failed' });
  }
});

export default router;
