const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'prisma', 'schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf8');

if (!schema.includes('model Warehouse {')) {
  schema += `

// ==========================================
// WMS Phase 1: Warehouse Master Setup
// ==========================================

model Warehouse {
  id                  String   @id @default(uuid())
  code                String   @unique
  name                String   @unique
  type                String   // e.g., Fulfillment Center, Distribution Center, Cross Dock
  category            String
  status              String   @default("ACTIVE") // ACTIVE, INACTIVE, MAINTENANCE
  description         String?
  
  capacity            Float
  capacityUnit        String   @default("PALLETS") // PALLETS, SQ_FT, CBM
  area                Float
  areaUnit            String   @default("SQ_M") // SQ_M, SQ_FT
  maxWeightCapacity   Float?
  storageCapacity     Float?
  
  branch              String   @default("HQ")
  businessUnit        String?
  costCenter          String?
  currency            String   @default("USD")
  timeZone            String   @default("UTC")
  workingDays         String   @default("Mon-Fri")
  workingHours        String   @default("09:00-18:00")
  holidayCalendar     String?
  
  location            WarehouseLocation?
  contact             WarehouseContact?
  services            WarehouseService?
  safety              WarehouseSafety?
  operatingHours      WarehouseWorkingHours?
  documents           WarehouseDocument[]
  
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt
}

model WarehouseLocation {
  id                  String   @id @default(uuid())
  warehouseId         String   @unique
  warehouse           Warehouse @relation(fields: [warehouseId], references: [id], onDelete: Cascade)
  
  country             String
  state               String
  district            String?
  city                String
  area                String?
  street              String
  building            String?
  floor               String?
  postalCode          String
  
  latitude            Float?
  longitude           Float?
  mapsLink            String?
}

model WarehouseContact {
  id                  String   @id @default(uuid())
  warehouseId         String   @unique
  warehouse           Warehouse @relation(fields: [warehouseId], references: [id], onDelete: Cascade)
  
  managerName         String
  operationsManager   String?
  supervisor          String?
  
  phone               String
  mobile              String
  email               String
  
  emergencyContact    String
  emergencyPhone      String
}

model WarehouseService {
  id                  String   @id @default(uuid())
  warehouseId         String   @unique
  warehouse           Warehouse @relation(fields: [warehouseId], references: [id], onDelete: Cascade)
  
  inbound             Boolean  @default(true)
  outbound            Boolean  @default(true)
  crossDock           Boolean  @default(false)
  coldStorage         Boolean  @default(false)
  dryStorage          Boolean  @default(true)
  hazardousStorage    Boolean  @default(false)
  bondedWarehouse     Boolean  @default(false)
  returnsProcessing   Boolean  @default(true)
  packaging           Boolean  @default(true)
  labeling            Boolean  @default(true)
  qualityInspection   Boolean  @default(false)
  containerYard       Boolean  @default(false)
}

model WarehouseSafety {
  id                  String   @id @default(uuid())
  warehouseId         String   @unique
  warehouse           Warehouse @relation(fields: [warehouseId], references: [id], onDelete: Cascade)
  
  fireSafety          Boolean  @default(true)
  cctv                Boolean  @default(true)
  security            Boolean  @default(true)
  accessControl       Boolean  @default(true)
  tempMonitoring      Boolean  @default(false)
  humidityMonitoring  Boolean  @default(false)
  emergencyExit       Boolean  @default(true)
  safetyCert          String?
  insuranceId         String?
}

model WarehouseWorkingHours {
  id                  String   @id @default(uuid())
  warehouseId         String   @unique
  warehouse           Warehouse @relation(fields: [warehouseId], references: [id], onDelete: Cascade)
  
  monday              Boolean  @default(true)
  tuesday             Boolean  @default(true)
  wednesday           Boolean  @default(true)
  thursday            Boolean  @default(true)
  friday              Boolean  @default(true)
  saturday            Boolean  @default(false)
  sunday              Boolean  @default(false)
  
  openingTime         String   @default("08:00")
  closingTime         String   @default("18:00")
}

model WarehouseDocument {
  id                  String   @id @default(uuid())
  warehouseId         String
  warehouse           Warehouse @relation(fields: [warehouseId], references: [id], onDelete: Cascade)
  
  docType             String   // LICENSE, GST, INSURANCE, FIRE_SAFETY
  docName             String
  fileUrl             String
  uploadedAt          DateTime @default(now())
}
`;
  fs.writeFileSync(schemaPath, schema);
  console.log('Appended WMS Phase 1 Models');
} else {
  console.log('WMS Phase 1 Models already exist.');
}
