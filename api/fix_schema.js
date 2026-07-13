const fs = require('fs');
const path = require('path');
const schemaPath = path.join(__dirname, 'prisma', 'schema.prisma');
let content = fs.readFileSync(schemaPath, 'utf8');
const index = content.indexOf('// HR Attendance & Time Tracking Schema');
if (index !== -1) {
    fs.writeFileSync(schemaPath, content.substring(0, index));
    console.log('Truncated schema.prisma');
} else {
    console.log('Not found');
}
