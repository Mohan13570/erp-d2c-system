import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database with realistic test data...');

  // 1. Seed CRM Customers
  const customer1 = await prisma.customer.create({
    data: { customerName: 'Global Logistics Inc', customerGroup: 'Commercial', territory: 'NA', email: 'contact@global-log.com', phone: '+1-555-0192' }
  });

  // 2. Seed CRM Leads & Opportunities
  const lead1 = await prisma.lead.create({
    data: { firstName: 'Jane', lastName: 'Doe', companyName: 'TechNova', email: 'jane@technova.com', status: 'Prospecting', source: 'Website' }
  });

  const opp1 = await prisma.opportunity.create({
    data: { 
      leadId: lead1.id, customerId: customer1.id, 
      name: 'Global Logistics SLA Renewal', 
      stage: 'Negotiation', amount: 500000, 
      expectedClose: new Date('2026-08-15')
    }
  });

  // 3. Seed RFQ & Quotation
  const rfq1 = await prisma.rFQ.create({
    data: {
      customerId: customer1.id,
      origin: 'CNSHA',
      destination: 'USLAX',
      freightType: 'Ocean',
      status: 'Open'
    }
  });

  const quote1 = await prisma.quotation.create({
    data: {
      rfqId: rfq1.id,
      validUntil: new Date('2026-07-31'),
      totalAmount: 14500,
      status: 'Draft'
    }
  });

  // 4. Seed Ocean Booking & Customs Declaration
  const booking1 = await prisma.oceanBooking.create({
    data: {
      bookingNumber: 'BKG-OCN-1002',
      freightType: 'FCL',
      status: 'Confirmed'
    }
  });

  const declaration = await prisma.oceanCustomsDeclaration.create({
    data: {
      bookingId: booking1.id,
      billOfEntryNo: 'BOE-773-891',
      status: 'Pending',
      totalDutyAmount: 3450.00
    }
  });

  console.log('✅ Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
