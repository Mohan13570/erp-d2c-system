import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Massive 10x Database...');

  // 1. Create Company "Aura"
  const company = await prisma.company.upsert({
    where: { name: 'Aura' },
    update: {},
    create: { name: 'Aura', abbr: 'AR', defaultCurrency: 'USD', country: 'US' },
  });
  console.log(`Company: ${company.name}`);

  // 2. Create Roles
  const adminRole = await prisma.role.upsert({
    where: { name: 'System Admin' },
    update: {},
    create: { name: 'System Admin', isSystem: true, description: 'Full access' },
  });
  const employeeRole = await prisma.role.upsert({
    where: { name: 'Employee' },
    update: {},
    create: { name: 'Employee', isSystem: false, description: 'Standard access' },
  });
  const managerRole = await prisma.role.upsert({
    where: { name: 'Manager' },
    update: {},
    create: { name: 'Manager', isSystem: false, description: 'Management access' },
  });

  // 3. Create Admin User
  const adminPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@aura.com' },
    update: { passwordHash: adminPassword },
    create: { email: 'admin@aura.com', passwordHash: adminPassword, firstName: 'Aura', lastName: 'Admin', roleId: adminRole.id },
  });
  console.log('Created Admin User: admin@aura.com');

  // 4. Create 10 Employees
  const empNames = [
    { f: 'John', l: 'Doe' }, { f: 'Jane', l: 'Smith' }, { f: 'Michael', l: 'Johnson' },
    { f: 'Sarah', l: 'Williams' }, { f: 'David', l: 'Brown' }, { f: 'Emily', l: 'Jones' },
    { f: 'James', l: 'Garcia' }, { f: 'Jessica', l: 'Miller' }, { f: 'William', l: 'Davis' },
    { f: 'Ashley', l: 'Rodriguez' }
  ];
  
  console.log('Creating 10 Employees...');
  for (let i = 0; i < 10; i++) {
    const email = `emp${i+1}@aura.com`;
    const password = await bcrypt.hash('employee123', 10);
    await prisma.user.upsert({
      where: { email },
      update: {},
      create: { 
        email, 
        passwordHash: password, 
        firstName: empNames[i].f, 
        lastName: empNames[i].l, 
        roleId: i % 3 === 0 ? managerRole.id : employeeRole.id 
      },
    });
  }

  // 5. Create Warehouse
  const warehouse = await prisma.warehouse.upsert({
    where: { name: 'Aura Main Warehouse' },
    update: {},
    create: { name: 'Aura Main Warehouse', companyName: 'Aura' },
  });

  // 6. Create 10 Items
  const itemsData = [
    { c: 'ITEM-001', n: 'Premium Wireless Headphones', rate: 199.99, val: 90 },
    { c: 'ITEM-002', n: 'Ergonomic Office Chair', rate: 299.00, val: 120 },
    { c: 'ITEM-003', n: 'Mechanical Keyboard (Red Switch)', rate: 149.50, val: 65 },
    { c: 'ITEM-004', n: 'Ultra-wide 34" Monitor', rate: 499.99, val: 350 },
    { c: 'ITEM-005', n: 'Smart Watch Series X', rate: 399.00, val: 200 },
    { c: 'ITEM-006', n: 'Bluetooth Speaker Portable', rate: 59.99, val: 25 },
    { c: 'ITEM-007', n: 'Noise Cancelling Earbuds', rate: 129.99, val: 55 },
    { c: 'ITEM-008', n: 'Standing Desk Pro', rate: 599.00, val: 300 },
    { c: 'ITEM-009', n: 'Webcam 4K HD', rate: 89.99, val: 40 },
    { c: 'ITEM-010', n: 'USB-C Hub 8-in-1', rate: 45.00, val: 15 },
  ];

  console.log('Creating 10 Items & Stock Levels...');
  for (const item of itemsData) {
    await prisma.item.upsert({
      where: { itemCode: item.c },
      update: {},
      create: { itemCode: item.c, itemName: item.n, standardRate: item.rate, valuationRate: item.val, companyName: 'Aura' },
    });
    // Add Stock Level
    await prisma.stockLevel.upsert({
      where: { itemCode_warehouseName: { itemCode: item.c, warehouseName: warehouse.name } },
      update: {},
      create: { itemCode: item.c, warehouseName: warehouse.name, qtyOnHand: Math.floor(Math.random() * 500) + 50, qtyAvailable: Math.floor(Math.random() * 500) + 50 },
    });
    // Add Ledger Entry
    await prisma.stockLedgerEntry.create({
      data: { itemCode: item.c, warehouse: warehouse.name, qty: 100, voucherType: 'Initial Receipt', voucherNo: `RCPT-${item.c}`, postingDate: new Date() }
    });
  }

  // 7. Create 10 Customers (B2B)
  const customers = [];
  for(let i=1; i<=10; i++) {
    const cust = await prisma.customer.create({
      data: { customerName: `Corporate Client ${i}`, customerGroup: 'Commercial', email: `contact@client${i}.com` }
    });
    customers.push(cust);
  }

  // 8. Create 10 Sales Orders
  console.log('Creating 10 Sales Orders...');
  const statuses = ['Completed', 'To Deliver and Bill', 'Draft', 'Cancelled'];
  for (let i = 0; i < 10; i++) {
    // Pick 2-3 random items for this order
    const numItems = Math.floor(Math.random() * 3) + 1;
    const orderItems = [];
    let grandTotal = 0;
    
    for(let j=0; j<numItems; j++) {
      const itm = itemsData[Math.floor(Math.random() * itemsData.length)];
      const qty = Math.floor(Math.random() * 5) + 1;
      const amount = itm.rate * qty;
      grandTotal += amount;
      orderItems.push({
        itemCode: itm.c,
        qty: qty,
        rate: itm.rate,
        amount: amount
      });
    }

    await prisma.salesOrder.create({
      data: {
        customerId: customers[i].id,
        status: statuses[i % statuses.length],
        grandTotal: grandTotal,
        channel: i % 2 === 0 ? 'B2B' : 'D2C',
        transactionDate: new Date(Date.now() - Math.floor(Math.random() * 10000000000)),
        items: {
          create: orderItems
        }
      }
    });
  }

  console.log('✅ Seeding completely finished. 10x data injected.');
}

main()
  .catch((e) => {
    console.error(e);
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
