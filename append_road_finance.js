const fs = require("fs");
const schemaPath = "api/prisma/schema.prisma";

const appendData = `

// ============================================================================
// PART 11: ROAD FINANCE, CLAIMS & ANALYTICS
// ============================================================================

model RoadChargeLine {
  id               String            @id @default(uuid())
  bookingId        String?
  booking          RoadBooking?      @relation(fields: [bookingId], references: [id])
  tripId           String?
  trip             RoadTrip?         @relation(fields: [tripId], references: [id])
  type             String            // REVENUE, EXPENSE
  chargeCode       String            // FREIGHT, FUEL, TOLL, WAITING, HANDLING, INSURANCE, TAX, GST
  amount           Float
  currency         String            @default("USD")
  exchangeRate     Float             @default(1.0)
  description      String?
  timestamp        DateTime          @default(now())
  
  isDeleted        Boolean           @default(false)
}

model RoadInvoice {
  id               String            @id @default(uuid())
  bookingId        String
  booking          RoadBooking       @relation(fields: [bookingId], references: [id])
  invoiceNumber    String            @unique
  totalAmount      Float
  currency         String            @default("USD")
  status           String            @default("DRAFT") // DRAFT, SENT, PAID, OVERDUE
  type             String            @default("CUSTOMER_INVOICE") // CUSTOMER_INVOICE, CREDIT_NOTE, DEBIT_NOTE
  dueDate          DateTime?
  timestamp        DateTime          @default(now())
  
  isDeleted        Boolean           @default(false)
}

model RoadVendorBill {
  id               String            @id @default(uuid())
  tripId           String
  trip             RoadTrip          @relation(fields: [tripId], references: [id])
  vendorId         String            // References an external vendor master if available
  billNumber       String
  totalAmount      Float
  currency         String            @default("USD")
  status           String            @default("DRAFT") // DRAFT, APPROVED, PAID
  timestamp        DateTime          @default(now())
  
  isDeleted        Boolean           @default(false)
}

model RoadClaim {
  id               String            @id @default(uuid())
  bookingId        String
  booking          RoadBooking       @relation(fields: [bookingId], references: [id])
  type             String            // DAMAGE, MISSING, COMPLAINT
  description      String
  claimAmount      Float
  approvedAmount   Float             @default(0)
  currency         String            @default("USD")
  status           String            @default("OPEN") // OPEN, INVESTIGATING, APPROVED, SETTLED, REJECTED
  timestamp        DateTime          @default(now())
  
  isDeleted        Boolean           @default(false)
}

model RoadProofOfDelivery {
  id               String            @id @default(uuid())
  stopId           String
  stop             RoadTripStop      @relation(fields: [stopId], references: [id])
  type             String            // DIGITAL_SIGNATURE, OTP, PHOTO, DOCUMENT
  payloadUrl       String            // URL to S3 or base64 string
  status           String            @default("ACCEPTED") // ACCEPTED, REJECTED, PARTIAL, FAILED
  remarks          String?
  timestamp        DateTime          @default(now())
  
  isDeleted        Boolean           @default(false)
}
`;

fs.appendFileSync(schemaPath, appendData, "utf8");
console.log("Road Finance schema appended.");

