const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'prisma', 'schema.prisma');
const customPath = path.join(__dirname, 'prisma', 'hr_leave.prisma');

try {
  let schemaContent = fs.readFileSync(schemaPath, 'utf8');
  let customContent = fs.readFileSync(customPath, 'utf8');

  if (!schemaContent.includes('model HRLeaveType {')) {
    schemaContent += '\n\n' + customContent;
    fs.writeFileSync(schemaPath, schemaContent);
    console.log('Successfully merged hr_leave.prisma into schema.prisma');
  } else {
    console.log('HR Leave models already exist in schema.prisma. Skipping merge.');
  }

} catch (error) {
  console.error('Error updating schema:', error.message);
  process.exit(1);
}
