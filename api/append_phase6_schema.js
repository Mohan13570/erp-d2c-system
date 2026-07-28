const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'prisma', 'schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf8');

// 1. Extend ShipmentTimelineEvent
const timelineEventModelStart = schema.indexOf('model ShipmentTimelineEvent {');
if (timelineEventModelStart !== -1) {
  const timelineEventModelEnd = schema.indexOf('}', timelineEventModelStart);
  
  if (!schema.includes('updatedBy String?')) {
    const before = schema.substring(0, timelineEventModelEnd - 1);
    const after = schema.substring(timelineEventModelEnd - 1);
    
    schema = before + 
      `  updatedBy String?\n` +
      `  location  String?\n` +
      after;
    console.log('Appended fields to ShipmentTimelineEvent');
  }
}

// 2. Add ShipmentLiveTracking
if (!schema.includes('model ShipmentLiveTracking')) {
  schema += `

// ==========================================
// Phase 6.3: Live Tracking Engine
// ==========================================
model ShipmentLiveTracking {
  id              String    @id @default(uuid())
  shipmentId      String
  shipment        Shipment  @relation(fields: [shipmentId], references: [id], onDelete: Cascade)
  
  latitude        Float
  longitude       Float
  speed           Float?
  heading         Float?
  altitude        Float?
  
  driverStatus    String?
  vehicleStatus   String?
  
  timestamp       DateTime  @default(now())
}
`;
  console.log('Appended ShipmentLiveTracking model');
}

fs.writeFileSync(schemaPath, schema);
console.log('Phase 6 models generated successfully.');
