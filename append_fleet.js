const fs = require("fs");
const schemaPath = "api/prisma/schema.prisma";

const appendData = `

// ============================================================================
// PART 10: FLEET OPERATIONS & DISPATCH EXECUTION
// ============================================================================

model RoadTripLog {
  id               String            @id @default(uuid())
  tripId           String
  trip             RoadTrip          @relation(fields: [tripId], references: [id])
  action           String            // Dispatched, Started, Paused, Resumed, Completed, Cancelled
  location         String?           // GPS coords or physical name
  remarks          String?
  timestamp        DateTime          @default(now())
  
  isDeleted        Boolean           @default(false)
}

model RoadTripDocument {
  id               String            @id @default(uuid())
  tripId           String
  trip             RoadTrip          @relation(fields: [tripId], references: [id])
  type             String            // POD, IncidentReport, FuelReceipt, TollReceipt, Photo
  url              String
  uploadedBy       String?
  timestamp        DateTime          @default(now())
  
  isDeleted        Boolean           @default(false)
}

model VehicleInspection {
  id               String            @id @default(uuid())
  vehicleId        String
  vehicle          RoadVehicle       @relation(fields: [vehicleId], references: [id])
  tripId           String?
  trip             RoadTrip?         @relation(fields: [tripId], references: [id])
  type             String            // Pre-Trip, Post-Trip, Routine
  isPassed         Boolean
  inspectorId      String?
  notes            String?
  timestamp        DateTime          @default(now())
  
  isDeleted        Boolean           @default(false)
}

model MaintenanceAlert {
  id               String            @id @default(uuid())
  vehicleId        String
  vehicle          RoadVehicle       @relation(fields: [vehicleId], references: [id])
  severity         String            // Low, Medium, High, Critical
  issue            String
  reportedAt       DateTime          @default(now())
  status           String            @default("Open") // Open, Scheduled, In-Progress, Resolved
  resolvedAt       DateTime?
  
  isDeleted        Boolean           @default(false)
}

model TyreLog {
  id               String            @id @default(uuid())
  vehicleId        String
  vehicle          RoadVehicle       @relation(fields: [vehicleId], references: [id])
  position         String            // FL, FR, RL, RR, etc.
  treadDepthMm     Float
  pressurePsi      Float
  inspectionDate   DateTime          @default(now())
  
  isDeleted        Boolean           @default(false)
}

model DriverShift {
  id               String            @id @default(uuid())
  driverId         String
  driver           RoadDriver        @relation(fields: [driverId], references: [id])
  shiftStart       DateTime
  shiftEnd         DateTime?
  drivingHours     Float             @default(0)
  breakHours       Float             @default(0)
  isFatigued       Boolean           @default(false)
  
  isDeleted        Boolean           @default(false)
}

model DriverAttendance {
  id               String            @id @default(uuid())
  driverId         String
  driver           RoadDriver        @relation(fields: [driverId], references: [id])
  date             DateTime
  status           String            // Present, Absent, Sick, Leave
  
  isDeleted        Boolean           @default(false)
}

model DriverViolation {
  id               String            @id @default(uuid())
  driverId         String
  driver           RoadDriver        @relation(fields: [driverId], references: [id])
  type             String            // Speeding, Harsh Braking, HOS Violation
  severity         String
  description      String
  timestamp        DateTime          @default(now())
  
  isDeleted        Boolean           @default(false)
}

model CargoOperationLog {
  id               String            @id @default(uuid())
  stopId           String
  stop             RoadTripStop      @relation(fields: [stopId], references: [id])
  bookingItemId    String?
  bookingItem      RoadBookingItem?  @relation(fields: [bookingItemId], references: [id])
  scanType         String            // Barcode, QRCode, Manual
  status           String            // Loaded, Unloaded, Damaged, Shortage, Excess
  weightVerified   Float?
  sealVerified     Boolean           @default(false)
  remarks          String?
  timestamp        DateTime          @default(now())
  
  isDeleted        Boolean           @default(false)
}

model RoadTripTelemetry {
  id               String            @id @default(uuid())
  tripId           String
  trip             RoadTrip          @relation(fields: [tripId], references: [id])
  latitude         Float
  longitude        Float
  speedKmh         Float             @default(0)
  fuelLevelPct     Float?
  isEngineIdle     Boolean           @default(false)
  timestamp        DateTime          @default(now())
  
  isDeleted        Boolean           @default(false)
}
`;

fs.appendFileSync(schemaPath, appendData, "utf8");
console.log("Fleet Operations schema appended.");

