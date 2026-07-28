const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'prisma', 'schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf8');

if (!schema.includes('model ShipmentKPI')) {
  schema += `

// ==========================================
// Phase 10: Executive Analytics & BI
// ==========================================

model ShipmentKPI {
  id                  String   @id @default(uuid())
  date                DateTime @default(now()) @unique
  
  totalShipments      Int      @default(0)
  activeShipments     Int      @default(0)
  completedShipments  Int      @default(0)
  delayedShipments    Int      @default(0)
  cancelledShipments  Int      @default(0)
  
  onTimeDeliveryPct   Float    @default(0)
  avgTransitTimeDays  Float    @default(0)
  
  totalRevenue        Float    @default(0)
  totalCost           Float    @default(0)
  grossProfit         Float    @default(0)
  netProfit           Float    @default(0)
  
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt
}

model ShipmentAnalytics {
  id                  String   @id @default(uuid())
  category            String   // STATUS, CUSTOMER, TRANSPORT, ROUTE, EXCEPTION
  metricName          String
  metricValue         Float    @default(0)
  metadata            String?  // JSON for extra context (e.g., branch, date)
  
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt
  
  @@unique([category, metricName])
}

model ShipmentReport {
  id                  String   @id @default(uuid())
  reportType          String   // SHIPMENT, DELIVERY, DELAY, REVENUE, PROFIT, CUSTOMER
  generatedBy         String
  status              String   @default("GENERATING") // GENERATING, COMPLETED, FAILED
  fileUrl             String?
  format              String   // PDF, EXCEL, CSV
  
  filters             String?  // JSON string of filters applied
  
  createdAt           DateTime @default(now())
}

model ExecutiveDashboard {
  id                  String   @id @default(uuid())
  userId              String   @unique
  preferences         String   // JSON containing layout, filters, saved views
  
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt
}
`;
  fs.writeFileSync(schemaPath, schema);
  console.log('Appended Phase 10 Models');
} else {
  console.log('Phase 10 Models already exist.');
}
