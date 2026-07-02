const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function clearData() {
  console.log("Clearing old PO and GRN data...");
  try {
    await prisma.gRNItem.deleteMany();
    await prisma.goodsReceiptNote.deleteMany();
    await prisma.pOItem.deleteMany();
    await prisma.purchaseOrder.deleteMany();
    console.log("Data cleared successfully.");
  } catch (error) {
    console.error("Error clearing data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

clearData();
