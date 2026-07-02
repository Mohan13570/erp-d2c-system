const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'api', 'prisma', 'schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf8');

// Regex patterns to remove the old models completely
const removePatterns = [
  /model PurchaseOrder\s*\{[\s\S]*?\n\}/g,
  /model POItem\s*\{[\s\S]*?\n\}/g,
  /model GoodsReceiptNote\s*\{[\s\S]*?\n\}/g,
  /model GRNItem\s*\{[\s\S]*?\n\}/g,
  /model PurchaseRequisition\s*\{[\s\S]*?\n\}/g
];

removePatterns.forEach(pattern => {
  schema = schema.replace(pattern, '');
});

// The new models to append
const newModels = `
// ==========================================
// PURCHASING OPERATIONS (PR, PO, GRN, RETURNS, INVOICE)
// ==========================================

model PurchaseRequisition {
  id          String   @id @default(uuid())
  prNumber    String   @unique
  department  String?
  projectId   String?
  warehouseId String?
  type        String   @default("Standard") // Standard, Emergency, Recurring
  priority    String   @default("Medium") // Low, Medium, High, Critical
  costCenter  String?
  status      String   @default("Draft") // Draft, Submitted, Approved, Rejected, PO_Created, Closed
  requestDate DateTime @default(now())
  requiredDate DateTime?
  totalEstAmount Float @default(0)
  currency    String   @default("USD")
  comments    String?
  items       PurchaseRequisitionItem[]
}

model PurchaseRequisitionItem {
  id          String   @id @default(uuid())
  prId        String
  pr          PurchaseRequisition @relation(fields: [prId], references: [id], onDelete: Cascade)
  itemCode    String
  item        Item     @relation(fields: [itemCode], references: [itemCode])
  description String?
  quantity    Float
  uom         String?
  estPrice    Float?
}

model PurchaseOrder {
  id           String             @id @default(uuid())
  poNumber     String             @unique
  vendorId     String
  vendor       Vendor             @relation(fields: [vendorId], references: [id])
  companyName  String?
  company      Company?           @relation(fields: [companyName], references: [name])
  warehouseId  String?
  type         String             @default("Standard") // Standard, Blanket, Contract
  status       String             @default("Draft") // Draft, Pending_Approval, Approved, Sent, Partial_Receipt, Closed, Cancelled
  orderDate    DateTime           @default(now())
  expectedDate DateTime?
  currency     String             @default("USD")
  subTotal     Float              @default(0.0)
  taxAmount    Float              @default(0.0)
  discount     Float              @default(0.0)
  freight      Float              @default(0.0)
  insurance    Float              @default(0.0)
  grandTotal   Float              @default(0.0)
  incoterms    String?
  shippingTerms String?
  notes        String?
  items        POItem[]
  grns         GoodsReceiptNote[]
  invoices     VendorInvoice[]
  returns      PurchaseReturn[]
  history      PurchaseOrderHistory[]
}

model PurchaseOrderHistory {
  id              String        @id @default(uuid())
  purchaseOrderId String
  purchaseOrder   PurchaseOrder @relation(fields: [purchaseOrderId], references: [id], onDelete: Cascade)
  action          String
  userId          String
  timestamp       DateTime      @default(now())
  details         String?
}

model POItem {
  id              String        @id @default(uuid())
  purchaseOrderId String
  purchaseOrder   PurchaseOrder @relation(fields: [purchaseOrderId], references: [id], onDelete: Cascade)
  itemCode        String
  item            Item          @relation(fields: [itemCode], references: [itemCode])
  description     String?
  qty             Float
  qtyReceived     Float         @default(0)
  uom             String?
  rate            Float
  taxPercent      Float         @default(0)
  discountPercent Float         @default(0)
  amount          Float
}

model GoodsReceiptNote {
  id              String        @id @default(uuid())
  grnNumber       String        @unique
  purchaseOrderId String
  purchaseOrder   PurchaseOrder @relation(fields: [purchaseOrderId], references: [id])
  warehouseId     String?
  receivedDate    DateTime      @default(now())
  status          String        @default("Draft") // Draft, Inspected, Posted
  receivedBy      String?
  notes           String?
  items           GRNItem[]
  inspections     QualityInspection[]
}

model GRNItem {
  id                 String           @id @default(uuid())
  goodsReceiptNoteId String
  goodsReceiptNote   GoodsReceiptNote @relation(fields: [goodsReceiptNoteId], references: [id], onDelete: Cascade)
  itemCode           String
  item               Item             @relation(fields: [itemCode], references: [itemCode])
  batchNumber        String?
  serialNumber       String?
  expiryDate         DateTime?
  qtyReceived        Float
  qtyAccepted        Float            @default(0)
  qtyRejected        Float            @default(0)
  reasonForReject    String?
}

model QualityInspection {
  id                 String           @id @default(uuid())
  goodsReceiptNoteId String
  goodsReceiptNote   GoodsReceiptNote @relation(fields: [goodsReceiptNoteId], references: [id], onDelete: Cascade)
  inspectorId        String
  inspectionDate     DateTime         @default(now())
  status             String           @default("Pending") // Pending, Passed, Failed, Conditional
  checklistResults   String?          // JSON
  comments           String?
}

model PurchaseReturn {
  id              String        @id @default(uuid())
  returnNumber    String        @unique
  purchaseOrderId String
  purchaseOrder   PurchaseOrder @relation(fields: [purchaseOrderId], references: [id])
  vendorId        String
  returnDate      DateTime      @default(now())
  status          String        @default("Draft") // Draft, Shipped, Credit_Received
  reason          String
  type            String        @default("RTV") // RTV, Replacement, Repair
  totalValue      Float         @default(0)
  items           PurchaseReturnItem[]
}

model PurchaseReturnItem {
  id              String        @id @default(uuid())
  returnId        String
  return          PurchaseReturn @relation(fields: [returnId], references: [id], onDelete: Cascade)
  itemCode        String
  item            Item          @relation(fields: [itemCode], references: [itemCode])
  qtyReturned     Float
  uom             String?
  unitPrice       Float
}

model VendorInvoice {
  id              String        @id @default(uuid())
  invoiceNumber   String        @unique
  vendorId        String
  purchaseOrderId String?
  purchaseOrder   PurchaseOrder? @relation(fields: [purchaseOrderId], references: [id])
  invoiceDate     DateTime
  dueDate         DateTime
  totalAmount     Float
  currency        String        @default("USD")
  status          String        @default("Draft") // Draft, Matched, Hold, Approved, Paid
  matchStatus     String        @default("Pending") // Pending, 2-Way-Matched, 3-Way-Matched, Discrepancy
  notes           String?
  createdAt       DateTime      @default(now())
}
`;

schema = schema + "\n" + newModels;

fs.writeFileSync(schemaPath, schema);
console.log("Purchasing Operations schema updated successfully!");
