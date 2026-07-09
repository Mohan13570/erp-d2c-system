import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { VendorProcurementEngine } from '../services/VendorProcurementEngine';
import { VendorNegotiationEngine } from '../services/VendorNegotiationEngine';

const router = Router();
const prisma = new PrismaClient();

// ==========================================
// VENDOR PROCUREMENT COLLABORATION
// ==========================================

// Mock Middleware to extract vendorId from JWT
// In reality, this would be `router.use(verifyVendorJWT)`
const mockVendorId = "mock-vendor-id"; // This would come from req.user.vendorId

router.get('/rfqs', async (req, res) => {
  try {
    // Return all Open RFQs and RFQs where this vendor has submitted a quotation
    const rfqs = await prisma.procurementRFQ.findMany({
      include: {
        items: true,
        vendorQuotations: {
          // In a real app we filter by the logged-in vendor's ID
          take: 1
        }
      }
    });
    res.json(rfqs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/quotation', async (req, res) => {
  try {
    const { rfqId, items, remarks } = req.body;
    // mockVendorId should be extracted from the authenticated user token
    const quote = await VendorProcurementEngine.submitQuotation(mockVendorId, rfqId, items, remarks);
    res.json(quote);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/quotation/:id/negotiation', async (req, res) => {
  try {
    const timeline = await VendorNegotiationEngine.getTimeline(req.params.id);
    res.json(timeline);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/quotation/:id/negotiation', async (req, res) => {
  try {
    const { message, attachmentUrl } = req.body;
    const authorId = "mock-vendor-user";
    const result = await VendorNegotiationEngine.addMessage(req.params.id, authorId, 'Vendor', message, attachmentUrl);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/purchase-orders', async (req, res) => {
  try {
    const pos = await prisma.purchaseOrder.findMany({
      include: {
        items: true,
        vendorInteractions: true
      }
    });
    res.json(pos);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/purchase-orders/:id/respond', async (req, res) => {
  try {
    const { action, remarks } = req.body; // 'Accepted' | 'Rejected'
    const result = await VendorProcurementEngine.respondToPO(req.params.id, mockVendorId, action, remarks);
    res.json({ success: result });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
