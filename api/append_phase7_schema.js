const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'prisma', 'schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf8');

if (!schema.includes('model ShipmentDocument')) {
  schema += `

// ==========================================
// Phase 7: Document Management & Compliance
// ==========================================

model DocumentCategory {
  id          String   @id @default(uuid())
  name        String   @unique // e.g., 'COMMERCIAL', 'TRANSPORT', 'CUSTOMS', 'INSURANCE', 'WAREHOUSE', 'PROOF'
  description String?
  
  documents   ShipmentDocument[]
}

model ShipmentDocument {
  id            String   @id @default(uuid())
  shipmentId    String
  shipment      Shipment @relation(fields: [shipmentId], references: [id], onDelete: Cascade)
  
  categoryId    String
  category      DocumentCategory @relation(fields: [categoryId], references: [id])
  
  name          String   // e.g., 'Commercial Invoice'
  fileUrl       String
  fileSize      Int
  fileType      String   // e.g., 'application/pdf'
  
  status        String   @default("PENDING_REVIEW") // DRAFT, PENDING_REVIEW, APPROVED, REJECTED, EXPIRED, ARCHIVED
  isMandatory   Boolean  @default(false)
  expiryDate    DateTime?
  
  metadata      String?  // JSON string for Customs (License#), Insurance (Policy#), Proof (Signatures)

  versions      DocumentVersion[]
  approvals     DocumentApproval[]
  history       DocumentHistory[]
  
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model DocumentVersion {
  id            String   @id @default(uuid())
  documentId    String
  document      ShipmentDocument @relation(fields: [documentId], references: [id], onDelete: Cascade)
  
  versionNumber Int
  fileUrl       String
  uploadedBy    String
  
  createdAt     DateTime @default(now())
}

model DocumentApproval {
  id            String   @id @default(uuid())
  documentId    String
  document      ShipmentDocument @relation(fields: [documentId], references: [id], onDelete: Cascade)
  
  status        String   // APPROVED, REJECTED
  remarks       String?
  reviewedBy    String
  
  createdAt     DateTime @default(now())
}

model DocumentHistory {
  id            String   @id @default(uuid())
  documentId    String
  document      ShipmentDocument @relation(fields: [documentId], references: [id], onDelete: Cascade)
  
  action        String   // UPLOADED, VIEWED, DELETED, REPLACED
  actor         String
  details       String?
  
  createdAt     DateTime @default(now())
}

model ComplianceCheck {
  id            String   @id @default(uuid())
  shipmentId    String
  shipment      Shipment @relation(fields: [shipmentId], references: [id], onDelete: Cascade)
  
  type          String   // IMPORT, EXPORT, DG, INSURANCE, TAX, CUSTOMER, VENDOR
  status        String   // COMPLIANT, NON_COMPLIANT, PENDING_REVIEW
  remarks       String?
  
  updatedAt     DateTime @updatedAt
}
`;
  fs.writeFileSync(schemaPath, schema);
  console.log('Appended Phase 7 Models');
} else {
  console.log('Phase 7 Models already exist.');
}
