const fs = require('fs');
const path = require('path');
const p = path.join(__dirname, 'prisma', 'hr_attendance.prisma');
let content = fs.readFileSync(p, 'utf8');
content = content.replace(/@db\.Date/g, '');
fs.writeFileSync(p, content);
console.log('Fixed hr_attendance.prisma');
