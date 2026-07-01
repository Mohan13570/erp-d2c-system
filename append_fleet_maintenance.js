const fs = require("fs");
const schemaPath = "api/prisma/schema.prisma";

const appendData = `

// ============================================================================
// PART 12: FLEET MAINTENANCE & WORKSHOP
// ============================================================================

model RoadVehicleDocument {
  id               String            @id @default(uuid())
  vehicleId        String
  vehicle          RoadVehicle       @relation(fields: [vehicleId], references: [id])
  type             String            // Insurance, Permit, RC, Fitness, Emission, RoadTax
  documentNo       String?
  issueDate        DateTime?
  expiryDate       DateTime?
  fileUrl          String?
  status           String            @default("Valid") // Valid, Expiring, Expired
  timestamp        DateTime          @default(now())
  
  isDeleted        Boolean           @default(false)
}

model RoadMaintenancePlan {
  id               String            @id @default(uuid())
  name             String
  description      String?
  type             String            // Mileage, Time, EngineHours
  intervalValue    Int               // e.g., 10000 (km) or 6 (months)
  schedules        RoadMaintenanceSchedule[]
  timestamp        DateTime          @default(now())
  
  isDeleted        Boolean           @default(false)
}

model RoadMaintenanceSchedule {
  id               String            @id @default(uuid())
  vehicleId        String
  vehicle          RoadVehicle       @relation(fields: [vehicleId], references: [id])
  planId           String
  plan             RoadMaintenancePlan @relation(fields: [planId], references: [id])
  nextDueDate      DateTime?
  nextDueMileage   Int?
  status           String            @default("Upcoming") // Upcoming, Overdue, Completed
  timestamp        DateTime          @default(now())
  
  isDeleted        Boolean           @default(false)
}

model RoadWorkshop {
  id               String            @id @default(uuid())
  name             String
  location         String
  managerId        String?
  bays             RoadWorkshopBay[]
  mechanics        RoadMechanic[]
  jobCards         RoadJobCard[]
  timestamp        DateTime          @default(now())
  
  isDeleted        Boolean           @default(false)
}

model RoadWorkshopBay {
  id               String            @id @default(uuid())
  workshopId       String
  workshop         RoadWorkshop      @relation(fields: [workshopId], references: [id])
  name             String
  status           String            @default("Available") // Available, Occupied, Maintenance
  jobCards         RoadJobCard[]
  timestamp        DateTime          @default(now())
  
  isDeleted        Boolean           @default(false)
}

model RoadMechanic {
  id               String            @id @default(uuid())
  workshopId       String
  workshop         RoadWorkshop      @relation(fields: [workshopId], references: [id])
  name             String
  specialization   String?
  status           String            @default("Active") // Active, On-Leave
  jobCards         RoadJobCard[]
  timestamp        DateTime          @default(now())
  
  isDeleted        Boolean           @default(false)
}

model RoadJobCard {
  id               String            @id @default(uuid())
  vehicleId        String
  vehicle          RoadVehicle       @relation(fields: [vehicleId], references: [id])
  workshopId       String
  workshop         RoadWorkshop      @relation(fields: [workshopId], references: [id])
  mechanicId       String?
  mechanic         RoadMechanic?     @relation(fields: [mechanicId], references: [id])
  bayId            String?
  bay              RoadWorkshopBay?  @relation(fields: [bayId], references: [id])
  
  status           String            @default("Open") // Open, In-Progress, QA, Closed
  description      String
  totalCost        Float             @default(0)
  currency         String            @default("USD")
  
  timestamp        DateTime          @default(now())
  isDeleted        Boolean           @default(false)
}
`;

fs.appendFileSync(schemaPath, appendData, "utf8");
console.log("Fleet Maintenance schema appended.");

