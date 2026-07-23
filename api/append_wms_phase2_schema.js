const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'prisma', 'schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf8');

if (!schema.includes('model WarehouseBlock {')) {
  schema += `

// ==========================================
// WMS Phase 2: Warehouse Structure Management
// ==========================================

model WarehouseBlock {
  id                String   @id @default(uuid())
  code              String   @unique
  name              String
  description       String?
  type              String   // Temperature Zone, Operations
  status            String   @default("ACTIVE")
  
  maxCapacity       Float?
  currentOccupancy  Float    @default(0)
  
  warehouseId       String
  warehouse         Warehouse @relation(fields: [warehouseId], references: [id], onDelete: Restrict)
  zones             WarehouseZone[]

  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}

model WarehouseZone {
  id                String   @id @default(uuid())
  code              String   @unique
  name              String
  type              String   // Dry, Cold, Frozen, Hazardous, Returns, Bulk, Picking
  description       String?
  status            String   @default("ACTIVE")
  
  blockId           String
  block             WarehouseBlock @relation(fields: [blockId], references: [id], onDelete: Restrict)
  aisles            WarehouseAisle[]

  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}

model WarehouseAisle {
  id                String   @id @default(uuid())
  code              String   @unique
  number            Int
  width             Float?
  walkingDirection  String   @default("BI_DIRECTIONAL")
  capacity          Float?
  status            String   @default("ACTIVE")
  
  zoneId            String
  zone              WarehouseZone @relation(fields: [zoneId], references: [id], onDelete: Restrict)
  racks             WarehouseRack[]

  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}

model WarehouseRack {
  id                String   @id @default(uuid())
  code              String   @unique
  number            Int
  type              String   // Static, Selective, Drive-In, Double Deep, Cantilever
  maxWeight         Float?
  maxHeight         Float?
  levels            Int      @default(1)
  status            String   @default("ACTIVE")
  
  aisleId           String
  aisle             WarehouseAisle @relation(fields: [aisleId], references: [id], onDelete: Restrict)
  shelves           WarehouseShelf[]

  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}

model WarehouseShelf {
  id                String   @id @default(uuid())
  code              String   @unique
  number            Int
  level             Int
  maxWeight         Float?
  maxVolume         Float?
  type              String?
  status            String   @default("ACTIVE")
  
  rackId            String
  rack              WarehouseRack @relation(fields: [rackId], references: [id], onDelete: Restrict)
  bins              WarehouseBin[]

  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}

model WarehouseBin {
  id                String   @id @default(uuid())
  code              String   @unique
  number            Int
  barcode           String   @unique
  qrCode            String   @unique
  maxCapacity       Float?
  maxWeight         Float?
  currentOccupancy  Float    @default(0)
  storageType       String   // PALLET, CARTON, PIECE
  status            String   @default("AVAILABLE") // AVAILABLE, OCCUPIED, RESERVED, BLOCKED, DAMAGED
  
  shelfId           String
  shelf             WarehouseShelf @relation(fields: [shelfId], references: [id], onDelete: Restrict)

  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}

model WarehouseLocationHierarchy {
  id                String   @id @default(uuid())
  pathId            String   @unique // Flattened path string e.g. WH1-B1-Z1-A1-R1-S1-BIN1
  warehouseId       String
  blockId           String?
  zoneId            String?
  aisleId           String?
  rackId            String?
  shelfId           String?
  binId             String?
  
  createdAt         DateTime @default(now())
}

model WarehouseCapacity {
  id                String   @id @default(uuid())
  warehouseId       String   @unique
  totalCapacity     Float
  usedCapacity      Float
  availableCapacity Float
  occupancyPercent  Float
  
  totalBins         Int
  availableBins     Int
  occupiedBins      Int
  blockedBins       Int
  reservedBins      Int
  
  updatedAt         DateTime @updatedAt
}
`;
  fs.writeFileSync(schemaPath, schema);
  console.log('Appended WMS Phase 2 Models');
} else {
  console.log('WMS Phase 2 Models already exist.');
}
