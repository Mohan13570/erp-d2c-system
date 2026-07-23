const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'prisma', 'schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf8');

if (!schema.includes('model WarehouseReceiving {')) {
  schema += `

// ==========================================
// WMS Phase 3: Inbound Operations & GRN
// ==========================================

model WarehouseReceiving {
  id                String   @id @default(uuid())
  receivingNumber   String   @unique
  warehouseId       String
  receivingDate     DateTime @default(now())
  receivingType     String   // Purchase Order, Shipment, Transfer, Return
  referenceNumber   String?
  supplier          String?
  customer          String?
  status            String   @default("PENDING") // PENDING, INSPECTION, GRN_GENERATED, APPROVED, REJECTED
  
  vehicle           ReceivingVehicle?
  shipment          ReceivingShipment?
  items             ReceivingItem[]
  inspection        ReceivingInspection?
  grn               GoodsReceiptNote?
  documents         ReceivingDocument[]
  putawayRequest    PutawayRequest?
  
  notes             String?
  warehouseNotes    String?
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}

model ReceivingVehicle {
  id                String   @id @default(uuid())
  receivingId       String   @unique
  receiving         WarehouseReceiving @relation(fields: [receivingId], references: [id], onDelete: Cascade)
  
  vehicleNumber     String
  containerNumber   String?
  trailerNumber     String?
  sealNumber        String?
  driverName        String
  driverMobile      String
  
  arrivalTime       DateTime?
  departureTime     DateTime?
  dockNumber        String?
}

model ReceivingShipment {
  id                String   @id @default(uuid())
  receivingId       String   @unique
  receiving         WarehouseReceiving @relation(fields: [receivingId], references: [id], onDelete: Cascade)
  
  shipmentNumber    String?
  bookingNumber     String?
  transportMode     String?
  carrier           String?
  origin            String?
  destination       String?
  
  eta               DateTime?
  actualArrival     DateTime?
}

model ReceivingItem {
  id                String   @id @default(uuid())
  receivingId       String
  receiving         WarehouseReceiving @relation(fields: [receivingId], references: [id], onDelete: Cascade)
  
  productCode       String
  productName       String
  sku               String?
  barcode           String?
  batchNumber       String?
  serialNumber      String?
  
  mfgDate           DateTime?
  expiryDate        DateTime?
  
  orderedQty        Float    @default(0)
  receivedQty       Float    @default(0)
  acceptedQty       Float    @default(0)
  rejectedQty       Float    @default(0)
  uom               String   @default("PCS")
}

model ReceivingInspection {
  id                String   @id @default(uuid())
  receivingId       String   @unique
  receiving         WarehouseReceiving @relation(fields: [receivingId], references: [id], onDelete: Cascade)
  
  isRequired        Boolean  @default(true)
  status            String   @default("PENDING") // PENDING, PASSED, FAILED, PARTIAL
  
  inspectorId       String?
  inspectionDate    DateTime?
  notes             String?
  rejectedReason    String?
}

model GoodsReceiptNote {
  id                String   @id @default(uuid())
  grnNumber         String   @unique
  receivingId       String   @unique
  receiving         WarehouseReceiving @relation(fields: [receivingId], references: [id], onDelete: Cascade)
  
  grnDate           DateTime @default(now())
  warehouseId       String
  supplier          String?
  referenceDoc      String?
  
  receivedBy        String?
  approvedBy        String?
  status            String   @default("DRAFT") // DRAFT, GENERATED, APPROVED
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}

model PutawayRequest {
  id                String   @id @default(uuid())
  putawayNumber     String   @unique
  receivingId       String   @unique
  receiving         WarehouseReceiving @relation(fields: [receivingId], references: [id], onDelete: Cascade)
  
  priority          String   @default("NORMAL") // LOW, NORMAL, HIGH, URGENT
  suggestedZone     String?
  suggestedAisle    String?
  suggestedRack     String?
  suggestedBin      String?
  
  assignedTo        String?
  status            String   @default("PENDING") // PENDING, IN_PROGRESS, COMPLETED
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}

model ReceivingDocument {
  id                String   @id @default(uuid())
  receivingId       String
  receiving         WarehouseReceiving @relation(fields: [receivingId], references: [id], onDelete: Cascade)
  
  docType           String   // PO, DELIVERY_CHALLAN, INVOICE, PACKING_LIST, TRANSPORT, PHOTO, INSPECTION
  docName           String
  fileUrl           String
  uploadedAt        DateTime @default(now())
}
`;
  fs.writeFileSync(schemaPath, schema);
  console.log('Appended WMS Phase 3 Models');
} else {
  console.log('WMS Phase 3 Models already exist.');
}
