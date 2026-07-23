const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'prisma', 'schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf8');

if (!schema.includes('model Inventory {')) {
  schema += `

// ==========================================
// WMS Phase 5: Inventory Management
// ==========================================

model Inventory {
  id                String   @id @default(uuid())
  warehouseId       String
  productCode       String
  productName       String
  sku               String?  @unique
  barcode           String?  @unique
  qrCode            String?  @unique
  category          String?
  brand             String?
  
  batchNumber       String?
  serialNumber      String?
  mfgDate           DateTime?
  expiryDate        DateTime?
  uom               String   @default("PCS")
  
  totalQuantity     Float    @default(0)
  availableQuantity Float    @default(0)
  reservedQuantity  Float    @default(0)
  damagedQuantity   Float    @default(0)
  blockedQuantity   Float    @default(0)
  
  status            String   @default("AVAILABLE") // AVAILABLE, RESERVED, QUARANTINED, EXPIRED, BLOCKED
  
  locations         InventoryLocation[]
  movements         InventoryMovement[]
  reservations      InventoryReservation[]
  history           InventoryHistory[]
  valuation         InventoryValuation?
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}

model InventoryLocation {
  id                String   @id @default(uuid())
  inventoryId       String
  inventory         Inventory @relation(fields: [inventoryId], references: [id], onDelete: Cascade)
  
  warehouseId       String
  block             String?
  zone              String?
  aisle             String?
  rack              String?
  shelf             String?
  bin               String?
  
  storageType       String?
  
  currentQuantity   Float    @default(0)
  availableQuantity Float    @default(0)
  reservedQuantity  Float    @default(0)
  blockedQuantity   Float    @default(0)
  
  updatedAt         DateTime @updatedAt
}

model InventoryMovement {
  id                String   @id @default(uuid())
  inventoryId       String
  inventory         Inventory @relation(fields: [inventoryId], references: [id], onDelete: Cascade)
  
  movementNumber    String   @unique
  movementType      String   // RECEIVING, PUTAWAY, TRANSFER, ADJUSTMENT, RESERVATION, PICKING, PACKING, DISPATCH, RETURN, ISSUE
  movementDate      DateTime @default(now())
  
  quantity          Float
  fromLocation      String?
  toLocation        String?
  performedBy       String?
}

model InventoryTransfer {
  id                String   @id @default(uuid())
  transferNumber    String   @unique
  
  transferType      String   // WAREHOUSE, BIN, RACK, ZONE
  reason            String?
  
  requestedBy       String?
  approvedBy        String?
  status            String   @default("PENDING") // PENDING, APPROVED, COMPLETED, REJECTED
  
  transferDate      DateTime?
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}

model InventoryReservation {
  id                String   @id @default(uuid())
  inventoryId       String
  inventory         Inventory @relation(fields: [inventoryId], references: [id], onDelete: Cascade)
  
  reservationNumber String   @unique
  shipmentNumber    String?
  orderNumber       String?
  customer          String?
  
  reservedQuantity  Float
  reservationDate   DateTime @default(now())
  expiryDate        DateTime?
  status            String   @default("ACTIVE") // ACTIVE, CONSUMED, RELEASED
}

model InventoryCount {
  id                String   @id @default(uuid())
  countNumber       String   @unique
  warehouseId       String
  zone              String?
  bin               String?
  
  scheduledDate     DateTime
  countDate         DateTime?
  
  systemQuantity    Float    @default(0)
  physicalQuantity  Float    @default(0)
  difference        Float    @default(0)
  variancePercent   Float    @default(0)
  
  status            String   @default("SCHEDULED") // SCHEDULED, COUNTED, APPROVED, REJECTED
  approvedBy        String?
}

model InventoryAdjustment {
  id                String   @id @default(uuid())
  adjustmentNumber  String   @unique
  
  adjustmentType    String   // INCREASE, DECREASE
  reason            String   // DAMAGE, LOSS, CORRECTION, EXPIRY, AUDIT
  quantity          Float
  
  status            String   @default("PENDING") // PENDING, APPROVED, REJECTED
  approvedBy        String?
  
  createdAt         DateTime @default(now())
}

model InventoryValuation {
  id                String   @id @default(uuid())
  inventoryId       String   @unique
  inventory         Inventory @relation(fields: [inventoryId], references: [id], onDelete: Cascade)
  
  costMethod        String   @default("FIFO") // FIFO, LIFO, WEIGHTED_AVERAGE, STANDARD
  unitCost          Float    @default(0)
  totalCost         Float    @default(0)
  totalValue        Float    @default(0)
  
  updatedAt         DateTime @updatedAt
}

model InventoryHistory {
  id                String   @id @default(uuid())
  inventoryId       String
  inventory         Inventory @relation(fields: [inventoryId], references: [id], onDelete: Cascade)
  
  transactionType   String   // MOVEMENT, ADJUSTMENT, RESERVATION, TRANSFER, COUNT
  referenceNumber   String
  description       String?
  quantityChange    Float
  balanceAfter      Float
  
  createdAt         DateTime @default(now())
}
`;
  fs.writeFileSync(schemaPath, schema);
  console.log('Appended WMS Phase 5 Models');
} else {
  console.log('WMS Phase 5 Models already exist.');
}
