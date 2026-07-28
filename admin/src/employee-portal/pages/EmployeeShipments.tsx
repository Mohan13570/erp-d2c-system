import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEmployeeAuth } from '../context/EmployeeAuthContext';
import { employeePortalService } from '../services/employeeApi';
import {
  Ship, AlertTriangle, PackageCheck, DollarSign, Plus, Search, Filter,
  ChevronRight, Eye, X, CheckCircle2, Truck
} from 'lucide-react';

export default function EmployeeShipments() {
  const { user } = useEmployeeAuth();
  const navigate = useNavigate();

  const [shipments, setShipments] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [branch, setBranch] = useState('ALL');
  const [agent, setAgent] = useState('ALL');
  const [status, setStatus] = useState('ALL');
  const [search, setSearch] = useState('');
  const [showFiltersDrawer, setShowFiltersDrawer] = useState(false);

  // Booking Modal State
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [serviceType, setServiceType] = useState('FTL Express Cargo');
  const [cargoDetails, setCargoDetails] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [billedAmount, setBilledAmount] = useState('125000');
  const [internalCost, setInternalCost] = useState('85000');
  const [bookingLoading, setBookingLoading] = useState(false);

  const isFinancialRole = user?.role === 'manager' || user?.role === 'hr_admin';

  const fetchShipments = () => {
    setLoading(true);
    employeePortalService.getShipments({
      branch,
      agent,
      status,
      search,
      page,
      limit: 10
    })
      .then(res => {
        if (res.data.success) {
          setShipments(res.data.data.shipments);
          setTotalCount(res.data.data.totalCount);
          setTotalPages(res.data.data.totalPages);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchShipments();
  }, [branch, agent, status, page]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchShipments();
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingLoading(true);

    try {
      const res = await employeePortalService.createStaffBooking({
        customerName,
        customerEmail,
        customerPhone,
        origin,
        destination,
        serviceType,
        cargoDetails,
        specialInstructions,
        billedAmount,
        internalCost
      });
      setShowBookingModal(false);
      setCustomerName('');
      setOrigin('');
      setDestination('');
      setCargoDetails('');
      fetchShipments();
      alert(`Booking created successfully! Waybill: ${res.data.data.shipmentNumber}`);
    } catch (err: any) {
      alert(err.message || 'Failed to create booking');
    } finally {
      setBookingLoading(false);
    }
  };

  // KPI Calculations
  const activeCount = shipments.filter(s => s.status === 'IN_TRANSIT' || s.status === 'BOOKED' || s.status === 'PICKED_UP').length;
  const delayedCount = shipments.filter(s => s.status === 'CUSTOMS' || (s.exceptions && s.exceptions.length > 0)).length;
  const completedCount = shipments.filter(s => s.status === 'DELIVERED').length;
  const revenueYtd = shipments.reduce((sum, s) => sum + (s.billedAmount || 0), 0);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* ── Shipment Dashboard Title Bar (Exact Image 1 Header) ────────────── */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Shipment Dashboard
        </h1>
        <p className="text-xs text-slate-500 font-normal mt-0.5">
          Real-time overview of global logistics operations.
        </p>
      </div>

      {/* ── Top 4 KPI Stat Cards Row (Exact Image 1 Design) ───────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* ACTIVE SHIPMENTS */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">ACTIVE SHIPMENTS</span>
            <p className="text-3xl font-bold text-slate-900">{activeCount}</p>
          </div>
          <div className="p-3 rounded-full bg-blue-50 text-blue-600">
            <Ship size={22} />
          </div>
        </div>

        {/* DELAYED / ALERTS */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">DELAYED / ALERTS</span>
            <p className="text-3xl font-bold text-rose-600">{delayedCount}</p>
          </div>
          <div className="p-3 rounded-full bg-rose-50 text-rose-500">
            <AlertTriangle size={22} />
          </div>
        </div>

        {/* COMPLETED YTD */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">COMPLETED YTD</span>
            <p className="text-3xl font-bold text-emerald-600">{completedCount}</p>
          </div>
          <div className="p-3 rounded-full bg-emerald-50 text-emerald-600">
            <PackageCheck size={22} />
          </div>
        </div>

        {/* REVENUE YTD */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">REVENUE YTD</span>
            <p className="text-3xl font-extrabold text-indigo-600">
              ${(revenueYtd / 1000000).toFixed(1)}M
            </p>
          </div>
          <div className="p-3 rounded-full bg-indigo-50 text-indigo-600">
            <DollarSign size={22} />
          </div>
        </div>

      </div>

      {/* ── Main Section: All Shipments (Exact Image 2 Design) ─────────────── */}
      <div className="space-y-4">
        
        {/* Section Header & Create Shipment Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              All Shipments
            </h2>
            <p className="text-xs text-slate-500 font-normal mt-0.5">
              Manage and track your global logistics pipeline.
            </p>
          </div>

          <button
            onClick={() => setShowBookingModal(true)}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-500/20 transition-all self-start sm:self-auto"
          >
            <Plus size={16} /> Create Shipment
          </button>
        </div>

        {/* Main Shipment Table Card */}
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden space-y-0">
          
          {/* Toolbar: Search + Filter */}
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            
            <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-96">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by tracking number, consignee, or origin..."
                className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 font-medium"
              />
            </form>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                onClick={() => setShowFiltersDrawer(!showFiltersDrawer)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold text-xs transition-all"
              >
                <Filter size={14} />
                <span>Filters</span>
              </button>
            </div>
          </div>

          {/* Expandable Filter Options Drawer */}
          {showFiltersDrawer && (
            <div className="p-4 bg-slate-50/70 border-b border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 animate-in fade-in">
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Branch Hub</label>
                <select
                  value={branch}
                  onChange={e => { setBranch(e.target.value); setPage(1); }}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 font-semibold"
                >
                  <option value="ALL">All Branches</option>
                  <option value="Mumbai Central Hub">Mumbai Central Hub</option>
                  <option value="Pune Industrial Branch">Pune Industrial Branch</option>
                  <option value="Delhi NCR Hub">Delhi NCR Hub</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Status Stage</label>
                <select
                  value={status}
                  onChange={e => { setStatus(e.target.value); setPage(1); }}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 font-semibold"
                >
                  <option value="ALL">All Stages</option>
                  <option value="BOOKED">Booked</option>
                  <option value="PICKED_UP">Picked Up</option>
                  <option value="IN_TRANSIT">In Transit</option>
                  <option value="CUSTOMS">Customs Hold</option>
                  <option value="DELIVERED">Delivered</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={fetchShipments}
                  className="w-full py-1.5 bg-indigo-600 text-white font-bold text-xs rounded-lg hover:bg-indigo-700"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}

          {/* Table Element (Exact Image 2 Headers: TRACKING NUMBER, ROUTE, TYPE, STATUS, CUSTOMER, ACTIONS) */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50/70 text-slate-400 font-extrabold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-6">TRACKING NUMBER</th>
                  <th className="py-3.5 px-6">ROUTE</th>
                  <th className="py-3.5 px-6">TYPE</th>
                  <th className="py-3.5 px-6">STATUS</th>
                  <th className="py-3.5 px-6">CUSTOMER</th>
                  <th className="py-3.5 px-6 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {shipments.map((s, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-indigo-600">
                      {s.shipmentNumber}
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-900">
                      <div>{s.origin}</div>
                      <div className="text-slate-400 text-[10px]">➔ {s.destination}</div>
                    </td>
                    <td className="py-4 px-6 font-semibold text-slate-600">
                      {s.serviceType || 'Standard Freight'}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                        s.status === 'DELIVERED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        s.status === 'IN_TRANSIT' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        s.status === 'CUSTOMS' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                        'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-900">
                      {s.customerName}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => navigate(`/hr-portal/shipments/${s.id}`)}
                        className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold text-xs flex items-center gap-1 ml-auto"
                      >
                        <Eye size={13} /> View Detail
                      </button>
                    </td>
                  </tr>
                ))}
                
                {/* Empty State (Exact match to Image 2: "No shipments found. Create one to get started.") */}
                {shipments.length === 0 && !loading && (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-slate-400 font-semibold text-xs">
                      No shipments found. Create one to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Bar */}
          {shipments.length > 0 && (
            <div className="flex items-center justify-between p-4 border-t border-slate-100 text-xs font-semibold text-slate-500">
              <span>Page {page} of {totalPages}</span>
              <div className="flex gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage(page + 1)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* ── Create Shipment Booking Modal ─────────────────────────────────── */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-xl space-y-4 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Create New Freight Shipment</h3>
              <button onClick={() => setShowBookingModal(false)} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">Customer Name / Enterprise</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500 font-medium"
                  placeholder="e.g. Aura Consumer Tech Ltd"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase">Origin Address / Terminal</label>
                  <input
                    type="text"
                    value={origin}
                    onChange={e => setOrigin(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500 font-medium"
                    placeholder="e.g. JNPT Terminal 2, Mumbai"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase">Destination Hub / City</label>
                  <input
                    type="text"
                    value={destination}
                    onChange={e => setDestination(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500 font-medium"
                    placeholder="e.g. NCR Fulfillment, Delhi"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">Cargo Description &amp; Weight</label>
                <textarea
                  value={cargoDetails}
                  onChange={e => setCargoDetails(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500 font-medium"
                  placeholder="e.g. 2,400 kg · 4 Pallets Refrigerated Electronics"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="px-5 py-2 rounded-lg bg-indigo-600 text-white text-xs font-bold shadow-md shadow-indigo-600/20 hover:bg-indigo-700"
                >
                  {bookingLoading ? 'Creating...' : 'Generate Shipment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
