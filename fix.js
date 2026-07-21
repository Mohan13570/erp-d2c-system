const fs = require('fs');
const files = [
  'admin/src/pages/shipments/ResourceAllocation.tsx', 
  'admin/src/pages/shipments/OperationsManagement.tsx', 
  'admin/src/pages/shipments/ShipmentDetail.tsx', 
  'admin/src/pages/shipments/CargoManagement.tsx', 
  'api/src/routes/operations.ts'
];
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  content = content.replace(/\\\$\\{/g, '${').replace(/\\\\`/g, '`').replace(/\\`/g, '`');
  fs.writeFileSync(f, content);
  console.log('Fixed ' + f);
});
