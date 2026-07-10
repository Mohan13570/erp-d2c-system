import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class VendorChatEngine {
  static async sendMessage(vendorId: string, sender: string, message: string) {
    return prisma.vendorChatMessage.create({
      data: {
        vendorId,
        sender,
        message
      }
    });
  }

  static async getHistory(vendorId: string) {
    return prisma.vendorChatMessage.findMany({
      where: { vendorId },
      orderBy: { createdAt: 'asc' }
    });
  }
}
