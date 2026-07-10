const fs = require('fs');
let schema = fs.readFileSync('prisma/schema.prisma', 'utf8');

// The ARInvoice implicitly links to Customer.id but doesn't have a formal relation in the core yet.
// If we want a formal relation, we can replace `customerId String` in ARInvoice with a proper relation.
schema = schema.replace(/model ARInvoice \{[\s\S]*?\n\}/, match => {
  return match.replace(/customerId\s+String\s+\/\/\s+Links to Customer.id implicitly/, 'customerId String\n  customer Customer @relation(fields: [customerId], references: [id])');
});

// Need to inject the reverse relation into Customer if we link it to ARInvoice
// We will just append the new file content below.
fs.writeFileSync('prisma/schema.prisma', schema);
