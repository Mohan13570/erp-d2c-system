import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get Spare Parts Inventory
router.get('/parts', async (req, res) => {
  try {
    const parts = await prisma.roadSparePart.findMany({
      where: { isDeleted: false },
      orderBy: { stockLevel: 'asc' }
    });
    res.json(parts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch spare parts' });
  }
});

// Record a Part Transaction
router.post('/parts/:id/transactions', async (req, res) => {
  try {
    const { id } = req.params;
    const { type, quantity, referenceId } = req.body;
    
    // Begin transaction
    const transaction = await prisma.$transaction(async (tx) => {
      const part = await tx.roadSparePart.findUnique({ where: { id } });
      if (!part) throw new Error('Part not found');

      const newStock = type === 'Receipt' || type === 'Return' 
        ? part.stockLevel + Number(quantity) 
        : part.stockLevel - Number(quantity);

      if (newStock < 0) throw new Error('Insufficient stock');

      await tx.roadSparePart.update({
        where: { id },
        data: { stockLevel: newStock }
      });

      return tx.roadPartTransaction.create({
        data: { partId: id, type, quantity: Number(quantity), referenceId }
      });
    });

    res.json(transaction);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to process transaction' });
  }
});

export default router;
