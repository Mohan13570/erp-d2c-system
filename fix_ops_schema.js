const fs = require("fs");
let schema = fs.readFileSync("api/prisma/schema.prisma", "utf8");

// Fix AirBookingItem
schema = schema.replace(
  "  iataCode         String?      // e.g. DGR, PER, AVI",
  `  iataCode         String?      // e.g. DGR, PER, AVI\n  uldManifestId    String?\n  uldManifest      AirULDManifest? @relation("ManifestItems", fields: [uldManifestId], references: [id])\n  operations       AirCargoOperation[]\n  discrepancies    AirCargoDiscrepancy[]`
);

// Fix FlightSchedule
schema = schema.replace(
  "  routings       AirRouting[]",
  `  routings       AirRouting[]\n  uldManifests   AirULDManifest[]\n  loadingPlans   AircraftLoadingPlan[] @relation("FlightLoadPlan")\n  gateAssignments GateAssignment[]`
);

// Fix Airport
schema = schema.replace(
  "    routingTos       AirRouting[]            @relation(\"RoutingTo\")",
  `    routingTos       AirRouting[]            @relation("RoutingTo")\n    gateAssignments  GateAssignment[]`
);

fs.writeFileSync("api/prisma/schema.prisma", schema, "utf8");
console.log("Ops Schema relations fixed.");

