const fs = require("fs");
const schemaPath = "api/prisma/schema.prisma";

const appendData = `

// ============================================================================
// PART 17: CONTAINER BILLING & ANALYTICS
// ============================================================================

model ContainerBilling {
  id               String            @id @default(uuid())
  containerId      String?
  container        Container?        @relation(fields: [containerId], references: [id])
  type             String            // Invoice, VendorBill, CreditNote, DebitNote
  status           String            @default("Draft") // Draft, Unpaid, Paid, Overdue
  totalAmount      Float             @default(0)
  currency         String            @default("USD")
  exchangeRate     Float             @default(1.0)
  dueDate          DateTime?
  timestamp        DateTime          @default(now())
  
  charges          ContainerCharge[]
  
  isDeleted        Boolean           @default(false)
}

model ContainerCharge {
  id               String            @id @default(uuid())
  billingId        String
  billing          ContainerBilling  @relation(fields: [billingId], references: [id], onDelete: Cascade)
  chargeType       String            // Demurrage, Detention, Storage, LiftOn, LiftOff, Cleaning, Repair, Rental
  amount           Float
  taxAmount        Float             @default(0)
  gstRate          Float             @default(0)
  description      String?
  timestamp        DateTime          @default(now())
  
  isDeleted        Boolean           @default(false)
}

model ContainerAnalytics {
  id                   String        @id @default(uuid())
  date                 DateTime      @unique
  averageUtilization   Float         @default(0)
  yardOccupancy        Float         @default(0)
  totalRevenue         Float         @default(0)
  totalProfit          Float         @default(0)
  containersAvailable  Int           @default(0)
  containersInTransit  Int           @default(0)
  containersAtYard     Int           @default(0)
  openDemurrageTickets Int           @default(0)
  openDetentionTickets Int           @default(0)
  
  timestamp            DateTime      @default(now())
}
`;

fs.appendFileSync(schemaPath, appendData, "utf8");
console.log("Container Billing schema appended.");

