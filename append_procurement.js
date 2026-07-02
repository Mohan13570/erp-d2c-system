const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'api', 'prisma', 'schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf8');

// The new models to append
const newModels = `
// ==========================================
// PROCUREMENT FOUNDATION & VENDOR MANAGEMENT
// ==========================================

model VendorCategory {
  id          String   @id @default(uuid())
  name        String   @unique
  description String?
  isActive    Boolean  @default(true)
  vendors     Vendor[]
}

model VendorGroup {
  id          String   @id @default(uuid())
  name        String   @unique
  description String?
  vendors     Vendor[]
}

model VendorType {
  id          String   @id @default(uuid())
  name        String   @unique
  description String?
  vendors     Vendor[]
}

model VendorContact {
  id          String  @id @default(uuid())
  vendorId    String
  vendor      Vendor  @relation(fields: [vendorId], references: [id], onDelete: Cascade)
  firstName   String
  lastName    String?
  email       String
  phone       String?
  designation String?
  isPrimary   Boolean @default(false)
  portalAccess Boolean @default(false)
}

model VendorAddress {
  id          String  @id @default(uuid())
  vendorId    String
  vendor      Vendor  @relation(fields: [vendorId], references: [id], onDelete: Cascade)
  type        String  // Billing, Shipping, HQ
  addressLine1 String
  addressLine2 String?
  city        String
  state       String
  postalCode  String
  country     String
  isPrimary   Boolean @default(false)
}

model VendorBankAccount {
  id            String  @id @default(uuid())
  vendorId      String
  vendor        Vendor  @relation(fields: [vendorId], references: [id], onDelete: Cascade)
  bankName      String
  accountName   String
  accountNumber String
  ifscCode      String? // Swift code / Routing
  branchName    String?
  isPrimary     Boolean @default(false)
}

model VendorDocument {
  id             String  @id @default(uuid())
  vendorId       String
  vendor         Vendor  @relation(fields: [vendorId], references: [id], onDelete: Cascade)
  documentType   String  // Registration, PAN, GST, Cancelled Cheque
  documentNumber String?
  fileUrl        String
  validFrom      DateTime?
  validTo        DateTime?
  status         String  @default("Active")
}

model VendorCertification {
  id          String  @id @default(uuid())
  vendorId    String
  vendor      Vendor  @relation(fields: [vendorId], references: [id], onDelete: Cascade)
  name        String  // ISO 9001, OHSAS
  certNumber  String
  issuedBy    String
  issueDate   DateTime
  expiryDate  DateTime
  fileUrl     String?
}

model VendorContract {
  id          String  @id @default(uuid())
  vendorId    String
  vendor      Vendor  @relation(fields: [vendorId], references: [id], onDelete: Cascade)
  contractNo  String  @unique
  title       String
  type        String  // Rate Contract, Annual, Service
  startDate   DateTime
  endDate     DateTime
  value       Float?
  currency    String  @default("USD")
  status      String  @default("Active")
  fileUrl     String?
  versions    VendorContractVersion[]
}

model VendorContractVersion {
  id          String  @id @default(uuid())
  contractId  String
  contract    VendorContract @relation(fields: [contractId], references: [id], onDelete: Cascade)
  versionNum  Int
  changes     String?
  fileUrl     String
  createdAt   DateTime @default(now())
}

model VendorProduct {
  id          String  @id @default(uuid())
  vendorId    String
  vendor      Vendor  @relation(fields: [vendorId], references: [id], onDelete: Cascade)
  skuCode     String
  name        String
  description String?
  unitPrice   Float
  currency    String  @default("USD")
  moq         Int     @default(1)
  leadTimeDays Int    @default(7)
}

model VendorService {
  id          String  @id @default(uuid())
  vendorId    String
  vendor      Vendor  @relation(fields: [vendorId], references: [id], onDelete: Cascade)
  serviceCode String
  name        String
  rate        Float
  uom         String  // Hourly, Fixed
}

model VendorRate {
  id          String  @id @default(uuid())
  vendorId    String
  vendor      Vendor  @relation(fields: [vendorId], references: [id], onDelete: Cascade)
  lane        String? // For logistics vendors
  origin      String?
  destination String?
  rate        Float
  validFrom   DateTime
  validTo     DateTime
}

model VendorPerformance {
  id          String  @id @default(uuid())
  vendorId    String
  vendor      Vendor  @relation(fields: [vendorId], references: [id], onDelete: Cascade)
  periodMonth Int
  periodYear  Int
  otifScore   Float   // On Time In Full
  qualityScore Float
  overallScore Float
  comments    String?
}

model VendorScorecard {
  id          String  @id @default(uuid())
  vendorId    String
  vendor      Vendor  @relation(fields: [vendorId], references: [id], onDelete: Cascade)
  evalDate    DateTime @default(now())
  evaluatorId String
  criteria    String // JSON string of criteria and scores
  totalScore  Float
}

model VendorRisk {
  id          String  @id @default(uuid())
  vendorId    String
  vendor      Vendor  @relation(fields: [vendorId], references: [id], onDelete: Cascade)
  riskCategory String // Financial, Operational, Compliance
  riskLevel   String  // Low, Medium, High
  description String
  mitigation  String?
  assessedAt  DateTime @default(now())
}

model VendorTax {
  id          String  @id @default(uuid())
  vendorId    String
  vendor      Vendor  @relation(fields: [vendorId], references: [id], onDelete: Cascade)
  taxType     String  // GST, VAT, TDS
  taxRegNo    String
  taxRate     Float?
}

model VendorAuditLog {
  id          String  @id @default(uuid())
  vendorId    String
  vendor      Vendor  @relation(fields: [vendorId], references: [id], onDelete: Cascade)
  action      String  // Created, Updated, Blacklisted
  userId      String
  details     String
  createdAt   DateTime @default(now())
}

// ==========================================
// PROCUREMENT RFQ MANAGEMENT
// ==========================================

model ProcurementRequisition {
  id          String  @id @default(uuid())
  prNumber    String  @unique
  department  String
  requestedBy String
  requestDate DateTime @default(now())
  requiredDate DateTime
  status      String  @default("Pending") // Pending, Approved, Rejected, RFQ_Generated
  items       ProcurementRequisitionItem[]
  rfqs        ProcurementRFQ[]
}

model ProcurementRequisitionItem {
  id          String  @id @default(uuid())
  prId        String
  pr          ProcurementRequisition @relation(fields: [prId], references: [id], onDelete: Cascade)
  itemCode    String
  description String
  quantity    Int
  uom         String
  estPrice    Float?
}

model ProcurementRFQ {
  id          String  @id @default(uuid())
  rfqNumber   String  @unique
  title       String
  prId        String?
  pr          ProcurementRequisition? @relation(fields: [prId], references: [id])
  issueDate   DateTime @default(now())
  deadline    DateTime
  status      String  @default("Open") // Open, Closed, Awarded
  terms       String?
  items       ProcurementRFQItem[]
  vendors     ProcurementRFQVendor[]
  responses   ProcurementRFQResponse[]
  comparisons ProcurementRFQComparison[]
}

model ProcurementRFQItem {
  id          String  @id @default(uuid())
  rfqId       String
  rfq         ProcurementRFQ     @relation(fields: [rfqId], references: [id], onDelete: Cascade)
  itemCode    String
  description String
  quantity    Int
  uom         String
}

model ProcurementRFQVendor {
  id          String  @id @default(uuid())
  rfqId       String
  rfq         ProcurementRFQ     @relation(fields: [rfqId], references: [id], onDelete: Cascade)
  vendorId    String
  vendor      Vendor  @relation(fields: [vendorId], references: [id])
  status      String  @default("Invited") // Invited, Responded, Declined
  invitedAt   DateTime @default(now())
}

model ProcurementRFQResponse {
  id          String  @id @default(uuid())
  rfqId       String
  rfq         ProcurementRFQ     @relation(fields: [rfqId], references: [id], onDelete: Cascade)
  vendorId    String
  vendor      Vendor  @relation(fields: [vendorId], references: [id])
  responseDate DateTime @default(now())
  totalAmount Float
  currency    String  @default("USD")
  validUntil  DateTime
  remarks     String?
  fileUrl     String?
}

model ProcurementRFQComparison {
  id          String  @id @default(uuid())
  rfqId       String
  rfq         ProcurementRFQ     @relation(fields: [rfqId], references: [id], onDelete: Cascade)
  evaluatedBy String
  evalDate    DateTime @default(now())
  data        String  // JSON matrix of technical/commercial scores
  winnerId    String? // The vendorId of the awarded vendor
}

// ==========================================
// APPROVAL ENGINE
// ==========================================

model ApprovalRule {
  id          String  @id @default(uuid())
  entityType  String  // RFQ, Contract, PR
  minAmount   Float?
  maxAmount   Float?
  department  String?
  level1Role  String  // e.g. "Department Manager"
  level2Role  String? // e.g. "Finance Manager"
  level3Role  String? // e.g. "General Manager"
  isActive    Boolean @default(true)
}

model ApprovalQueue {
  id          String  @id @default(uuid())
  entityType  String  // RFQ, Contract, PR
  entityId    String
  requestedBy String
  requestDate DateTime @default(now())
  currentLevel Int    @default(1)
  status      String  @default("Pending") // Pending, Approved, Rejected
  logs        ApprovalLog[]
}

model ApprovalLog {
  id          String  @id @default(uuid())
  queueId     String
  queue       ApprovalQueue @relation(fields: [queueId], references: [id], onDelete: Cascade)
  approverId  String
  action      String  // Approved, Rejected
  comments    String?
  actionDate  DateTime @default(now())
}
`;

// Extract existing Vendor model
const vendorModelRegex = /model Vendor\s+\{([\s\S]*?)\n\}/;
const vendorMatch = schema.match(vendorModelRegex);

if (!vendorMatch) {
    console.error("Vendor model not found!");
    process.exit(1);
}

const existingVendorFields = vendorMatch[1];

const newVendorModel = `model Vendor {
${existingVendorFields}

  // New Fields for Vendor Management
  status         String          @default("Active") // Active, Inactive, Blacklisted, Pending
  registrationNo String?
  gstNo          String?
  panNo          String?
  website        String?
  currency       String          @default("USD")
  creditLimit    Float           @default(0.0)
  rating         Float           @default(0.0)

  // Relations
  contacts       VendorContact[]
  addresses      VendorAddress[]
  bankAccounts   VendorBankAccount[]
  documents      VendorDocument[]
  certifications VendorCertification[]
  contracts      VendorContract[]
  products       VendorProduct[]
  services       VendorService[]
  rates          VendorRate[]
  performances   VendorPerformance[]
  scorecards     VendorScorecard[]
  risks          VendorRisk[]
  taxes          VendorTax[]
  auditLogs      VendorAuditLog[]
  rfqVendors     ProcurementRFQVendor[]
  rfqResponses   ProcurementRFQResponse[]
  
  // Categorization
  categoryId     String?
  category       VendorCategory? @relation(fields: [categoryId], references: [id])
  groupId        String?
  group          VendorGroup?    @relation(fields: [groupId], references: [id])
  typeId         String?
  type           VendorType?     @relation(fields: [typeId], references: [id])
}`;

schema = schema.replace(vendorModelRegex, newVendorModel);
schema = schema + "\n" + newModels;

fs.writeFileSync(schemaPath, schema);
console.log("Procurement Schema updated successfully!");
