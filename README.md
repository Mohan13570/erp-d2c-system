# Comprehensive ERP & Logistics System

An enterprise-grade, end-to-end ERP system built with **React (Vite), Tailwind CSS, ShadCN UI** on the frontend, and **Node.js, Express, Prisma, PostgreSQL/SQLite** on the backend.

## 🚀 Features Highlights

### 1. Core ERP
- **Sales & CRM**: Order tracking, quotations, customer portals.
- **Procurement & Warehouse**: Inventory, gating, document center.
- **HR & Finance**: Billing, accounts payable/receivable, margins.

### 2. Fleet & Live GPS Engine
- **Vehicle & Driver Master**: Compliance, health, shifts.
- **Live Telematics**: WebSocket-powered GIS mapping and heartbeat tracking.
- **Geofence Studio**: Polygon restricted zones and automatic transit violation alerts.

### 3. Global Ocean Freight Forwarding
- **Maritime Master Data**: Vessels, Ports, Terminals, Shipping Lines.
- **Booking Workflows**: Advanced NVOCC freight routing (FCL, LCL, Hazmat, Reefer).
- **Yard & Port Operations**: Gate-in/Gate-out scanning, crane assignment, container inventory.
- **Customs & Finance**: Bills of Entry, Duty calculators, AR/AP margin analytics.
- **Executive BI**: High-level C-Suite KPI aggregators and carrier performance profiling.

## 💻 Tech Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS, Recharts, Leaflet, Vite
- **Backend**: Node.js, Express, Socket.io
- **Database**: Prisma ORM (SQLite for Dev, easily portable to PostgreSQL)

## 🛠️ Quick Start

### 1. Install Dependencies
```bash
# In the root directory (install both admin and api dependencies)
cd api && npm install
cd ../admin && npm install
```

### 2. Database Setup
```bash
cd api
npx prisma db push
npx prisma generate
```

### 3. Start Development Servers
You will need two terminal windows:

**Terminal 1 (Backend API & WebSockets)**
```bash
cd api
npm run dev
# Runs on http://localhost:5000
```

**Terminal 2 (Frontend Admin UI)**
```bash
cd admin
npm run dev
# Runs on http://localhost:5173
```

## 🔐 Default Access
- **Email**: `admin@company.com`
- **Password**: `admin123`
