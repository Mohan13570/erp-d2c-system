const fs = require('fs');
let schema = fs.readFileSync('prisma/schema.prisma', 'utf8');

schema = schema.replace(/model Vendor \{[\s\S]*?\n\}/, match => {
  return match.replace(/\n\}$/, '\n  supportTickets VendorSupportTicket[]\n  chatMessages VendorChatMessage[]\n  performanceMetrics VendorPerformanceMetric[]\n  developerApps VendorDeveloperApp[]\n}');
});

fs.writeFileSync('prisma/schema.prisma', schema);
