const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'api', 'prisma', 'schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf8');

// 1. Remove the old VendorBill
schema = schema.replace(/model VendorBill\s*\{[\s\S]*?\n\}/g, '');

// 2. Remove old relation in Vendor
schema = schema.replace(/vendorBills\s+VendorBill\[\]/g, '');

// 3. Inject new relations into Vendor model
const vendorInsertionPoint = 'purchaseOrders PurchaseOrder[]';
schema = schema.replace(vendorInsertionPoint, `purchaseOrders PurchaseOrder[]
  procurementVendorBills ProcurementVendorBill[] @relation("ProcurementVendorBills")
  procurementPayments    ProcurementPayment[]    @relation("ProcurementPayments")
  vendorLedgers          VendorLedger[]`);

// 4. Append new models
const newModels = `
// ==========================================
// PROCUREMENT FINANCE & ANALYTICS
// ==========================================

model ProcurementVendorBill {
  id              String   @id @default(uuid())
  billNumber      String   @unique
  vendorId        String
  vendor          Vendor   @relation("ProcurementVendorBills", fields: [vendorId], references: [id])
  purchaseOrderId String?
  purchaseOrder   PurchaseOrder? @relation(fields: [purchaseOrderId], references: [id])
  amount          Float
  taxAmount       Float    @default(0)
  totalAmount     Float
  currency        String   @default("USD")
  status          String   @default("Unpaid") // Unpaid, Partial, Paid, Cancelled, On_Hold
  dueDate         DateTime
  createdAt       DateTime @default(now())
  payments        ProcurementPayment[]
}

model ProcurementPayment {
  id              String   @id @default(uuid())
  paymentNumber   String   @unique
  vendorBillId    String
  vendorBill      ProcurementVendorBill @relation(fields: [vendorBillId], references: [id], onDelete: Cascade)
  vendorId        String
  vendor          Vendor   @relation("ProcurementPayments", fields: [vendorId], references: [id])
  amount          Float
  method          String   @default("Bank Transfer") // Bank Transfer, UPI, Cheque, Credit Card
  reference       String?
  paymentDate     DateTime @default(now())
  status          String   @default("Completed") // Pending, Completed, Failed
}

model VendorLedger {
  id              String   @id @default(uuid())
  vendorId        String
  vendor          Vendor   @relation(fields: [vendorId], references: [id])
  transactionType String   // Invoice, Payment, CreditNote, DebitNote
  referenceId     String
  debit           Float    @default(0)
  credit          Float    @default(0)
  balance         Float
  date            DateTime @default(now())
  description     String?
}

model BudgetMaster {
  id              String   @id @default(uuid())
  department      String?
  projectId       String?
  costCenter      String?
  fiscalYear      String
  totalBudget     Float
  consumedAmount  Float    @default(0)
  allocatedAmount Float    @default(0)
  currency        String   @default("USD")
  status          String   @default("Active") // Active, Exhausted, Frozen
}

model SpendAnalysis {
  id              String   @id @default(uuid())
  periodMonth     Int
  periodYear      Int
  categoryId      String?
  vendorId        String?
  department      String?
  spendAmount     Float
  transactionCount Int     @default(0)
  currency        String   @default("USD")
}
`;

schema = schema + "\n" + newModels;
fs.writeFileSync(schemaPath, schema);
console.log("Finance Schema updated successfully.");
