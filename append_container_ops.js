const fs = require("fs");
const schemaPath = "api/prisma/schema.prisma";

const appendData = `

// ============================================================================
// PART 15: CONTAINER YARD, OPERATIONS & MOVEMENT
// ============================================================================

model ContainerYardZone {
  id               String            @id @default(uuid())
  name             String
  type             String            // Empty, Loaded, Reefer, DG
  capacity         Int
  occupied         Int               @default(0)
  slots            ContainerYardSlot[]
  
  isDeleted        Boolean           @default(false)
  timestamp        DateTime          @default(now())
}

model ContainerYardSlot {
  id               String            @id @default(uuid())
  zoneId           String
  zone             ContainerYardZone @relation(fields: [zoneId], references: [id])
  block            String
  row              String
  stack            String
  tier             String
  status           String            @default("Available") // Available, Occupied, Maintenance
  
  containerId      String?           @unique
  container        Container?        @relation(fields: [containerId], references: [id])
  
  isDeleted        Boolean           @default(false)
  timestamp        DateTime          @default(now())
}

model ContainerOperation {
  id               String            @id @default(uuid())
  containerId      String
  container        Container         @relation(fields: [containerId], references: [id])
  type             String            // GateIn, GateOut, Stuffing, Destuffing, Cleaning, Washing, Fumigation, Repair
  location         String?
  performedBy      String?
  status           String            @default("Completed")
  notes            String?
  timestamp        DateTime          @default(now())
  
  isDeleted        Boolean           @default(false)
}

model ContainerCargoOperation {
  id               String            @id @default(uuid())
  containerId      String
  container        Container         @relation(fields: [containerId], references: [id])
  type             String            // Loading, Unloading, WeightVerif, TempCheck, DGVerif
  verifiedWeight   Float?            // VGM (Verified Gross Mass)
  reeferTemperature Float?           // Celsius
  isDangerousGoods Boolean           @default(false)
  inspectorId      String?
  notes            String?
  timestamp        DateTime          @default(now())
  
  isDeleted        Boolean           @default(false)
}

model ContainerPortOperation {
  id               String            @id @default(uuid())
  containerId      String
  container        Container         @relation(fields: [containerId], references: [id])
  terminal         String
  berth            String?
  crane            String?
  operation        String            // Load, Discharge, Arrival, Departure
  vesselName       String?
  scheduledTime    DateTime?
  actualTime       DateTime?
  timestamp        DateTime          @default(now())
  
  isDeleted        Boolean           @default(false)
}
`;

fs.appendFileSync(schemaPath, appendData, "utf8");
console.log("Container Ops schema appended.");

