const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'prisma', 'schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf8');

if (!schema.includes('model ShipmentWorkflow')) {
  schema += `

// ==========================================
// Phase 9: Workflow Automation, Exceptions & Notifications
// ==========================================

model ShipmentWorkflow {
  id                  String   @id @default(uuid())
  shipmentId          String   @unique
  shipment            Shipment @relation(fields: [shipmentId], references: [id], onDelete: Cascade)
  
  currentStage        String   @default("BOOKING_APPROVED")
  previousStage       String?
  nextStage           String?
  
  progressPercentage  Int      @default(0)
  currentOwner        String   @default("UNASSIGNED")
  department          String   @default("OPERATIONS")
  
  steps               WorkflowStep[]
  history             WorkflowHistory[]
  exceptions          ShipmentException[]
  
  updatedAt           DateTime @updatedAt
}

model WorkflowStep {
  id                  String   @id @default(uuid())
  workflowId          String
  workflow            ShipmentWorkflow @relation(fields: [workflowId], references: [id], onDelete: Cascade)
  
  stageName           String
  status              String   @default("PENDING") // PENDING, IN_PROGRESS, COMPLETED, SKIPPED
  completedAt         DateTime?
  completedBy         String?
  
  sequence            Int
}

model WorkflowHistory {
  id                  String   @id @default(uuid())
  workflowId          String
  workflow            ShipmentWorkflow @relation(fields: [workflowId], references: [id], onDelete: Cascade)
  
  fromStage           String
  toStage             String
  actionBy            String
  remarks             String?
  
  createdAt           DateTime @default(now())
}

model ShipmentException {
  id                  String   @id @default(uuid())
  workflowId          String
  workflow            ShipmentWorkflow @relation(fields: [workflowId], references: [id], onDelete: Cascade)
  
  type                String   // DELAY, DAMAGE, MISSING, CUSTOMS, ADDRESS
  severity            String   @default("MEDIUM") // LOW, MEDIUM, HIGH, CRITICAL
  status              String   @default("OPEN") // OPEN, IN_PROGRESS, RESOLVED, CLOSED
  
  raisedBy            String
  assignedTo          String?
  
  resolution          String?
  resolvedAt          DateTime?
  remarks             String?
  
  history             ExceptionHistory[]
  
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt
}

model ExceptionHistory {
  id                  String   @id @default(uuid())
  exceptionId         String
  exception           ShipmentException @relation(fields: [exceptionId], references: [id], onDelete: Cascade)
  
  action              String
  actor               String
  details             String?
  
  createdAt           DateTime @default(now())
}

model NotificationQueue {
  id                  String   @id @default(uuid())
  shipmentId          String
  type                String   // EMAIL, SMS, WHATSAPP, PUSH
  event               String   // DISPATCH, DELIVERED, EXCEPTION
  payload             String   // JSON
  status              String   @default("QUEUED") // QUEUED, PROCESSING, SENT, FAILED
  
  createdAt           DateTime @default(now())
}

model NotificationLog {
  id                  String   @id @default(uuid())
  shipmentId          String
  channel             String
  recipient           String
  message             String
  sentAt              DateTime @default(now())
}

model AuditLog {
  id                  String   @id @default(uuid())
  entityType          String   // SHIPMENT, WORKFLOW, EXCEPTION, BILLING, DOCUMENT
  entityId            String
  action              String   // CREATE, UPDATE, DELETE, OVERRIDE
  actor               String
  changes             String?  // JSON diff
  
  createdAt           DateTime @default(now())
}

model ActivityTimeline {
  id                  String   @id @default(uuid())
  shipmentId          String
  category            String   // SYSTEM, USER, WORKFLOW, EXCEPTION
  description         String
  actor               String
  
  createdAt           DateTime @default(now())
}
`;
  fs.writeFileSync(schemaPath, schema);
  console.log('Appended Phase 9 Models');
} else {
  console.log('Phase 9 Models already exist.');
}
