import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class VendorAnalyticsEngine {
  static async getPerformanceMetrics(vendorId: string) {
    // Generate mock KPIs for the Vendor BI dashboard
    const metrics = await prisma.vendorPerformanceMetric.findMany({
      where: { vendorId },
      orderBy: { createdAt: 'desc' },
      take: 6 // last 6 months
    });
    
    if (metrics.length === 0) {
      // Seed some mock data if empty
      const months = ["2026-02", "2026-03", "2026-04", "2026-05", "2026-06", "2026-07"];
      for (const m of months) {
        await prisma.vendorPerformanceMetric.create({
          data: {
            vendorId,
            month: m,
            onTimeDelivery: 85 + Math.random() * 15,
            invoiceAccuracy: 90 + Math.random() * 10,
            qualityScore: 4 + Math.random() * 1
          }
        });
      }
      return prisma.vendorPerformanceMetric.findMany({
        where: { vendorId },
        orderBy: { month: 'asc' }
      });
    }

    return metrics.reverse();
  }

  static async getKnowledgeBase() {
    return prisma.vendorKnowledgeArticle.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' }
    });
  }
}
