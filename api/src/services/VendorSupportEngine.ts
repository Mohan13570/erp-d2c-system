import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class VendorSupportEngine {
  static async createTicket(vendorId: string, payload: any) {
    const ticketNumber = `TKT-${Date.now()}`;
    return prisma.vendorSupportTicket.create({
      data: {
        ticketNumber,
        vendorId,
        category: payload.category,
        priority: payload.priority,
        subject: payload.subject,
        description: payload.description
      }
    });
  }

  static async getTickets(vendorId: string) {
    return prisma.vendorSupportTicket.findMany({
      where: { vendorId },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async updateTicketStatus(ticketId: string, status: string, resolution?: string) {
    return prisma.vendorSupportTicket.update({
      where: { id: ticketId },
      data: { status, resolution, updatedAt: new Date() }
    });
  }
}
