const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'api', 'prisma', 'schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf8');

const newOutboundModels = `
model PickList {
  id           String         @id @default(uuid())
  pickNumber   String         @unique
  orderRef     String
  salesOrder   SalesOrder?    @relation(fields: [orderRef], references: [orderNumber])
  pickingType  String         @default("Single") // Single, Wave, Zone, Batch
  assignedZone String?
  assignedTo   String?
  status       String         @default("Pending") // Pending, Picking, Completed
  completedAt  DateTime?
  createdAt    DateTime       @default(now())
  items        PickListItem[]
  boxes        PackingBox[]
}

model PickListItem {
  id           String       @id @default(uuid())
  pickListId   String
  pickList     PickList     @relation(fields: [pickListId], references: [id], onDelete: Cascade)
  itemCode     String
  item         Item         @relation(fields: [itemCode], references: [itemCode])
  fromBinId    String?
  bin          WarehouseBin? @relation(fields: [fromBinId], references: [id])
  qtyExpected  Float
  qtyPicked    Float        @default(0)
  status       String       @default("Pending") // Pending, Picked
}

model PackingBox {
  id           String       @id @default(uuid())
  boxNumber    String       @unique
  pickListId   String
  pickList     PickList     @relation(fields: [pickListId], references: [id], onDelete: Cascade)
  packingType  String       // Box, Pallet, Carton
  weight       Float?
  dimensions   String?      // L x W x H
  labelUrl     String?      // Barcode/QR Code image URL
  status       String       @default("Packed") // Packed, Dispatched
  dispatchId   String?
  dispatch     ShipmentDispatch? @relation(fields: [dispatchId], references: [id])
  createdAt    DateTime     @default(now())
}

model ShipmentDispatch {
  id           String       @id @default(uuid())
  dispatchNo   String       @unique
  driverName   String?
  vehicleNo    String?
  sealNumber   String?
  dockBayId    String?
  dockBay      LoadingBay?  @relation(fields: [dockBayId], references: [id])
  status       String       @default("Planned") // Planned, Loading, Dispatched, Delivered
  dispatchedAt DateTime?
  boxes        PackingBox[]
  proof        DispatchProof?
  createdAt    DateTime     @default(now())
}

model DispatchProof {
  id           String       @id @default(uuid())
  dispatchId   String       @unique
  dispatch     ShipmentDispatch @relation(fields: [dispatchId], references: [id], onDelete: Cascade)
  receiverName String
  signatureUrl String?
  photoUrl     String?
  receivedAt   DateTime     @default(now())
}

model WarehouseAuditLog {
  id           String       @id @default(uuid())
  actionType   String       // PICK, PACK, DISPATCH, ADJUSTMENT
  entityType   String       // PickList, PackingBox
  entityId     String
  userId       String
  metadata     String?      // JSON blob
  createdAt    DateTime     @default(now())
}
`;

// Remove existing PickList and PackingList
schema = schema.replace(/model PickList\s*\{[\s\S]*?createdAt\s+DateTime\s+@default\(now\(\)\)\n\}/g, '');
schema = schema.replace(/model PackingList\s*\{[\s\S]*?createdAt\s+DateTime\s+@default\(now\(\)\)\n\}/g, '');

// Inject relation fields into Item, WarehouseBin, LoadingBay, SalesOrder
schema = schema.replace(/model Item\s*\{/, 'model Item {\n  pickListItems   PickListItem[]');
schema = schema.replace(/model WarehouseBin\s*\{/, 'model WarehouseBin {\n  pickListItems   PickListItem[]');
schema = schema.replace(/model LoadingBay\s*\{/, 'model LoadingBay {\n  dispatches      ShipmentDispatch[]');
schema = schema.replace(/model SalesOrder\s*\{/, 'model SalesOrder {\n  pickLists       PickList[]');

schema = schema + "\n" + newOutboundModels;
fs.writeFileSync(schemaPath, schema);
console.log("Outbound & Analytics Schema updated successfully.");

// Append to mohan_documentation.md
const docPath = path.join(__dirname, 'mohan_documentation.md');
const docUpdate = `
### Warehouse Outbound & Analytics - Schema Update
- **File**: \`api/prisma/schema.prisma\`
- **Lines Added**: ~90 lines
- **Lines Deleted**: ~14 lines (Legacy PickList/PackingList)
- **Changes**:
  - Engineered advanced \`PickList\` & \`PickListItem\` models supporting Wave/Zone operations and bin tracing.
  - Constructed \`PackingBox\` for labeling (QR/Barcodes) and packaging dimensions.
  - Added \`ShipmentDispatch\` and \`DispatchProof\` for vehicle loading and POD management.
  - Implemented \`WarehouseAuditLog\` to serve as the bedrock for BI Analytics and KPIs.
`;
fs.appendFileSync(docPath, docUpdate);

