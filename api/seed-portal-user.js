const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  // Ensure a Customer record exists to link the portal user to
  let customer = await prisma.customer.findFirst();
  if (!customer) {
    customer = await prisma.customer.create({
      data: {
        customerName: 'Demo Company',
        legalName: 'Demo Company Pvt Ltd',
        email: 'demo@company.com',
        phone: '9999999999',
        status: 'Active',
      }
    });
    console.log('Created customer:', customer.id);
  } else {
    console.log('Using existing customer:', customer.id);
  }

  const passwordHash = await bcrypt.hash('portal123', 10);

  const portalUser = await prisma.customerUser.upsert({
    where: { email: 'customer@aura.com' },
    update: { passwordHash, isActive: true },
    create: {
      email: 'customer@aura.com',
      passwordHash,
      firstName: 'Demo',
      lastName: 'Customer',
      customerId: customer.id,
      role: 'Admin',
      isActive: true,
    }
  });

  console.log('✅ Portal user ready!');
  console.log('   Email:    customer@aura.com');
  console.log('   Password: portal123');
  console.log('   Customer ID:', portalUser.customerId);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
