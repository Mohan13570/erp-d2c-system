const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'prisma', 'schema.prisma');
const billingPath = path.join(__dirname, 'prisma', 'erp_billing.prisma');

const schema = fs.readFileSync(schemaPath, 'utf8');
const billing = fs.readFileSync(billingPath, 'utf8');

if (!schema.includes('model ErpInvoice {')) {
  fs.writeFileSync(schemaPath, schema + '\n' + billing);
  console.log('Appended erp_billing to schema.prisma');
} else {
  console.log('Already appended');
}
