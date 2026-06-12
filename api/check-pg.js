const { Client } = require('pg');

async function check() {
  const pg = new Client({
    connectionString: "postgresql://postgres:Mohan.G%40135790@db.osxvuovscupbsqiocnmp.supabase.co:5432/postgres",
    ssl: { rejectUnauthorized: false }
  });
  await pg.connect();
  
  const tables = [
    'Company', 'Role', 'User', 'AuditLog', 'Warehouse', 'Item', 'Customer', 'D2CCustomer', 'SalesOrder', 'SalesOrderItem', 'Account', 'Invoice', 'JournalEntry', 'JournalEntryLine', 'Employee'
  ];
  
  for (const table of tables) {
    try {
      const { rows } = await pg.query(`SELECT COUNT(*) FROM "${table}"`);
      console.log(`Table ${table}: ${rows[0].count} rows`);
    } catch(e) {
      console.log(`Table ${table}: Error - ${e.message}`);
    }
  }
  
  await pg.end();
}

check().catch(console.error);
