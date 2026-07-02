import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  try {
    const pos = await prisma.purchaseOrder.findMany({
      include: {
        vendor: true,
        items: true,
        grns: true
      },
      orderBy: { orderDate: 'desc' }
    });
    res.json(pos);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { vendorId, warehouseId, type, items, expectedDate, incoterms, shippingTerms, notes } = req.body;
    
    const count = await prisma.purchaseOrder.count();
    const poNumber = `PO-${new Date().getFullYear()}-${(count + 1).toString().padStart(5, '0')}`;

    let subTotal = 0;
    const poItemsData = items.map((i: any) => {
      const amount = i.qty * i.rate;
      subTotal += amount;
      return {
        itemCode: i.itemCode,
        description: i.description,
        qty: i.qty,
        uom: i.uom,
        rate: i.rate,
        taxPercent: i.taxPercent || 0,
        amount
      };
    });

    const taxAmount = poItemsData.reduce((sum: number, i: any) => sum + (i.amount * i.taxPercent / 100), 0);
    const grandTotal = subTotal + taxAmount;

    const po = await prisma.purchaseOrder.create({
      data: {
        poNumber,
        vendorId,
        warehouseId,
        type,
        expectedDate: expectedDate ? new Date(expectedDate) : null,
        subTotal,
        taxAmount,
        grandTotal,
        incoterms,
        shippingTerms,
        notes,
        status: 'Approved', // Auto-approved for this iteration
        items: { create: poItemsData },
        history: {
          create: {
            action: 'CREATED',
            userId: 'SYSTEM',
            details: 'PO Automatically Approved and Sent to Vendor'
          }
        }
      },
      include: { items: true, vendor: true }
    });

    res.status(201).json(po);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const po = await prisma.purchaseOrder.findUnique({
      where: { id: req.params.id },
      include: { 
        vendor: true, 
        items: { include: { item: true } }, 
        history: { orderBy: { timestamp: 'desc' } },
        grns: { include: { items: true } }
      }
    });
    if (!po) return res.status(404).json({ error: 'PO not found' });
    res.json(po);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
