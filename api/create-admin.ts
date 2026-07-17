import { PrismaClient } from '@prisma/client';
const crypto = require('crypto');

const prisma = new PrismaClient();

async function main() {
  const passwordHash = crypto.createHash('sha256').update('admin123').digest('hex');
  const employeePasswordHash = crypto.createHash('sha256').update('employee123').digest('hex');

  // Upsert Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@lizome.com' },
    update: {
      passwordHash: passwordHash,
      status: 'Active',
    },
    create: {
      email: 'admin@lizome.com',
      passwordHash: passwordHash,
      status: 'Active',
      // Provide defaults for any required fields
      firstName: 'System',
      lastName: 'Admin'
    }
  });

  // Upsert Employee
  const employee = await prisma.user.upsert({
    where: { email: 'employee@lizome.com' },
    update: {
      passwordHash: employeePasswordHash,
      status: 'Active',
    },
    create: {
      email: 'employee@lizome.com',
      passwordHash: employeePasswordHash,
      status: 'Active',
      firstName: 'Lizome',
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
