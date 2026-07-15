import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function checkAndGenerateLowStockAlert(itemCode: string, warehouseName: string) {
  try {
    const stock = await prisma.stockLevel.findFirst({
      where: { itemCode, warehouseName },
      include: { item: true }
    });
    
    if (stock && stock.item.minimum_stock > 0 && stock.qtyAvailable < stock.item.minimum_stock) {
      const message = `Low Stock Alert: ${stock.item.itemName} (${itemCode}) in ${warehouseName} has fallen below the minimum stock level. Available: ${stock.qtyAvailable}, Minimum: ${stock.item.minimum_stock}`;
      
      // Avoid spamming if same alert was sent recently (last 24 hours)
      const recentNotification = await prisma.notificationLog.findFirst({
        where: {
          recipient: 'Inventory Manager',
          subject: 'Low Stock Alert',
          message: { contains: itemCode },
          sentAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
        }
      });

      if (!recentNotification) {
        await prisma.notificationLog.create({
          data: {
            channel: 'System',
            recipient: 'Inventory Manager',
            subject: 'Low Stock Alert',
            message: message,
            status: 'Delivered'
          }
        });
        console.log(`[Low Stock Alert Generated]: ${message}`);
      }
    }
  } catch (error) {
    console.error('[Low Stock Alert Checking Error]:', error);
  }
}
