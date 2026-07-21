const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'prisma', 'schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf8');

const newModels = `
// ==========================================
// PICKUP & DELIVERY (PHASE 5)
// ==========================================

model PickupRequest {
  id               String   @id @default(uuid())
  shipmentId       String   @unique
  shipment         Shipment @relation(fields: [shipmentId], references: [id], onDelete: Cascade)
  pickupStatus     String   @default("REQUESTED")
  pickupDate       DateTime?
  pickupTime       String?
  pickupTimeSlot   String?
  pickupLocation   String?
  pickupAddress    String?
  contactPerson    String?
  mobile           String?
  email            String?
  instructions     String?
  priority         String   @default("NORMAL")
  
  // Loading Operations
  loadingBay       String?
  loadingStartTime DateTime?
  loadingEndTime   DateTime?
  loadingDuration  String?
  loadedBy         String?
  vehicleCheck     Boolean  @default(false)
  containerCheck   Boolean  @default(false)
  packageCount     Int?
  sealNumber       String?
  
  // Checklist (Stored as JSON for flexibility or strict booleans)
  checklistData    String?  // JSON stringified checklist
  
  documents        PickupDocument[]
  
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
}

model PickupDocument {
  id               String   @id @default(uuid())
  pickupRequestId  String
  pickupRequest    PickupRequest @relation(fields: [pickupRequestId], references: [id], onDelete: Cascade)
  documentType     String   // COMMERCIAL_INVOICE, PACKING_LIST, DELIVERY_ORDER, GATE_PASS
  documentUrl      String
  version          Int      @default(1)
  uploadedBy       String?
  createdAt        DateTime @default(now())
}

model DeliverySchedule {
  id               String   @id @default(uuid())
  shipmentId       String   @unique
  shipment         Shipment @relation(fields: [shipmentId], references: [id], onDelete: Cascade)
  deliveryStatus   String   @default("PENDING")
  deliveryDate     DateTime?
  deliveryTime     String?
  deliverySlot     String?
  deliveryAddress  String?
  contactPerson    String?
  mobile           String?
  email            String?
  instructions     String?
  priority         String   @default("NORMAL")
  
  checklistData    String?  // JSON stringified delivery checklist
  
  proofOfDelivery  ProofOfDelivery?
  exceptions       DeliveryException[]
  photos           DeliveryPhoto[]
  
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
}

model ProofOfDelivery {
  id                 String   @id @default(uuid())
  deliveryScheduleId String   @unique
  deliverySchedule   DeliverySchedule @relation(fields: [deliveryScheduleId], references: [id], onDelete: Cascade)
  receiverSignature  String?  // Base64 or URL
  driverSignature    String?  // Base64 or URL
  gpsLocation        String?
  deliveryTimestamp  DateTime?
  receiverName       String?
  receiverId         String?
  deliveryNotes      String?
  barcodeScanned     Boolean  @default(false)
  createdAt          DateTime @default(now())
}

model DeliveryException {
  id                 String   @id @default(uuid())
  deliveryScheduleId String
  deliverySchedule   DeliverySchedule @relation(fields: [deliveryScheduleId], references: [id], onDelete: Cascade)
  exceptionType      String   // WRONG_ADDRESS, DAMAGED, REFUSED, DELAYED
  notes              String?
  correctiveAction   String?
  resolved           Boolean  @default(false)
  createdAt          DateTime @default(now())
}

model DeliveryPhoto {
  id                 String   @id @default(uuid())
  deliveryScheduleId String
  deliverySchedule   DeliverySchedule @relation(fields: [deliveryScheduleId], references: [id], onDelete: Cascade)
  photoUrl           String
  photoType          String   // PROOF, DAMAGE, LOCATION
  uploadedBy         String?
  createdAt          DateTime @default(now())
}
`;

if (!schema.includes('model PickupRequest')) {
  // Insert relations into Shipment model
  const shipmentModelRegex = /model Shipment\s+{[\s\S]*?(?=model\s+\w+\s+{|$)/;
  const match = schema.match(shipmentModelRegex);

  if (match) {
    let shipmentModel = match[0];
    const newRelations = `
  pickupRequest      PickupRequest?
  deliverySchedule   DeliverySchedule?
`;
    // Insert before closing brace.
    shipmentModel = shipmentModel.replace(/}\s*$/, newRelations + '\n}\n');
    schema = schema.replace(match[0], shipmentModel);
  }

  schema += '\n' + newModels;
  fs.writeFileSync(schemaPath, schema, 'utf8');
  console.log('Phase 5 models appended successfully.');
} else {
  console.log('Phase 5 models already exist.');
}
