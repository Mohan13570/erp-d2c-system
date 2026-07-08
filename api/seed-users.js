const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');
const prisma = new PrismaClient();

async function main() {
  const passwordHash = crypto.createHash('sha256').update('admin123').digest('hex');

  // Check if admin role exists
  let adminRole = await prisma.role.findFirst({ where: { name: 'System Admin' } });
  if (!adminRole) {
    adminRole = await prisma.role.create({
      data: { name: 'System Admin', description: 'Super Administrator', isSystem: true, category: 'Administration' }
    });
  }

  // Check if user exists
  let user = await prisma.user.findUnique({ where: { email: 'admin@aura.com' } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: 'admin@aura.com',
        passwordHash,
        firstName: 'System',
        lastName: 'Admin',
        status: 'Active'
      }
    });
  } else {
    // Update password just in case
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash, status: 'Active' }
    });
  }

  // Check if userRole exists
  const userRole = await prisma.userRole.findFirst({
    where: { userId: user.id, roleId: adminRole.id }
  });

  if (!userRole) {
    await prisma.userRole.create({
      data: { userId: user.id, roleId: adminRole.id }
    });
  }

  console.log('✅ Admin user created/updated successfully: admin@aura.com / admin123');
}

main().catch(console.error).finally(() => prisma.$disconnect());
