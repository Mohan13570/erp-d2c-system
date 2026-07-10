import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class CustomerOnboardingEngine {
  /**
   * Initial Registration Request
   */
  static async registerCustomer(payload: any) {
    // 1. Duplicate Checks
    if (payload.profile?.gstNumber) {
      const existingGst = await prisma.customerProfile.findUnique({
        where: { gstNumber: payload.profile.gstNumber }
      });
      if (existingGst) throw new Error("A customer with this GST number is already registered.");
    }
    
    if (payload.profile?.panNumber) {
      const existingPan = await prisma.customerProfile.findUnique({
        where: { panNumber: payload.profile.panNumber }
      });
      if (existingPan) throw new Error("A customer with this PAN number is already registered.");
    }

    // 2. Insert Customer Graph (Transaction)
    const customer = await prisma.$transaction(async (tx) => {
      // Base Customer
      const cust = await tx.customer.create({
        data: {
          legalName: payload.legalName,
          tradeName: payload.tradeName,
          customerName: payload.tradeName || payload.legalName, // Backwards compat
          email: payload.email,
          phone: payload.phone,
          status: 'Pending Approval'
        }
      });

      // Profile
      if (payload.profile) {
        await tx.customerProfile.create({
          data: {
            customerId: cust.id,
            companyType: payload.profile.companyType,
            industry: payload.profile.industry,
            gstNumber: payload.profile.gstNumber,
            panNumber: payload.profile.panNumber,
            businessDesc: payload.profile.businessDesc
          }
        });
      }

      // Address
      if (payload.address) {
        await tx.b2BCustomerAddress.create({
          data: {
            customerId: cust.id,
            type: 'Registered',
            addressLine1: payload.address.addressLine1,
            city: payload.address.city,
            state: payload.address.state,
            country: payload.address.country,
            zipCode: payload.address.zipCode,
            isPrimary: true
          }
        });
      }

      // Contact
      if (payload.contact) {
        await tx.customerContact.create({
          data: {
            customerId: cust.id,
            firstName: payload.contact.firstName,
            lastName: payload.contact.lastName,
            email: payload.contact.email,
            phone: payload.contact.phone,
            isPrimary: true
          }
        });
      }

      // Initial Compliance Record
      await tx.customerCompliance.create({
        data: {
          customerId: cust.id,
          complianceScore: 50.0, // Base Score
          riskLevel: 'Medium'
        }
      });

      return cust;
    });

    return customer;
  }

  static async getCustomers() {
    return prisma.customer.findMany({
      include: {
        profile: true,
        addresses: true,
        compliance: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async getCustomerById(id: string) {
    return prisma.customer.findUnique({
      where: { id },
      include: {
        profile: true,
        addresses: true,
        contacts: true,
        banks: true,
        documents: true,
        compliance: true,
        kyc: true,
        branches: true
      }
    });
  }

  static async approveCustomer(id: string) {
    // Elevate compliance score on manual approval
    await prisma.customerCompliance.update({
      where: { customerId: id },
      data: { complianceScore: 100.0, riskLevel: 'Low' }
    });

    return prisma.customer.update({
      where: { id },
      data: { status: 'Active' }
    });
  }

  static async inviteCustomer(email: string) {
    // Generate secure token and send email
    const token = `INV-${Date.now()}-${Math.floor(Math.random()*1000)}`;
    
    const customer = await prisma.customer.create({
      data: {
        legalName: "Invited Customer",
        customerName: "Invited Customer",
        email: email,
        status: "Draft"
      }
    });

    const invite = await prisma.customerInvitation.create({
      data: {
        customerId: customer.id,
        email: email,
        token: token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      }
    });

    return invite;
  }
}
