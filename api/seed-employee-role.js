const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      userRoles: {
        select: {
          role: { select: { name: true } }
        }
      }
    }
  });
  console.log('USERS IN DB:', JSON.stringify(users, null, 2));

  // Let's also check Role model
  let empRole = await prisma.role.findFirst({ where: { name: 'Employee' } });
  if (!empRole) {
    empRole = await prisma.role.create({
      data: { name: 'Employee', description: 'Employee Workspace Role' }
    });
    console.log('Created Employee Role:', empRole);
  }

  // Ensure employee@aura.com has Employee role
  const empUser = users.find(u => u.email === 'employee@aura.com');
  if (empUser) {
    const hasRole = empUser.userRoles.some(ur => ur.role.name === 'Employee');
    if (!hasRole) {
      await prisma.userRole.create({
        data: {
          userId: empUser.id,
          roleId: empRole.id
        }
      });
      console.log('Assigned Employee role to employee@aura.com');
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
