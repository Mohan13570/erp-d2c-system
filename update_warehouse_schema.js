const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'api', 'prisma', 'schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf8');

const newWarehouseModel = `
model Warehouse {
  name             String              @id
  code             String?             @unique
  companyName      String
  company          Company             @relation(fields: [companyName], references: [name])
  
  // WMS Master Data
  category         String?             // e.g., Regional, Local
  type             String?             // Cold Storage, Dry, Bonded, Cross Dock
  capacity         Float?
  storageConditions String?            // Ambient, Chilled, Frozen
  gpsCoordinates   String?
  managerName      String?
  status           String              @default("Active") // Active, Maintenance, Closed

  stockEntries     StockLedgerEntry[]
  stockLevels      StockLevel[]
  locations        WarehouseLocation[]

  // New Spatial & Asset Relations
  zones            WarehouseZone[]
  equipments       WarehouseEquipment[]
  loadingBays      LoadingBay[]
  shifts           WarehouseShift[]
  holidays         WarehouseHoliday[]
  settings         WarehouseSetting?
  documents        WarehouseDocument[]
  images           WarehouseImage[]
  safetyRules      SafetyRule[]
}
`;

// Replace the old Warehouse model
schema = schema.replace(/model Warehouse\s*\{[\s\S]*?locations\s+WarehouseLocation\[\]\n\}/g, newWarehouseModel.trim());

const newWmsModels = `
// ==========================================
// WAREHOUSE MASTER & SPATIAL Hierarchy
// ==========================================

model WarehouseZone {
  id              String   @id @default(uuid())
  zoneCode        String
  warehouseName   String
  warehouse       Warehouse @relation(fields: [warehouseName], references: [name], onDelete: Cascade)
  type            String   // Receiving, Storage, Picking, Packing, Dispatch
  temperature     String?  // Control requirement
  blocks          WarehouseBlock[]
  
  @@unique([warehouseName, zoneCode])
}

model WarehouseBlock {
  id              String   @id @default(uuid())
  blockCode       String
  zoneId          String
  zone            WarehouseZone @relation(fields: [zoneId], references: [id], onDelete: Cascade)
  aisles          WarehouseAisle[]
  
  @@unique([zoneId, blockCode])
}

model WarehouseAisle {
  id              String   @id @default(uuid())
  aisleCode       String
  blockId         String
  block           WarehouseBlock @relation(fields: [blockId], references: [id], onDelete: Cascade)
  racks           WarehouseRack[]

  @@unique([blockId, aisleCode])
}

model WarehouseRack {
  id              String   @id @default(uuid())
  rackCode        String
  aisleId         String
  aisle           WarehouseAisle @relation(fields: [aisleId], references: [id], onDelete: Cascade)
  shelves         WarehouseShelf[]

  @@unique([aisleId, rackCode])
}

model WarehouseShelf {
  id              String   @id @default(uuid())
  shelfCode       String
  rackId          String
  rack            WarehouseRack @relation(fields: [rackId], references: [id], onDelete: Cascade)
  maxWeightCapacity Float?
  bins            WarehouseBin[]

  @@unique([rackId, shelfCode])
}

model WarehouseBin {
  id              String   @id @default(uuid())
  binCode         String
  shelfId         String
  shelf           WarehouseShelf @relation(fields: [shelfId], references: [id], onDelete: Cascade)
  barcode         String?  @unique
  volumeCapacity  Float?
  weightCapacity  Float?

  @@unique([shelfId, binCode])
}

model WarehouseFloor {
  id              String   @id @default(uuid())
  floorName       String
  description     String?
}

// ==========================================
// WAREHOUSE ASSETS & RULES
// ==========================================

model WarehouseEquipment {
  id              String   @id @default(uuid())
  equipmentCode   String   @unique
  warehouseName   String
  warehouse       Warehouse @relation(fields: [warehouseName], references: [name], onDelete: Cascade)
  type            String   // Forklift, Pallet Jack, Conveyor
  status          String   @default("Active") // Active, Maintenance, Retired
  lastServiceDate DateTime?
}

model LoadingBay {
  id              String   @id @default(uuid())
  bayCode         String
  warehouseName   String
  warehouse       Warehouse @relation(fields: [warehouseName], references: [name], onDelete: Cascade)
  type            String   // Inbound, Outbound, Both
  status          String   @default("Available") // Available, Occupied, Maintenance

  @@unique([warehouseName, bayCode])
}

model WarehouseShift {
  id              String   @id @default(uuid())
  shiftName       String
  warehouseName   String
  warehouse       Warehouse @relation(fields: [warehouseName], references: [name], onDelete: Cascade)
  startTime       String   // e.g., 08:00
  endTime         String   // e.g., 16:00
}

model WarehouseHoliday {
  id              String   @id @default(uuid())
  date            DateTime
  description     String?
  warehouseName   String
  warehouse       Warehouse @relation(fields: [warehouseName], references: [name], onDelete: Cascade)
}

model WarehouseSetting {
  id              String   @id @default(uuid())
  warehouseName   String   @unique
  warehouse       Warehouse @relation(fields: [warehouseName], references: [name], onDelete: Cascade)
  barcodeConfig   String   @default("CODE128")
  qrConfig        Boolean  @default(true)
  rfidConfig      Boolean  @default(false)
  pickingRule     String   @default("FIFO") // FIFO, LIFO, FEFO
  packingRule     String   @default("Standard")
  dispatchRule    String   @default("Standard")
  stockReservation Boolean @default(true)
}

model WarehouseDocument {
  id              String   @id @default(uuid())
  title           String
  fileUrl         String
  warehouseName   String
  warehouse       Warehouse @relation(fields: [warehouseName], references: [name], onDelete: Cascade)
}

model WarehouseImage {
  id              String   @id @default(uuid())
  imageUrl        String
  warehouseName   String
  warehouse       Warehouse @relation(fields: [warehouseName], references: [name], onDelete: Cascade)
}

model SafetyRule {
  id              String   @id @default(uuid())
  rule            String
  isMandatory     Boolean  @default(true)
  warehouseName   String
  warehouse       Warehouse @relation(fields: [warehouseName], references: [name], onDelete: Cascade)
}
`;

schema = schema + "\n" + newWmsModels;
fs.writeFileSync(schemaPath, schema);
console.log("Warehouse WMS Schema updated successfully.");

// Append to mohan_documentation.md
const docPath = path.join(__dirname, 'mohan_documentation.md');
const docUpdate = `
### Warehouse Master Setup - Schema Update
- **File**: \`api/prisma/schema.prisma\`
- **Lines Added**: ~160 lines
- **Lines Deleted**: ~10 lines
- **Changes**:
  - Replaced the basic \`Warehouse\` model with an advanced WMS \`Warehouse\` model.
  - Added new fields: \`category\`, \`type\`, \`capacity\`, \`storageConditions\`, \`gpsCoordinates\`, \`managerName\`, \`status\`.
  - Added spatial hierarchy models: \`WarehouseZone\`, \`WarehouseBlock\`, \`WarehouseAisle\`, \`WarehouseRack\`, \`WarehouseShelf\`, \`WarehouseBin\`, \`WarehouseFloor\`.
  - Added operational asset models: \`WarehouseEquipment\`, \`LoadingBay\`, \`WarehouseShift\`, \`WarehouseHoliday\`.
  - Added rules & configuration models: \`WarehouseSetting\`, \`WarehouseDocument\`, \`WarehouseImage\`, \`SafetyRule\`.
`;
fs.appendFileSync(docPath, docUpdate);

