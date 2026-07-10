import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import SalesOrders from './pages/SalesOrders';
import HR from './pages/HR';
import Finance from './pages/Finance';
import SupplyChain from './pages/SupplyChain';
import Manufacturing from './pages/Manufacturing';
import CustomerDashboard from './pages/customer/CustomerDashboard';
import CustomerList from './pages/customer/CustomerList';
import CustomerProfileView from './pages/customer/CustomerProfileView';
import CustomerRegistrationWizard from './pages/customer/CustomerRegistrationWizard';

// Customer Logistics Portal
import CustomerLogisticsDashboard from './pages/customer/logistics/BookingDashboard';
import CustomerBookingWizard from './pages/customer/logistics/BookingWizard';
import CustomerRFQDashboard from './pages/customer/logistics/RFQDashboard';
import CustomerQuotationComparison from './pages/customer/logistics/QuotationComparison';
import Projects from './pages/Projects';
import Assets from './pages/Assets';
import Returns from './pages/Returns';
import Login from './pages/Login';
import CRM from './pages/CRM';
import Marketing from './pages/Marketing';
import Analytics from './pages/Analytics';
import RBAC from './pages/RBAC';
import CompanyStock from './pages/CompanyStock';
import EmployeeAccess from './pages/EmployeeAccess';
import Fleet from './pages/Fleet';
import ShipmentDashboard from './pages/shipments/ShipmentDashboard';
import ShipmentList from './pages/shipments/ShipmentList';
import CreateShipmentWizard from './pages/shipments/CreateShipmentWizard';
import ShipmentDetail from './pages/shipments/ShipmentDetail';
import CompanyManagement from './pages/CompanyManagement';
import Quotations from './pages/Quotations';
import OceanFreight from './pages/OceanFreight';
import AirFreight from './pages/AirFreight';

// New Organization Enterprise Routing
import CompanyMaster from './pages/company/CompanyMaster';
import OrganizationChart from './pages/company/OrganizationChart';

// New User & Employee Routing
import UserDashboard from './pages/users/UserDashboard';
import EmployeeProfile from './pages/users/EmployeeProfile';

// New Security & RBAC Routing
import SecurityDashboard from './pages/security/SecurityDashboard';
import RoleManagement from './pages/security/RoleManagement';

// New Workflow & Approval Routing
import WorkflowDashboard from './pages/workflow/WorkflowDashboard';
import WorkflowBuilder from './pages/workflow/WorkflowBuilder';
import ApprovalInbox from './pages/workflow/ApprovalInbox';

// New Notification & Communication Hub Routing
import NotificationDashboard from './pages/notifications/NotificationDashboard';
import TemplateBuilder from './pages/notifications/TemplateBuilder';
import Announcements from './pages/notifications/Announcements';

// New Master Data Management (MDM) Routing
import MDMDashboard from './pages/mdm/MDMDashboard';
import MasterDataGrid from './pages/mdm/MasterDataGrid';

// New System Admin Routing
import SystemDashboard from './pages/admin/SystemDashboard';
import LogsViewer from './pages/admin/LogsViewer';

// Enterprise Integration & AI
import IntegrationDashboard from './pages/integration/IntegrationDashboard';
import APIGateway from './pages/integration/APIGateway';
import AIDashboard from './pages/ai/AIDashboard';
import PromptLibrary from './pages/ai/PromptLibrary';

// Vendor Portal
import VendorList from './pages/vendor/VendorList';
import VendorRegistrationWizard from './pages/vendor/VendorRegistrationWizard';
import VendorDashboard from './pages/vendor/VendorDashboard';
import VendorProcurementDashboard from './pages/vendor/VendorProcurementDashboard';
import VendorRFQList from './pages/vendor/VendorRFQList';
import VendorPOView from './pages/vendor/VendorPOView';
import VendorLogisticsDashboard from './pages/vendor/VendorLogisticsDashboard';
import VendorASNList from './pages/vendor/VendorASNList';
import VendorDockBooking from './pages/vendor/VendorDockBooking';
import VendorFinanceDashboard from './pages/vendor/VendorFinanceDashboard';
import VendorInvoiceList from './pages/vendor/VendorInvoiceList';
import VendorLedgerView from './pages/vendor/VendorLedgerView';
import VendorSupportCenter from './pages/vendor/VendorSupportCenter';
import VendorChat from './pages/vendor/VendorChat';
import VendorPerformance from './pages/vendor/VendorPerformance';
import VendorKnowledgeBase from './pages/vendor/VendorKnowledgeBase';

import Warehouse from './pages/Warehouse';
import Customs from './pages/Customs';
import DocumentCenter from './pages/DocumentCenter';
import ContainerMgmt from './pages/ContainerMgmt';
import Procurement from './pages/Procurement';
import Billing from './pages/Billing';
import Insurance from './pages/Insurance';
import Tracking from './pages/Tracking';
import CustomerPortal from './pages/CustomerPortal';
import VendorPortal from './pages/VendorPortal';
import EmployeePortal from './pages/EmployeePortal';
import BIDashboard from './pages/BIDashboard';
import AIHub from './pages/AIHub';
import DriverApp from './pages/mobile/DriverApp';
import WarehouseApp from './pages/mobile/WarehouseApp';
import GPSDashboard from './pages/gps/GPSDashboard';
import VehicleDashboard from './pages/vehicles/VehicleDashboard';
import VehicleList from './pages/vehicles/VehicleList';
import VehicleRegistration from './pages/vehicles/VehicleRegistration';
import VehicleDetail from './pages/vehicles/VehicleDetail';
import DriverDashboard from './pages/drivers/DriverDashboard';
import DriverList from './pages/drivers/DriverList';
import DriverRegistration from './pages/drivers/DriverRegistration';
import DriverProfile from './pages/drivers/DriverProfile';
import GPSDeviceList from './pages/gps/GPSDeviceList';
import GPSDeviceDetail from './pages/gps/GPSDeviceDetail';
import AdvancedLiveMap from './pages/maps/AdvancedLiveMap';
import TripDashboard from './pages/trips/TripDashboard';
import TripList from './pages/trips/TripList';
import TripWizard from './pages/trips/TripWizard';
import TripDetail from './pages/trips/TripDetail';
import GeofenceMapEditor from './pages/geofences/GeofenceMapEditor';
import RoutePlanner from './pages/routes/RoutePlanner';
import AlertDashboard from './pages/alerts/AlertDashboard';
import BIReports from './pages/reports/BIReports';
import BookingDashboard from './pages/ocean/BookingDashboard';
import CreateBookingWizard from './pages/ocean/CreateBookingWizard';
import AirBookingDashboard from './pages/air/BookingDashboard';
import CreateAirBookingWizard from './pages/air/CreateBookingWizard';
import AirShipmentDetail from './pages/air/ShipmentDetail';
import CargoAcceptanceDock from './pages/air/operations/CargoAcceptanceDock';
import ULDBuildup from './pages/air/operations/ULDBuildup';
import AircraftLoadPlan from './pages/air/operations/AircraftLoadPlan';
import RampOperations from './pages/air/operations/RampOperations';
import CostingDashboard from './pages/air/finance/CostingDashboard';
import ShipmentProfitability from './pages/air/finance/ShipmentProfitability';
import CustomsClearanceDesk from './pages/air/customs/CustomsClearanceDesk';
import AirFreightHub from './pages/air/AirFreightHub';
import TrackingDashboard from './pages/air/tracking/TrackingDashboard';
import AnalyticsDashboard from './pages/air/analytics/AnalyticsDashboard';
import RoadTransportHub from './pages/road/RoadTransportHub';
import RoadBookingWizard from './pages/road/RoadBookingWizard';
import TripPlanner from './pages/road/TripPlanner';
import DispatchConsole from './pages/road/DispatchConsole';
import TripExecutionWorkspace from './pages/road/TripExecutionWorkspace';
import VehicleOpsDashboard from './pages/road/VehicleOpsDashboard';
import DriverOpsDashboard from './pages/road/DriverOpsDashboard';
import RoadBillingDashboard from './pages/road/RoadBillingDashboard';
import RoadClaimsDesk from './pages/road/RoadClaimsDesk';
import RoadAnalytics from './pages/road/RoadAnalytics';
import RoadExecutiveDashboard from './pages/road/RoadExecutiveDashboard';
import FleetAssetManager from './pages/maintenance/FleetAssetManager';
import PreventiveMaintenanceCalendar from './pages/maintenance/PreventiveMaintenanceCalendar';
import WorkshopDashboard from './pages/maintenance/WorkshopDashboard';
import InspectionDesk from './pages/maintenance/InspectionDesk';
import MaintenanceExecutiveDashboard from './pages/maintenance-ops/MaintenanceExecutiveDashboard';
import PartsInventory from './pages/maintenance-ops/PartsInventory';
import FuelAndTyreDesk from './pages/maintenance-ops/FuelAndTyreDesk';
import ComplianceAndVendorHub from './pages/maintenance-ops/ComplianceAndVendorHub';
import ContainerMasterDesk from './pages/containers/ContainerMasterDesk';
import ContainerLifecycleTracker from './pages/containers/ContainerLifecycleTracker';
import ContainerAllocationHub from './pages/containers/ContainerAllocationHub';
import ContainerExecutiveDashboard from './pages/containers/ContainerExecutiveDashboard';
import YardManagementConsole from './pages/container-ops/YardManagementConsole';
import ContainerOperationsDesk from './pages/container-ops/ContainerOperationsDesk';
import CargoAndPortTerminal from './pages/container-ops/CargoAndPortTerminal';
import ContainerMovementHistory from './pages/container-ops/ContainerMovementHistory';
import LiveTrackingMap from './pages/container-tracking/LiveTrackingMap';
import ReeferTelemetryDashboard from './pages/container-tracking/ReeferTelemetryDashboard';
import HealthAndComplianceHub from './pages/container-tracking/HealthAndComplianceHub';
import RepairWorkshop from './pages/container-tracking/RepairWorkshop';
import ContainerFinanceExecutiveDashboard from './pages/container-finance/ContainerExecutiveDashboard';
import ContainerBillingHub from './pages/container-finance/ContainerBillingHub';
import ContainerAnalyticsDesk from './pages/container-finance/ContainerAnalyticsDesk';
import ContainerReportsEngine from './pages/container-finance/ContainerReportsEngine';
import BookingWorkspace from './pages/ocean/BookingWorkspace';
import YardDashboard from './pages/ocean/operations/YardDashboard';
import ContainerInventory from './pages/ocean/operations/ContainerInventory';
import GateOperations from './pages/ocean/operations/GateOperations';
import PortPlanning from './pages/ocean/operations/PortPlanning';
import BillingDashboard from './pages/ocean/finance/BillingDashboard';
import InvoiceManager from './pages/ocean/finance/InvoiceManager';
import ProfitabilityAnalysis from './pages/ocean/finance/ProfitabilityAnalysis';
import CustomsWorkspace from './pages/ocean/finance/CustomsWorkspace';
import ExecutiveDashboard from './pages/ocean/executive/ExecutiveDashboard';
import PerformanceAnalytics from './pages/ocean/executive/PerformanceAnalytics';
import OceanLiveTrackingMap from './pages/ocean/tracking/LiveTrackingMap';
import ShipmentTimeline from './pages/ocean/tracking/ShipmentTimeline';

// Procurement Module
import ProcurementHub from './pages/procurement/ProcurementHub';
import VendorMaster from './pages/procurement/VendorMaster';
import RFQDashboard from './pages/procurement/RFQDashboard';
import ContractManager from './pages/procurement/ContractManager';
import ApprovalQueue from './pages/procurement/ApprovalQueue';

// Purchasing Operations Module
import PurchaseDashboard from './pages/procurement/PurchaseDashboard';
import PRManager from './pages/procurement/PRManager';
import POControlCenter from './pages/procurement/POControlCenter';
import GoodsReceiptDesk from './pages/procurement/GoodsReceiptDesk';
import InvoiceMatcher from './pages/procurement/InvoiceMatcher';
import PurchaseReturns from './pages/procurement/PurchaseReturns';

// Procurement Finance Module
import ExecutiveDashboardProc from './pages/procurement/ExecutiveDashboard';
import VendorBilling from './pages/procurement/VendorBilling';
import PaymentManager from './pages/procurement/PaymentManager';
import BudgetManager from './pages/procurement/BudgetManager';
import SpendAnalytics from './pages/procurement/SpendAnalytics';

// WMS UI Module
import WarehouseMaster from './pages/warehouse/WarehouseMaster';
import SpatialManager from './pages/warehouse/SpatialManager';
import EquipmentManager from './pages/warehouse/EquipmentManager';
import WarehouseSettings from './pages/warehouse/WarehouseSettings';

// WMS Inbound Module
import InboundDashboard from './pages/warehouse/inbound/InboundDashboard';
import ASNManager from './pages/warehouse/inbound/ASNManager';
import GateEntry from './pages/warehouse/inbound/GateEntry';
import GRNWorkspace from './pages/warehouse/inbound/GRNWorkspace';
import PutAwayPlanner from './pages/warehouse/inbound/PutAwayPlanner';

// WMS Outbound Module
import OutboundDashboard from './pages/warehouse/outbound/OutboundDashboard';
import PickPlanner from './pages/warehouse/outbound/PickPlanner';
import PackingStation from './pages/warehouse/outbound/PackingStation';
import DispatchManager from './pages/warehouse/outbound/DispatchManager';

// WMS Analytics Module
import WMSExecutiveDashboard from './pages/warehouse/analytics/ExecutiveDashboard';
import WarehouseReports from './pages/warehouse/analytics/WarehouseReports';

// Enterprise Finance Module
import FinanceDashboard from './pages/finance/FinanceDashboard';
import ChartOfAccounts from './pages/finance/ChartOfAccounts';
import AccountsPayable from './pages/finance/AccountsPayable';
import AccountsReceivable from './pages/finance/AccountsReceivable';
import FinanceSettings from './pages/finance/FinanceSettings';
import GeneralLedger from './pages/finance/GeneralLedger';
import TrialBalance from './pages/finance/TrialBalance';
import BankReconciliation from './pages/finance/BankReconciliation';
import EnterpriseBilling from './pages/finance/EnterpriseBilling';
import TaxCompliance from './pages/finance/TaxCompliance';
import FinanceProfitabilityAnalysis from './pages/finance/ProfitabilityAnalysis';

// Advanced Inventory Module
import InventoryDashboard from './pages/inventory/InventoryDashboard';
import StockControl from './pages/inventory/StockControl';
import Traceability from './pages/inventory/Traceability';
import StockMovements from './pages/inventory/StockMovements';
import CycleCount from './pages/inventory/CycleCount';
import InventoryReports from './pages/inventory/InventoryReports';

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isInitializing } = useAuth();
  if (isInitializing) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#F8F9FA]">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function App() {
  return (
    <Router basename="/admin">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={
          <RequireAuth>
            <div className="flex h-screen bg-[#F8F9FA] text-gray-900 font-sans selection:bg-indigo-100">
              <Sidebar />
              <main className="flex-1 overflow-y-auto p-8">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/inventory" element={<Inventory />} />
                  <Route path="/orders" element={<SalesOrders />} />
                  <Route path="/hr" element={<HR />} />
                  <Route path="/finance" element={<Finance />} />
                  <Route path="/supply-chain" element={<SupplyChain />} />
                  <Route path="/manufacturing" element={<Manufacturing />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/assets" element={<Assets />} />
                  <Route path="/returns" element={<Returns />} />
                  <Route path="/crm" element={<CRM />} />
                  <Route path="/quotations" element={<Quotations />} />
                  {/* Logistics & Fleet */}
                  <Route path="/trips" element={<TripDashboard />} />
                  <Route path="/trips/list" element={<TripList />} />
                  <Route path="/trips/plan" element={<TripWizard />} />
                  <Route path="/trips/:id" element={<TripDetail />} />
                  <Route path="/gps" element={<AdvancedLiveMap />} />
                  <Route path="/gps/devices" element={<GPSDeviceList />} />
                  <Route path="/gps/devices/:id" element={<GPSDeviceDetail />} />
                  <Route path="/geofences" element={<GeofenceMapEditor />} />
                  <Route path="/routes/plan" element={<RoutePlanner />} />
                  <Route path="/alerts" element={<AlertDashboard />} />
                  <Route path="/reports/bi" element={<BIReports />} />
                  <Route path="/ocean/bookings" element={<BookingDashboard />} />
                  <Route path="/air/bookings" element={<AirBookingDashboard />} />
                  <Route path="/air/bookings/create" element={<CreateAirBookingWizard />} />
                  <Route path="/air/bookings/:id" element={<AirShipmentDetail />} />
                  <Route path="/air/operations/acceptance" element={<CargoAcceptanceDock />} />
                  <Route path="/air/operations/uld" element={<ULDBuildup />} />
                  <Route path="/air/operations/load-plan" element={<AircraftLoadPlan />} />
                  <Route path="/air/operations/ramp" element={<RampOperations />} />
                  <Route path="/air/finance" element={<CostingDashboard />} />
                  <Route path="/air/finance/profitability/:id" element={<ShipmentProfitability />} />
                  <Route path="/air/customs" element={<CustomsClearanceDesk />} />
                  <Route path="/air/hub" element={<AirFreightHub />} />
                  <Route path="/air/tracking" element={<TrackingDashboard />} />
                  <Route path="/air/analytics" element={<AnalyticsDashboard />} />
                  <Route path="/ocean/bookings/new" element={<CreateBookingWizard />} />
                  <Route path="/ocean/bookings/:id" element={<BookingWorkspace />} />
                  <Route path="/ocean/ops/yard" element={<YardDashboard />} />
                  <Route path="/ocean/ops/inventory" element={<ContainerInventory />} />
                  <Route path="/ocean/ops/gate" element={<GateOperations />} />
                  <Route path="/ocean/ops/planning" element={<PortPlanning />} />
                  <Route path="/ocean/finance/billing" element={<BillingDashboard />} />
                  <Route path="/ocean/finance/invoices/new" element={<InvoiceManager />} />
                  <Route path="/ocean/finance/profitability" element={<ProfitabilityAnalysis />} />
                  <Route path="/ocean/customs" element={<CustomsWorkspace />} />
                  <Route path="/ocean/executive/dashboard" element={<ExecutiveDashboard />} />
                  <Route path="/ocean/executive/performance" element={<PerformanceAnalytics />} />
                  <Route path="/ocean/tracking/map" element={<OceanLiveTrackingMap />} />
                  <Route path="/ocean/tracking/timeline" element={<ShipmentTimeline />} />
                  <Route path="/vehicles" element={<VehicleDashboard />} />
                  <Route path="/vehicles/list" element={<VehicleList />} />
                  <Route path="/vehicles/register" element={<VehicleRegistration />} />
                  <Route path="/vehicles/:id" element={<VehicleDetail />} />
                  <Route path="/drivers" element={<DriverDashboard />} />
                  <Route path="/drivers/list" element={<DriverList />} />
                  <Route path="/drivers/register" element={<DriverRegistration />} />
                  <Route path="/drivers/:id" element={<DriverProfile />} />
                  <Route path="/shipments" element={<ShipmentDashboard />} />
                  <Route path="/shipments/list" element={<ShipmentList />} />
                  <Route path="/shipments/create" element={<CreateShipmentWizard />} />
                  <Route path="/shipments/:id" element={<ShipmentDetail />} />
                  <Route path="/fleet" element={<Fleet />} />
                  <Route path="/ocean-freight" element={<OceanFreight />} />
                  <Route path="/air-freight" element={<Navigate to="/air/hub" replace />} />
                  <Route path="/road-transport" element={<Navigate to="/road/hub" replace />} />
                  <Route path="/road/hub" element={<RoadTransportHub />} />
                  <Route path="/road/bookings/new" element={<RoadBookingWizard />} />
                  <Route path="/road/planning" element={<TripPlanner />} />
                  <Route path="/road/dispatch" element={<DispatchConsole />} />
                  <Route path="/road/execution/:id" element={<TripExecutionWorkspace />} />
                  <Route path="/road/vehicle-ops" element={<VehicleOpsDashboard />} />
                  <Route path="/road/driver-ops" element={<DriverOpsDashboard />} />
                  <Route path="/road/billing" element={<RoadBillingDashboard />} />
                  <Route path="/road/claims" element={<RoadClaimsDesk />} />
                  <Route path="/road/analytics" element={<RoadAnalytics />} />
                  <Route path="/road/executive" element={<RoadExecutiveDashboard />} />
                  {/* <Route path="/fleet-management" element={<FleetManagement />} /> */}
                  <Route path="/maintenance/assets" element={<FleetAssetManager />} />
                  <Route path="/maintenance/preventive" element={<PreventiveMaintenanceCalendar />} />
                  <Route path="/maintenance/workshop" element={<WorkshopDashboard />} />
                  <Route path="/maintenance/inspections" element={<InspectionDesk />} />
                  
                  <Route path="/maintenance-ops/executive" element={<MaintenanceExecutiveDashboard />} />
                  <Route path="/maintenance-ops/inventory" element={<PartsInventory />} />
                  <Route path="/maintenance-ops/fuel-tyres" element={<FuelAndTyreDesk />} />
                  <Route path="/maintenance-ops/vendors" element={<ComplianceAndVendorHub />} />

                  <Route path="/containers/executive" element={<ContainerExecutiveDashboard />} />
                  <Route path="/containers/master" element={<ContainerMasterDesk />} />
                  <Route path="/containers/lifecycle" element={<ContainerLifecycleTracker />} />
                  <Route path="/containers/allocations" element={<ContainerAllocationHub />} />

                  <Route path="/container-ops/yard" element={<YardManagementConsole />} />
                  <Route path="/container-ops/desk" element={<ContainerOperationsDesk />} />
                  <Route path="/container-ops/cargo" element={<CargoAndPortTerminal />} />
                  <Route path="/container-ops/history" element={<ContainerMovementHistory />} />

                  <Route path="/container-tracking/map" element={<LiveTrackingMap />} />
                  <Route path="/container-tracking/reefer" element={<ReeferTelemetryDashboard />} />
                  <Route path="/container-tracking/compliance" element={<HealthAndComplianceHub />} />
                  <Route path="/container-tracking/repair" element={<RepairWorkshop />} />

                  <Route path="/container-finance/dashboard" element={<ContainerFinanceExecutiveDashboard />} />
                  <Route path="/container-finance/billing" element={<ContainerBillingHub />} />
                  <Route path="/container-finance/analytics" element={<ContainerAnalyticsDesk />} />
                  <Route path="/container-finance/reports" element={<ContainerReportsEngine />} />
          
          {/* Organization & Company Routes */}
          <Route path="company/master" element={<CompanyMaster />} />
          <Route path="company/organization-chart" element={<OrganizationChart />} />

          {/* User & Employee Routes */}
          <Route path="users/dashboard" element={<UserDashboard />} />
          <Route path="users/employee/:id" element={<EmployeeProfile />} />

          {/* Security & RBAC Routes */}
          <Route path="security/dashboard" element={<SecurityDashboard />} />
          <Route path="security/roles" element={<RoleManagement />} />

          {/* Workflow & Approval Routes */}
          <Route path="workflow/dashboard" element={<WorkflowDashboard />} />
          <Route path="workflow/builder" element={<WorkflowBuilder />} />
          <Route path="workflow/inbox" element={<ApprovalInbox />} />

          {/* Notification Hub Routes */}
          <Route path="notifications/dashboard" element={<NotificationDashboard />} />
          <Route path="notifications/templates" element={<TemplateBuilder />} />
          <Route path="notifications/announcements" element={<Announcements />} />

          {/* Master Data Management (MDM) Routes */}
          <Route path="mdm/dashboard" element={<MDMDashboard />} />
          <Route path="mdm/:entity" element={<MasterDataGrid />} />

          {/* System Admin Routes */}
          <Route path="admin/dashboard" element={<SystemDashboard />} />
          <Route path="admin/logs" element={<LogsViewer />} />

          {/* Integration & AI Routes */}
          <Route path="integration/dashboard" element={<IntegrationDashboard />} />
          <Route path="integration/gateway" element={<APIGateway />} />
          <Route path="ai/dashboard" element={<AIDashboard />} />
          <Route path="ai/prompts" element={<PromptLibrary />} />

          {/* Vendor Portal Routes */}
          <Route path="vendor/list" element={<VendorList />} />
          <Route path="vendor/registration" element={<VendorRegistrationWizard />} />
          <Route path="vendor/portal" element={<VendorDashboard />} />
          <Route path="vendor/procurement" element={<VendorProcurementDashboard />} />
          <Route path="vendor/rfqs" element={<VendorRFQList />} />
          <Route path="vendor/pos" element={<VendorPOView />} />
          <Route path="vendor/logistics" element={<VendorLogisticsDashboard />} />
          <Route path="vendor/asns" element={<VendorASNList />} />
          <Route path="vendor/docks" element={<VendorDockBooking />} />
          <Route path="vendor/finance" element={<VendorFinanceDashboard />} />
          <Route path="vendor/invoices" element={<VendorInvoiceList />} />
          <Route path="vendor/ledger" element={<VendorLedgerView />} />
          
          <Route path="vendor/support" element={<VendorSupportCenter />} />
          <Route path="vendor/chat" element={<VendorChat />} />
          <Route path="vendor/performance" element={<VendorPerformance />} />
          <Route path="vendor/knowledge-base" element={<VendorKnowledgeBase />} />

          {/* CRM & Sales */}
          <Route path="/customer/dashboard" element={<CustomerDashboard />} />
          <Route path="/customer/directory" element={<CustomerList />} />
          <Route path="/customer/:id" element={<CustomerProfileView />} />
          <Route path="/customer/register" element={<CustomerRegistrationWizard />} />
          
          {/* Customer Logistics Portal */}
          <Route path="/customer/logistics" element={<CustomerLogisticsDashboard />} />
          <Route path="/customer/logistics/booking/new" element={<CustomerBookingWizard />} />
          <Route path="/customer/logistics/rfqs" element={<CustomerRFQDashboard />} />
          <Route path="/customer/logistics/quotations/compare/:id" element={<CustomerQuotationComparison />} />

          {/* Logistics & TMS */}    <Route path="/customs" element={<Customs />} />
                  <Route path="/documents" element={<DocumentCenter />} />
                  <Route path="/containers" element={<ContainerMgmt />} />
                  
                  {/* Procurement & Sourcing Module */}
                  <Route path="/procurement/hub" element={<ProcurementHub />} />
                  <Route path="/procurement/vendors" element={<VendorMaster />} />
                  <Route path="/procurement/rfq" element={<RFQDashboard />} />
                  <Route path="/procurement/contracts" element={<ContractManager />} />
                  <Route path="/procurement/approvals" element={<ApprovalQueue />} />

                  {/* Purchasing Operations Module */}
                  <Route path="/purchasing/dashboard" element={<PurchaseDashboard />} />
                  <Route path="/purchasing/pr" element={<PRManager />} />
                  <Route path="/purchasing/po" element={<POControlCenter />} />
                  <Route path="/purchasing/grn" element={<GoodsReceiptDesk />} />
                  <Route path="/purchasing/invoices" element={<InvoiceMatcher />} />
                  <Route path="/purchasing/returns" element={<PurchaseReturns />} />

                  {/* Procurement Finance Module */}
                  <Route path="/finance/executive-dashboard" element={<ExecutiveDashboardProc />} />
                  <Route path="/finance/analytics" element={<SpendAnalytics />} />
                  <Route path="/finance/bills" element={<VendorBilling />} />
                  <Route path="/finance/payments" element={<PaymentManager />} />
                  <Route path="/finance/budgets" element={<BudgetManager />} />

                  {/* Warehouse Management Module */}
                  <Route path="/warehouse/master" element={<WarehouseMaster />} />
                  <Route path="/warehouse/spatial" element={<SpatialManager />} />
                  <Route path="/warehouse/equipment" element={<EquipmentManager />} />
                  <Route path="/warehouse/settings" element={<WarehouseSettings />} />

                  {/* Warehouse Inbound Module */}
                  <Route path="/warehouse/inbound/dashboard" element={<InboundDashboard />} />
                  <Route path="/warehouse/inbound/asn" element={<ASNManager />} />
                  <Route path="/warehouse/inbound/gate-entry" element={<GateEntry />} />
                  <Route path="/warehouse/inbound/grn" element={<GRNWorkspace />} />
                  <Route path="/warehouse/inbound/put-away" element={<PutAwayPlanner />} />

                  {/* Warehouse Outbound Module */}
                  <Route path="/warehouse/outbound/dashboard" element={<OutboundDashboard />} />
                  <Route path="/warehouse/outbound/picking" element={<PickPlanner />} />
                  <Route path="/warehouse/outbound/packing" element={<PackingStation />} />
                  <Route path="/warehouse/outbound/dispatch" element={<DispatchManager />} />

                  {/* Warehouse Analytics Module */}
                  <Route path="/warehouse/analytics/dashboard" element={<WMSExecutiveDashboard />} />
                  <Route path="/warehouse/analytics/reports" element={<WarehouseReports />} />

                  {/* Enterprise Finance Module */}
                  <Route path="/finance/dashboard" element={<FinanceDashboard />} />
                  <Route path="/finance/coa" element={<ChartOfAccounts />} />
                  <Route path="/finance/gl" element={<GeneralLedger />} />
                  <Route path="/finance/trial-balance" element={<TrialBalance />} />
                  <Route path="/finance/bank-reconciliation" element={<BankReconciliation />} />
                  <Route path="/finance/billing" element={<EnterpriseBilling />} />
                  <Route path="/finance/tax" element={<TaxCompliance />} />
                  <Route path="/finance/profitability" element={<FinanceProfitabilityAnalysis />} />
                  <Route path="/finance/ap" element={<AccountsPayable />} />
                  <Route path="/finance/ar" element={<AccountsReceivable />} />
                  <Route path="/finance/settings" element={<FinanceSettings />} />

                  {/* Procurement Module */}
                  <Route path="/inventory/dashboard" element={<InventoryDashboard />} />
                  <Route path="/inventory/stock-control" element={<StockControl />} />
                  <Route path="/inventory/traceability" element={<Traceability />} />
                  <Route path="/inventory/movements" element={<StockMovements />} />
                  <Route path="/inventory/cycle-counts" element={<CycleCount />} />
                  <Route path="/inventory/reports" element={<InventoryReports />} />

                  <Route path="/billing" element={<Billing />} />
                  <Route path="/tracking" element={<Tracking />} />

                  {/* Portals */}
                  <Route path="/customer-portal" element={<CustomerPortal />} />
                  <Route path="/vendor-portal" element={<VendorPortal />} />
                  <Route path="/hr-portal" element={<EmployeePortal />} />

                  {/* BI & AI */}
                  <Route path="/bi-dashboard" element={<BIDashboard />} />
                  <Route path="/ai-hub" element={<AIHub />} />

                  {/* Mobile Apps */}
                  <Route path="/mobile/driver" element={<DriverApp />} />
                  <Route path="/mobile/warehouse" element={<WarehouseApp />} />

                  <Route path="/marketing" element={<Marketing />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/rbac" element={<RBAC />} />
                  <Route path="/access" element={<EmployeeAccess />} />
                  <Route path="/stock" element={<CompanyStock />} />
                  <Route path="/company-management" element={<CompanyManagement />} />
                </Routes>
              </main>
            </div>
          </RequireAuth>
        } />
      </Routes>
    </Router>
  );
}

export default App;
