import { Router } from 'express';
import { CustomerOnboardingEngine } from '../services/CustomerOnboardingEngine';
import bcrypt from 'bcrypt';

const router = Router();

// --- In-Memory Settings Master Store for Customer Portal ---
interface CustomerSettings {
  customerId: string;
  displayName: string;
  email: string;
  phone: string;
  profilePhoto: string | null;
  pendingEmail: string | null;
  emailVerificationToken: string | null;
  passwordHash: string; // Default password: "Password123!"
  notifications: {
    emailShipmentUpdates: boolean;
    emailBillingAlerts: boolean;
    emailClaimsReturns: boolean;
    smsShipmentUpdates: boolean;
    smsBillingAlerts: boolean;
    smsClaimsReturns: boolean;
  };
  twoFactorEnabled: boolean;
  accountStatus: 'ACTIVE' | 'DEACTIVATION_PENDING_REVIEW' | 'DEACTIVATED';
  deactivationReason?: string;
  updatedAt: string;
}

// Initialized with default customer settings
const DEFAULT_PASSWORD = 'Password123!';
const DEFAULT_PASSWORD_HASH = bcrypt.hashSync(DEFAULT_PASSWORD, 10);

const customerSettingsStore: Record<string, CustomerSettings> = {
  'cust_901': {
    customerId: 'cust_901',
    displayName: 'Acme Corporation Admin',
    email: 'admin@acme.com',
    phone: '+1 (555) 234-5678',
    profilePhoto: null,
    pendingEmail: null,
    emailVerificationToken: null,
    passwordHash: DEFAULT_PASSWORD_HASH,
    notifications: {
      emailShipmentUpdates: true,
      emailBillingAlerts: true,
      emailClaimsReturns: false,
      smsShipmentUpdates: true,
      smsBillingAlerts: false,
      smsClaimsReturns: true,
    },
    twoFactorEnabled: false,
    accountStatus: 'ACTIVE',
    updatedAt: new Date().toISOString()
  }
};

const getOrCreateCustomerSettings = (customerId: string): CustomerSettings => {
  if (!customerSettingsStore[customerId]) {
    customerSettingsStore[customerId] = {
      customerId,
      displayName: 'Valued Customer',
      email: 'customer@company.com',
      phone: '+1 (555) 000-0000',
      profilePhoto: null,
      pendingEmail: null,
      emailVerificationToken: null,
      passwordHash: DEFAULT_PASSWORD_HASH,
      notifications: {
        emailShipmentUpdates: true,
        emailBillingAlerts: true,
        emailClaimsReturns: false,
        smsShipmentUpdates: true,
        smsBillingAlerts: false,
        smsClaimsReturns: true,
      },
      twoFactorEnabled: false,
      accountStatus: 'ACTIVE',
      updatedAt: new Date().toISOString()
    };
  }
  return customerSettingsStore[customerId];
};

// --- Registration & Onboarding ---
router.post('/register', async (req, res) => {
  try {
    const customer = await CustomerOnboardingEngine.registerCustomer(req.body);
    res.json(customer);
  } catch (err: any) { res.status(400).json({ error: err.message }); }
});

router.post('/invite', async (req, res) => {
  try {
    const invite = await CustomerOnboardingEngine.inviteCustomer(req.body.email);
    res.json(invite);
  } catch (err: any) { res.status(400).json({ error: err.message }); }
});

// --- Customer Settings APIs (Scoped to Authenticated Customer ID) ---

// 1. GET Customer Settings
router.get('/settings', (req, res) => {
  try {
    const customerId = (req.query.customerId as string) || (req.headers['x-customer-id'] as string) || 'cust_901';
    const settings = getOrCreateCustomerSettings(customerId);

    // Return settings omitting sensitive password hash
    const { passwordHash, emailVerificationToken, ...safeSettings } = settings;
    res.json({
      success: true,
      data: safeSettings
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. PUT Update Profile (Display Name & Phone)
router.put('/settings/profile', (req, res) => {
  try {
    const customerId = (req.body.customerId as string) || (req.headers['x-customer-id'] as string) || 'cust_901';
    const settings = getOrCreateCustomerSettings(customerId);

    if (req.body.displayName) settings.displayName = req.body.displayName;
    if (req.body.phone) settings.phone = req.body.phone;
    settings.updatedAt = new Date().toISOString();

    const { passwordHash, emailVerificationToken, ...safeSettings } = settings;
    res.json({
      success: true,
      message: 'Profile details updated successfully.',
      data: safeSettings
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. POST Upload / Remove Profile Photo
router.post('/settings/photo', (req, res) => {
  try {
    const customerId = (req.body.customerId as string) || (req.headers['x-customer-id'] as string) || 'cust_901';
    const settings = getOrCreateCustomerSettings(customerId);

    if (req.body.action === 'remove') {
      settings.profilePhoto = null;
    } else if (req.body.photoUrl) {
      settings.profilePhoto = req.body.photoUrl;
    }
    settings.updatedAt = new Date().toISOString();

    const { passwordHash, emailVerificationToken, ...safeSettings } = settings;
    res.json({
      success: true,
      message: req.body.action === 'remove' ? 'Profile picture removed.' : 'Profile picture updated successfully.',
      data: safeSettings
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. POST Request Email Change (Requires Current Password Verification)
router.post('/settings/request-email-change', async (req, res) => {
  try {
    const customerId = (req.body.customerId as string) || (req.headers['x-customer-id'] as string) || 'cust_901';
    const { currentPassword, newEmail } = req.body;

    if (!currentPassword || !newEmail) {
      return res.status(400).json({ success: false, error: 'Current password and new email are required.' });
    }

    const settings = getOrCreateCustomerSettings(customerId);

    // Verify current password server-side
    const isPasswordValid = await bcrypt.compare(currentPassword, settings.passwordHash);
    if (!isPasswordValid) {
      return res.status(400).json({ success: false, error: 'Current password verification failed. Please check your password.' });
    }

    if (newEmail === settings.email) {
      return res.status(400).json({ success: false, error: 'New email address must be different from current email.' });
    }

    // Generate Verification Token
    const verificationToken = `VERIFY-EMAIL-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    settings.pendingEmail = newEmail;
    settings.emailVerificationToken = verificationToken;
    settings.updatedAt = new Date().toISOString();

    const verificationLink = `http://localhost:5173/portal/verify-email?token=${verificationToken}`;

    res.json({
      success: true,
      message: `A verification link has been dispatched to ${newEmail}. Please click the link to confirm your new email address.`,
      data: {
        pendingEmail: newEmail,
        verificationToken,
        simulatedLink: verificationLink
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. POST Verify Email Change Token
router.post('/settings/verify-email', (req, res) => {
  try {
    const customerId = (req.body.customerId as string) || (req.headers['x-customer-id'] as string) || 'cust_901';
    const { token } = req.body;

    const settings = getOrCreateCustomerSettings(customerId);

    if (!settings.emailVerificationToken || settings.emailVerificationToken !== token) {
      return res.status(400).json({ success: false, error: 'Invalid or expired email verification token.' });
    }

    if (settings.pendingEmail) {
      settings.email = settings.pendingEmail;
      settings.pendingEmail = null;
      settings.emailVerificationToken = null;
      settings.updatedAt = new Date().toISOString();
    }

    const { passwordHash, emailVerificationToken, ...safeSettings } = settings;
    res.json({
      success: true,
      message: 'Email address successfully verified and updated!',
      data: safeSettings
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 6. POST Change Password (Requires Server-Side Current Password Validation)
router.post('/settings/change-password', async (req, res) => {
  try {
    const customerId = (req.body.customerId as string) || (req.headers['x-customer-id'] as string) || 'cust_901';
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ success: false, error: 'Current password, new password, and confirmation are required.' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, error: 'New password and confirmation password do not match.' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, error: 'New password must be at least 8 characters long.' });
    }

    const settings = getOrCreateCustomerSettings(customerId);

    // Server-side validation of current password
    const isPasswordValid = await bcrypt.compare(currentPassword, settings.passwordHash);
    if (!isPasswordValid) {
      return res.status(400).json({ success: false, error: 'Current password verification failed. Please re-enter your current password.' });
    }

    // Hash and store new password
    settings.passwordHash = await bcrypt.hash(newPassword, 10);
    settings.updatedAt = new Date().toISOString();

    res.json({
      success: true,
      message: 'Password changed successfully! Your account credentials have been updated.'
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 7. PUT Notification Preferences
router.put('/settings/notifications', (req, res) => {
  try {
    const customerId = (req.body.customerId as string) || (req.headers['x-customer-id'] as string) || 'cust_901';
    const settings = getOrCreateCustomerSettings(customerId);

    if (req.body.notifications) {
      settings.notifications = {
        ...settings.notifications,
        ...req.body.notifications
      };
    }
    settings.updatedAt = new Date().toISOString();

    const { passwordHash, emailVerificationToken, ...safeSettings } = settings;
    res.json({
      success: true,
      message: 'Notification preferences updated successfully.',
      data: safeSettings
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 8. POST Deactivate Account
router.post('/settings/deactivate', async (req, res) => {
  try {
    const customerId = (req.body.customerId as string) || (req.headers['x-customer-id'] as string) || 'cust_901';
    const { currentPassword, reason } = req.body;

    if (!currentPassword) {
      return res.status(400).json({ success: false, error: 'Current password is required to request account deactivation.' });
    }

    const settings = getOrCreateCustomerSettings(customerId);

    // Verify current password server-side
    const isPasswordValid = await bcrypt.compare(currentPassword, settings.passwordHash);
    if (!isPasswordValid) {
      return res.status(400).json({ success: false, error: 'Current password verification failed.' });
    }

    settings.accountStatus = 'DEACTIVATION_PENDING_REVIEW';
    settings.deactivationReason = reason || 'User requested account deactivation via settings.';
    settings.updatedAt = new Date().toISOString();

    res.json({
      success: true,
      message: 'Deactivation request submitted successfully. Your request has been logged for administrative review.'
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- Documents Module (Customer Scoped & Read-Only) ---

interface CustomerDocumentRecord {
  id: string;
  customerId: string;
  shipmentId: string;
  origin: string;
  destination: string;
  serviceType: string;
  tradeType: string;
  shipmentStatus: string;
  docType: 'Commercial Invoice' | 'Bill of Lading' | 'Packing List' | 'Proof of Delivery' | 'Customs Declaration';
  dateGenerated: string;
  fileSize: string;
  status: 'AVAILABLE' | 'NOT_YET_AVAILABLE';
  availabilityReason?: string;
  cargoDetails: any;
}

const mockCustomerDocuments: CustomerDocumentRecord[] = [
  {
    id: 'DOC-INV-SHP-8902',
    customerId: 'cust_901',
    shipmentId: 'SHP-8902',
    origin: 'Mumbai (MMR), India',
    destination: 'Hamburg, Germany',
    serviceType: 'Ocean FCL (40ft High Cube)',
    tradeType: 'Export',
    shipmentStatus: 'IN_TRANSIT',
    docType: 'Commercial Invoice',
    dateGenerated: '2026-07-20T10:30:00.000Z',
    fileSize: '245 KB',
    status: 'AVAILABLE',
    cargoDetails: {
      senderDetails: { companyName: 'Acme Logistics India Pvt Ltd', line1: 'Plot 45, SEEPZ Andheri', city: 'Mumbai', country: 'India', postalCode: '400096' },
      receiverDetails: { companyName: 'Global Freight Systems GmBH', line1: 'Hafenstrasse 12', city: 'Hamburg', country: 'Germany', postalCode: '20457' },
      bookingInfo: { serviceType: 'Ocean FCL', tradeType: 'Export', currency: 'USD' },
      cargoInformation: [{ commodity: 'Precision Auto Parts', hsCode: '8708.29', packageType: 'Pallet', numberOfPackages: 24, grossWeight: 14500 }]
    }
  },
  {
    id: 'DOC-BOL-SHP-8902',
    customerId: 'cust_901',
    shipmentId: 'SHP-8902',
    origin: 'Mumbai (MMR), India',
    destination: 'Hamburg, Germany',
    serviceType: 'Ocean FCL (40ft High Cube)',
    tradeType: 'Export',
    shipmentStatus: 'IN_TRANSIT',
    docType: 'Bill of Lading',
    dateGenerated: '2026-07-21T08:15:00.000Z',
    fileSize: '380 KB',
    status: 'AVAILABLE',
    cargoDetails: {
      senderDetails: { companyName: 'Acme Logistics India Pvt Ltd', line1: 'Plot 45, SEEPZ Andheri', city: 'Mumbai', country: 'India', postalCode: '400096' },
      receiverDetails: { companyName: 'Global Freight Systems GmBH', line1: 'Hafenstrasse 12', city: 'Hamburg', country: 'Germany', postalCode: '20457' },
      bookingInfo: { serviceType: 'Ocean FCL', tradeType: 'Export', currency: 'USD' },
      cargoInformation: [{ commodity: 'Precision Auto Parts', hsCode: '8708.29', packageType: 'Pallet', numberOfPackages: 24, grossWeight: 14500 }]
    }
  },
  {
    id: 'DOC-PKG-SHP-8902',
    customerId: 'cust_901',
    shipmentId: 'SHP-8902',
    origin: 'Mumbai (MMR), India',
    destination: 'Hamburg, Germany',
    serviceType: 'Ocean FCL (40ft High Cube)',
    tradeType: 'Export',
    shipmentStatus: 'IN_TRANSIT',
    docType: 'Packing List',
    dateGenerated: '2026-07-20T11:00:00.000Z',
    fileSize: '190 KB',
    status: 'AVAILABLE',
    cargoDetails: {
      senderDetails: { companyName: 'Acme Logistics India Pvt Ltd', line1: 'Plot 45, SEEPZ Andheri', city: 'Mumbai', country: 'India', postalCode: '400096' },
      receiverDetails: { companyName: 'Global Freight Systems GmBH', line1: 'Hafenstrasse 12', city: 'Hamburg', country: 'Germany', postalCode: '20457' },
      bookingInfo: { serviceType: 'Ocean FCL', tradeType: 'Export', currency: 'USD' },
      cargoInformation: [{ commodity: 'Precision Auto Parts', hsCode: '8708.29', packageType: 'Pallet', numberOfPackages: 24, grossWeight: 14500 }]
    }
  },
  {
    id: 'DOC-POD-SHP-8902',
    customerId: 'cust_901',
    shipmentId: 'SHP-8902',
    origin: 'Mumbai (MMR), India',
    destination: 'Hamburg, Germany',
    serviceType: 'Ocean FCL (40ft High Cube)',
    tradeType: 'Export',
    shipmentStatus: 'IN_TRANSIT',
    docType: 'Proof of Delivery',
    dateGenerated: '-',
    fileSize: '-',
    status: 'NOT_YET_AVAILABLE',
    availabilityReason: 'Proof of Delivery (POD) becomes available once shipment is marked Delivered.',
    cargoDetails: null
  },
  {
    id: 'DOC-CUST-SHP-8902',
    customerId: 'cust_901',
    shipmentId: 'SHP-8902',
    origin: 'Mumbai (MMR), India',
    destination: 'Hamburg, Germany',
    serviceType: 'Ocean FCL (40ft High Cube)',
    tradeType: 'Export',
    shipmentStatus: 'IN_TRANSIT',
    docType: 'Customs Declaration',
    dateGenerated: '2026-07-21T14:20:00.000Z',
    fileSize: '410 KB',
    status: 'AVAILABLE',
    cargoDetails: {
      senderDetails: { companyName: 'Acme Logistics India Pvt Ltd', line1: 'Plot 45, SEEPZ Andheri', city: 'Mumbai', country: 'India', postalCode: '400096' },
      receiverDetails: { companyName: 'Global Freight Systems GmBH', line1: 'Hafenstrasse 12', city: 'Hamburg', country: 'Germany', postalCode: '20457' },
      bookingInfo: { serviceType: 'Ocean FCL', tradeType: 'Export', currency: 'USD' },
      cargoInformation: [{ commodity: 'Precision Auto Parts', hsCode: '8708.29', packageType: 'Pallet', numberOfPackages: 24, grossWeight: 14500 }]
    }
  },
  {
    id: 'DOC-INV-SHP-4401',
    customerId: 'cust_901',
    shipmentId: 'SHP-4401',
    origin: 'Bangalore, India',
    destination: 'Singapore Port',
    serviceType: 'Air Freight Priority',
    tradeType: 'Export',
    shipmentStatus: 'DELIVERED',
    docType: 'Commercial Invoice',
    dateGenerated: '2026-07-15T09:00:00.000Z',
    fileSize: '210 KB',
    status: 'AVAILABLE',
    cargoDetails: {
      senderDetails: { companyName: 'Acme Logistics India Pvt Ltd', line1: 'Electronic City Phase 1', city: 'Bangalore', country: 'India', postalCode: '560100' },
      receiverDetails: { companyName: 'SGP Semiconductor Logistics', line1: 'Changi Business Park', city: 'Singapore', country: 'Singapore', postalCode: '486048' },
      bookingInfo: { serviceType: 'Air Freight', tradeType: 'Export', currency: 'USD' },
      cargoInformation: [{ commodity: 'Semiconductor Chips', hsCode: '8542.31', packageType: 'Carton', numberOfPackages: 10, grossWeight: 320 }]
    }
  },
  {
    id: 'DOC-POD-SHP-4401',
    customerId: 'cust_901',
    shipmentId: 'SHP-4401',
    origin: 'Bangalore, India',
    destination: 'Singapore Port',
    serviceType: 'Air Freight Priority',
    tradeType: 'Export',
    shipmentStatus: 'DELIVERED',
    docType: 'Proof of Delivery',
    dateGenerated: '2026-07-18T16:45:00.000Z',
    fileSize: '315 KB',
    status: 'AVAILABLE',
    cargoDetails: {
      senderDetails: { companyName: 'Acme Logistics India Pvt Ltd', line1: 'Electronic City Phase 1', city: 'Bangalore', country: 'India', postalCode: '560100' },
      receiverDetails: { companyName: 'SGP Semiconductor Logistics', line1: 'Changi Business Park', city: 'Singapore', country: 'Singapore', postalCode: '486048' },
      bookingInfo: { serviceType: 'Air Freight', tradeType: 'Export', currency: 'USD' },
      cargoInformation: [{ commodity: 'Semiconductor Chips', hsCode: '8542.31', packageType: 'Carton', numberOfPackages: 10, grossWeight: 320 }]
    }
  },
  // Other Customer Document (cust_999) - Used for 403 Forbidden Scoping Test
  {
    id: 'DOC-INV-SHP-9999',
    customerId: 'cust_999',
    shipmentId: 'SHP-9999',
    origin: 'Dubai, UAE',
    destination: 'London, UK',
    serviceType: 'Ocean FCL',
    tradeType: 'Export',
    shipmentStatus: 'IN_TRANSIT',
    docType: 'Commercial Invoice',
    dateGenerated: '2026-07-10T12:00:00.000Z',
    fileSize: '290 KB',
    status: 'AVAILABLE',
    cargoDetails: {
      senderDetails: { companyName: 'Unrelated Overseas Corp', line1: 'Jebel Ali Free Zone', city: 'Dubai', country: 'UAE', postalCode: '00000' },
      receiverDetails: { companyName: 'London Import Co', line1: 'Docklands', city: 'London', country: 'UK', postalCode: 'E14 5AB' },
      bookingInfo: { serviceType: 'Ocean FCL', tradeType: 'Export', currency: 'USD' },
      cargoInformation: [{ commodity: 'Textiles', hsCode: '5208.11', packageType: 'Bale', numberOfPackages: 50, grossWeight: 5000 }]
    }
  }
];

// GET List Documents for Logged-In Customer
router.get('/documents', async (req, res) => {
  try {
    const customerId = (req.query.customerId as string) || (req.headers['x-customer-id'] as string) || 'cust_901';
    const { docType, shipmentId, search } = req.query;

    // Strict Customer ID Scoping
    let filtered = mockCustomerDocuments.filter(doc => doc.customerId === customerId);

    if (docType && docType !== 'ALL') {
      filtered = filtered.filter(doc => doc.docType === docType);
    }

    if (shipmentId && shipmentId !== 'ALL') {
      filtered = filtered.filter(doc => doc.shipmentId === shipmentId);
    }

    if (search) {
      const q = (search as string).toLowerCase();
      filtered = filtered.filter(doc =>
        doc.id.toLowerCase().includes(q) ||
        doc.shipmentId.toLowerCase().includes(q) ||
        doc.docType.toLowerCase().includes(q) ||
        doc.origin.toLowerCase().includes(q) ||
        doc.destination.toLowerCase().includes(q)
      );
    }

    // Group documents by shipment
    const groupedByShipment: Record<string, { shipmentId: string; origin: string; destination: string; status: string; serviceType: string; documents: CustomerDocumentRecord[] }> = {};

    filtered.forEach(doc => {
      if (!groupedByShipment[doc.shipmentId]) {
        groupedByShipment[doc.shipmentId] = {
          shipmentId: doc.shipmentId,
          origin: doc.origin,
          destination: doc.destination,
          status: doc.shipmentStatus,
          serviceType: doc.serviceType,
          documents: []
        };
      }
      groupedByShipment[doc.shipmentId].documents.push(doc);
    });

    res.json({
      success: true,
      customerId,
      totalCount: filtered.length,
      shipmentsCount: Object.keys(groupedByShipment).length,
      groupedShipments: Object.values(groupedByShipment),
      rawDocuments: filtered
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET Download Document with Strict Scoping Enforcement (403 Test Case)
router.get('/documents/:docId/download', async (req, res) => {
  try {
    const customerId = (req.query.customerId as string) || (req.headers['x-customer-id'] as string) || 'cust_901';
    const { docId } = req.params;

    const targetDoc = mockCustomerDocuments.find(d => d.id === docId);

    if (!targetDoc) {
      return res.status(404).json({ success: false, error: 'Document record not found.' });
    }

    // ── Backend Scoping Test Case: Confirm customer_id match ─────────────────
    if (targetDoc.customerId !== customerId) {
      return res.status(403).json({
        success: false,
        error: `403 Forbidden: Access Denied. Document ${docId} belongs to a different customer ID (${targetDoc.customerId}) and cannot be accessed by customer ${customerId}.`
      });
    }

    // On-demand Availability Check
    if (targetDoc.status === 'NOT_YET_AVAILABLE') {
      return res.status(400).json({
        success: false,
        error: targetDoc.availabilityReason || 'Document is not yet available for download.'
      });
    }

    res.json({
      success: true,
      data: targetDoc
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- Read APIs ---
router.get('/', async (req, res) => {
  try {
    const customers = await CustomerOnboardingEngine.getCustomers();
    res.json(customers);
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const customer = await CustomerOnboardingEngine.getCustomerById(req.params.id);
    if (!customer) return res.status(404).json({ error: "Customer not found" });
    res.json(customer);
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

// --- Workflow ---
router.put('/:id/approve', async (req, res) => {
  try {
    const customer = await CustomerOnboardingEngine.approveCustomer(req.params.id);
    res.json(customer);
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

export default router;
