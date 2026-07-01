const fs = require("fs");
const schemaPath = "api/prisma/schema.prisma";

const appendData = `

// ============================================================================
// PART 13: FLEET MAINTENANCE OPERATIONS
// ============================================================================

model RoadSparePart {
  id               String            @id @default(uuid())
  name             String
  sku              String            @unique
  category         String            // Engine, Brakes, Electrical, Body
  stockLevel       Int               @default(0)
  reorderLevel     Int               @default(5)
  unitCost         Float             @default(0)
  transactions     RoadPartTransaction[]
  timestamp        DateTime          @default(now())
  
  isDeleted        Boolean           @default(false)
}

model RoadPartTransaction {
  id               String            @id @default(uuid())
  partId           String
  part             RoadSparePart     @relation(fields: [partId], references: [id])
  type             String            // Issue, Receipt, Return
  quantity         Int
  referenceId      String?           // E.g., JobCard ID or PO ID
  timestamp        DateTime          @default(now())
  
  isDeleted        Boolean           @default(false)
}

model RoadFuelLog {
  id               String            @id @default(uuid())
  vehicleId        String
  vehicle          RoadVehicle       @relation(fields: [vehicleId], references: [id])
  quantityLiters   Float
  cost             Float
  odometerReading  Int
  stationName      String?
  timestamp        DateTime          @default(now())
  
  isDeleted        Boolean           @default(false)
}

model RoadTyreInventory {
  id               String            @id @default(uuid())
  serialNumber     String            @unique
  brand            String
  size             String
  status           String            @default("Stock") // Stock, Installed, Retired
  vehicleId        String?
  vehicle          RoadVehicle?      @relation(fields: [vehicleId], references: [id])
  position         String?           // FL, FR, RL, RR, etc.
  treadDepth       Float             // in mm
  cost             Float             @default(0)
  timestamp        DateTime          @default(now())
  
  isDeleted        Boolean           @default(false)
}

model RoadServiceVendor {
  id               String            @id @default(uuid())
  name             String
  type             String            // Garage, Dealer, Supplier
  contactPerson    String?
  phone            String?
  rating           Float             @default(5.0)
  costs            RoadMaintenanceCost[]
  timestamp        DateTime          @default(now())
  
  isDeleted        Boolean           @default(false)
}

model RoadMaintenanceCost {
  id               String            @id @default(uuid())
  vehicleId        String
  vehicle          RoadVehicle       @relation(fields: [vehicleId], references: [id])
  vendorId         String?
  vendor           RoadServiceVendor? @relation(fields: [vendorId], references: [id])
  type             String            // Parts, Labour, Fuel, Tyre, General
  amount           Float
  currency         String            @default("USD")
  description      String?
  incurredAt       DateTime          @default(now())
  timestamp        DateTime          @default(now())
  
  isDeleted        Boolean           @default(false)
}
`;

fs.appendFileSync(schemaPath, appendData, "utf8");
console.log("Fleet Maintenance Ops schema appended.");

