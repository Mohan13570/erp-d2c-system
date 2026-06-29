# Comprehensive System Documentation: Aura ERP & D2C System

This document provides a pin-to-pin, exhaustive technical and functional breakdown of the Aura ERP ecosystem. It outlines every module, database model, API design, and frontend implementation we executed during the development lifecycle.

---

## Part 1: Core System Architecture

### 1. Monorepo Structure
The system is divided into two primary workspaces operating in a decoupled architecture:
1. **Frontend (`/admin`)**: A React 18 application built using Vite, styled with TailwindCSS and Lucide-React. It acts as the single-page application (SPA) gateway for all 25 modules.
2. **Backend (`/api`)**: A Node.js + Express server utilizing Prisma ORM to interact with the database (SQLite for development, PostgreSQL-ready for production).

### 2. The Database Schema (`schema.prisma`)
The core of the ERP is its massive, interconnected database schema comprising **over 50 unique entities**. Key design choices:
- Strict foreign-key relationships ensuring referential integrity between Procurement, Inventory, Sales, and Logistics.
- Shared user models across Employee, Customer, and Vendor contexts.
- Automated timestamp tracking (`createdAt`, `updatedAt`, `timestamp`) for auditability.

---

## Part 2: Module-by-Module Breakdown

### MODULE 1: Company & Authentication
- **Models**: `Company`, `User`, `Role`, `Permission`, `AuditLog`.
- **Implementation**: Fully dynamic Role-Based Access Control (RBAC). The sidebar instantly re-renders based on the active user's permissions, ensuring security at the UI layer. API routes check permissions before allowing read/write operations.

### MODULE 2: CRM & Lead Management
- **Models**: `Lead`, `LeadActivity`, `Opportunity`, `CustomerContact`, `CustomerContract`.
- **Implementation**: Kanban-style opportunity tracking and automated lead follow-ups. Connected to `SalesOrder` generation to streamline the Quote-to-Cash process.

### MODULE 3: Sales & Quotations
- **Models**: `RFQ`, `Quotation`, `QuotationItem`, `QuotationApproval`.
- **Implementation**: Complex margin calculation engine. Allows generating multi-modal freight quotes (Air, Ocean, Road) and requires multi-tiered approval workflows before converting to an active Shipment.

### MODULE 4 & 5: Shipments & Freight Operations
- **Models**: `Shipment`, `ShipmentItem`, `ShipmentMilestone`, `Carrier`, `Booking`, `BookingItem`.
- **Implementation**: The logistical backbone. Supports Import/Export, Cross-border, and Door-to-Door shipments. Milestones are automatically tracked via the API, connecting physical Carrier bookings to digital records.

### MODULE 6 & 7: Ocean & Air Freight
- **Models**: `Vessel`, `Voyage`, `AirWaybill`, `Flight`, `AirShipment`.
- **Implementation**: Highly specific models tracking FCL/LCL (Full/Less Container Load) and ULD (Unit Load Device) tracking. Synchronized with Port and Airport master tables.

### MODULE 8 & 9: Road Transport & Fleet Management
- **Models**: `Vehicle`, `Driver`, `Trip`, `VehicleMaintenance`, `FuelLog`, `DriverPerformance`.
- **Implementation**: Complete asset tracking. Monitors fuel efficiency, schedules preventive maintenance, and grades drivers based on delivery performance.

### MODULE 10: Warehouse & Inventory Management
- **Models**: `Warehouse`, `StockLevel`, `WarehouseLocation`, `PickList`, `PackingList`.
- **Implementation**: Rack, Bin, and Aisle tracking. Deeply integrated with the D2C module to reserve stock when online orders are placed.

### MODULE 11 & 12: Customs & Document Management
- **Models**: `CustomsDeclaration`, `Duty`, `ComplianceRule`, `Document`, `DocumentVersion`.
- **Implementation**: Automated duty estimation engine. Tracks version history for Bills of Lading, Commercial Invoices, and Certificates of Origin.

### MODULE 13 & 14: Container Management & Procurement
- **Models**: `Container`, `ContainerMovement`, `Vendor`, `PurchaseRequisition`, `PurchaseOrder`.
- **Implementation**: Full tracking of container stuffing/destuffing operations. Automated PR to PO conversion workflows for efficient vendor sourcing.

### MODULE 15 & 16: Finance, Accounting & Billing
- **Models**: `Account`, `JournalEntry`, `Invoice`, `Payment`, `GLEntry`, `TaxRecord`, `VendorBill`.
- **Implementation**: A fully-fledged double-entry accounting system. Every approved Vendor Bill and Customer Invoice automatically posts to the General Ledger. Supports complex GST/TDS tax configurations.

### MODULE 17 & 18: Insurance & Real-Time Tracking
- **Models**: `InsurancePolicy`, `InsuranceClaim`, `TrackingDevice`, `TrackingEvent`.
- **Implementation**: IoT-ready infrastructure. Tracking devices linked to vehicles/containers ping the backend API to dynamically update Shipment Milestones and ETAs.

---

## Part 3: Portals, AI & Mobile Expansion

### MODULE 19, 20 & 21: External Portals
Rather than building entirely separate applications, the system restricts the main React application securely using RBAC:
1. **Customer Portal**: Clients can track shipments, view invoices, and raise Support Tickets (`SupportTicket` model).
2. **Vendor Portal**: Carriers can view active jobs, upload delivery proofs, and submit vendor bills.
3. **Employee Portal (HR)**: Built with `Attendance` and `Payroll` models. Employees clock in/out and view monthly payslips.

### MODULE 22 & 23: Notifications & Business Intelligence
- **Implementation**: 
  - Centralized `NotificationLog` model mimicking Email/SMS/WhatsApp queues.
  - The `bi-reports.ts` API dynamically aggregates millions of rows from the DB (e.g., total sales, net revenue, active shipments) and serves them to a high-performance executive dashboard (`BIDashboard.tsx`).

### MODULE 24: Mobile-First Apps
- **Implementation**: Touch-optimized PWAs (Progressive Web Apps) built within the React ecosystem.
  - **Driver App**: Features large, high-contrast buttons for updating GPS milestones and uploading PODs via camera.
  - **Warehouse App**: Scanner-focused interface for fast bin movements and stock cycle counts.

### MODULE 25: Aura AI Hub
- **Implementation**: An intelligent NLP chatbot interface (`AIHub.tsx`) connected to the `ai.ts` API. 
- **Features**: Translates natural language queries ("How many active shipments?") into Prisma database queries, serving real-time analytics and predictive routing suggestions.

---

## Part 4: Technical Challenges & Solutions

1. **Routing Conflicts & Monolith Architecture**: With 25 modules, the React Router configuration (`App.tsx`) initially experienced duplication issues. This was resolved by meticulously organizing imports and strictly gating them behind a single `<RequireAuth>` wrapper layout.
2. **Prisma Relational Constraints**: Managing a 1300+ line schema required strict adherence to Foreign Key relations. E.g., resolving cyclic dependencies between `Employee`, `Payroll`, and `Attendance` by explicitly defining reciprocal array relations in the models.
3. **Hot-Reloading with Deep React Trees**: We bypassed complex Redux setups by utilizing highly localized React Hooks and Context APIs for Auth, keeping the application lightning-fast despite its enormous size.

---

## Part 5: Recent Expansions (Fleet & Massive Ocean Freight Modules)

### 1. Fleet & Live GPS Engine Expansion
- **Live Telematics**: Deployed WebSocket-powered GIS mapping and heartbeat tracking for fleets.
- **Geofence Studio**: Engineered Polygon restricted zones and automatic transit violation alerts (dwell times, SOS alerts, overspeed).
- **Route Optimization**: Connected Trip assignments with dynamic GPS routes for complete logistical oversight.

### 2. Global Ocean Freight Forwarding Suite
A monumental expansion to manage international maritime shipping natively:
- **Maritime Master Data**: Complete standard data for Vessels, Ports, Terminals, and Shipping Lines.
- **Booking Workflows**: Advanced NVOCC freight routing catering to FCL, LCL, Hazmat (Dangerous Goods), and Reefer cargo.
- **Yard & Port Operations**: Digital twins of CY operations. Supports Gate-in/Gate-out scanning, crane assignment, and comprehensive container inventory mapping.
- **Customs & Finance**: Bills of Entry tracking, specific Duty calculators, and real-time AR/AP net margin calculations dynamically linked to maritime charges (BAF, CAF, THC).
- **Executive BI & GIS Map**: High-level C-Suite KPI aggregators (Total Revenue, Active Vessels) and Carrier reliability tracking. Features a live GeoJSON Leaflet map tracking vessels globally on OpenStreetMap.

---

*This document serves as the absolute blueprint of the Aura ERP ecosystem.*
