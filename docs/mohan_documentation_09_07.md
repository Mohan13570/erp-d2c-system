# Phase 1: Enterprise System Monitoring & Administration

## Executive Summary
This documentation details the implementation of the **System Administration & Monitoring Module** for the Logistics & Freight Forwarding ERP. Designed to emulate the robust functionality of enterprise control towers (e.g., SAP Solution Manager, Datadog), this module introduces real-time health tracking, advanced logging, background job queues, and critical infrastructure metrics directly into the ERP environment.

---

## 1. Database Architecture (Prisma)
A dedicated set of tables was introduced to the PostgreSQL database to persist time-series metrics and detailed logs. 
### New Data Models:
- **Metrics Models**: `SystemHealth`, `ServerMetrics`, `DatabaseMetrics`, `RedisMetrics`, `QueueMetrics`, `ApiMetrics`, `PerformanceMetric`.
- **Log Models**: `SystemLog`, `ApiLog`, `ErrorLog`, `AuditLog`, `SecurityEvent`, `ActivityLog`.
- **System Administration**: `License`, `FeatureFlag`, `EnvironmentSetting`.

All schemas were successfully compiled via `npx prisma generate` and synced to the database via `npx prisma db push`.

---

## 2. Backend Implementation (Node.js & Express)
The backend was expanded to include intelligent background services that collect, store, and stream data.

### Node.js System Monitoring
A new `MonitoringEngine` service was implemented that utilizes the native Node.js `os` module. It performs the following functions:
- Measures actual host CPU utilization, memory allocation, and system uptime.
- Runs a non-blocking `setInterval` loop to persist hardware telemetry to the database.

### Real-Time Socket.IO Telemetry
To achieve a highly responsive, modern interface without HTTP polling overhead:
- A `Socket.IO` server was integrated directly into the core Express `httpServer`.
- It broadcasts `live_metrics` objects (containing server and DB stats) every 2 seconds to any connected administrator clients.

### REST API Endpoints
A dedicated administration route (`/api/admin`) was introduced, providing JSON endpoints for historical metrics, application logs, and system health checks.

---

## 3. Frontend Architecture (React & Vite)
The ERP's presentation layer was updated with two significant enterprise-grade views, styled using Tailwind CSS and Shadcn UI.

### System Control Tower (`SystemDashboard.tsx`)
- Connected directly to the backend's WebSocket to receive live, sub-second telemetry updates.
- Renders dynamic progress bars indicating CPU and Memory utilization.
- Displays mocked BullMQ background queue processing stats (e.g., Webhook Queues, Email Queues).
- Embedded within the global application routing at `/admin/dashboard`.

### Enterprise Logs Viewer (`LogsViewer.tsx`)
- A robust UI table designed for auditing `SystemLogs` (INFO, WARN, ERROR).
- Displays color-coded log levels and service origins (e.g., ApiServer, Database) for rapid root-cause analysis during outages.

### Navigation Integration
- The main sidebar (`Sidebar.tsx`) was upgraded with a new **"Enterprise Core"** group, providing intuitive navigation points to the Control Tower and System Logs.

---

## 4. Verification & Status
- **Vite Server**: Running successfully in the background on port `5173`.
- **API Server**: Running successfully in the background on port `5000` (including Socket.IO).
- **Module Status**: `ACTIVE` and accessible natively within the application.


<br><br><br>

# Phase 2: Enterprise Integration Hub & AI Platform

## Executive Summary
The second phase of the Enterprise Administration architecture successfully scaffolds an environment capable of deep third-party synchronization (similar to SAP BTP or MuleSoft) alongside a robust, token-aware AI routing engine.

---

## 1. Database Architecture (Prisma)
We successfully compiled a dedicated `integration.prisma` schema and linked it to the primary PostgreSQL database using `npx prisma db push`.
### Key Models Added:
- **API Gateway**: `GatewayApiKey`, `ApiToken`, `ApiMetric`.
- **Webhooks**: `Webhook`, `WebhookHistory`, `WebhookRetry`.
- **Integrations**: `Integration`, `IntegrationCredential`, `IntegrationLog`.
- **AI Platform**: `AIProvider`, `AIModel`, `PromptTemplate`, `PromptVersion`, `AIAgent`, `AIRequest`, `AIUsage`, `AICost`.

---

## 2. Backend Engines (Node.js)
Three core administrative engines were built and mounted into the Express API:

### `WebhookEngine.ts`
- Provides an asynchronous dispatcher `WebhookEngine.dispatch(event, payload)`.
- Automatically cross-references incoming events (e.g., `shipment.created`) with registered Webhook listeners.
- Simulates network delay, logs successes/failures to `WebhookHistory`, and queues failures for retry.

### `AIEngine.ts`
- Provides a centralized `AIEngine.query(prompt, model)` router to abstract away direct SDK calls to OpenAI/Gemini/Claude.
- Calculates prompt token consumption and dynamically records daily `AIUsage` and financial `AICost` based on the targeted model.
- Automatically handles fallback routing and token logging.

### Integration API Routes (`/api/integration/*`)
- Secure endpoints delivering telemetry to the front-end for AI request logs, active webhook queues, and Gateway API keys.

---

## 3. Frontend Architecture (React)
Four major enterprise screens were added to the `admin` portal under two new sidebar groups (**Integration Hub** & **AI Platform**).

### 1. Integration Connectors (`/integration/dashboard`)
Displays the status of active OAuth/API keys linked to third-party tools (SAP, Salesforce, Stripe) and global security alerts.

### 2. API Gateway (`/integration/gateway`)
A control panel mapping out all registered system endpoints, their active API version (e.g., v1, v2), and applied rate limits per hour.

### 3. AI Control Center (`/ai/dashboard`)
An incredibly detailed token and cost tracking center. It provides metrics on total AI requests processed today, millions of tokens consumed, and actual USD estimates. It also includes a live log of recent LLM queries and latencies.

### 4. Prompt Library (`/ai/prompts`)
A version-control system for LLM instructions. Administrators can see exactly which version of a prompt (e.g., `Invoice_OCR_Extract`) is currently active and bound to a specific model.


<br><br><br>

# Phase 3: Enterprise Vendor Portal & Onboarding

## Executive Summary
This phase introduces a secure, multi-tenant portal designed for external suppliers and partners to self-register, manage profiles, and monitor their compliance and purchase orders. It transforms the ERP into a collaborative ecosystem akin to SAP Ariba or CargoWise Vendor Portal.

---

## 1. Database Architecture (Prisma)
We successfully integrated a dedicated `vendor_portal.prisma` schema into the core PostgreSQL database, extending the capabilities of the core `Vendor` model.

### Key Models Added:
- **Vendor Authentication**: `VendorUser`, `VendorUserRole`, `VendorInvitation`.
- **Vendor Compliance & KYC**: `VendorProfile`, `VendorCompliance`, `VendorKYC`.
- **Workflow & Approvals**: `VendorApproval`, `VendorApprovalHistory`.
- **Engagement**: `VendorNotification`, `VendorActivity`.

---

## 2. Backend Engines (Node.js)
Specialized administrative engines were built to govern vendor interactions safely without cross-contaminating internal employee data.

### `VendorAuthEngine.ts`
- Issues separate JSON Web Tokens (JWT) specifically for `VendorUser` accounts.
- Generates secure cryptographic invitation links for onboarding external partners via email.

### `VendorOnboardingEngine.ts`
- Manages the entire multi-stage state machine from `Pending KYC` to `Active`.
- Automatically locks vendor accounts until administration verifies mandatory regulatory documents (GST, PAN).
- Automatically provisions `VendorApproval` workflows upon document submission.

### Vendor API Routes (`/api/vendor-portal/*`)
- Isolated REST endpoints that govern both external self-registration flows and internal administrative approval interfaces.

---

## 3. Frontend Architecture (React)
Three major enterprise screens were added to the `admin` portal under the new **Vendor Portal** sidebar group.

### 1. Vendor Directory (`/vendor/list`)
The internal control center. Provides administrators with an advanced data grid tracking all vendors, their active KYC statuses, live compliance scores (rendered via dynamic progress bars), and total counts of expiring documents.

### 2. Self Registration Wizard (`/vendor/registration`)
A comprehensive, multi-step onboarding flow designed for external users. Captures Legal Entity Details, Banking Information, and provides a drag-and-drop interface for uploading statutory documents.

### 3. External Portal (`/vendor/portal`)
The dashboard seen by vendors upon logging in. Grants them real-time visibility into their tier rating, active purchase orders pending fulfillment, and urgent notifications (e.g., "Insurance expires in 14 days").


<br><br><br>

# Phase 4: Enterprise Vendor Procurement Collaboration

## Executive Summary
This phase activates the core supply-chain collaboration capabilities of the Vendor Portal. It transforms the portal from a simple profile management tool into an active transactional environment for Quotations, Purchase Orders, and Contract negotiations.

---

## 1. Database Architecture (Prisma)
A `vendor_procurement.prisma` schema was successfully integrated and pushed to PostgreSQL, establishing relational bridges between the core ERP's `ProcurementRFQ`/`PurchaseOrder` tables and the external `Vendor` accounts.

### Key Models Added:
- **Quotation & Negotiation**: `VendorQuotation`, `VendorQuotationItem`, `VendorNegotiation`.
- **Product Catalog & Pricing**: `VendorProductCatalog`, `VendorPriceList`.
- **Interaction Tracking**: `VendorPOInteraction`, `VendorContractAcknowledge`.

---

## 2. Backend Engines (Node.js)
Two powerful state-tracking engines were deployed to the `api/src/services` layer.

### `VendorProcurementEngine.ts`
- Abstracts away complex transactional logic. When a vendor clicks "Accept" on a PO, this engine safely changes the PO status while generating an immutable `VendorPOInteraction` audit record.
- Allows vendors to securely submit their `VendorQuotationItem` rates against open RFQs, rolling up subtotals into the master Quotation automatically.

### `VendorNegotiationEngine.ts`
- A dedicated chat-like engine that tracks messages passing between the internal Buyer and external Vendor during quotation reviews. Allows appending attachment URLs to specific messages.

### Vendor API Routes (`/api/vendor-procurement/*`)
- REST routes mapping directly to these new engines.

---

## 3. Frontend Architecture (React)
Three new collaborative dashboards were generated and appended to the **Vendor Portal** sidebar section.

### 1. Procurement Collaboration Dashboard (`/vendor/procurement`)
A high-level summary view tailored specifically for the vendor. Highlights open RFQs requiring quotes, active negotiations, and a live "Revenue Forecast" calculating the sum of accepted Purchase Orders.

### 2. RFQs & Quotes Interface (`/vendor/rfqs`)
A structured grid pulling active RFQs that are open to the vendor. Indicates whether their quote status is "Not Started", "Submitted", or "UnderNegotiation".

### 3. Purchase Order Acceptance (`/vendor/pos`)
A dedicated PO approval directory. Vendors can easily scan their assigned POs and quickly click "Accept" or "Reject". Successfully accepted POs update the backend state immediately via the `VendorProcurementEngine`.


<br><br><br>

# Phase 5: Vendor Logistics & ASN Collaboration

## Executive Summary
This final phase bridges the gap between digital procurement and physical supply chain execution. It provides vendors with direct integration into the core warehouse system, allowing them to create Advance Shipment Notices (ASNs), secure dock delivery appointments, and receive automated visibility into Goods Receipt Notes (GRN) generated at the destination.

---

## 1. Database Architecture (Prisma)
A specialized `vendor_logistics.prisma` schema was injected and deployed. It directly connects vendor accounts to core warehouse execution models like `DockSchedule` and `AdvanceShipmentNotice`.

### Key Models Added:
- **ASN & Delivery Tracking**: `VendorASNInteraction`, `VendorShipmentTracking`.
- **Appointments**: `VendorDeliveryAppointment` (mapping a Vendor's ASN to a specific `DockSchedule`).
- **Warehouse Visibility**: `VendorGRNVisibility` (mapping vendor viewing rights to `GoodsReceiptNote` entities).

---

## 2. Backend Engines (Node.js)
Two new automated services govern the logistics integrations:

### `VendorLogisticsEngine.ts`
- Responsible for transforming accepted Purchase Orders into formal `AdvanceShipmentNotice` entries.
- Safely allocates available `DockSchedule` records (Loading Bays) and transitions their status from "Available" to "Booked" to prevent double-booking.
- Records automatic tracking milestone events (e.g., "Dock Appointment Booked").

### `VendorWarehouseEngine.ts`
- An aggregation engine that provides safe, read-only visibility for external vendors into internal Warehouse `GoodsReceiptNote` data.

### Vendor API Routes (`/api/vendor-logistics/*`)
- Secure endpoints for `GET /docks/available`, `POST /asn`, and `POST /dock/book`.

---

## 3. Frontend Architecture (React)
Three new logistics execution interfaces were added to the portal sidebar:

### 1. Logistics & Deliveries Dashboard (`/vendor/logistics`)
An operational control center for the vendor's dispatch team. Tracks the total volume of in-transit ASNs, imminent deliveries within 48 hours, and global tracking alerts.

### 2. ASN Directory (`/vendor/asns`)
A detailed tracking grid of every Advance Shipment Notice generated by the vendor against active POs, showing expected arrival dates and real-time status.

### 3. Dock Scheduling Interface (`/vendor/docks`)
A smart appointment booking interface. It queries the backend for `Available` dock slots (time windows & bay assignments) in the warehouse, allowing dispatchers to click and reserve a slot directly.
