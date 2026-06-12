# Aura - Next-Gen Enterprise Resource Planning (ERP) & D2C System

![Aura ERP System](https://img.shields.io/badge/System-Aura%20ERP-indigo?style=for-the-badge&logo=react)
![Version](https://img.shields.io/badge/Version-1.0.0-blue?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20Node.js%20%7C%20Prisma-emerald?style=for-the-badge)

**Aura** is a cutting-edge, 25-module Enterprise Resource Planning (ERP) and Direct-to-Consumer (D2C) ecosystem. Built with a modern technology stack (React, TailwindCSS, Node.js, Express, and Prisma ORM), Aura bridges the gap between massive enterprise-scale data processing and hyper-modern, user-centric aesthetics.

## 🚀 Key Features

Aura is divided into 25 interconnected modules spanning the entire supply chain, human resources, finance, operations, and customer relations lifecycles.

### 🏢 Core Enterprise & CRM
- **CRM & Lead Management**: Track leads, assignment pipelines, customer interactions, and opportunity flows.
- **Sales & Quotation**: Advanced RFQ management, multimodal freight quoting, margin calculators, and approval workflows.
- **D2C Storefront**: Integrated Direct-to-Consumer e-commerce marketing, cart, and returns management.

### 🚢 Logistics & Freight Operations
- **Freight Management**: Distinct modules for Air, Ocean, Road, and Rail freight with booking operations and carrier allocation.
- **Shipment Management**: Import/Export, cross-border, door-to-door logistics routing with automated milestone tracking.
- **Fleet Management**: Driver performance metrics, vehicle maintenance, insurance tracking, and fuel logging.
- **Real-Time Tracking & IoT**: Tracking milestones and IoT Tracking Device integrations for vehicle and container tracking.

### 📦 Operations & Supply Chain
- **Warehouse Management**: Inbound/outbound flows, rack/bin tracking, barcode scanning, cycle counting, and inventory controls.
- **Container Management**: Container tracking, stuffing, destuffing, and vessel/voyage scheduling.
- **Customs Clearance**: Automated duty calculations and compliance tracking for import/export regulations.
- **Procurement & Vendor Management**: Purchase requisitions, Vendor Bills, and seamless PO generation.
- **Document Management**: Version-controlled generation for Bill of Lading, Air Waybills, and Commercial Invoices.

### 💰 Finance & HR
- **Accounting & Billing**: Complete General Ledger, Chart of Accounts, Journal Entries, Accounts Payable/Receivable, GST/TDS tax records.
- **Insurance Module**: Policy management, risk assessments, and claim processing.
- **HR & Employee Self-Service**: Attendance tracking, leave management, automated payroll processing, and Payslip generation.

### 🌐 Portals, AI & Mobile
- **External Portals**: Dedicated restricted-access self-service web portals for Customers, Vendors, and Employees.
- **Mobile-First Field Apps**: Touch-optimized PWAs for Driver route tracking (GPS/POD) and Warehouse barcode scanning.
- **Business Intelligence (BI)**: Live KPI dashboards plotting P&L, balance sheets, and real-time revenue analytics.
- **Aura AI Hub**: Integrated AI assistant capable of NLP-based shipment tracking, route optimization, and revenue forecasting.

---

## 🛠️ Technology Stack

- **Frontend Environment**: React 18, Vite, TypeScript
- **Frontend Styling**: Tailwind CSS, Lucide React (Icons)
- **Backend Environment**: Node.js, Express, TypeScript
- **Database Architecture**: SQLite (Dev) / PostgreSQL (Prod Ready) via Prisma ORM
- **API Communication**: RESTful JSON APIs

---

## 📂 Project Architecture

```text
erp-d2c-system/
├── admin/                     # Main Frontend Monolith (React + Vite)
│   ├── src/
│   │   ├── components/        # Reusable UI elements & layouts (Sidebar, etc.)
│   │   ├── context/           # React Context (Auth, RBAC)
│   │   ├── pages/             # 25+ distinct views (Finance, Logistics, AI Hub, Portals)
│   │   └── App.tsx            # Master router & RBAC gatekeeper
├── api/                       # Backend Express API
│   ├── prisma/
│   │   └── schema.prisma      # Massive 1300+ line Database Schema (Source of Truth)
│   ├── src/
│   │   ├── routes/            # Distinct Express routers per module
│   │   └── index.ts           # Server entry point
```

---

## ⚙️ Local Setup & Installation

### 1. Prerequisites
- Node.js (v18+)
- npm or yarn

### 2. Backend Initialization
```bash
cd api
npm install

# Push the schema to the database
npx prisma db push

# Generate the Prisma Client
npx prisma generate

# Start the development server (runs on port 5000)
npm run dev
```

### 3. Frontend Initialization
Open a new terminal window:
```bash
cd admin
npm install

# Start the Vite development server (runs on port 5173)
npm run dev
```

### 4. Accessing the System
Navigate to `http://localhost:5173/admin/` in your browser. 
*(Note: To view the mobile apps, use your browser's responsive design mode targeting a mobile device size.)*

---

## 🔒 Security & RBAC

The system employs a strict Role-Based Access Control (RBAC) model at the `App.tsx` and `Sidebar.tsx` levels.
Users are classified by distinct roles (e.g., System Admin, HR Manager, Customer, Vendor), and the system dynamically filters API routes and UI components based on precise permission flags.

---

*Engineered with precision for absolute supply chain dominance.*
