const fs = require("fs");
const schemaPath = "api/prisma/schema.prisma";
const appendData = `

// ============================================================================
// PART 4: AIR FREIGHT FOUNDATION MODULE
// ============================================================================

model Airport {
  id              String            @id @default(uuid())
  iataCode        String            @unique
  icaoCode        String            @unique
  name            String
  cityId          String?
  city            City?             @relation(fields: [cityId], references: [id])
  terminals       AirportTerminal[]
  cargoTerminals  CargoTerminal[]
  runways         Runway[]
  handlingAgents  HandlingAgent[]
  groundHandlers  GroundHandlingCompany[]
  securityAgencies SecurityAgency[]
  customsOffices  AirCustomsOffice[]
  originRoutes    AirRoute[]        @relation("OriginAirport")
  destRoutes      AirRoute[]        @relation("DestAirport")
  isDeleted       Boolean           @default(false)
  createdAt       DateTime          @default(now())
  updatedAt       DateTime          @updatedAt
}

model AirportTerminal {
  id          String   @id @default(uuid())
  airportId   String
  airport     Airport  @relation(fields: [airportId], references: [id])
  name        String
  terminalType String  // Passenger, Cargo, Both
  isDeleted   Boolean  @default(false)
}

model CargoTerminal {
  id               String   @id @default(uuid())
  airportId        String
  airport          Airport  @relation(fields: [airportId], references: [id])
  name             String
  handlingCapacity String
  isDeleted        Boolean  @default(false)
}

model Runway {
  id          String   @id @default(uuid())
  airportId   String
  airport     Airport  @relation(fields: [airportId], references: [id])
  designation String
  length      Float
  width       Float
  isDeleted   Boolean  @default(false)
}

model AirlineAlliance {
  id        String    @id @default(uuid())
  name      String    @unique
  airlines  Airline[]
  isDeleted Boolean   @default(false)
}

model Airline {
  id         String           @id @default(uuid())
  iataCode   String           @unique
  icaoCode   String           @unique
  name       String
  allianceId String?
  alliance   AirlineAlliance? @relation(fields: [allianceId], references: [id])
  agents     AirlineAgent[]
  schedules  FlightSchedule[]
  uldOwned   ULDOwnership[]
  isDeleted  Boolean          @default(false)
}

model AirlineAgent {
  id             String   @id @default(uuid())
  airlineId      String
  airline        Airline  @relation(fields: [airlineId], references: [id])
  name           String
  contactDetails String
  isDeleted      Boolean  @default(false)
}

model AircraftType {
  id             String                  @id @default(uuid())
  iataCode       String                  @unique
  manufacturer   String
  model          String
  capacities     AircraftCapacity[]
  configurations AircraftConfiguration[]
  schedules      FlightSchedule[]
  isDeleted      Boolean                 @default(false)
}

model AircraftCapacity {
  id               String       @id @default(uuid())
  aircraftTypeId   String
  aircraftType     AircraftType @relation(fields: [aircraftTypeId], references: [id])
  maxPayloadVolume Float
  maxPayloadWeight Float
  isDeleted        Boolean      @default(false)
}

model AircraftConfiguration {
  id                String       @id @default(uuid())
  aircraftTypeId    String
  aircraftType      AircraftType @relation(fields: [aircraftTypeId], references: [id])
  configurationType String       // Freighter, Passenger, Combi
  isDeleted         Boolean      @default(false)
}

model AirRoute {
  id                   String           @id @default(uuid())
  originAirportId      String
  originAirport        Airport          @relation("OriginAirport", fields: [originAirportId], references: [id])
  destinationAirportId String
  destinationAirport   Airport          @relation("DestAirport", fields: [destinationAirportId], references: [id])
  distance             Float
  schedules            FlightSchedule[]
  isDeleted            Boolean          @default(false)
}

model FlightSchedule {
  id             String       @id @default(uuid())
  airlineId      String
  airline        Airline      @relation(fields: [airlineId], references: [id])
  routeId        String
  route          AirRoute     @relation(fields: [routeId], references: [id])
  flightNumber   String
  aircraftTypeId String
  aircraftType   AircraftType @relation(fields: [aircraftTypeId], references: [id])
  daysOfWeek     String
  departureTime  DateTime
  arrivalTime    DateTime
  isDeleted      Boolean      @default(false)
}

model AirCargoCategory {
  id          String  @id @default(uuid())
  name        String  @unique
  description String?
  isDeleted   Boolean @default(false)
}

model ULDType {
  id          String         @id @default(uuid())
  iataCode    String         @unique // AKE, PMC
  description String?
  sizes       ULDSize[]
  ownership   ULDOwnership[]
  isDeleted   Boolean        @default(false)
}

model ULDSize {
  id             String  @id @default(uuid())
  uldTypeId      String
  uldType        ULDType @relation(fields: [uldTypeId], references: [id])
  length         Float
  width          Float
  height         Float
  maxGrossWeight Float
  isDeleted      Boolean @default(false)
}

model ULDOwnership {
  id        String  @id @default(uuid())
  uldTypeId String
  uldType   ULDType @relation(fields: [uldTypeId], references: [id])
  airlineId String
  airline   Airline @relation(fields: [airlineId], references: [id])
  ownerCode String
  isDeleted Boolean @default(false)
}

model AirPalletType {
  id        String  @id @default(uuid())
  name      String  @unique
  maxWeight Float
  isDeleted Boolean @default(false)
}

model HandlingAgent {
  id        String  @id @default(uuid())
  name      String
  airportId String
  airport   Airport @relation(fields: [airportId], references: [id])
  isDeleted Boolean @default(false)
}

model GroundHandlingCompany {
  id        String  @id @default(uuid())
  name      String
  airportId String
  airport   Airport @relation(fields: [airportId], references: [id])
  isDeleted Boolean @default(false)
}

model SecurityAgency {
  id        String  @id @default(uuid())
  name      String
  airportId String
  airport   Airport @relation(fields: [airportId], references: [id])
  isDeleted Boolean @default(false)
}

model AirCustomsOffice {
  id         String  @id @default(uuid())
  officeCode String  @unique
  name       String
  airportId  String
  airport    Airport @relation(fields: [airportId], references: [id])
  isDeleted  Boolean @default(false)
}

`;
fs.appendFileSync(schemaPath, appendData, "utf8");
console.log("Schema appended successfully.");

