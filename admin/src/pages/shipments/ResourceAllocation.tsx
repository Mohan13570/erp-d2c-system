import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { 
  Users, Save, RefreshCw, Truck, Map, ShieldCheck, 
  Warehouse, CalendarClock, CheckCircle, XCircle, AlertTriangle, Play
} from 'lucide-react';

export default function ResourceAllocation() {
  const { id } = useParams();
  const [isSaving, setIsSaving] = useState(false);
  const [isDispatching, setIsDispatching] = useState(false);

  // Initialize massive form state
  const { register, watch, handleSubmit } = useForm({
    defaultValues: {
      vehicle: '',
      driver: '',
      originWarehouse: '',
      destWarehouse: '',
      container: '',
      route: '',
      dispatchTime: ''
    }
  });

  const formValues = watch();

  // Dynamic Validation Logic
  const validations = {
    isVehicleValid: !!formValues.vehicle,
    isDriverValid: !!formValues.driver,
    isWarehouseValid: !!formValues.originWarehouse && !!formValues.destWarehouse,
    isContainerValid: !!formValues.container,
    isRouteValid: !!formValues.route,
  };

  const isFullyValidated = Object.values(validations).every(v => v === true);

  const onSubmit = async (data: any) => {
    setIsSaving(true);
    // Simulate Save
    setTimeout(() => {
      setIsSaving(false);
      alert('Resource Allocations saved successfully!');
    }, 1000);
  };

  const onDispatch = async () => {
    setIsDispatching(true);
    // Simulate Dispatch
    setTimeout(() => {
      setIsDispatching(false);
      alert('Shipment Dispatched Successfully! Status locked.');
    }, 1500);
  };

  return (
    <div className="h-screen flex flex-col bg-[#F8FAFC] overflow-hidden">
      
      {/* 1. STICKY HEADER */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 h-16 shrink-0 px-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Resource Allocation</h1>
          </div>
          <div className="h-6 w-px bg-slate-200 mx-2"></div>
          <div>
            <span className="text-2xl font-black text-blue-700 tracking-tighter">TRK-90218-444</span>
            <span className="ml-3 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 uppercase tracking-widest">Pending Allocation</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={handleSubmit(onSubmit)} className="flex items-center gap-2 px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 font-semibold text-sm transition-colors shadow-sm">
            {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} 
            Save Allocation
          </button>
          <div className="w-px h-6 bg-slate-200 mx-1"></div>
          <button 
            disabled={!isFullyValidated || isDispatching}
            onClick={onDispatch} 
            className={`flex items-center gap-2 px-6 py-2 text-white rounded-lg font-bold text-sm transition-all shadow-sm
              \${isFullyValidated ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200 shadow-lg' : 'bg-slate-300 cursor-not-allowed'}`}
          >
            {isDispatching ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />} 
            GENERATE DISPATCH ORDER
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        
        {/* 2. MAIN CONTENT SCROLLABLE */}
        <main className="flex-1 overflow-y-auto p-6 scroll-smooth bg-[#F8FAFC]">
          <form className="max-w-4xl mx-auto space-y-6 pb-20">

            {/* SECTION 1: SHIPMENT OVERVIEW */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">Shipment Context</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
                <div><p className="text-slate-500 mb-1">Customer</p><p className="font-bold text-slate-900">Acme Corp Ltd</p></div>
                <div><p className="text-slate-500 mb-1">Transport Mode</p><p className="font-bold text-slate-900">Road Freight</p></div>
                <div><p className="text-slate-500 mb-1">Origin</p><p className="font-bold text-slate-900">New York (WH-01)</p></div>
                <div><p className="text-slate-500 mb-1">Destination</p><p className="font-bold text-slate-900">Chicago (WH-02)</p></div>
              </div>
            </section>

            {/* SECTION 2: WAREHOUSE ASSIGNMENT */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 border-l-4 border-l-blue-500">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 mb-6">
                <Warehouse className="w-5 h-5 text-blue-600" /> Warehouse Assignment
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Origin Warehouse <span className="text-red-500">*</span></label>
                  <select {...register('originWarehouse')} className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm font-medium">
                    <option value="">Select Origin...</option>
                    <option value="WH-NY-01">WH-NY-01 (New York Main)</option>
                    <option value="WH-NJ-02">WH-NJ-02 (New Jersey Overflow)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Destination Warehouse <span className="text-red-500">*</span></label>
                  <select {...register('destWarehouse')} className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm font-medium">
                    <option value="">Select Destination...</option>
                    <option value="WH-CHI-01">WH-CHI-01 (Chicago Central)</option>
                    <option value="WH-IL-03">WH-IL-03 (Illinois Distribution)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Warehouse Zone / Bay</label>
                  <input type="text" placeholder="e.g. Zone A, Bay 4" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Warehouse Instructions</label>
                  <input type="text" placeholder="Special loading instructions..." className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" />
                </div>
              </div>
            </section>

            {/* SECTION 3: VEHICLE ASSIGNMENT */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 border-l-4 border-l-indigo-500">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 mb-6">
                <Truck className="w-5 h-5 text-indigo-600" /> Vehicle Assignment
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Assign Vehicle <span className="text-red-500">*</span></label>
                  <select {...register('vehicle')} className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm font-medium">
                    <option value="">Search Available Vehicles...</option>
                    <option value="V-001">V-001 (Volvo FH16 - 40T) - AVAILABLE</option>
                    <option value="V-002">V-002 (Scania R450 - 20T) - AVAILABLE</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Vehicle Owner / Fleet</label>
                  <input type="text" readOnly value={formValues.vehicle ? "Internal Fleet" : ""} className="w-full px-3 py-2 border border-slate-200 bg-slate-50 rounded-lg text-sm text-slate-500" />
                </div>
              </div>
            </section>

            {/* SECTION 4: DRIVER ASSIGNMENT */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 border-l-4 border-l-emerald-500">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 mb-6">
                <Users className="w-5 h-5 text-emerald-600" /> Driver Assignment
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Assign Primary Driver <span className="text-red-500">*</span></label>
                  <select {...register('driver')} className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm font-medium">
                    <option value="">Search Available Drivers...</option>
                    <option value="D-101">D-101 (John Smith) - Valid CDL</option>
                    <option value="D-102">D-102 (Sarah Connor) - Valid CDL</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number</label>
                  <input type="text" readOnly value={formValues.driver ? "+1 555-0192-333" : ""} className="w-full px-3 py-2 border border-slate-200 bg-slate-50 rounded-lg text-sm text-slate-500" />
                </div>
              </div>
            </section>

            {/* SECTION 5: CONTAINER ASSIGNMENT */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 border-l-4 border-l-orange-500">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 mb-6">
                <ShieldCheck className="w-5 h-5 text-orange-600" /> Container Assignment
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Assign Container <span className="text-red-500">*</span></label>
                  <select {...register('container')} className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm font-medium">
                    <option value="">Select Container...</option>
                    <option value="MSKU1234567">MSKU1234567 (40ft HC)</option>
                    <option value="CMAU9876543">CMAU9876543 (20ft STD)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Seal Number</label>
                  <input type="text" placeholder="Enter Seal ID" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" />
                </div>
              </div>
            </section>

            {/* SECTION 6: ROUTE ASSIGNMENT */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 border-l-4 border-l-purple-500">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 mb-6">
                <Map className="w-5 h-5 text-purple-600" /> Route Assignment
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Select Route Template <span className="text-red-500">*</span></label>
                  <select {...register('route')} className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm font-medium">
                    <option value="">Select Predefined Route...</option>
                    <option value="R-NY-CHI-01">R-NY-CHI-01 (I-80 W Express)</option>
                    <option value="R-NY-CHI-02">R-NY-CHI-02 (I-76 Toll Avoidance)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Traffic Priority</label>
                  <select className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm font-medium">
                    <option>Normal</option>
                    <option>High Priority</option>
                  </select>
                </div>
              </div>
            </section>

            {/* SECTION 8: DISPATCH PLANNING */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 mb-6">
                <CalendarClock className="w-5 h-5 text-slate-700" /> Dispatch Timeline
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Expected Dispatch Date & Time</label>
                  <input type="datetime-local" {...register('dispatchTime')} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Loading Window</label>
                  <div className="flex items-center gap-2">
                    <input type="time" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
                    <span>to</span>
                    <input type="time" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
                  </div>
                </div>
              </div>
            </section>

          </form>
        </main>

        {/* 3. STICKY RIGHT SIDEBAR */}
        <aside className="w-96 bg-white border-l border-slate-200 shrink-0 overflow-y-auto shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.02)]">
          <div className="p-6">
            
            <h3 className="font-black text-slate-900 mb-4 uppercase tracking-wider text-xs">Resource Validation Status</h3>
            
            {/* SECTION 9: RESOURCE VALIDATION STATUS BOARD */}
            <div className="space-y-3 mb-8 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Warehouse className="w-4 h-4" /> Warehouse
                </span>
                {validations.isWarehouseValid ? <CheckCircle className="w-5 h-5 text-emerald-500" /> : <XCircle className="w-5 h-5 text-red-400" />}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Truck className="w-4 h-4" /> Vehicle
                </span>
                {validations.isVehicleValid ? <CheckCircle className="w-5 h-5 text-emerald-500" /> : <XCircle className="w-5 h-5 text-red-400" />}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Users className="w-4 h-4" /> Driver
                </span>
                {validations.isDriverValid ? <CheckCircle className="w-5 h-5 text-emerald-500" /> : <XCircle className="w-5 h-5 text-red-400" />}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" /> Container
                </span>
                {validations.isContainerValid ? <CheckCircle className="w-5 h-5 text-emerald-500" /> : <XCircle className="w-5 h-5 text-red-400" />}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Map className="w-4 h-4" /> Route
                </span>
                {validations.isRouteValid ? <CheckCircle className="w-5 h-5 text-emerald-500" /> : <XCircle className="w-5 h-5 text-red-400" />}
              </div>
            </div>

            {/* STATUS SUMMARY */}
            {isFullyValidated ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-2 text-emerald-800 font-bold mb-1">
                  <CheckCircle className="w-5 h-5" /> ALL CLEAR FOR DISPATCH
                </div>
                <p className="text-xs text-emerald-600 font-medium">All mandatory resources have been validated and assigned.</p>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-2 text-red-800 font-bold mb-1">
                  <AlertTriangle className="w-5 h-5" /> VALIDATION FAILED
                </div>
                <p className="text-xs text-red-600 font-medium">Please assign all required resources (indicated by red crosses) before dispatching.</p>
              </div>
            )}

            {/* SECTION 10: SPECIAL REQUIREMENTS (READ-ONLY) */}
            <h3 className="font-black text-slate-900 mb-4 uppercase tracking-wider text-xs">Cargo Requirements</h3>
            <div className="bg-amber-50 rounded-xl p-4 border border-amber-100 mb-6">
              <ul className="space-y-2 text-xs font-bold text-amber-800">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div> Dangerous Goods (DG)</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div> Temperature Control: 2°C to 8°C</li>
              </ul>
              <p className="text-[10px] text-amber-600 mt-3 font-medium">Ensure assigned vehicle supports these requirements.</p>
            </div>

            <button 
              disabled={!isFullyValidated || isDispatching}
              onClick={onDispatch} 
              className={`w-full font-black py-4 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 text-white
                \${isFullyValidated ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200' : 'bg-slate-300 cursor-not-allowed text-slate-500 shadow-none'}`}
            >
              {isDispatching ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />} 
              GENERATE DISPATCH ORDER
            </button>

          </div>
        </aside>
      </div>
    </div>
  );
}
