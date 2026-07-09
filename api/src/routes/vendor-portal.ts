import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { VendorOnboardingEngine } from '../services/VendorOnboardingEngine';
import { VendorAuthEngine } from '../services/VendorAuthEngine';

const router = Router();
const prisma = new PrismaClient();

// ==========================================
// VENDOR PORTAL - PUBLIC/EXTERNAL
// ==========================================

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    // Password should be hashed, using raw for mockup
    const result = await VendorAuthEngine.login(email, password);
    res.json(result);
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { token, legalName, email, password } = req.body;
    
    // Verify invitation token
    const invite = await prisma.vendorInvitation.findUnique({ where: { token }});
    if (!invite || invite.status !== 'Pending' || invite.expiresAt < new Date()) {
      return res.status(400).json({ error: 'Invalid or expired invitation' });
    }

    // Create Vendor
    const vendor = await prisma.vendor.create({
      data: {
        name: legalName,
        email: invite.email,
        status: 'Pending',
        profile: {
          create: { legalName }
        }
      }
    });

    // Create Vendor User
    const user = await prisma.vendorUser.create({
      data: {
        vendorId: vendor.id,
        email: email || invite.email,
        passwordHash: password,
        firstName: 'Primary',
        lastName: 'Contact'
      }
    });

    // Mark invitation accepted
    await prisma.vendorInvitation.update({
      where: { id: invite.id },
      data: { status: 'Accepted', vendorId: vendor.id }
    });

    res.json({ vendor, user });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// VENDOR PORTAL - INTERNAL ADMIN
// ==========================================

router.get('/', async (req, res) => {
  try {
    const vendors = await prisma.vendor.findMany({
      include: {
        profile: true,
        compliance: true
      },
      take: 100
    });
    res.json(vendors);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:id/approve', async (req, res) => {
  try {
    // In reality, get adminId from auth token
    const result = await VendorOnboardingEngine.approveKYC(req.params.id, 'admin_123');
    res.json({ success: result });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/invite', async (req, res) => {
  try {
    const { email } = req.body;
    const invite = await VendorAuthEngine.inviteVendor(email, 'admin_123');
    res.json(invite);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
