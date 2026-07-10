const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const schemaPath = path.join(__dirname, 'prisma', 'schema.prisma');
const customPath = path.join(__dirname, 'prisma', 'customer_logistics.prisma');

try {
  let schemaContent = fs.readFileSync(schemaPath, 'utf8');
  let customContent = fs.readFileSync(customPath, 'utf8');

  // Prevent multiple appends
  if (!schemaContent.includes('model ShipmentBooking {')) {
    // Add models to schema
    schemaContent += '\n\n' + customContent;

    fs.writeFileSync(schemaPath, schemaContent);
    console.log('Successfully merged customer_logistics.prisma into schema.prisma');
    
    // Format the schema
    execSync('npx prisma format', { cwd: path.join(__dirname, '..'), stdio: 'inherit' });
    
    // Push the schema
    execSync('npx prisma db push', { cwd: path.join(__dirname, '..'), stdio: 'inherit' });
    console.log('Database successfully updated!');
  } else {
    console.log('Customer Logistics models already exist in schema.prisma. Skipping merge.');
  }

} catch (error) {
  console.error('Error updating schema:', error.message);
  process.exit(1);
}
