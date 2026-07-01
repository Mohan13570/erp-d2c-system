const fs = require("fs");
const schemaPath = "api/prisma/schema.prisma";
let schema = fs.readFileSync(schemaPath, "utf8");

const appendData = `

// ============================================================================
// PART 8: AIR TRACKING & WEATHER
// ============================================================================

model AirFlightTracking {
  id               String            @id @default(uuid())
  flightScheduleId String
  flightSchedule   FlightSchedule    @relation(fields: [flightScheduleId], references: [id])
  latitude         Float
  longitude        Float
  altitude         Float             @default(0)
  speed            Float             @default(0)
  heading          Float             @default(0)
  status           String            @default("Scheduled") // In-Air, Delayed, Landed, Diverted
  estimatedETA     DateTime?
  timestamp        DateTime          @default(now())

  isDeleted        Boolean           @default(false)
}

model AirWeatherAlert {
  id               String            @id @default(uuid())
  airportId        String
  airport          Airport           @relation(fields: [airportId], references: [id])
  severity         String            // Low, Medium, High, Severe
  description      String
  affectedRoutes   String?
  timestamp        DateTime          @default(now())
  
  isDeleted        Boolean           @default(false)
}
`;

fs.appendFileSync(schemaPath, appendData, "utf8");

// Fix FlightSchedule relations
schema = fs.readFileSync(schemaPath, "utf8");
schema = schema.replace(
  "  gateAssignments GateAssignment[]",
  `  gateAssignments GateAssignment[]\n  trackings       AirFlightTracking[]`
);

// Fix Airport relations
schema = schema.replace(
  "  gateAssignments  GateAssignment[]",
  `  gateAssignments  GateAssignment[]\n  weatherAlerts    AirWeatherAlert[]`
);

fs.writeFileSync(schemaPath, schema, "utf8");
console.log("Tracking Schema appended successfully.");

