const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'prisma', 'schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf8');

if (!schema.includes('model ShipmentRouteProgress')) {
  schema += `

// ==========================================
// Phase 6.4: Route Progress
// ==========================================
model ShipmentRouteProgress {
  id                  String    @id @default(uuid())
  shipmentId          String    @unique
  shipment            Shipment  @relation(fields: [shipmentId], references: [id], onDelete: Cascade)
  
  origin              String
  destination         String
  intermediateStops   String?   // JSON array string of stops
  
  distanceCovered     Float     @default(0)
  distanceRemaining   Float     @default(0)
  
  estimatedArrival    DateTime?
  actualArrival       DateTime?
  delayMinutes        Int       @default(0)
  
  updatedAt           DateTime  @updatedAt
}
`;
  fs.writeFileSync(schemaPath, schema);
  console.log('Appended ShipmentRouteProgress model');
} else {
  console.log('ShipmentRouteProgress already exists.');
}
