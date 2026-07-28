import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Network, Activity, Clock, Map, QrCode, Route as RouteIcon, TrendingUp, Package, ExternalLink
} from 'lucide-react';

export default function ShipmentTrackingHub() {
  const { id } = useParams();
  const shipmentId = id || 'TRK-90218-444';
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 p-8 flex flex-col">
      
      {/* Header */}
      <div className="flex justify-between items-start mb-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">Phase 6.10 Integration</span>
            <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">Active Status</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Network className="w-8 h-8 text-indigo-600" /> Tracking & Monitoring Hub
          </h1>
          <p className="text-slate-500 mt-2 text-lg">Centralized command center for Shipment <span className="font-mono text-slate-900 font-bold bg-slate-200 px-2 py-0.5 rounded">{shipmentId}</span></p>
        </div>
        
        <button onClick={() => window.open(\`/tracking?ref=\${shipmentId}\`, '_blank')} className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors">
          <ExternalLink className="w-4 h-4" /> Open Public Portal
        </button>
      </div>

      {/* Grid of connected Tracking Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 flex-1">
        
        {/* Phase 6.1 */}
        <div onClick={() => navigate(\`/admin/shipments/\${shipmentId}/tracking\`)} className="bg-white rounded-3xl p-8 shadow-sm border-2 border-slate-200 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group">
          <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Activity className="w-7 h-7 text-blue-600" />
          </div>
          <h2 className="text-xl font-black text-slate-900 mb-2">Tracking Dashboard</h2>
          <p className="text-slate-500 text-sm font-medium">View high-level KPIs, shipment context, and executive operational overviews.</p>
        </div>

        {/* Phase 6.2 */}
        <div onClick={() => navigate(\`/admin/shipments/\${shipmentId}/timeline\`)} className="bg-white rounded-3xl p-8 shadow-sm border-2 border-slate-200 hover:border-amber-500 hover:shadow-md transition-all cursor-pointer group">
          <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Clock className="w-7 h-7 text-amber-600" />
          </div>
          <h2 className="text-xl font-black text-slate-900 mb-2">Audit Timeline</h2>
          <p className="text-slate-500 text-sm font-medium">View the chronological audit ledger of all status updates, locations, and system remarks.</p>
        </div>

        {/* Phase 6.3 & 6.5 */}
        <div onClick={() => navigate(\`/admin/shipments/\${shipmentId}/map\`)} className="bg-white rounded-3xl p-8 shadow-sm border-2 border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group">
          <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Map className="w-7 h-7 text-emerald-600" />
          </div>
          <h2 className="text-xl font-black text-slate-900 mb-2">Live GPS Tracking</h2>
          <p className="text-slate-500 text-sm font-medium">Monitor real-time vehicle telemetry, Socket.IO updates, and map polylines.</p>
        </div>

        {/* Phase 6.4 */}
        <div onClick={() => navigate(\`/admin/shipments/\${shipmentId}/route\`)} className="bg-white rounded-3xl p-8 shadow-sm border-2 border-slate-200 hover:border-indigo-500 hover:shadow-md transition-all cursor-pointer group">
          <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <RouteIcon className="w-7 h-7 text-indigo-600" />
          </div>
          <h2 className="text-xl font-black text-slate-900 mb-2">Route Progress</h2>
          <p className="text-slate-500 text-sm font-medium">Calculate distance covered, remaining distance, ETA, and intermediate stops.</p>
        </div>

        {/* Phase 6.6 */}
        <div onClick={() => navigate(\`/admin/shipments/\${shipmentId}/labels\`)} className="bg-white rounded-3xl p-8 shadow-sm border-2 border-slate-200 hover:border-purple-500 hover:shadow-md transition-all cursor-pointer group">
          <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <QrCode className="w-7 h-7 text-purple-600" />
          </div>
          <h2 className="text-xl font-black text-slate-900 mb-2">QR & Barcode Labels</h2>
          <p className="text-slate-500 text-sm font-medium">Generate, download, and print 2D/1D barcodes for physical cargo attachment.</p>
        </div>

        {/* Phase 6.9 */}
        <div onClick={() => navigate(\`/admin/shipments/analytics\`)} className="bg-white rounded-3xl p-8 shadow-sm border-2 border-slate-200 hover:border-rose-500 hover:shadow-md transition-all cursor-pointer group">
          <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <TrendingUp className="w-7 h-7 text-rose-600" />
          </div>
          <h2 className="text-xl font-black text-slate-900 mb-2">Tracking Analytics</h2>
          <p className="text-slate-500 text-sm font-medium">Analyze delivery success rates, transit times, delays, and driver performance matrices.</p>
        </div>

      </div>

    </div>
  );
}
