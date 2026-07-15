const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'prisma', 'schema.prisma');
const pricingPath = path.join(__dirname, 'prisma', 'erp_pricing.prisma');

const schema = fs.readFileSync(schemaPath, 'utf8');
const pricing = fs.readFileSync(pricingPath, 'utf8');

if (!schema.includes('model ErpRateCard {')) {
  fs.writeFileSync(schemaPath, schema + '\n' + pricing);
  console.log('Appended erp_pricing to schema.prisma');
} else {
  console.log('Already appended');
}
