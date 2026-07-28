const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'prisma', 'schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf8');

if (!schema.includes('model ShipmentBilling')) {
  schema += `

// ==========================================
// Phase 8: Shipment Billing Integration
// ==========================================

model ShipmentBilling {
  id                  String   @id @default(uuid())
  shipmentId          String   @unique
  shipment            Shipment @relation(fields: [shipmentId], references: [id], onDelete: Cascade)
  
  billingStatus       String   @default("PENDING") // PENDING, READY_FOR_BILLING, INVOICED, PARTIALLY_PAID, PAID
  currency            String   @default("USD")
  
  subtotal            Float    @default(0)
  totalTax            Float    @default(0)
  totalDiscount       Float    @default(0)
  grandTotal          Float    @default(0)
  
  chargeSummary       ShipmentChargeSummary?
  taxDetails          ShipmentTax[]
  paymentStatus       ShipmentPaymentStatus?
  invoices            ShipmentInvoice[]
  notes               FinancialNote[]
  
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt
}

model ShipmentChargeSummary {
  id                  String   @id @default(uuid())
  billingId           String   @unique
  billing             ShipmentBilling @relation(fields: [billingId], references: [id], onDelete: Cascade)
  
  baseFreight         Float    @default(0)
  fuelSurcharge       Float    @default(0)
  handlingCharges     Float    @default(0)
  loadingCharges      Float    @default(0)
  unloadingCharges    Float    @default(0)
  warehouseCharges    Float    @default(0)
  insuranceCharges    Float    @default(0)
  customsCharges      Float    @default(0)
  documentationCharges Float   @default(0)
  otherCharges        Float    @default(0)
  
  updatedAt           DateTime @updatedAt
}

model ShipmentTax {
  id                  String   @id @default(uuid())
  billingId           String
  billing             ShipmentBilling @relation(fields: [billingId], references: [id], onDelete: Cascade)
  
  taxType             String   // GST, CGST, SGST, IGST, VAT
  percentage          Float
  amount              Float
}

model ShipmentInvoice {
  id                  String   @id @default(uuid())
  billingId           String
  billing             ShipmentBilling @relation(fields: [billingId], references: [id], onDelete: Cascade)
  
  invoiceNumber       String   @unique
  invoiceDate         DateTime
  dueDate             DateTime
  status              String   // DRAFT, ISSUED, PAID, CANCELLED
  paymentTerms        String
  pdfUrl              String?
  generatedBy         String
  
  createdAt           DateTime @default(now())
}

model ShipmentPaymentStatus {
  id                  String   @id @default(uuid())
  billingId           String   @unique
  billing             ShipmentBilling @relation(fields: [billingId], references: [id], onDelete: Cascade)
  
  paidAmount          Float    @default(0)
  outstandingAmount   Float    @default(0)
  lastPaymentDate     DateTime?
  status              String   @default("UNPAID") // UNPAID, PARTIALLY_PAID, PAID, OVERDUE
}

model FinancialNote {
  id                  String   @id @default(uuid())
  billingId           String
  billing             ShipmentBilling @relation(fields: [billingId], references: [id], onDelete: Cascade)
  
  type                String   // BILLING, FINANCE, CUSTOMER, INTERNAL
  content             String
  author              String
  
  createdAt           DateTime @default(now())
}
`;
  fs.writeFileSync(schemaPath, schema);
  console.log('Appended Phase 8 Models');
} else {
  console.log('Phase 8 Models already exist.');
}
