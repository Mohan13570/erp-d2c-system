const fs = require("fs");
const schemaPath = "api/prisma/schema.prisma";
const appendData = `

// ============================================================================
// PART 5: AIR FREIGHT BOOKING & SHIPMENT MODULE
// ============================================================================

model AirBooking {
  id               String            @id @default(uuid())
  bookingNumber    String            @unique
  originAirportId  String
  originAirport    Airport           @relation("BookingOrigin", fields: [originAirportId], references: [id])
  destAirportId    String
  destAirport      Airport           @relation("BookingDest", fields: [destAirportId], references: [id])
  shipperId        String?
  consigneeId      String?
  notifyPartyId    String?
  freightForwarderId String?
  cargoAgentId     String?
  status           String            @default("Draft") // Draft, Requested, Approved, Confirmed, Rejected, Cancelled
  totalGrossWeight Float             @default(0)
  totalChargeableWeight Float        @default(0)
  totalVolume      Float             @default(0)
  isDangerousGoods Boolean           @default(false)
  isPerishable     Boolean           @default(false)
  isTemperatureControlled Boolean    @default(false)
  isLiveAnimals    Boolean           @default(false)
  isValuable       Boolean           @default(false)
  
  items            AirBookingItem[]
  routings         AirRouting[]
  waybills         AirWaybill[]
  documents        AirDocument[]
  milestones       AirShipmentMilestone[]

  isDeleted        Boolean           @default(false)
  createdAt        DateTime          @default(now())
  updatedAt        DateTime          @updatedAt
}

model AirBookingItem {
  id               String       @id @default(uuid())
  bookingId        String
  booking          AirBooking   @relation(fields: [bookingId], references: [id])
  description      String
  quantity         Int          @default(1)
  length           Float        // in cm
  width            Float        // in cm
  height           Float        // in cm
  grossWeight      Float        // in kg
  chargeableWeight Float        // in kg
  volume           Float        // in cbm
  iataCode         String?      // e.g. DGR, PER, AVI
  isDeleted        Boolean      @default(false)
}

model AirRouting {
  id               String          @id @default(uuid())
  bookingId        String
  booking          AirBooking      @relation(fields: [bookingId], references: [id])
  sequence         Int
  flightScheduleId String?
  flightSchedule   FlightSchedule? @relation(fields: [flightScheduleId], references: [id])
  fromAirportId    String
  fromAirport      Airport         @relation("RoutingFrom", fields: [fromAirportId], references: [id])
  toAirportId      String
  toAirport        Airport         @relation("RoutingTo", fields: [toAirportId], references: [id])
  status           String          @default("Scheduled") // Scheduled, Departed, Arrived
  isDeleted        Boolean         @default(false)
}

model AirWaybill {
  id               String       @id @default(uuid())
  bookingId        String
  booking          AirBooking   @relation(fields: [bookingId], references: [id])
  awbNumber        String       @unique
  awbType          String       // HAWB, MAWB
  issueDate        DateTime     @default(now())
  status           String       @default("Issued")
  isDeleted        Boolean      @default(false)
}

model AirDocument {
  id               String       @id @default(uuid())
  bookingId        String
  booking          AirBooking   @relation(fields: [bookingId], references: [id])
  documentType     String       // Commercial Invoice, Packing List, Certificate Of Origin, DGD, Security Declaration
  documentNumber   String?
  fileUrl          String?
  uploadDate       DateTime     @default(now())
  status           String       @default("Uploaded") // Uploaded, Verified, Rejected
  isDeleted        Boolean      @default(false)
}

model AirShipmentMilestone {
  id               String       @id @default(uuid())
  bookingId        String
  booking          AirBooking   @relation(fields: [bookingId], references: [id])
  milestoneCode    String       // e.g., RCS, DEP, ARR, RCF, DLV
  description      String
  location         String?
  timestamp        DateTime     @default(now())
  isDeleted        Boolean      @default(false)
}
`;
fs.appendFileSync(schemaPath, appendData, "utf8");
console.log("Air Booking Schema appended successfully.");

