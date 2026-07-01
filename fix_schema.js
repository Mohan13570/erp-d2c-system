const fs = require("fs");
let schema = fs.readFileSync("api/prisma/schema.prisma", "utf8");

// Remove any auto-injected AirBooking or AirRouting fields in Airport
schema = schema.replace(/  AirBooking\s+AirBooking\[\].*\n/g, "");
schema = schema.replace(/  AirRouting\s+AirRouting\[\].*\n/g, "");

// Add relations to Airport
schema = schema.replace(
  "    destRoutes       AirRoute[]              @relation(\"DestAirport\")",
  `    destRoutes       AirRoute[]              @relation("DestAirport")\n    bookingOrigins   AirBooking[]            @relation("BookingOrigin")\n    bookingDests     AirBooking[]            @relation("BookingDest")\n    routingFroms     AirRouting[]            @relation("RoutingFrom")\n    routingTos       AirRouting[]            @relation("RoutingTo")`
);

// Add relations to FlightSchedule
schema = schema.replace(
  "  arrivalTime    DateTime",
  `  arrivalTime    DateTime\n  routings       AirRouting[]`
);

fs.writeFileSync("api/prisma/schema.prisma", schema, "utf8");
console.log("Schema fixed.");

