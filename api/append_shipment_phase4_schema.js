const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'prisma', 'schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf8');

const newModels = `
// ==========================================
// RESOURCE ALLOCATION & DISPATCH (PHASE 4)
// ==========================================

model ShipmentResourceValidation {
  id               String   @id @default(uuid())
  shipmentId       String   @unique
  shipment         Shipment @relation(fields: [shipmentId], references: [id], onDelete: Cascade)
  isVehicleValid   Boolean  @default(false)
  isDriverValid    Boolean  @default(false)
  isWarehouseValid Boolean  @default(false)
  isContainerValid Boolean  @default(false)
  isRouteValid     Boolean  @default(false)
  isTeamValid      Boolean  @default(false)
  overallStatus    String   @default("PENDING") // PENDING, VALIDATED, FAILED
  lastValidatedAt  DateTime?
  updatedAt        DateTime @updatedAt
}

model VehicleAssignment {
  id               String   @id @default(uuid())
  shipmentId       String   @unique
  shipment         Shipment @relation(fields: [shipmentId], references: [id], onDelete: Cascade)
  vehicleId        String?
  vehicleNumber    String?
  vehicleType      String?
  registrationNo   String?
  capacityWeight   Float?
  capacityVolume   Float?
  currentLocation  String?
  fuelStatus       String?
  availability     String   @default("AVAILABLE")
  vehicleOwner     String?
  vehicleContact   String?
  remarks          String?
  assignedAt       DateTime @default(now())
  updatedAt        DateTime @updatedAt
}

model DriverAssignment {
  id               String   @id @default(uuid())
  shipmentId       String   @unique
  shipment         Shipment @relation(fields: [shipmentId], references: [id], onDelete: Cascade)
  driverId         String?
  driverName       String?
  licenseNumber    String?
  licenseExpiry    DateTime?
  mobileNumber     String?
  experienceYears  Int?
  currentStatus    String   @default("AVAILABLE")
  currentLocation  String?
  emergencyContact String?
  alternateDriver  String?
  remarks          String?
  assignedAt       DateTime @default(now())
  updatedAt        DateTime @updatedAt
}

model WarehouseAssignment {
  id                 String   @id @default(uuid())
  shipmentId         String   @unique
  shipment           Shipment @relation(fields: [shipmentId], references: [id], onDelete: Cascade)
  originWarehouse    String?
  destWarehouse      String?
  crossDock          String?
  transitWarehouse   String?
  warehouseZone      String?
  warehouseManager   String?
  warehouseContact   String?
  loadingBay         String?
  instructions       String?
  capacityCBM        Float?
  currentUtilization Float?
  availableSpaceCBM  Float?
  assignedAt         DateTime @default(now())
  updatedAt        DateTime @updatedAt
}

model ContainerAssignment {
  id               String   @id @default(uuid())
  shipmentId       String   @unique
  shipment         Shipment @relation(fields: [shipmentId], references: [id], onDelete: Cascade)
  containerNumber  String?
  containerType    String?
  containerSize    String?
  sealNumber       String?
  containerOwner   String?
  containerStatus  String   @default("EMPTY")
  containerWeight  Float?
  capacityWeight   Float?
  availableCapacity Float?
  assignedAt       DateTime @default(now())
  updatedAt        DateTime @updatedAt
}

model RouteAssignment {
  id               String   @id @default(uuid())
  shipmentId       String   @unique
  shipment         Shipment @relation(fields: [shipmentId], references: [id], onDelete: Cascade)
  routeName        String?
  originNode       String?
  destNode         String?
  distanceKm       Float?
  estTransitTimeHrs Float?
  preferredRoute   String?
  alternateRoute   String?
  tollRoute        Boolean  @default(false)
  avoidRoute       String?
  trafficPriority  String?
  assignedAt       DateTime @default(now())
  updatedAt        DateTime @updatedAt
}

model DispatchPlan {
  id               String   @id @default(uuid())
  shipmentId       String   @unique
  shipment         Shipment @relation(fields: [shipmentId], references: [id], onDelete: Cascade)
  dispatchDate     DateTime?
  dispatchTime     String?
  loadingStartTime DateTime?
  loadingEndTime   DateTime?
  departureTime    DateTime?
  expectedArrival  DateTime?
  estimatedDelivery DateTime?
  priority         String   @default("NORMAL")
  instructions     String?
  status           String   @default("DRAFT")
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
}
`;

if (!schema.includes('model VehicleAssignment')) {
  // Insert relations into Shipment model
  const shipmentModelRegex = /model Shipment\s+{[\s\S]*?(?=model\s+\w+\s+{|$)/;
  const match = schema.match(shipmentModelRegex);

  if (match) {
    let shipmentModel = match[0];
    const newRelations = `
  resourceValidation ShipmentResourceValidation?
  vehicleAssignment  VehicleAssignment?
  driverAssignment   DriverAssignment?
  warehouseAssignment WarehouseAssignment?
  containerAssignment ContainerAssignment?
  routeAssignment    RouteAssignment?
  dispatchPlan       DispatchPlan?
`;
    // Insert before closing brace.
    shipmentModel = shipmentModel.replace(/}\s*$/, newRelations + '\n}\n');
    schema = schema.replace(match[0], shipmentModel);
  }

  schema += '\n' + newModels;
  fs.writeFileSync(schemaPath, schema, 'utf8');
  console.log('Phase 4 models appended successfully.');
} else {
  console.log('Phase 4 models already exist.');
}
