const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

const prisma = new PrismaClient();

async function main() {
  const passwordHash = crypto.createHash('sha256').update('admin123').digest('hex');
  const employeePasswordHash = crypto.createHash('sha256').update('employee123').digest('hex');

  await prisma.user.upsert({
    where: { email: 'admin@aura.com' },
    update: {
      passwordHash: passwordHash,
      status: 'Active',
    },
    create: {
      email: 'admin@aura.com',
      passwordHash: passwordHash,
      status: 'Active',
      firstName: 'System',
      lastName: 'Admin'
    }
  });

  await prisma.user.upsert({
    where: { email: 'employee@aura.com' },
    update: {
      passwordHash: employeePasswordHash,
      status: 'Active',
    },
    create: {
      email: 'employee@aura.com',
      passwordHash: employeePasswordHash,
      status: 'Active',
      firstName: 'Aura',
      lastName: 'Employee'
    }
  });

  console.log('✅ Admin and Employee users seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
