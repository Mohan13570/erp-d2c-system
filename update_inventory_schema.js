const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'api', 'prisma', 'schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf8');

// Update Item
const itemReplacement = `
  hasBatchTracking        Boolean                   @default(false)
  hasSerialTracking       Boolean                   @default(false)
  reorderLevel            Float                     @default(0.0)
  safetyStock             Float                     @default(0.0)
  createdAt               DateTime                  @default(now())
`;
schema = schema.replace(/createdAt\s+DateTime\s+@default\(now\(\)\)/, itemReplacement.trim());

// Update StockLevel
const stockLevelReplacement = `
  qtyAvailable  Float     @default(0.0)
  qtyBlocked    Float     @default(0.0)
  qtyDamaged    Float     @default(0.0)
  qtyExpired    Float     @default(0.0)
  updatedAt     DateTime  @updatedAt
`;
schema = schema.replace(/qtyAvailable\s+Float\s+@default\(0\.0\)\n\s+updatedAt\s+DateTime\s+@updatedAt/, stockLevelReplacement.trim());

// New Models
const newInventoryModels = `
// ==========================================
// ADVANCED INVENTORY MANAGEMENT
// ==========================================

model InventoryBatch {
  id              String   @id @default(uuid())
  itemCode        String
  item            Item     @relation(fields: [itemCode], references: [itemCode], onDelete: Cascade)
  batchNumber     String   @unique
  mfgDate         DateTime?
  expiryDate      DateTime?
  qtyOriginal     Float
  qtyCurrent      Float
  status          String   @default("Active") // Active, Expired, Recalled
  createdAt       DateTime @default(now())
}

model InventorySerial {
  id              String   @id @default(uuid())
  itemCode        String
  item            Item     @relation(fields: [itemCode], references: [itemCode], onDelete: Cascade)
  serialNumber    String   @unique
  warehouseName   String
  status          String   @default("In-Stock") // In-Stock, Sold, In-Transit, Damaged, Returned
  createdAt       DateTime @default(now())
}

model InventoryAdjustment {
  id              String   @id @default(uuid())
  itemCode        String
  item            Item     @relation(fields: [itemCode], references: [itemCode], onDelete: Cascade)
  warehouseName   String
  adjustmentQty   Float
  reason          String   // Shrinkage, Damage, Found, Write-Off
  adjustedBy      String
  status          String   @default("Draft") // Draft, Posted
  createdAt       DateTime @default(now())
}

model InventoryTransfer {
  id              String   @id @default(uuid())
  transferId      String   @unique
  itemCode        String
  item            Item     @relation(fields: [itemCode], references: [itemCode], onDelete: Cascade)
  fromWarehouse   String
  toWarehouse     String
  qty             Float
  status          String   @default("Pending") // Pending, In-Transit, Completed
  initiatedBy     String
  shippedDate     DateTime?
  receivedDate    DateTime?
}

model CycleCount {
  id              String   @id @default(uuid())
  countId         String   @unique
  warehouseName   String
  status          String   @default("Scheduled") // Scheduled, Counting, Review, Reconciled
  assignedTo      String?
  scheduledDate   DateTime
  items           CycleCountItem[]
  createdAt       DateTime @default(now())
}

model CycleCountItem {
  id              String   @id @default(uuid())
  cycleCountId    String
  cycleCount      CycleCount @relation(fields: [cycleCountId], references: [id], onDelete: Cascade)
  itemCode        String
  expectedQty     Float
  countedQty      Float?
  variance        Float?
  status          String   @default("Pending") // Pending, Counted, Adjusted
}

model InventoryValuationSnapshot {
  id              String   @id @default(uuid())
  snapshotDate    DateTime @default(now())
  itemCode        String
  warehouseName   String
  qty             Float
  unitValue       Float
  totalValue      Float
  method          String   // FIFO, LIFO, Weighted Average
}
`;

// Inject relations to Item
schema = schema.replace(/model Item\s*\{/, 'model Item {\n  batches         InventoryBatch[]\n  serials         InventorySerial[]\n  adjustments     InventoryAdjustment[]\n  transfers       InventoryTransfer[]');

schema = schema + "\n" + newInventoryModels;
fs.writeFileSync(schemaPath, schema);
console.log("Advanced Inventory Schema updated successfully.");

// Append to mohan_documentation.md
const docPath = path.join(__dirname, 'mohan_documentation.md');
const docUpdate = `
### Advanced Inventory Management - Schema Update
- **File**: \`api/prisma/schema.prisma\`
- **Lines Added**: ~100 lines
- **Lines Deleted**: ~2 lines
- **Changes**:
  - Engineered new Inventory models: \`InventoryBatch\`, \`InventorySerial\`, \`InventoryAdjustment\`, \`InventoryTransfer\`, \`CycleCount\`, \`InventoryValuationSnapshot\`.
  - Upgraded \`Item\` to include \`hasBatchTracking\`, \`hasSerialTracking\`, \`reorderLevel\`, and \`safetyStock\`.
  - Upgraded \`StockLevel\` to include \`qtyBlocked\`, \`qtyDamaged\`, and \`qtyExpired\`.
`;
fs.appendFileSync(docPath, docUpdate);
