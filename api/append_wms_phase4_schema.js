const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'prisma', 'schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf8');

if (!schema.includes('model PutawayTask {')) {
  schema += `

// ==========================================
// WMS Phase 4: Putaway Management
// ==========================================

model PutawayTask {
  id                String   @id @default(uuid())
  putawayNumber     String   @unique
  warehouseId       String
  receivingId       String?  @unique // Link to WarehouseReceiving
  grnNumber         String?
  
  createdDate       DateTime @default(now())
  priority          String   @default("NORMAL") // LOW, NORMAL, HIGH, URGENT
  status            String   @default("PENDING") // PENDING, SUGGESTED, ASSIGNED, IN_PROGRESS, COMPLETED, CANCELLED
  taskType          String   @default("STANDARD_PUTAWAY")
  
  items             PutawayTaskItem[]
  location          PutawayLocation?
  rules             StorageRule[]
  assignment        PutawayAssignment?
  execution         PutawayExecution?
  exceptions        PutawayException[]
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}

model PutawayTaskItem {
  id                String   @id @default(uuid())
  taskId            String
  task              PutawayTask @relation(fields: [taskId], references: [id], onDelete: Cascade)
  
  productCode       String
  productName       String
  sku               String?
  barcode           String?
  batchNumber       String?
  serialNumber      String?
  
  quantity          Float
  weight            Float?
  volume            Float?
  storageReq        String?  // AMBIENT, COLD, HAZARDOUS
}

model PutawayLocation {
  id                String   @id @default(uuid())
  taskId            String   @unique
  task              PutawayTask @relation(fields: [taskId], references: [id], onDelete: Cascade)
  
  // Source
  sourceDock        String?
  sourceBin         String?
  sourceZone        String?
  
  // Suggested Destination Engine Output
  suggestedBlock    String?
  suggestedZone     String?
  suggestedAisle    String?
  suggestedRack     String?
  suggestedShelf    String?
  suggestedBin      String?
  
  availableCapacity Float?
  remainingCapacity Float?
  storageType       String?
  suggestionScore   Float?   // Engine ranking score
}

model StorageRule {
  id                String   @id @default(uuid())
  taskId            String
  task              PutawayTask @relation(fields: [taskId], references: [id], onDelete: Cascade)
  
  ruleType          String   // FIFO, FEFO, LIFO, DEDICATED, RANDOM, ABC, COLD, HAZARDOUS
  isActive          Boolean  @default(true)
  priority          Int      @default(1)
}

model PutawayAssignment {
  id                String   @id @default(uuid())
  taskId            String   @unique
  task              PutawayTask @relation(fields: [taskId], references: [id], onDelete: Cascade)
  
  operatorId        String?
  operatorName      String?
  supervisorId      String?
  
  equipmentType     String?  // FORKLIFT, PALLET_JACK
  equipmentId       String?
  
  estimatedDuration Int?     // in minutes
}

model PutawayExecution {
  id                String   @id @default(uuid())
  taskId            String   @unique
  task              PutawayTask @relation(fields: [taskId], references: [id], onDelete: Cascade)
  
  startTime         DateTime?
  endTime           DateTime?
  actualDuration    Int?     // in minutes
  
  confirmedBy       String?
  finalBin          String?
  finalQuantity     Float?
  
  barcodeScanned    Boolean  @default(false)
  qrScanned         Boolean  @default(false)
  notes             String?
}

model PutawayException {
  id                String   @id @default(uuid())
  taskId            String
  task              PutawayTask @relation(fields: [taskId], references: [id], onDelete: Cascade)
  
  exceptionType     String   // LOCATION_FULL, LOCATION_BLOCKED, DAMAGED_GOODS, WRONG_ITEM
  description       String?
  reportedBy        String
  reportedAt        DateTime @default(now())
  resolution        String?
  isResolved        Boolean  @default(false)
}
`;
  fs.writeFileSync(schemaPath, schema);
  console.log('Appended WMS Phase 4 Models');
} else {
  console.log('WMS Phase 4 Models already exist.');
}
