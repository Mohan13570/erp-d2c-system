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
import Shipments from './pages/Shipments';
import CompanyManagement from './pages/CompanyManagement';
import Quotations from './pages/Quotations';
import OceanFreight from './pages/OceanFreight';
import AirFreight from './pages/AirFreight';
import RoadTransport from './pages/RoadTransport';
import FleetManagement from './pages/FleetManagement';
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
import Reports from './pages/Reports';
import ForecastDashboard from './pages/ForecastDashboard';
import NotificationsDashboard from './pages/NotificationsDashboard';

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

function RequirePermission({ children, module }: { children: React.ReactNode; module: string }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'System Admin' || user.role === 'Admin' || user.role === 'Administrator') {
    return <>{children}</>;
  }
  const hasPermission = user.permissions?.includes(module) || user.permissions?.includes('All Modules');
  if (!hasPermission) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-black text-slate-800">Access Denied</h2>
        <p className="text-slate-500 font-semibold mt-2">You do not have permission to access the {module} module.</p>
      </div>
    );
  }
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
                  <Route path="/inventory" element={<RequirePermission module="Inventory"><Inventory /></RequirePermission>} />
                  <Route path="/orders" element={<RequirePermission module="Sales Orders"><SalesOrders /></RequirePermission>} />
                  <Route path="/hr" element={<HR />} />
                  <Route path="/finance" element={<Finance />} />
                  <Route path="/supply-chain" element={<SupplyChain />} />
                  <Route path="/manufacturing" element={<Manufacturing />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/assets" element={<Assets />} />
                  <Route path="/returns" element={<Returns />} />
                  <Route path="/crm" element={<CRM />} />
                  <Route path="/quotations" element={<Quotations />} />
                  <Route path="/shipments" element={<Shipments />} />
                  <Route path="/fleet" element={<Fleet />} />
                  <Route path="/ocean-freight" element={<OceanFreight />} />
                  <Route path="/air-freight" element={<AirFreight />} />
                  <Route path="/road-transport" element={<RoadTransport />} />
                  <Route path="/fleet-management" element={<FleetManagement />} />
                  <Route path="/warehouse" element={<Warehouse />} />
                  <Route path="/customs" element={<Customs />} />
                  <Route path="/documents" element={<DocumentCenter />} />
                  <Route path="/containers" element={<ContainerMgmt />} />
                  <Route path="/procurement" element={<Procurement />} />
                  <Route path="/billing" element={<Billing />} />
                  <Route path="/insurance" element={<Insurance />} />
                  <Route path="/tracking" element={<Tracking />} />
                  <Route path="/reports" element={<Reports />} />

                  {/* Portals */}
                  <Route path="/customer-portal" element={<CustomerPortal />} />
                  <Route path="/vendor-portal" element={<VendorPortal />} />
                  <Route path="/hr-portal" element={<EmployeePortal />} />

                  {/* BI & AI */}
                  <Route path="/bi-dashboard" element={<BIDashboard />} />
                  <Route path="/ai-hub" element={<AIHub />} />
                  <Route path="/ai-forecast" element={<ForecastDashboard />} />
                  <Route path="/ai-notifications" element={<NotificationsDashboard />} />

                  {/* Mobile Apps */}
                  <Route path="/mobile/driver" element={<DriverApp />} />
                  <Route path="/mobile/warehouse" element={<WarehouseApp />} />

                  <Route path="/marketing" element={<Marketing />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/rbac" element={<RequirePermission module="Auth & RBAC"><RBAC /></RequirePermission>} />
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
