import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all vehicles with compliance documents
router.get('/', async (req, res) => {
  try {
    const vehicles = await prisma.roadVehicle.findMany({
      where: { isDeleted: false },
      include: {
        documents: { where: { isDeleted: false } },
        inspections: { orderBy: { timestamp: 'desc' }, take: 1 }
      }
    });
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch vehicles' });
  }
});

// Add a compliance document
router.post('/:id/documents', async (req, res) => {
  try {
    const { id } = req.params;
    const { type, documentNo, issueDate, expiryDate, fileUrl } = req.body;
    
    const doc = await prisma.roadVehicleDocument.create({
      data: {
        vehicleId: id,
        type,
        documentNo,
        issueDate: issueDate ? new Date(issueDate) : null,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        fileUrl,
        status: new Date(expiryDate) < new Date() ? 'Expired' : 'Valid'
      }
    });
    res.json(doc);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add document' });
  }
});

export default router;
