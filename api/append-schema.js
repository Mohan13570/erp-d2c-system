const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'prisma', 'schema.prisma');
const newModels = `
// ==========================================
// PACKAGE & FREIGHT CALCULATION ENGINE
// ==========================================

model RateCard {
  id              String   @id @default(uuid())
  code            String   @unique
  name            String
  serviceType     String   // Ocean, Air, Road
  origin          String?
  destination     String?
  currency        String   @default("USD")
  validFrom       DateTime
  validTo         DateTime
  status          String   @default("Active")
  
  items           RateCardItem[]
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model RateCardItem {
  id              String   @id @default(uuid())
  rateCardId      String
  rateCard        RateCard @relation(fields: [rateCardId], references: [id], onDelete: Cascade)
  
  chargeCode      String   // FREIGHT, FSC, THC, DOC
  chargeName      String
  calculationType String   // PER_KG, PER_CBM, FLAT, PER_SHIPMENT, PERCENTAGE
  unitRate        Float
  minimumCharge   Float?
  maximumCharge   Float?
  
  // Tiering
  tierMinUnit     Float?
  tierMaxUnit     Float?
}

model PkgPackage {
  id              String   @id @default(uuid())
  bookingId       String   // Connects to CustomerBooking or BookingCargo
  packageRef      String   @unique
  
  packageType     String   // Pallet, Box, Carton, Drum
  quantity        Int      @default(1)
  description     String?
  
  dimensions      PkgDimension?
  weight          PkgWeight?
  calculation     PkgCalculation?
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model PkgDimension {
  id              String   @id @default(uuid())
  packageId       String   @unique
  package         PkgPackage @relation(fields: [packageId], references: [id], onDelete: Cascade)
  
  length          Float
  width           Float
  height          Float
  unit            String   @default("CM") // CM, IN
}

model PkgWeight {
  id              String   @id @default(uuid())
  packageId       String   @unique
  package         PkgPackage @relation(fields: [packageId], references: [id], onDelete: Cascade)
  
  actualWeight    Float
  unit            String   @default("KG") // KG, LBS
}

model PkgCalculation {
  id              String   @id @default(uuid())
  packageId       String   @unique
  package         PkgPackage @relation(fields: [packageId], references: [id], onDelete: Cascade)
  
  volumeCBM       Float
  volumeCFT       Float
  volumetricWeight Float
  chargeableWeight Float
  
  volumetricDivisor Float  @default(6000)
}

model PricingRule {
  id              String   @id @default(uuid())
  ruleCode        String   @unique
  ruleName        String
  priority        Int      @default(1)
  condition       String?  
  action          String?  
  status          String   @default("Active")
}

model FuelSurcharge {
  id              String   @id @default(uuid())
  carrierCode     String
  serviceType     String
  percentage      Float
  effectiveFrom   DateTime
  effectiveTo     DateTime?
  status          String   @default("Active")
}

model InsuranceRule {
  id              String   @id @default(uuid())
  commodityType   String
  ratePercentage  Float
  minimumPremium  Float
  status          String   @default("Active")
}

model TaxRule {
  id              String   @id @default(uuid())
  countryCode     String
  taxName         String
  taxPercentage   Float
  appliesTo       String   // FREIGHT, ALL
  status          String   @default("Active")
}

model DiscountRule {
  id              String   @id @default(uuid())
  customerGroupId String?
  customerId      String?
  discountPercent Float
  maxDiscountAmount Float?
  validUntil      DateTime?
}

model BusinessRule {
  id              String   @id @default(uuid())
  ruleType        String   // VALIDATION, ROUTING, CALCULATION
  ruleCode        String   @unique
  parameters      String   
  isActive        Boolean  @default(true)
}

model ShipmentCharge {
  id              String   @id @default(uuid())
  bookingId       String   
  
  totalFreight    Float    @default(0)
  totalSurcharges Float    @default(0)
  totalTaxes      Float    @default(0)
  totalDiscount   Float    @default(0)
  grandTotal      Float    @default(0)
  currency        String   @default("USD")
  
  breakdowns      ChargeBreakdown[]
  
  createdAt       DateTime @default(now())
}

model ChargeBreakdown {
  id              String   @id @default(uuid())
  shipmentChargeId String
  shipmentCharge  ShipmentCharge @relation(fields: [shipmentChargeId], references: [id], onDelete: Cascade)
  
  chargeCode      String
  chargeName      String
  amount          Float
  currency        String   @default("USD")
  isTaxable       Boolean  @default(true)
}

model CalculationHistory {
  id              String   @id @default(uuid())
  bookingId       String
  calculatedBy    String   // User ID or SYSTEM
  inputSnapshot   String   
  appliedRates    String   
  finalAmount     Float
  currency        String
  
  calculatedAt    DateTime @default(now())
}
`;

fs.appendFileSync(schemaPath, newModels);
console.log("Successfully appended 16 models to schema.prisma");
