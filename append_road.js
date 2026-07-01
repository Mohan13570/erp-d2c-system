const fs = require("fs");
const schemaPath = "api/prisma/schema.prisma";
let schema = fs.readFileSync(schemaPath, "utf8");

const appendData = `

// ============================================================================
// PART 9: ROAD TRANSPORT OPERATIONS
// ============================================================================

model RoadVehicle {
  id               String            @id @default(uuid())
  registrationNo   String            @unique
  category         String            // Rigid, Articulated, Van
  type             String            // Flatbed, Curtainsider, Box, Reefer
  make             String?
  model            String?
  maxPayload       Float             @default(0) // kg
  volumeCapacity   Float             @default(0) // cbm
  fuelType         String            @default("Diesel")
  status           String            @default("Active") // Active, Maintenance, Retired
  
  trips            RoadTrip[]
  isDeleted        Boolean           @default(false)
  createdAt        DateTime          @default(now())
}

model RoadTrailer {
  id               String            @id @default(uuid())
  registrationNo   String            @unique
  type             String            // Flatbed, Reefer, Tanker
  maxPayload       Float             @default(0)
  volumeCapacity   Float             @default(0)
  axleType         String?
  status           String            @default("Active")
  
  trips            RoadTrip[]
  isDeleted        Boolean           @default(false)
}

model RoadDriver {
  id               String            @id @default(uuid())
  name             String
  licenseNo        String            @unique
  licenseExpiry    DateTime?
  phone            String?
  status           String            @default("Active") // Active, On-Trip, Rest, Leave
  
  trips            RoadTrip[]
  isDeleted        Boolean           @default(false)
}

model RoadRoute {
  id               String            @id @default(uuid())
  name             String            @unique // e.g. DXB-AUH-Express
  originCity       String
  destCity         String
  distanceKm       Float             @default(0)
  estimatedHours   Float             @default(0)
  
  isDeleted        Boolean           @default(false)
}

model FuelStation {
  id               String            @id @default(uuid())
  name             String
  location         String
  partnerNetwork   Boolean           @default(false)
  isDeleted        Boolean           @default(false)
}

model TollBooth {
  id               String            @id @default(uuid())
  name             String
  highway          String
  costEstimate     Float             @default(0)
  currency         String            @default("USD")
  isDeleted        Boolean           @default(false)
}

model RoadBooking {
  id               String            @id @default(uuid())
  bookingNumber    String            @unique
  customerId       String?           
  loadType         String            // FTL, LTL
  status           String            @default("Draft") // Draft, Confirmed, Planned, In-Transit, Delivered, Cancelled
  totalGrossWeight Float             @default(0)
  totalVolume      Float             @default(0)
  isHazardous      Boolean           @default(false)
  isTemperatureControlled Boolean    @default(false)
  
  items            RoadBookingItem[]
  tripStops        RoadTripStop[]
  
  isDeleted        Boolean           @default(false)
  createdAt        DateTime          @default(now())
  updatedAt        DateTime          @updatedAt
}

model RoadBookingItem {
  id               String            @id @default(uuid())
  bookingId        String
  booking          RoadBooking       @relation(fields: [bookingId], references: [id])
  description      String
  quantity         Int               @default(1)
  grossWeight      Float             @default(0)
  volume           Float             @default(0)
  packageType      String            // Pallet, Carton, Drum
  
  isDeleted        Boolean           @default(false)
}

model RoadTrip {
  id               String            @id @default(uuid())
  tripNumber       String            @unique
  driverId         String?
  driver           RoadDriver?       @relation(fields: [driverId], references: [id])
  vehicleId        String?
  vehicle          RoadVehicle?      @relation(fields: [vehicleId], references: [id])
  trailerId        String?
  trailer          RoadTrailer?      @relation(fields: [trailerId], references: [id])
  
  status           String            @default("Planned") // Planned, Dispatched, In-Transit, Completed
  plannedStart     DateTime?
  plannedEnd       DateTime?
  actualStart      DateTime?
  actualEnd        DateTime?
  
  stops            RoadTripStop[]
  
  isDeleted        Boolean           @default(false)
  createdAt        DateTime          @default(now())
  updatedAt        DateTime          @updatedAt
}

model RoadTripStop {
  id               String            @id @default(uuid())
  tripId           String
  trip             RoadTrip          @relation(fields: [tripId], references: [id])
  sequence         Int
  type             String            // Pickup, Delivery, CrossDock, Rest
  locationName     String
  locationAddress  String
  
  bookingId        String?
  booking          RoadBooking?      @relation(fields: [bookingId], references: [id])
  
  plannedTime      DateTime?
  actualTime       DateTime?
  status           String            @default("Pending") // Pending, Arrived, Completed, Skipped
  
  isDeleted        Boolean           @default(false)
}
`;

fs.appendFileSync(schemaPath, appendData, "utf8");
console.log("Road Schema appended successfully.");

