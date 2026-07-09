import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class VendorOnboardingEngine {
  /**
   * Submit KYC documents for a vendor.
   */
  static async submitKYC(vendorId: string, documents: any[]) {
    // Save documents
    const docRecords = await Promise.all(documents.map(doc => 
      prisma.vendorKYC.create({
        data: {
          vendorId,
          documentType: doc.type,
          documentNumber: doc.number,
          documentUrl: doc.url,
          expiryDate: doc.expiryDate ? new Date(doc.expiryDate) : null,
          status: 'Pending'
        }
      })
    ));

    // Update Vendor Compliance Status to Pending KYC
    await prisma.vendorCompliance.upsert({
      where: { vendorId },
      update: { kycStatus: 'Pending' },
      create: { vendorId, kycStatus: 'Pending', amlClear: false }
    });

    // Create Approval Workflow
    await prisma.vendorApproval.create({
      data: {
        vendorId,
        approvalType: 'Registration',
        status: 'Pending',
        currentLevel: 1
      }
    });

    return docRecords;
  }

  /**
   * Internal Admin Action: Approve KYC
   */
  static async approveKYC(vendorId: string, adminId: string) {
    // Verify all pending documents
    await prisma.vendorKYC.updateMany({
      where: { vendorId, status: 'Pending' },
      data: { status: 'Verified', verifiedBy: adminId, verifiedAt: new Date() }
    });

    // Update Compliance
    await prisma.vendorCompliance.update({
      where: { vendorId },
      data: { kycStatus: 'Verified', complianceScore: 100 }
    });

    // Update Overall Vendor Status
    await prisma.vendor.update({
      where: { id: vendorId },
      data: { status: 'Active' }
    });

    // Create Notification for the Vendor
    await prisma.vendorNotification.create({
      data: {
        vendorId,
        title: 'Account Activated',
        message: 'Your KYC documents have been verified and your account is now active.',
        type: 'Approval'
      }
    });

    return true;
  }
}
