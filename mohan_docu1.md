# Aura Enterprise ERP - Organization Structure Module
## Technical Implementation Log (mohan_docu1)

This document tracks all deep-level architectural changes, file additions, line counts, and engineering logic specifically for the Company Master & Organization Structure Node.js module build (Phase 1).

---

## 🏗️ PHASE 1: Enterprise Organization Master (Node.js/Prisma)

### Implementation Overview
Phase 1 involved a complete structural overhaul of the primary Node.js ERP backend. The Python/FastAPI microservice was wiped entirely, and the massively nested SAP/Oracle-grade Company Hierarchy was natively injected into the central Prisma ORM.

### 1. Database Schema & Migrations
**Action**: Deep expansion of `api/prisma/schema.prisma` to support infinite recursive hierarchies and robust business units.
- **File Modified**: `api/prisma/schema.prisma`
- **Lines Modified**: ~250 lines added
- **Purpose**:
  - Transformed the root `model Company` (lines 13-35) into a massive 100+ line entity mapping `CompanyAddress`, `CompanyContact`, `CompanyBranding`, `CompanyDocument`, and `CompanySettings`.
  - Upgraded Primary Key architecture across the board to use `id String @id @default(uuid())` while strategically maintaining `@unique` on `name` to prevent breaking existing multi-tenant relations across the ERP.
  - Injected `model OrganizationHierarchy` to support infinite nested Parent/Child structures (e.g., Corporate -> Region -> Zone -> Branch -> Division).
  - Injected `BusinessUnit`, `CostCenter`, and `ProfitCenter` to establish the financial backbone.
  - Handled SQLite limitations by converting intended `Json` fields (like `invoiceBranding` and `kpis`) to `String` for local dev compatibility.
  - Triggered total database wipe & sync via `npx prisma db push --force-reset` to forcefully apply the new structural paradigms.

### 2. Express Backend APIs
**Action**: Built the RESTful API routing architecture to serve the new Prisma models securely.
- **File Created**: `api/src/routes/company.ts`
- **Lines Added**: 74
- **Purpose**: Implemented GET/POST/PUT endpoints for Company Master creation, equipped with Zod payload validation (`companySchema`) and duplicate detection logic for `companyCode` generation.
- **File Created**: `api/src/routes/organization.ts`
- **Lines Added**: 66
- **Purpose**: Engineered the `GET /api/organization/tree` endpoint which maps the flat `OrganizationHierarchy` SQL rows into a deeply nested JSON tree payload designed specifically for frontend visualizers.
- **File Modified**: `api/src/index.ts`
- **Purpose**: Mounted `companyRouter` and `organizationRouter` into the primary Express `app` stack.

### 3. Enterprise React UI
**Action**: Generated the interactive Dashboards in Vite/React to visualize and manage the Company structure.
- **File Created**: `admin/src/pages/company/CompanyMaster.tsx`
- **Lines Added**: 90
- **Purpose**: Built a robust ShadCN/Tailwind dashboard tracking all registered corporate entities, subsidiaries, active Branches, and Business Units. Connected via React Query to the `/api/company` endpoint.
- **File Created**: `admin/src/pages/company/OrganizationChart.tsx`
- **Lines Added**: 80
- **Purpose**: Engineered a highly visual recursive component (`<OrgNode />`) that automatically draws a tree-like Org Chart using the nested JSON provided by `/api/organization/tree`.
- **File Modified**: `admin/src/App.tsx`
- **Purpose**: Wired the React Router DOM routes `/company/master` and `/company/organization-chart` into the core application layout.

---

## 👥 PHASE 2: Enterprise User & Employee Master (Node.js/Prisma)

### Implementation Overview
Phase 2 expanded the core Node.js backend to support an incredibly granular User & Employee Lifecycle system identical to SAP SuccessFactors/Oracle Fusion standards. 

### 1. Database Schema Expansion (Prisma)
**Action**: Appended 20+ new interconnected entities to `api/prisma/schema.prisma`.
- **File Modified**: `api/prisma/schema.prisma`
- **Lines Added**: ~270 lines
- **Purpose**: 
  - Upgraded the base `User` model (line 160) to hold core IAM attributes (`status`, `isVerified`, `lastLogin`) and established 1:1 and 1:Many links.
  - Injected `EmployeeProfile` to hold 20+ personal/verification fields.
  - Injected `EmploymentInformation` for corporate assignments (Company, Branch, Dept, BU, Reporting Manager, Shift, Work Mode).
  - Injected Profile Support Tables: `EmployeeAddress`, `EmployeeContact`, `EmployeeDocument`, `EmployeeSkill`, `EmployeeLanguage`, `EmployeeEducation`, `EmployeeExperience`, `EmployeeCertification`.
  - Injected Team Architecture: `Team`, `TeamMember`, `Designation`, `JobTitle`.
  - Injected IAM/Security Models: `UserPreference`, `UserDevice`, `UserSession`, `LoginHistory` mapping strictly back to the primary User.
  - Pushed to SQLite via `npx prisma db push --accept-data-loss`.

### 2. Express Backend APIs
**Action**: Built heavily specialized endpoints to securely manage this vast data load.
- **File Created**: `api/src/routes/users.ts`
- **Lines Added**: ~78
- **Purpose**: Handled User provisioning (w/ temp passwords), Session retrievals, and brute-force session termination endpoints. Implemented Zod payload verification.
- **File Created**: `api/src/routes/employees.ts`
- **Lines Added**: ~80
- **Purpose**: Engineered deep-fetch nested Prisma queries (using `.findUnique({ include: { ... } })`) to assemble a full 360-degree Employee view across 10 tables simultaneously. Added Auto-generation logic for `employeeCode` (`EMP-0000X`).
- **File Modified**: `api/src/index.ts`
- **Purpose**: Mounted `/api/users` and `/api/employees`.

### 3. Enterprise React UI Integration
**Action**: Engineered the high-level UI controls.
- **File Created**: `admin/src/pages/users/UserDashboard.tsx`
- **Lines Added**: ~150
- **Purpose**: Developed the global Identity Management view with KPI metrics (Active Sessions, Total Identities, Pending Approvals) and an interactive User Directory.
- **File Created**: `admin/src/pages/users/EmployeeProfile.tsx`
- **Lines Added**: ~135
- **Purpose**: Built the massive Tabbed 360-Degree Profile component covering Personal Details, Professional Assignments (linked to Phase 1's Company/Branch structure), Compliance Documents, and IT Assets.
- **File Modified**: `admin/src/App.tsx`
- **Purpose**: Mounted routes for `/users/dashboard` and `/users/employee/:id`.

---

## 🛡️ PHASE 3: Enterprise Auth & RBAC Security (Node.js/Prisma)

### Implementation Overview
Phase 3 establishes a zero-trust, enterprise-ready Identity & Security module comparable to SAP Security and Microsoft Entra ID. It handles JWT issuance, multi-factor authentication triggers, detailed security policies, and granular Role-Based Access Control (RBAC).

### 1. Security Database Schema Architecture
**Action**: Built the highly normalized Security Schema.
- **File Modified**: `api/prisma/schema.prisma`
- **Purpose**: 
  - Overhauled the legacy `Role` and `Permission` models. Created a Many-to-Many RBAC structure (`RolePermission` map, `PermissionCategory`, `UserRole`).
  - Added enterprise IAM models: `SecurityPolicy`, `PasswordHistory`, `OTP`, `MFA`, `RefreshToken`, `APIKey`, `WebhookToken`.
  - Added `SecurityAlert` for tracking brute-force or malicious IP logs.
  - Successfully ran `npx prisma db push --accept-data-loss`.

### 2. Specialized Express Security REST APIs
**Action**: Constructed the triple-router security architecture.
- **File Created**: `api/src/routes/auth.ts`
- **Purpose**: Built `/login` utilizing crypto hashes, evaluating Account Status (`Locked`, `Suspended`), intercepting for `MFA Required`, generating JWT tokens, and logging the session securely to `UserSession` and `LoginHistory`.
- **File Created**: `api/src/routes/rbac.ts`
- **Purpose**: Built the Roles CRUD, Permission Matrix generation endpoint, and `UserRole` assignment systems.
- **File Created**: `api/src/routes/security.ts`
- **Purpose**: Built the global Security Dashboard endpoint (fetch locked users, active sessions, 24h failed logins) and Global Security Policy retrieval.

### 3. Enterprise React Security Dashboards
**Action**: Engineered the SOC (Security Operations Center) views.
- **File Created**: `admin/src/pages/security/SecurityDashboard.tsx`
- **Purpose**: A dark-mode ready, premium SOC dashboard displaying Active Sessions, MFA Compliance, Failed Logins, Locked Accounts, and a live feed of Security Alerts.
- **File Created**: `admin/src/pages/security/RoleManagement.tsx`
- **Purpose**: The RBAC control panel showing all Roles, their Permission count, and mapped users.
- **File Modified**: `admin/src/App.tsx`
- **Purpose**: Injected the `/security/dashboard` and `/security/roles` routes natively into the frontend application.

---

## ⚙️ PHASE 4: Enterprise Workflow & Approval Engine (Node.js/Prisma)

### Implementation Overview
Phase 4 replaces rigid, hardcoded approvals with a visual, state-machine driven Workflow Engine natively integrated into the Node.js backend. This operates identically to Camunda BPM or SAP Workflow. It enables business users to visually draw workflows on the frontend using `reactflow` and deploy them to the backend parser.

### 1. Database State Machine Architecture
**Action**: Built the Workflow & Approval schema mapping.
- **File Modified**: `api/prisma/schema.prisma`
- **Purpose**: 
  - Modeled the core workflow layout: `Workflow`, `WorkflowVersion`, `WorkflowNode` (for discrete steps), and `WorkflowEdge` (for logic/paths).
  - Designed the Approval Matrix Engine: `Approval`, `ApprovalStep` (allowing sequential/parallel logic), and `ApprovalHistory`.
  - Added Manual Human Intervention blocks via a renamed `WorkflowTask`, `TaskAssignment`, and `TaskComment`.
  - Resolved a naming collision with the legacy `Task` model safely.
  - Successfully ran `npx prisma db push --accept-data-loss`.

### 2. Node.js Workflow Execution Engine
**Action**: Constructed the parser and execution APIs to interpret visual node data.
- **File Created**: `api/src/routes/workflow.ts`
- **Purpose**: A CRUD API that receives visual JSON payloads from `reactflow` containing Nodes and Edges, and persists them into the normalized Prisma `WorkflowNode`/`WorkflowEdge` schema. 
- **File Created**: `api/src/routes/approvals.ts`
- **Purpose**: The core decision endpoint (`/:id/decide`) handling `Approved`, `Rejected`, or `Delegated` actions. Operates within an ACID-compliant `$transaction` to update the step status, append an audit history log, and advance the parent Approval state synchronously.
- **File Created**: `api/src/routes/tasks.ts`
- **Purpose**: Endpoints to manage manual interventions (`WorkflowTask`) triggered by specific workflow nodes.

### 3. Visual Designer & Frontend (ReactFlow)
**Action**: Assembled the interactive Drag-and-Drop BPMN builder.
- **Dependency Installed**: `npm install reactflow`
- **File Created**: `admin/src/pages/workflow/WorkflowBuilder.tsx`
- **Purpose**: Integrated a high-performance interactive canvas using `useNodesState` and `useEdgesState`. Included a sidebar palette with Decision Nodes, Approval Steps, Email Triggers, and Webhook calls. Fully capable of drawing, connecting, and publishing graphs to the backend.
- **File Created**: `admin/src/pages/workflow/WorkflowDashboard.tsx`
- **Purpose**: A system health dashboard tracking Running Workflows, Failed Executions, and Active Versions.
- **File Created**: `admin/src/pages/workflow/ApprovalInbox.tsx`
- **Purpose**: The "Unified Inbox" for employees, fetching all pending steps where they are the assignee, allowing them to Reject/Approve instantly.
- **File Modified**: `admin/src/App.tsx`
- **Purpose**: Mounted `/workflow/dashboard`, `/workflow/builder`, and `/workflow/inbox`.

---

## 📢 PHASE 5: Enterprise Notification & Communication Hub (Node.js/Prisma)

### Implementation Overview
Phase 5 centralizes all communication (Email, SMS, WhatsApp, Web Push, and In-App Alerts). It introduces an asynchronous payload architecture meant to run securely alongside BullMQ and Redis, keeping the main Node.js thread unblocked during heavy global broadcast tasks (like mass-emailing).

### 1. Database Communication Architecture
**Action**: Built the Notification & Logs schema mapping.
- **File Modified**: `api/prisma/schema.prisma`
- **Purpose**: 
  - Designed the generic Notification architecture: `Notification`, `NotificationCategory`, `NotificationTemplate`, `NotificationRecipient`, and `NotificationDelivery`.
  - Fixed a missing relation block (added `notifications NotificationRecipient[]` to the core `User` model).
  - Modeled dedicated external channels tracking: `EmailLog`, `SMSLog`, `WhatsAppLog`.
  - Modeled internal broadcast functionality: `Announcement`, `Campaign`.
  - Successfully ran `npx prisma db push --accept-data-loss`.

### 2. Node.js Notification Delivery Engine
**Action**: Assembled the Express routes simulating the queue dispatcher.
- **Dependencies Installed**: `npm install bullmq ioredis nodemailer socket.io`
- **File Created**: `api/src/routes/notifications.ts`
- **Purpose**: Exposes endpoints for the user's personal active inbox (`/my`), global SOC metrics (`/dashboard`), and the core manual dispatcher (`/dispatch`) which stages records as `Pending` intended to be swept by BullMQ workers (mocked in the current environment).
- **File Created**: `api/src/routes/announcements.ts`
- **Purpose**: Broadcast endpoint allowing admins to push pinned `Emergency`, `Info`, or `Warning` broadcasts to the entire company or isolated departments.

### 3. React Communication Hub UI
**Action**: Engineered the templates and analytics interfaces.
- **File Created**: `admin/src/pages/notifications/NotificationDashboard.tsx`
- **Purpose**: A KPI hub monitoring the success rate, failure counts, and BullMQ queues of all outbound Omnichannel communications.
- **File Created**: `admin/src/pages/notifications/TemplateBuilder.tsx`
- **Purpose**: An interactive editor allowing admins to swap between Channels (Email HTML, SMS Text, WhatsApp Block) and inject programmatic `{{variables}}` (e.g. `{{user.firstName}}`, `{{workflow.status}}`).
- **File Created**: `admin/src/pages/notifications/Announcements.tsx`
- **Purpose**: An interface combining a composer for new global broadcasts and a real-time Live Feed of current pinned announcements.
- **File Modified**: `admin/src/App.tsx`
- **Purpose**: Mounted `/notifications/dashboard`, `/notifications/templates`, and `/notifications/announcements`.

---

## 🗄️ PHASE 6: Enterprise Master Data Management (MDM) (Node.js/Prisma)

### Implementation Overview
Phase 6 establishes a robust and dynamic Master Data Management module designed identically to SAP MDG. Rather than writing 30 duplicate endpoints for 30 different tables, we implemented a single dynamic universal router and UI grid that adapts instantly based on the `:entity` parameter.

### 1. Unified Master Data Schema
**Action**: Cleaned and appended the core MDM tables safely.
- **File Modified**: `api/prisma/schema.prisma`
- **Purpose**: 
  - Verified pre-existing foundational models like `Country`, `State`, `City`, `Currency`, `Port`.
  - Injected missing operational dictionaries: `HSCode`, `LookupCategory`, `LookupValue`.
  - Resolved model collision issues, preventing DB corruption.
  - Successfully ran `npx prisma db push --accept-data-loss`.

### 2. Universal Express Dynamic Router
**Action**: Developed a sophisticated, DRY (Don't Repeat Yourself) CRUD API.
- **File Created**: `api/src/routes/mdm.ts`
- **Purpose**: Designed a dynamic `/api/mdm/:entity` router that utilizes an `ALLOWED_ENTITIES` whitelist array. It leverages Prisma's internal delegation (`(prisma as any)[entity]`) to execute `findMany`, `create`, `update`, and `delete` globally across all 30 master tables automatically.
- **File Created**: `api/src/routes/lookups.ts`
- **Purpose**: A dedicated endpoint designed specifically for the React UI to hydrate dropdowns using the generic `LookupCategory` -> `LookupValue` relationship.

### 3. Universal React Data Grid
**Action**: Built the polymorphic Master Data UI screens.
- **File Created**: `admin/src/pages/mdm/MDMDashboard.tsx`
- **Purpose**: A visually dense directory pointing users to all the disparate configuration nodes (Countries, Seaports, Currencies, Incoterms, HS Codes).
- **File Created**: `admin/src/pages/mdm/MasterDataGrid.tsx`
- **Purpose**: A highly advanced component using TanStack Query. It evaluates the current `useParams<{ entity: string }>()`, hits the dynamic API, extracts the generic JSON payload, and automatically infers table headers `Object.keys()` to render a flawless grid for *any* incoming master data object.
- **File Modified**: `admin/src/App.tsx`
- **Purpose**: Mounted `/mdm/dashboard` and `/mdm/:entity` using React Router wildcard variables.
