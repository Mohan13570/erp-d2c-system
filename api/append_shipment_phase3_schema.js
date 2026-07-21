const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'prisma', 'schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf8');

// 1. Update ShipmentCargo model
const cargoModelRegex = /model ShipmentCargo\s+{[\s\S]*?(?=model\s+\w+\s+{|$)/;
const match = schema.match(cargoModelRegex);

if (match) {
  let cargoModel = match[0];
  
  if (!cargoModel.includes('cargoNature')) {
    const newFields = `
  cargoName          String?
  commodityCategory  String?
  unNumber           String?
  cargoNature        String?
  cargoType          String?
  countryOfOrigin    String?
  countryOfDestination String?
  declaredValue      Float?
  currency           String?
  insuranceRequired  Boolean @default(false)
  insuranceValue     Float?
  incoterms          String?

  // Special Handling
  dangerousGoods     Boolean @default(false)
  dgClass            String?
  imoClass           String?
  temperatureControlled Boolean @default(false)
  tempRangeMin       Float?
  tempRangeMax       Float?
  fragile            Boolean @default(false)
  stackable          Boolean @default(true)
  hazardous          Boolean @default(false)
  perishable         Boolean @default(false)
  oversizedCargo     Boolean @default(false)
  heavyLift          Boolean @default(false)
  highValueCargo     Boolean @default(false)
  lithiumBattery     Boolean @default(false)
  liveAnimals        Boolean @default(false)
  medicalGoods       Boolean @default(false)
  foodGrade          Boolean @default(false)
  specialInstructions String?

  packages           ShipmentPackage[]
`;
    // Insert before closing brace.
    cargoModel = cargoModel.replace(/}\s*$/, newFields + '\n}\n');
    schema = schema.replace(match[0], cargoModel);
    console.log('ShipmentCargo model updated for Phase 3 successfully.');
  } else {
    console.log('ShipmentCargo model already updated for Phase 3.');
  }
} else {
  console.log('ShipmentCargo model not found!');
}

// 2. Append new models for Phase 3
const newModels = `
// ==========================================
// PACKAGE MANAGEMENT (PHASE 3)
// ==========================================

model ShipmentPackage {
  id               String   @id @default(uuid())
  cargoId          String
  cargo            ShipmentCargo @relation(fields: [cargoId], references: [id], onDelete: Cascade)
  packageNumber    String   @unique
  packageType      String
  description      String?
  marksAndNumbers  String?
  quantity         Int      @default(1)
  
  // Dimensions
  length           Float?
  width            Float?
  height           Float?
  dimensionUnit    String   @default("cm") // cm, mm, m, in, ft
  
  // Weights & Volumes (Calculated/Stored)
  grossWeight      Float?
  netWeight        Float?
  actualWeight     Float?
  weightUnit       String   @default("kg") // kg, lbs
  volume           Float?
  cbm              Float?
  cft              Float?
  volumetricWeight Float?
  chargeableWeight Float?
  
  declaredValue    Float?
  insuranceValue   Float?
  remarks          String?
  
  photos           PackagePhoto[]
  inspections      QualityInspection[]
  
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
}

model PackagePhoto {
  id          String   @id @default(uuid())
  packageId   String
  packageRef  ShipmentPackage @relation(fields: [packageId], references: [id], onDelete: Cascade)
  photoUrl    String
  photoType   String   // PACKAGE, DAMAGE, LOADING
  description String?
  uploadedBy  String?
  createdAt   DateTime @default(now())
}

model QualityInspection {
  id                String   @id @default(uuid())
  packageId         String
  packageRef        ShipmentPackage @relation(fields: [packageId], references: [id], onDelete: Cascade)
  inspectionRequired Boolean @default(false)
  inspectionStatus  String   @default("PENDING")
  inspectionDate    DateTime?
  inspector         String?
  damageFound       Boolean  @default(false)
  damageDescription String?
  packageCondition  String?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}

model ContainerPlanning {
  id                String   @id @default(uuid())
  shipmentId        String   @unique
  shipment          Shipment @relation(fields: [shipmentId], references: [id], onDelete: Cascade)
  containerType     String
  containerSize     String
  maximumWeight     Float
  currentWeight     Float    @default(0.0)
  remainingCapacity Float
  loadPercentage    Float    @default(0.0)
  containerStatus   String   @default("PLANNED")
  updatedAt         DateTime @updatedAt
}
`;

if (!schema.includes('model ShipmentPackage')) {
  schema += '\n' + newModels;
  fs.writeFileSync(schemaPath, schema, 'utf8');
  console.log('Phase 3 models appended successfully.');
} else {
  console.log('Phase 3 models already exist.');
}
