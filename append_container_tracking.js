const fs = require("fs");
const schemaPath = "api/prisma/schema.prisma";

const appendData = `

// ============================================================================
// PART 16: CONTAINER TRACKING, HEALTH & COMPLIANCE
// ============================================================================

model ContainerTracking {
  id               String            @id @default(uuid())
  containerId      String
  container        Container         @relation(fields: [containerId], references: [id])
  latitude         Float
  longitude        Float
  speed            Float             @default(0)
  heading          String?
  locationName     String?
  timestamp        DateTime          @default(now())
  
  isDeleted        Boolean           @default(false)
}

model ContainerHealth {
  id               String            @id @default(uuid())
  containerId      String            @unique
  container        Container         @relation(fields: [containerId], references: [id])
  healthScore      Int               @default(100) // 0-100
  structuralCondition String         @default("Good")
  floorCondition   String            @default("Good")
  needsCleaning    Boolean           @default(false)
  needsFumigation  Boolean           @default(false)
  lastInspection   DateTime?
  
  timestamp        DateTime          @default(now())
  isDeleted        Boolean           @default(false)
}

model ContainerReeferLog {
  id               String            @id @default(uuid())
  containerId      String
  container        Container         @relation(fields: [containerId], references: [id])
  temperature      Float
  humidity         Float
  powerStatus      String            @default("On") // On, Off, Error
  hasAlarm         Boolean           @default(false)
  alarmDetails     String?
  timestamp        DateTime          @default(now())
  
  isDeleted        Boolean           @default(false)
}

model ContainerCompliance {
  id               String            @id @default(uuid())
  containerId      String
  container        Container         @relation(fields: [containerId], references: [id])
  documentType     String            // CSC Plate, ISO Cert, Insurance
  documentNumber   String?
  issueDate        DateTime?
  expiryDate       DateTime
  issuingAuthority String?
  fileUrl          String?
  timestamp        DateTime          @default(now())
  
  isDeleted        Boolean           @default(false)
}

model ContainerRepair {
  id               String            @id @default(uuid())
  containerId      String
  container        Container         @relation(fields: [containerId], references: [id])
  damageDescription String
  repairStatus     String            @default("Requested") // Requested, InProgress, Completed
  workshopName     String?
  estimatedCost    Float?
  actualCost       Float?
  photos           String?           // JSON array string of URLs
  requestedAt      DateTime          @default(now())
  completedAt      DateTime?
  
  isDeleted        Boolean           @default(false)
}
`;

fs.appendFileSync(schemaPath, appendData, "utf8");
console.log("Container Tracking schema appended.");

