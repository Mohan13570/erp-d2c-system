import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// 1. Get All Vendors (With Filtering)
router.get('/', async (req, res) => {
  try {
    const { status, categoryId } = req.query;
    
    let whereClause: any = {};
    if (status) whereClause.status = status as string;
    if (categoryId) whereClause.categoryId = categoryId as string;

    const vendors = await prisma.vendor.findMany({
      where: whereClause,
      include: {
        category: true,
        group: true,
        type: true,
        _count: {
          select: { contracts: true, purchaseOrders: true, rfqResponses: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(vendors);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Get Single Vendor (360 Degree View)
router.get('/:id', async (req, res) => {
  try {
    const vendor = await prisma.vendor.findUnique({
      where: { id: req.params.id },
      include: {
        category: true,
        group: true,
        type: true,
        contacts: true,
        addresses: true,
        bankAccounts: true,
        documents: true,
        certifications: true,
        contracts: true,
        products: true,
        services: true,
        rates: true,
        performances: { orderBy: { periodYear: 'desc' }, take: 5 },
        scorecards: { orderBy: { evalDate: 'desc' }, take: 5 },
        risks: true,
        taxes: true,
        auditLogs: { orderBy: { createdAt: 'desc' }, take: 20 }
      }
    });
    
    if (!vendor) return res.status(404).json({ error: 'Vendor not found' });
    res.json(vendor);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Create Vendor Profile (Onboarding)
router.post('/', async (req, res) => {
  try {
    const vendorData = req.body;
    const vendor = await prisma.vendor.create({
      data: vendorData,
    });
    
    // Auto-log the creation
    await prisma.vendorAuditLog.create({
      data: {
        vendorId: vendor.id,
        action: 'CREATED',
        userId: 'SYSTEM', // Assuming System created if via API
        details: 'Vendor onboarded successfully'
      }
    });

    res.status(201).json(vendor);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Update Vendor Status (Blacklist, Suspend, Activate)
router.patch('/:id/status', async (req, res) => {
  try {
    const { status, reason, userId } = req.body;
    
    const vendor = await prisma.vendor.update({
      where: { id: req.params.id },
      data: { status }
    });
    
    await prisma.vendorAuditLog.create({
      data: {
        vendorId: vendor.id,
        action: `STATUS_CHANGED_${status.toUpperCase()}`,
        userId: userId || 'SYSTEM',
        details: reason || `Vendor status updated to ${status}`
      }
    });
    
    res.json(vendor);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 5. Add Vendor Contact
router.post('/:id/contacts', async (req, res) => {
  try {
    const contact = await prisma.vendorContact.create({
      data: { ...req.body, vendorId: req.params.id }
    });
    res.status(201).json(contact);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 6. Record Vendor Risk
router.post('/:id/risks', async (req, res) => {
  try {
    const risk = await prisma.vendorRisk.create({
      data: { ...req.body, vendorId: req.params.id }
    });
    res.status(201).json(risk);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
