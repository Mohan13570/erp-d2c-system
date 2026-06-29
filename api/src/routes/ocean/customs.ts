import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get Customs Declarations
router.get('/declarations', async (req, res) => {
  try {
    const declarations = await prisma.oceanCustomsDeclaration.findMany({
      where: { isDeleted: false },
      include: { booking: true, items: true, portOfClearance: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(declarations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch declarations' });
  }
});

// Create Declaration
router.post('/declarations', async (req, res) => {
  try {
    const { items, ...declData } = req.body;

    const newDecl = await prisma.oceanCustomsDeclaration.create({
      data: {
        ...declData,
        items: { create: items || [] }
      },
      include: { items: true }
    });
    res.status(201).json(newDecl);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Update Clearance Status
router.put('/declarations/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await prisma.oceanCustomsDeclaration.update({
      where: { id: req.params.id },
      data: { status }
    });
    res.json(updated);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
