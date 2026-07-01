const fs = require("fs");
const schemaPath = "api/prisma/schema.prisma";

const appendData = `

// ============================================================================
// PART 14: CONTAINER MANAGEMENT
// ============================================================================

model Container {
  id               String            @id @default(uuid())
  containerNo      String            @unique // ISO 6346 Validated
  category         String            @default("General Purpose")
  type             String            // 20FT, 40FT, 40HC, Reefer, Open Top, Flat Rack, Tank
  maxGrossWeight   Float             @default(0) // kg
  tareWeight       Float             @default(0) // kg
  payloadCapacity  Float             @default(0) // kg
  volume           Float             @default(0) // cbm
  ownershipType    String            @default("Owned") // Owned, Leased, Shipping Line
  manufacturer     String?
  manufacturingDate DateTime?
  status           String            @default("Available") // Available, Reserved, Allocated, Loaded, In Transit, At Yard, Under Repair, Retired
  
  lifecycles       ContainerLifecycle[]
  allocations      ContainerAllocation[]
  documents        ContainerDocument[]
  
  timestamp        DateTime          @default(now())
  isDeleted        Boolean           @default(false)
}

model ContainerLifecycle {
  id               String            @id @default(uuid())
  containerId      String
  container        Container         @relation(fields: [containerId], references: [id])
  status           String
  location         String?           // Port, Yard, Customer Location
  referenceId      String?           // Booking ID, Shipment ID
  notes            String?
  timestamp        DateTime          @default(now())
  
  isDeleted        Boolean           @default(false)
}

model ContainerAllocation {
  id               String            @id @default(uuid())
  containerId      String
  container        Container         @relation(fields: [containerId], references: [id])
  allocationType   String            // Shipment, Booking, Vehicle, YardSlot
  referenceId      String            // ID of the allocated entity
  sealNumber       String?
  allocatedAt      DateTime          @default(now())
  releasedAt       DateTime?
  
  isDeleted        Boolean           @default(false)
}

model ContainerDocument {
  id               String            @id @default(uuid())
  containerId      String
  container        Container         @relation(fields: [containerId], references: [id])
  type             String            // CSC Plate, Approval, Inspection
  fileUrl          String
  expiryDate       DateTime?
  timestamp        DateTime          @default(now())
  
  isDeleted        Boolean           @default(false)
}
`;

fs.appendFileSync(schemaPath, appendData, "utf8");
console.log("Container Management schema appended.");

