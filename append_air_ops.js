const fs = require("fs");
const schemaPath = "api/prisma/schema.prisma";
const appendData = `

// ============================================================================
// PART 6: AIR CARGO & AIRPORT OPERATIONS
// ============================================================================

model AirULDManifest {
  id               String            @id @default(uuid())
  uldNumber        String            @unique // e.g., AKE12345EK
  uldTypeId        String?
  uldType          ULDType?          @relation(fields: [uldTypeId], references: [id])
  flightScheduleId String?
  flightSchedule   FlightSchedule?   @relation(fields: [flightScheduleId], references: [id])
  status           String            @default("Building") // Building, Built, Weighed, Loaded, Unloaded, Broken-down
  grossWeight      Float             @default(0)
  netWeight        Float             @default(0)
  tareWeight       Float             @default(0)
  sealNumber       String?
  isIntact         Boolean           @default(true)
  
  items            AirBookingItem[]  @relation("ManifestItems")
  loadingPlans     AircraftLoadingPlan[]

  isDeleted        Boolean           @default(false)
  createdAt        DateTime          @default(now())
  updatedAt        DateTime          @updatedAt
}

model AircraftLoadingPlan {
  id               String            @id @default(uuid())
  flightScheduleId String
  flightSchedule   FlightSchedule    @relation("FlightLoadPlan", fields: [flightScheduleId], references: [id])
  uldManifestId    String
  uldManifest      AirULDManifest    @relation(fields: [uldManifestId], references: [id])
  position         String            // e.g., FWD1, AFT2, BULK
  deck             String            // Main, Lower
  status           String            @default("Planned") // Planned, Loaded, Unloaded
  loadedAt         DateTime?
  unloadedAt       DateTime?

  isDeleted        Boolean           @default(false)
}

model AirCargoOperation {
  id               String            @id @default(uuid())
  bookingItemId    String
  bookingItem      AirBookingItem    @relation(fields: [bookingItemId], references: [id])
  operationType    String            // Acceptance, Screening, ColdStorage, Transfer, Breakdown
  location         String
  operatorId       String?
  barcodeScanned   String?
  qrCodeScanned    String?
  timestamp        DateTime          @default(now())
  remarks          String?
  
  isDeleted        Boolean           @default(false)
}

model AirCargoDiscrepancy {
  id               String            @id @default(uuid())
  bookingItemId    String
  bookingItem      AirBookingItem    @relation(fields: [bookingItemId], references: [id])
  discrepancyType  String            // Damage, Shortage, Excess
  severity         String            // Low, Medium, High
  description      String
  photoUrls        String?           // Comma separated
  reportedAt       DateTime          @default(now())
  status           String            @default("Open") // Open, Investigating, Resolved
  
  isDeleted        Boolean           @default(false)
}

model GateAssignment {
  id               String            @id @default(uuid())
  airportId        String
  airport          Airport           @relation(fields: [airportId], references: [id])
  gateNumber       String
  flightScheduleId String?
  flightSchedule   FlightSchedule?   @relation(fields: [flightScheduleId], references: [id])
  assignedDate     DateTime
  startTime        DateTime
  endTime          DateTime
  status           String            @default("Scheduled") // Scheduled, Occupied, Released

  isDeleted        Boolean           @default(false)
}
`;
fs.appendFileSync(schemaPath, appendData, "utf8");
console.log("Air Operations Schema appended successfully.");

