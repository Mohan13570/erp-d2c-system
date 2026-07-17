import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Minimal Database...');

  // 1. Create Company "Lizome"
  const company = await prisma.company.upsert({
    where: { name: 'Lizome' },
    update: {},
    create: {
      name: 'Lizome',
      abbr: 'AR',
      defaultCurrency: 'USD',
      country: 'US',
    },
  });
  console.log(`Company: ${company.name}`);

  // 2. Create Roles
  const adminRole = await prisma.role.upsert({
    where: { name: 'System Admin' },
    update: {},
    create: { name: 'System Admin', isSystem: true, description: 'Full access to all modules' },
  });

  const employeeRole = await prisma.role.upsert({
    where: { name: 'Employee' },
    update: {},
    create: { name: 'Employee', isSystem: false, description: 'Standard employee access' },
  });

  // 3. Create Admin User
  const adminPassword = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@lizome.com' },
    update: { passwordHash: adminPassword, firstName: 'Lizome', lastName: 'Admin' },
    create: {
      email: 'admin@lizome.com',
      passwordHash: adminPassword,
      firstName: 'Lizome',
      lastName: 'Admin',
      roleId: adminRole.id,
    },
  });
  console.log(`Admin user created: ${adminUser.email}`);

  console.log('Minimal seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
