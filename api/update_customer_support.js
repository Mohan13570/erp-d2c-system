const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'prisma', 'schema.prisma');
const customPath = path.join(__dirname, 'prisma', 'customer_support.prisma');

try {
  let schemaContent = fs.readFileSync(schemaPath, 'utf8');
  let customContent = fs.readFileSync(customPath, 'utf8');

  // Prevent multiple appends
  if (!schemaContent.includes('model SupportTicket {')) {
    // Add models to schema
    schemaContent += '\n\n' + customContent;

    fs.writeFileSync(schemaPath, schemaContent);
    console.log('Successfully merged customer_support.prisma into schema.prisma');
  } else {
    console.log('Customer Support models already exist in schema.prisma. Skipping merge.');
  }

} catch (error) {
  console.error('Error updating schema:', error.message);
  process.exit(1);
}
