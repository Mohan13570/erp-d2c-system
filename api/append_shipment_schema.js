const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'prisma', 'schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf8');

// 1. Update Shipment model
const shipmentModelRegex = /model Shipment\s+{[\s\S]*?(?=model\s+\w+\s+{|$)/;
const match = schema.match(shipmentModelRegex);

if (match) {
  let shipmentModel = match[0];
  
  if (!shipmentModel.includes('bookingNumber')) {
    const newFields = `
  bookingNumber       String?
  origin              String?
  destination         String?
  assignedDriver      String?
  assignedVehicle     String?
  operationsExecutive String?
  shipmentType        String?
  revenue             Float    @default(0.0)
  profit              Float    @default(0.0)

  activities          ShipmentActivity[]
`;
    // Insert before "// Relations"
    shipmentModel = shipmentModel.replace(/\/\/ Relations/, newFields + '\n  // Relations');
    schema = schema.replace(match[0], shipmentModel);
    console.log('Shipment model updated successfully.');
  } else {
    console.log('Shipment model already updated.');
  }
} else {
  console.log('Shipment model not found!');
}

// 2. Append new models
const newModels = `
// ==========================================
// SHIPMENT MANAGEMENT (PHASE 1)
// ==========================================

model ShipmentStatus {
  id          String   @id @default(uuid())
  code        String   @unique // e.g., PENDING_PICKUP
  label       String   // e.g., Pending Pickup
  description String?
  colorHex    String?  // e.g., #3B82F6
  isTerminal  Boolean  @default(false)
  createdAt   DateTime @default(now())
}

model ShipmentSummary {
  id             String   @id @default(uuid())
  date           DateTime @unique @default(now())
  totalShipments Int      @default(0)
  todayShipments Int      @default(0)
  pendingPickup  Int      @default(0)
  pickedUp       Int      @default(0)
  warehouse      Int      @default(0)
  inTransit      Int      @default(0)
  customs        Int      @default(0)
  outForDelivery Int      @default(0)
  delivered      Int      @default(0)
  completed      Int      @default(0)
  cancelled      Int      @default(0)
  delayed        Int      @default(0)
  revenue        Float    @default(0.0)
  profit         Float    @default(0.0)
  updatedAt      DateTime @updatedAt
}

model ShipmentDashboard {
  id              String   @id @default(uuid())
  userId          String   @unique
  customLayout    String?  // JSON configuration for KPI cards
  defaultFilters  String?  // JSON default filters
  updatedAt       DateTime @updatedAt
}

model ShipmentActivity {
  id           String   @id @default(uuid())
  shipmentId   String
  shipmentRef  Shipment @relation(fields: [shipmentId], references: [id])
  activityType String   // e.g., STATUS_CHANGE, DISPATCH, DRIVER_ASSIGNED
  description  String
  performedBy  String?
  oldValue     String?
  newValue     String?
  createdAt    DateTime @default(now())
}
`;

if (!schema.includes('model ShipmentStatus')) {
  schema += '\n' + newModels;
  fs.writeFileSync(schemaPath, schema, 'utf8');
  console.log('New models appended successfully.');
} else {
  console.log('New models already exist.');
}
