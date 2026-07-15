const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'prisma', 'schema.prisma');
const arPath = path.join(__dirname, 'prisma', 'erp_ar.prisma');

const schema = fs.readFileSync(schemaPath, 'utf8');
const ar = fs.readFileSync(arPath, 'utf8');

if (!schema.includes('model ArCustomerProfile {')) {
  fs.writeFileSync(schemaPath, schema + '\n' + ar);
  console.log('Appended erp_ar to schema.prisma');
} else {
  console.log('Already appended');
}
