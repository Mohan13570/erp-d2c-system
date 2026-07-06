const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'api', 'prisma', 'schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf8');

// Replace GRNItem
const newGRNItem = `
model GRNItem {
  id                 String           @id @default(uuid())
  goodsReceiptNoteId String
  goodsReceiptNote   GoodsReceiptNote @relation(fields: [goodsReceiptNoteId], references: [id], onDelete: Cascade)
  itemCode           String
  item               Item             @relation(fields: [itemCode], references: [itemCode])
  batchNumber        String?
  serialNumber       String?
  expiryDate         DateTime?
  lotNumber          String?
  qtyReceived        Float
  qtyAccepted        Float            @default(0)
  qtyRejected        Float            @default(0)
  reasonForReject    String?
  putAwayBinId       String?
}
`;
schema = schema.replace(/model GRNItem\s*\{[\s\S]*?reasonForReject\s+String\?\n\}/g, newGRNItem.trim());

// Replace QualityInspection
const newQualityInspection = `
model QualityInspection {
  id                 String           @id @default(uuid())
  goodsReceiptNoteId String
  goodsReceiptNote   GoodsReceiptNote @relation(fields: [goodsReceiptNoteId], references: [id], onDelete: Cascade)
  inspectorId        String
  inspectionDate     DateTime         @default(now())
  status             String           @default("Pending") // Pending, Passed, Failed, Conditional
  checklistResults   String? // JSON
  attachments        String? // JSON array of photo URLs
  comments           String?
}
`;
schema = schema.replace(/model QualityInspection\s*\{[\s\S]*?checklistResults\s+String\?\s*\/\/\s*JSON\n\}/g, newQualityInspection.trim());

const newInboundModels = `
// ==========================================
// WAREHOUSE INBOUND OPERATIONS
// ==========================================

model AdvanceShipmentNotice {
  id              String   @id @default(uuid())
  asnNumber       String   @unique
  purchaseOrderId String
  purchaseOrder   PurchaseOrder @relation(fields: [purchaseOrderId], references: [id])
  vendorId        String
  vendor          Vendor   @relation(fields: [vendorId], references: [id])
  expectedArrival DateTime
  carrierName     String?
  trackingNumber  String?
  status          String   @default("Scheduled") // Scheduled, Arrived, Receiving, Completed
  createdAt       DateTime @default(now())
  gateEntries     GateEntry[]
}

model DockSchedule {
  id              String   @id @default(uuid())
  bayId           String
  bay             LoadingBay @relation(fields: [bayId], references: [id], onDelete: Cascade)
  asnNumber       String?
  scheduledDate   DateTime
  startTime       String   // "10:00"
  endTime         String   // "12:00"
  status          String   @default("Booked") // Booked, In-Progress, Completed
}

model GateEntry {
  id              String   @id @default(uuid())
  entryNumber     String   @unique
  asnId           String?
  asn             AdvanceShipmentNotice? @relation(fields: [asnId], references: [id])
  driverName      String
  driverLicense   String?
  vehicleNumber   String
  sealNumber      String?
  entryTime       DateTime @default(now())
  exitTime        DateTime?
  status          String   @default("Checked-In") // Checked-In, Unloading, Departed
}

model PutAwayTask {
  id              String   @id @default(uuid())
  taskId          String   @unique
  grnId           String
  goodsReceiptNote GoodsReceiptNote @relation(fields: [grnId], references: [id])
  assignedTo      String?
  status          String   @default("Pending") // Pending, In-Progress, Completed
  createdAt       DateTime @default(now())
  items           PutAwayItem[]
}

model PutAwayItem {
  id              String   @id @default(uuid())
  taskId          String
  task            PutAwayTask @relation(fields: [taskId], references: [id], onDelete: Cascade)
  itemCode        String
  item            Item     @relation(fields: [itemCode], references: [itemCode])
  qty             Float
  targetBinId     String
  bin             WarehouseBin @relation(fields: [targetBinId], references: [id])
  status          String   @default("Pending") // Pending, Completed
}
`;

// Inject relation fields into WarehouseBin, Vendor, GoodsReceiptNote, PurchaseOrder, LoadingBay
schema = schema.replace(/model WarehouseBin\s*\{/, 'model WarehouseBin {\n  putAwayItems    PutAwayItem[]');
schema = schema.replace(/model Vendor\s*\{/, 'model Vendor {\n  asns            AdvanceShipmentNotice[]');
schema = schema.replace(/model GoodsReceiptNote\s*\{/, 'model GoodsReceiptNote {\n  putAwayTasks    PutAwayTask[]');
schema = schema.replace(/model PurchaseOrder\s*\{/, 'model PurchaseOrder {\n  asns            AdvanceShipmentNotice[]');
schema = schema.replace(/model LoadingBay\s*\{/, 'model LoadingBay {\n  schedules       DockSchedule[]');

schema = schema + "\n" + newInboundModels;
fs.writeFileSync(schemaPath, schema);
console.log("Warehouse Inbound Schema updated successfully.");

// Append to mohan_documentation.md
const docPath = path.join(__dirname, 'mohan_documentation.md');
const docUpdate = `
### Warehouse Inbound Operations - Schema Update
- **File**: \`api/prisma/schema.prisma\`
- **Lines Added**: ~100 lines
- **Lines Deleted**: ~10 lines
- **Changes**:
  - Engineered new Inbound models: \`AdvanceShipmentNotice\`, \`DockSchedule\`, \`GateEntry\`, \`PutAwayTask\`, \`PutAwayItem\`.
  - Upgraded \`GRNItem\` to include \`lotNumber\` and \`putAwayBinId\`.
  - Upgraded \`QualityInspection\` to handle rich \`attachments\` (photos) and \`comments\`.
  - Linked \`LoadingBay\` to \`DockSchedule\`, and \`WarehouseBin\` to \`PutAwayItem\`.
`;
fs.appendFileSync(docPath, docUpdate);

