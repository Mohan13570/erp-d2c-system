import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// RFQ Endpoints

router.get('/', async (req, res) => {
  try {
    const rfqs = await prisma.procurementRFQ.findMany({
      include: {
        items: true,
        vendors: { include: { vendor: true } },
        _count: { select: { responses: true } }
      },
      orderBy: { issueDate: 'desc' }
    });
    res.json(rfqs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, deadline, terms, items, vendorIds, prId } = req.body;
    
    // Auto-generate RFQ Number
    const count = await prisma.procurementRFQ.count();
    const rfqNumber = `RFQ-${new Date().getFullYear()}-${(count + 1).toString().padStart(5, '0')}`;
    
    const rfq = await prisma.procurementRFQ.create({
      data: {
        rfqNumber,
        title,
        deadline: new Date(deadline),
        terms,
        prId,
        items: {
          create: items.map((item: any) => ({
            itemCode: item.itemCode,
            description: item.description,
            quantity: item.quantity,
            uom: item.uom
          }))
        },
        vendors: {
          create: vendorIds.map((vendorId: string) => ({
            vendorId,
            status: 'Invited'
          }))
        }
      },
      include: {
        items: true,
        vendors: true
      }
    });
    
    res.status(201).json(rfq);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const rfq = await prisma.procurementRFQ.findUnique({
      where: { id: req.params.id },
      include: {
        items: true,
        vendors: { include: { vendor: true } },
        responses: { include: { vendor: true } },
        comparisons: true,
        pr: true
      }
    });
    if (!rfq) return res.status(404).json({ error: 'RFQ not found' });
    res.json(rfq);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Submit RFQ Response (Vendor Portal Simulation)
router.post('/:id/responses', async (req, res) => {
  try {
    const response = await prisma.procurementRFQResponse.create({
      data: {
        rfqId: req.params.id,
        ...req.body
      }
    });
    
    // Update Vendor Status to Responded
    await prisma.procurementRFQVendor.updateMany({
      where: { rfqId: req.params.id, vendorId: req.body.vendorId },
      data: { status: 'Responded' }
    });
    
    res.status(201).json(response);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Run Comparison Engine
router.post('/:id/compare', async (req, res) => {
  try {
    const rfq = await prisma.procurementRFQ.findUnique({
      where: { id: req.params.id },
      include: { responses: { include: { vendor: true } } }
    });
    
    if (!rfq) return res.status(404).json({ error: 'RFQ not found' });
    
    // Basic Commercial Evaluation Logic (Lowest Price Wins)
    const sortedResponses = [...rfq.responses].sort((a, b) => a.totalAmount - b.totalAmount);
    
    const comparisonData = {
      rankings: sortedResponses.map((r, index) => ({
        rank: index + 1,
        vendorId: r.vendorId,
        vendorName: r.vendor.name,
        totalAmount: r.totalAmount,
        currency: r.currency,
        score: index === 0 ? 100 : Math.max(0, 100 - (index * 20))
      }))
    };
    
    const comparison = await prisma.procurementRFQComparison.create({
      data: {
        rfqId: rfq.id,
        evaluatedBy: 'SYSTEM_EVALUATOR',
        data: JSON.stringify(comparisonData),
        winnerId: sortedResponses[0]?.vendorId
      }
    });
    
    res.json(comparison);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Award RFQ
router.post('/:id/award', async (req, res) => {
  try {
    const { winnerId } = req.body;
    
    const rfq = await prisma.procurementRFQ.update({
      where: { id: req.params.id },
      data: { status: 'Awarded' }
    });
    
    // Create an approval queue item for the award
    await prisma.approvalQueue.create({
      data: {
        entityType: 'RFQ_AWARD',
        entityId: rfq.id,
        requestedBy: 'SYSTEM',
        status: 'Pending'
      }
    });
    
    res.json(rfq);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
