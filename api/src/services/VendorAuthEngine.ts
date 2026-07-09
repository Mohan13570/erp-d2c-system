import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const VENDOR_JWT_SECRET = process.env.VENDOR_JWT_SECRET || 'fallback_vendor_secret';

export class VendorAuthEngine {
  /**
   * Generate an invite token and email for external vendor registration.
   */
  static async inviteVendor(email: string, adminId: string) {
    // Generate secure token (mocked with simple random for now)
    const token = Buffer.from(Math.random().toString() + Date.now().toString()).toString('base64');
    
    // Expires in 7 days
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const invite = await prisma.vendorInvitation.create({
      data: {
        email,
        token,
        expiresAt,
        invitedBy: adminId
      }
    });

    // Here we would use NodeMailer to send the invite email
    console.log(`[VendorAuth] Sent invite to ${email}. Token: ${token}`);

    return invite;
  }

  /**
   * Vendor User Login
   */
  static async login(email: string, passwordHash: string) {
    const user = await prisma.vendorUser.findUnique({ where: { email }});
    
    if (!user || user.passwordHash !== passwordHash || !user.isActive) {
      throw new Error("Invalid credentials or inactive account");
    }

    // Update login history
    await prisma.vendorUser.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    });

    // Generate JWT specific to vendors (isolated from standard employees)
    const token = jwt.sign(
      { userId: user.id, vendorId: user.vendorId, role: 'VendorUser' },
      VENDOR_JWT_SECRET,
      { expiresIn: '8h' }
    );

    return { token, user };
  }
}
