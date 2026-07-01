import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get Billings
router.get('/', async (req, res) => {
  try {
    const billings = await prisma.containerBilling.findMany({
      where: { isDeleted: false },
      include: { 
        container: true,
        charges: true
      },
      orderBy: { timestamp: 'desc' }
    });
    res.json(billings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch billings' });
  }
});

// Create Billing Invoice
router.post('/', async (req, res) => {
  try {
    const { containerId, type, currency, exchangeRate, dueDate, charges } = req.body;
    
    let totalAmount = 0;
    
    // Calculate totals
    const chargeData = charges.map((c: any) => {
      const taxAmount = c.amount * (c.gstRate / 100);
      totalAmount += (c.amount + taxAmount);
      return { ...c, taxAmount };
    });

    const billing = await prisma.containerBilling.create({
      data: {
        containerId, type, currency, exchangeRate, dueDate, totalAmount,
        charges: {
          create: chargeData
        }
      },
      include: { charges: true }
    });

    res.json(billing);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create billing' });
  }
});

export default router;
