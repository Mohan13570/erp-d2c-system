const fs = require("fs");
const schemaPath = "api/prisma/schema.prisma";
let schema = fs.readFileSync(schemaPath, "utf8");

const appendData = `

// ============================================================================
// PART 7: AIR COSTING, BILLING & CUSTOMS
// ============================================================================

model AirShipmentFinancials {
  id               String            @id @default(uuid())
  bookingId        String            @unique
  booking          AirBooking        @relation(fields: [bookingId], references: [id])
  baseCurrency     String            @default("USD")
  totalRevenue     Float             @default(0)
  totalCost        Float             @default(0)
  grossMargin      Float             @default(0)
  marginPercentage Float             @default(0)
  
  isDeleted        Boolean           @default(false)
  updatedAt        DateTime          @updatedAt
}

model AirChargeLine {
  id               String            @id @default(uuid())
  bookingId        String
  booking          AirBooking        @relation(fields: [bookingId], references: [id])
  chargeCode       String            // FREIGHT, FSC, SSC, SCREENING, HANDLING, STORAGE, CUSTOMS_DUTY
  chargeName       String
  type             String            // REVENUE, COST
  amount           Float
  currency         String            @default("USD")
  exchangeRate     Float             @default(1.0)
  baseAmount       Float             // converted to baseCurrency
  
  invoiceId        String?
  invoice          AirInvoice?       @relation(fields: [invoiceId], references: [id])
  vendorBillId     String?
  vendorBill       AirVendorBill?    @relation(fields: [vendorBillId], references: [id])

  isDeleted        Boolean           @default(false)
}

model AirInvoice {
  id               String            @id @default(uuid())
  bookingId        String
  booking          AirBooking        @relation(fields: [bookingId], references: [id])
  invoiceNumber    String            @unique
  customerId       String?
  totalAmount      Float
  currency         String            @default("USD")
  status           String            @default("Draft") // Draft, Sent, Paid, Overdue
  dueDate          DateTime?
  
  chargeLines      AirChargeLine[]
  isDeleted        Boolean           @default(false)
  createdAt        DateTime          @default(now())
}

model AirVendorBill {
  id               String            @id @default(uuid())
  bookingId        String
  booking          AirBooking        @relation(fields: [bookingId], references: [id])
  billNumber       String            @unique
  vendorId         String?           // Airline or Handler
  totalAmount      Float
  currency         String            @default("USD")
  status           String            @default("Draft") // Draft, Approved, Paid
  dueDate          DateTime?
  
  chargeLines      AirChargeLine[]
  isDeleted        Boolean           @default(false)
  createdAt        DateTime          @default(now())
}

model AirCustomsDeclaration {
  id               String            @id @default(uuid())
  bookingId        String
  booking          AirBooking        @relation(fields: [bookingId], references: [id])
  declarationType  String            // Import, Export
  hsCode           String?
  declarationNum   String?           @unique
  declaredValue    Float             @default(0)
  currency         String            @default("USD")
  dutyCalculated   Float             @default(0)
  status           String            @default("Pending") // Pending, Submitted, Under Inspection, Cleared, Rejected
  inspectionDate   DateTime?
  clearedDate      DateTime?
  remarks          String?
  
  isDeleted        Boolean           @default(false)
  createdAt        DateTime          @default(now())
  updatedAt        DateTime          @updatedAt
}
`;

fs.appendFileSync(schemaPath, appendData, "utf8");

// Fix AirBooking relations
schema = fs.readFileSync(schemaPath, "utf8");
schema = schema.replace(
  "  isDeleted        Boolean           @default(false)",
  `  financials       AirShipmentFinancials?\n  chargeLines      AirChargeLine[]\n  invoices         AirInvoice[]\n  vendorBills      AirVendorBill[]\n  customsDeclarations AirCustomsDeclaration[]\n  isDeleted        Boolean           @default(false)`
);

fs.writeFileSync(schemaPath, schema, "utf8");
console.log("Finance and Customs Schema appended successfully.");

