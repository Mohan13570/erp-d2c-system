const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'prisma', 'schema.prisma');
const paymentsPath = path.join(__dirname, 'prisma', 'erp_payments.prisma');

const schema = fs.readFileSync(schemaPath, 'utf8');
const payments = fs.readFileSync(paymentsPath, 'utf8');

if (!schema.includes('model ErpPaymentReceipt {')) {
  fs.writeFileSync(schemaPath, schema + '\n' + payments);
  console.log('Appended erp_payments to schema.prisma');
} else {
  console.log('Already appended');
}
