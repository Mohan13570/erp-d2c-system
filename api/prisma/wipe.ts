import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Wiping database content...');

  // Delete transaction-dependent records first
  await prisma.stockLedgerEntry.deleteMany({});
  await prisma.salesOrderItem.deleteMany({});
  await prisma.salesOrder.deleteMany({});
  
  // Delete catalog and stock levels
  await prisma.stockLevel.deleteMany({});
  await prisma.item.deleteMany({});
  await prisma.warehouse.deleteMany({});
  
  // Delete mock employees and customers (keep admin)
  await prisma.user.deleteMany({
    where: { email: { not: 'admin@aura.com' } }
  });
  await prisma.d2CCustomer.deleteMany({});

  console.log('Wipe complete. Clean slate ready.');
}

main()
  .catch((e) => {
    console.error(e);
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
