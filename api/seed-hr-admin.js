const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Ensure HR Admin role exists
  let hrRole = await prisma.role.findFirst({ where: { name: 'HR Admin' } });
  if (!hrRole) {
    hrRole = await prisma.role.create({
      data: { name: 'HR Admin', description: 'HR Administrator Role' }
    });
  }

  const adminUser = await prisma.user.findUnique({ where: { email: 'admin@aura.com' } });
  if (adminUser) {
    const hasRole = await prisma.userRole.findFirst({
      where: { userId: adminUser.id, roleId: hrRole.id }
    });

    if (!hasRole) {
      await prisma.userRole.create({
        data: { userId: adminUser.id, roleId: hrRole.id }
      });
    }
  }

  console.log('✅ HR Admin role assigned to admin@aura.com');
}

main().catch(console.error).finally(() => prisma.$disconnect());
