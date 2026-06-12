import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear all data
  await prisma.returnItem.deleteMany();
  await prisma.return.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.salesOrderItem.deleteMany();
  await prisma.salesOrder.deleteMany();
  await prisma.payslip.deleteMany();
  await prisma.payrollRun.deleteMany();
  await prisma.attendanceLog.deleteMany();
  await prisma.gRNItem.deleteMany();
  await prisma.goodsReceiptNote.deleteMany();
  await prisma.pOItem.deleteMany();
  await prisma.purchaseOrder.deleteMany();
  await prisma.vendor.deleteMany();
  await prisma.bOMItem.deleteMany();
  await prisma.bOM.deleteMany();
  await prisma.workOrder.deleteMany();
  await prisma.task.deleteMany();
  await prisma.project.deleteMany();
  await prisma.asset.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.journalEntryLine.deleteMany();
  await prisma.journalEntry.deleteMany();
  await prisma.gLEntry.deleteMany();
  await prisma.account.deleteMany();
  await prisma.fiscalPeriod.deleteMany();
  await prisma.stockLedgerEntry.deleteMany();
  await prisma.stockLevel.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.item.deleteMany();
  await prisma.warehouse.deleteMany();
  await prisma.employee.deleteMany();
  await prisma.department.deleteMany();
  await prisma.permission.deleteMany();
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.customerAddress.deleteMany();
  await prisma.d2CCustomer.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.company.deleteMany();

  // Company
  const company = await prisma.company.create({
    data: { name: 'Aura Designs Ltd.', abbr: 'ADL', country: 'US', defaultCurrency: 'USD', taxId: 'TX-00123' }
  });

  // Roles
  const adminRole = await prisma.role.create({ data: { name: 'Administrator', isSystem: true } });
  const financeRole = await prisma.role.create({ data: { name: 'Finance Manager' } });
  const hrRole = await prisma.role.create({ data: { name: 'HR Manager' } });

  // Users
  await prisma.user.createMany({
    data: [
      { email: 'admin@aura.com', passwordHash: 'hashed_pass', firstName: 'System', lastName: 'Admin', roleId: adminRole.id },
      { email: 'finance@aura.com', passwordHash: 'hashed_pass', firstName: 'Sarah', lastName: 'Connor', roleId: financeRole.id },
    ]
  });

  // Departments
  const salesDept = await prisma.department.create({ data: { name: 'Sales', companyName: company.name } });
  const engDept = await prisma.department.create({ data: { name: 'Engineering', companyName: company.name } });
  const hrDept = await prisma.department.create({ data: { name: 'Human Resources', companyName: company.name } });
  const financeDept = await prisma.department.create({ data: { name: 'Finance', companyName: company.name } });

  // Employees
  const emp1 = await prisma.employee.create({ data: { employeeName: 'Alice Johnson', companyName: company.name, departmentId: salesDept.id, designation: 'Sales Manager', salary: 75000, employmentType: 'Full-time' } });
  const emp2 = await prisma.employee.create({ data: { employeeName: 'Bob Williams', companyName: company.name, departmentId: engDept.id, designation: 'Senior Engineer', salary: 95000 } });
  const emp3 = await prisma.employee.create({ data: { employeeName: 'Charlie Brown', companyName: company.name, departmentId: hrDept.id, designation: 'HR Specialist', salary: 65000 } });
  const emp4 = await prisma.employee.create({ data: { employeeName: 'Diana Prince', companyName: company.name, departmentId: financeDept.id, designation: 'Finance Analyst', salary: 70000 } });

  // Attendance
  const today = new Date();
  for (const emp of [emp1, emp2, emp3, emp4]) {
    await prisma.attendanceLog.createMany({
      data: [
        { employeeId: emp.employee, date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1), clockIn: new Date(`${today.toDateString()} 09:00`), clockOut: new Date(`${today.toDateString()} 17:30`), hoursWorked: 8.5 },
        { employeeId: emp.employee, date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2), clockIn: new Date(`${today.toDateString()} 08:45`), clockOut: new Date(`${today.toDateString()} 17:00`), hoursWorked: 8.25 },
      ]
    });
  }

  // Payroll
  const payroll = await prisma.payrollRun.create({ data: { period: 'May 2026', status: 'Approved', totalGross: 76250, totalNet: 61000, totalDeductions: 15250, companyName: company.name } });
  for (const emp of [emp1, emp2, emp3, emp4]) {
    const gross = emp.salary! / 12;
    await prisma.payslip.create({ data: { payrollRunId: payroll.id, employeeId: emp.employee, gross, net: gross * 0.8, deductions: JSON.stringify({ tax: gross * 0.2 }), status: 'Approved' } });
  }

  // Warehouse
  const warehouse = await prisma.warehouse.create({ data: { name: 'Main Store - ADL', companyName: company.name } });

  // Items
  const items = await Promise.all([
    prisma.item.create({ data: { itemCode: 'ITEM-001', itemName: 'Premium Wireless Headphones', itemGroup: 'Electronics', description: 'Active noise-cancelling over-ear headphones with 30hr battery life.', standardRate: 299.99, valuationRate: 150.00, taxRate: 8, weight: 0.35, companyName: company.name } }),
    prisma.item.create({ data: { itemCode: 'ITEM-002', itemName: 'Minimalist Smartwatch', itemGroup: 'Electronics', description: 'Track fitness, notifications and more with this elegant smartwatch.', standardRate: 199.50, valuationRate: 90.00, taxRate: 8, weight: 0.05, companyName: company.name } }),
    prisma.item.create({ data: { itemCode: 'ITEM-003', itemName: 'Ergonomic Office Chair', itemGroup: 'Furniture', description: 'Adjustable lumbar support and breathable mesh for all-day comfort.', standardRate: 450.00, valuationRate: 200.00, taxRate: 5, weight: 12.5, companyName: company.name } }),
    prisma.item.create({ data: { itemCode: 'ITEM-004', itemName: 'Mechanical Keyboard', itemGroup: 'Electronics', description: 'Tactile brown switches, RGB backlight, and aircraft-grade aluminium frame.', standardRate: 120.00, valuationRate: 60.00, taxRate: 8, weight: 0.9, companyName: company.name } }),
    prisma.item.create({ data: { itemCode: 'ITEM-005', itemName: 'Organic Cotton T-Shirt', itemGroup: 'Apparel', description: 'GOTS-certified, super-soft, breathable organic cotton tee.', standardRate: 25.00, valuationRate: 10.00, taxRate: 0, weight: 0.2, companyName: company.name } }),
    prisma.item.create({ data: { itemCode: 'ITEM-006', itemName: 'Stainless Steel Water Bottle', itemGroup: 'Accessories', description: 'Double-wall vacuum insulation keeps drinks cold 24h, hot 12h.', standardRate: 35.00, valuationRate: 12.00, taxRate: 0, weight: 0.4, companyName: company.name } }),
  ]);

  // Stock Levels
  for (const item of items) {
    await prisma.stockLevel.create({ data: { itemCode: item.itemCode, warehouseName: warehouse.name, qtyOnHand: 150, qtyReserved: 10, qtyAvailable: 140 } });
    await prisma.stockLedgerEntry.create({ data: { itemCode: item.itemCode, warehouse: warehouse.name, qty: 150, voucherType: 'Opening', voucherNo: 'OPEN-001' } });
  }

  // Product Variants
  await prisma.productVariant.createMany({
    data: [
      { itemCode: 'ITEM-005', sku: 'TSHIRT-S-WHT', attributes: JSON.stringify({ size: 'S', color: 'White' }) },
      { itemCode: 'ITEM-005', sku: 'TSHIRT-M-WHT', attributes: JSON.stringify({ size: 'M', color: 'White' }) },
      { itemCode: 'ITEM-005', sku: 'TSHIRT-L-BLK', attributes: JSON.stringify({ size: 'L', color: 'Black' }) },
    ]
  });

  // BOM
  const bom = await prisma.bOM.create({ data: { itemCode: 'ITEM-004', quantity: 1 } });
  await prisma.bOMItem.createMany({
    data: [
      { bomId: bom.id, itemCode: 'ITEM-004', qty: 1, uom: 'Nos' },
    ]
  });

  // Work Orders
  await prisma.workOrder.create({ data: { bomId: bom.id, plannedQty: 50, status: 'In Process', plannedStart: new Date('2026-05-01'), plannedEnd: new Date('2026-05-31') } });

  // Finance Accounts
  const cashAcc = await prisma.account.create({ data: { name: 'Cash - ADL', code: '1001', accountType: 'Bank', rootType: 'Asset', companyName: company.name } });
  const arAcc = await prisma.account.create({ data: { name: 'Accounts Receivable - ADL', code: '1200', accountType: 'Receivable', rootType: 'Asset', companyName: company.name } });
  const salesAcc = await prisma.account.create({ data: { name: 'Sales Revenue - ADL', code: '4001', accountType: 'Income', rootType: 'Income', companyName: company.name } });
  const expenseAcc = await prisma.account.create({ data: { name: 'Operating Expenses - ADL', code: '5001', accountType: 'Expense', rootType: 'Expense', companyName: company.name } });

  // Fiscal Period
  await prisma.fiscalPeriod.create({ data: { name: 'Q2 2026', startDate: new Date('2026-04-01'), endDate: new Date('2026-06-30'), year: 2026, status: 'Open', companyName: company.name } });

  // Journal Entries
  const je1 = await prisma.journalEntry.create({ data: { reference: 'JV-2026-001', date: new Date(), description: 'Monthly Revenue Recognition', status: 'Posted' } });
  await prisma.journalEntryLine.createMany({
    data: [
      { journalEntryId: je1.id, accountName: cashAcc.name, debit: 15000, credit: 0 },
      { journalEntryId: je1.id, accountName: salesAcc.name, debit: 0, credit: 15000 },
    ]
  });
  await prisma.gLEntry.createMany({
    data: [
      { account: cashAcc.name, debit: 15000, credit: 0, voucherType: 'Journal Entry', voucherNo: 'JV-2026-001' },
      { account: salesAcc.name, debit: 0, credit: 15000, voucherType: 'Journal Entry', voucherNo: 'JV-2026-001' },
    ]
  });

  // ERP Customers
  const cust1 = await prisma.customer.create({ data: { customerName: 'John Doe', territory: 'North America', email: 'john@example.com' } });
  const cust2 = await prisma.customer.create({ data: { customerName: 'Jane Smith', territory: 'Europe', email: 'jane@example.com' } });

  // Invoices
  const inv1 = await prisma.invoice.create({ data: { type: 'AR', customerId: cust1.id, dueDate: new Date('2026-06-30'), status: 'Sent', subtotal: 299.99, tax: 24.00, total: 323.99, debitAccountName: arAcc.name, creditAccountName: salesAcc.name } });
  await prisma.payment.create({ data: { invoiceId: inv1.id, amount: 323.99, method: 'Stripe', status: 'Completed', reconciled: true } });

  // Sales Orders
  const so1 = await prisma.salesOrder.create({
    data: { customerId: cust1.id, companyName: company.name, status: 'Completed', grandTotal: 334.99, channel: 'D2C',
      items: { create: [{ itemCode: 'ITEM-001', qty: 1, rate: 299.99, amount: 299.99 }, { itemCode: 'ITEM-006', qty: 1, rate: 35.00, amount: 35.00 }] }
    }
  });
  const so2 = await prisma.salesOrder.create({
    data: { customerId: cust2.id, companyName: company.name, status: 'To Deliver and Bill', grandTotal: 450.00, channel: 'B2B',
      items: { create: [{ itemCode: 'ITEM-003', qty: 1, rate: 450.00, amount: 450.00 }] }
    }
  });

  // Returns
  await prisma.return.create({ data: { salesOrderId: so1.id, status: 'Approved', reason: 'Defective product', resolution: 'Refund', refundAmount: 299.99, items: { create: [{ itemCode: 'ITEM-001', qty: 1, condition: 'Damaged' }] } } });

  // D2C Customer
  await prisma.d2CCustomer.create({ data: { email: 'guest@shop.com', firstName: 'Guest', lastName: 'User', loyaltyPoints: 250, tier: 'Silver' } });

  // Suppliers & Vendors
  const supp1 = await prisma.supplier.create({ data: { supplierName: 'Tech Components Inc.', email: 'supply@techcomp.com' } });
  const vendor1 = await prisma.vendor.create({ data: { name: 'Tech Components Inc.', supplierId: supp1.id, companyName: company.name, country: 'China', paymentTerms: 'Net 30' } });

  // Purchase Orders
  const po1 = await prisma.purchaseOrder.create({
    data: { vendorId: vendor1.id, companyName: company.name, status: 'Submitted', grandTotal: 9000, expectedDate: new Date('2026-06-15'),
      items: { create: [{ itemCode: 'ITEM-001', qty: 60, rate: 150, amount: 9000 }] }
    }
  });

  // GRN
  await prisma.goodsReceiptNote.create({
    data: { purchaseOrderId: po1.id, status: 'Submitted',
      items: { create: [{ itemCode: 'ITEM-001', qtyReceived: 60, qtyRejected: 0 }] }
    }
  });

  // Projects
  const proj1 = await prisma.project.create({ data: { name: 'Website Relaunch', status: 'Open', companyName: company.name, budget: 25000, startDate: new Date('2026-05-01'), endDate: new Date('2026-08-31') } });
  await prisma.task.createMany({ data: [
    { projectId: proj1.id, subject: 'UI/UX Design', status: 'Completed', priority: 'High', assignedTo: 'Alice Johnson', dueDate: new Date('2026-05-31') },
    { projectId: proj1.id, subject: 'Frontend Development', status: 'In Progress', priority: 'High', assignedTo: 'Bob Williams', dueDate: new Date('2026-06-30') },
    { projectId: proj1.id, subject: 'QA Testing', status: 'Open', priority: 'Medium', dueDate: new Date('2026-07-31') },
  ]});

  // Assets
  await prisma.asset.createMany({ data: [
    { assetName: 'MacBook Pro 16"', assetCategory: 'IT Equipment', companyName: company.name, purchaseDate: new Date('2025-01-15'), purchaseAmount: 3499, currentValue: 2800, usefulLifeYears: 4 },
    { assetName: 'Office Printer', assetCategory: 'Office Equipment', companyName: company.name, purchaseDate: new Date('2024-06-01'), purchaseAmount: 850, currentValue: 650, usefulLifeYears: 5 },
    { assetName: 'Delivery Van', assetCategory: 'Vehicles', companyName: company.name, purchaseDate: new Date('2023-03-20'), purchaseAmount: 28000, currentValue: 22000, usefulLifeYears: 8, location: 'Warehouse' },
  ]});

  console.log('✅ ERP+D2C Database fully seeded with all 19 modules!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
