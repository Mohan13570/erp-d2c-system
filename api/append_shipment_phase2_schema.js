const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'prisma', 'schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf8');

// 1. Update Shipment model
const shipmentModelRegex = /model Shipment\s+{[\s\S]*?(?=model\s+\w+\s+{|$)/;
const match = schema.match(shipmentModelRegex);

if (match) {
  let shipmentModel = match[0];
  
  if (!shipmentModel.includes('referenceNumber')) {
    const newFields = `
  referenceNumber     String?
  serviceType         String?
  operation           String?
  branch              String?
  businessUnit        String?
  salesExecutive      String?
  approver            String?
  route               String?
  currentLocation     String?
  totalPackages       Int?
  totalPieces         Int?
  grossWeight         Float?
  netWeight           Float?
  chargeableWeight    Float?
  cbm                 Float?
  cft                 Float?
  totalVolume         Float?
  declaredValue       Float?
  specialCargo        Boolean @default(false)
  currentWorkflowStage String?

  parties             ShipmentParty[]
  notes               ShipmentNotes[]
  assignments         ShipmentAssignment[]
`;
    // Insert before "// Relations" if it exists, otherwise just at the end before closing brace.
    if (shipmentModel.includes('// Relations')) {
        shipmentModel = shipmentModel.replace(/\/\/ Relations/, newFields + '\n  // Relations');
    } else {
        shipmentModel = shipmentModel.replace(/}\s*$/, newFields + '\n}\n');
    }
    
    schema = schema.replace(match[0], shipmentModel);
    console.log('Shipment model updated for Phase 2 successfully.');
  } else {
    console.log('Shipment model already updated for Phase 2.');
  }
} else {
  console.log('Shipment model not found!');
}

// 2. Append new models for Phase 2
const newModels = `
// ==========================================
// SHIPMENT MANAGEMENT (PHASE 2)
// ==========================================

model ShipmentParty {
  id               String   @id @default(uuid())
  shipmentId       String
  shipment         Shipment @relation(fields: [shipmentId], references: [id], onDelete: Cascade)
  partyType        String   // SHIPPER, CONSIGNEE, NOTIFY_PARTY, BILL_TO
  company          String
  contactPerson    String?
  department       String?
  email            String?
  phone            String?
  mobile           String?
  country          String?
  city             String?
  address          String?
  location         String?  // Pickup or Delivery Location
  instructions     String?
  notificationMethod String?
  paymentTerms     String?
  currency         String?
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
}

model ShipmentNotes {
  id          String   @id @default(uuid())
  shipmentId  String
  shipment    Shipment @relation(fields: [shipmentId], references: [id], onDelete: Cascade)
  noteType    String   // CUSTOMER, OPERATIONS, FINANCE, INTERNAL
  content     String
  author      String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model ShipmentAssignment {
  id             String   @id @default(uuid())
  shipmentId     String
  shipment       Shipment @relation(fields: [shipmentId], references: [id], onDelete: Cascade)
  assignmentType String   // DRIVER, VEHICLE, CONTAINER, WAREHOUSE
  assignedEntity String   // Entity ID or Name
  assignedBy     String?
  assignedAt     DateTime @default(now())
  status         String   @default("ACTIVE") // ACTIVE, RELEASED
}
`;

if (!schema.includes('model ShipmentParty')) {
  schema += '\n' + newModels;
  fs.writeFileSync(schemaPath, schema, 'utf8');
  console.log('Phase 2 models appended successfully.');
} else {
  console.log('Phase 2 models already exist.');
}
