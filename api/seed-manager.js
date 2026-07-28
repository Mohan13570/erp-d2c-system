const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

const prisma = new PrismaClient();

async function main() {
  const passwordHash = crypto.createHash('sha256').update('employee123').digest('hex');

  // Ensure Manager role exists
  let mgrRole = await prisma.role.findFirst({ where: { name: 'Manager' } });
  if (!mgrRole) {
    mgrRole = await prisma.role.create({
      data: { name: 'Manager', description: 'Team Manager Role' }
    });
  }

  // Create or update manager@aura.com
  const managerUser = await prisma.user.upsert({
    where: { email: 'manager@aura.com' },
    update: { passwordHash, status: 'Active' },
    create: {
      email: 'manager@aura.com',
      passwordHash,
      status: 'Active',
      firstName: 'Mohan',
      lastName: 'Manager'
    }
  });

  // Assign Manager role
  const hasRole = await prisma.userRole.findFirst({
    where: { userId: managerUser.id, roleId: mgrRole.id }
  });

  if (!hasRole) {
    await prisma.userRole.create({
      data: { userId: managerUser.id, roleId: mgrRole.id }
    });
  }

  console.log('✅ Manager user manager@aura.com seeded successfully!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
