const { Client } = require('pg');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const tableMap = {
  'Company': 'company',
  'Role': 'role',
  'User': 'user',
  'Permission': 'permission',
  'Customer': 'customer',
  'D2CCustomer': 'd2CCustomer',
  'CustomerAddress': 'customerAddress',
  'Supplier': 'supplier',
  'Vendor': 'vendor',
  'PurchaseOrder': 'purchaseOrder',
  'Item': 'item',
  'POItem': 'pOItem',
  'GoodsReceiptNote': 'goodsReceiptNote',
  'GRNItem': 'gRNItem',
  'ProductVariant': 'productVariant',
  'Warehouse': 'warehouse',
  'StockLevel': 'stockLevel',
  'StockLedgerEntry': 'stockLedgerEntry',
  'BOM': 'bOM',
  'BOMItem': 'bOMItem',
  'WorkOrder': 'workOrder',
  'Project': 'project',
  'Task': 'task',
  'Asset': 'asset',
  'FiscalPeriod': 'fiscalPeriod',
  'Account': 'account',
  'JournalEntry': 'journalEntry',
  'JournalEntryLine': 'journalEntryLine',
  'Invoice': 'invoice',
  'Payment': 'payment',
  'GLEntry': 'gLEntry',
  'Department': 'department',
  'Employee': 'employee',
  'AttendanceLog': 'attendanceLog',
  'PayrollRun': 'payrollRun',
  'Payslip': 'payslip',
  'SalesOrder': 'salesOrder',
  'SalesOrderItem': 'salesOrderItem',
  'Cart': 'cart',
  'CartItem': 'cartItem',
  'Return': 'return',
  'ReturnItem': 'returnItem',
  'CompanyStock': 'companyStock',
  'CorporateAction': 'corporateAction',
  'MarketingCampaign': 'marketingCampaign',
  'AuditLog': 'auditLog'
};

async function migrate() {
  console.log("Connecting to Supabase PostgreSQL...");
  const pg = new Client({
    connectionString: "postgresql://postgres:Mohan.G%40135790@db.osxvuovscupbsqiocnmp.supabase.co:5432/postgres",
    ssl: { rejectUnauthorized: false }
  });
  await pg.connect();
  
  for (const [pgTable, prismaModel] of Object.entries(tableMap)) {
    try {
      const { rows } = await pg.query(`SELECT * FROM "${pgTable}"`);
      if (rows.length === 0) {
        console.log(`Skipping ${pgTable} (0 rows)`);
        continue;
      }
      console.log(`Migrating ${rows.length} rows for ${pgTable}...`);
      
      for (const row of rows) {
        // Convert BigInts from string to BigInt
        for(let key in row) {
           if(pgTable === 'CompanyStock' && key === 'sharesOutstanding' && typeof row[key] === 'string') {
               row[key] = BigInt(row[key]);
           }
        }
        await prisma[prismaModel].create({ data: row });
      }
      console.log(`✅ Finished ${pgTable}.`);
    } catch(e) {
      console.log(`❌ Error migrating ${pgTable}: ${e.message}`);
    }
  }
  
  await pg.end();
  await prisma.$disconnect();
  console.log("Migration Complete!");
}

migrate().catch(console.error);
