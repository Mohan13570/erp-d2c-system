import React, { useState, useEffect } from 'react';
import { Crosshair, AlertCircle, BrainCircuit, Navigation, Info } from 'lucide-react';

export default function LiveTrackingMap() {
  const [geoData, setGeoData] = useState<any>(null);
  const [aiRoute, setAiRoute] = useState<any>(null);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    fetch('/api/ocean/tracking/map-data')
      .then(res => res.json())
      .then(data => setGeoData(data));
  }, []);

  const runRouteOptimization = async () => {
    setAiLoading(true);
    try {
      const res = await fetch('/api/ai/optimize-route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ origin: 'CNHKG', destination: 'NLRTM' })
      });
      const data = await res.json();
      setAiRoute(data.optimization);
    } catch (e) {
      console.error(e);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-theme(spacing.16))] w-full relative bg-blue-50 flex flex-col">
       <div className="absolute top-6 left-6 z-10 bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-gray-100 w-96 flex flex-col gap-6 max-h-[90vh] overflow-y-auto">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-2">
              <Crosshair className="text-indigo-600" /> Global Live Map
            </h1>
            <p className="text-gray-500 text-sm mb-4">Real-time geospatial tracking of Vessels and Containers.</p>
            
            <div className="space-y-4">
               <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-center justify-between">
                  <span className="font-semibold text-indigo-900">Active Vessels</span>
                  <span className="text-indigo-600 font-bold">{geoData?.features.length || 0}</span>
               </div>
               <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 flex items-center justify-between">
                  <span className="font-semibold text-orange-900 flex items-center gap-1"><AlertCircle size={16}/> Weather Alerts</span>
                  <span className="text-orange-600 font-bold">2</span>
               </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
              <BrainCircuit className="text-purple-600" /> AI Logistics Brain
            </h2>
            <button 
              onClick={runRouteOptimization} 
              disabled={aiLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-3 rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-70">
              {aiLoading ? <span className="animate-pulse">Optimizing Trajectories...</span> : <><Navigation size={18}/> Calculate Optimal Route</>}
            </button>

            {aiRoute && (
              <div className="mt-4 bg-purple-50 rounded-xl p-4 border border-purple-100 space-y-3">
                <div className="flex justify-between items-center text-sm font-bold text-purple-900">
                   <span>{aiRoute.origin}</span> <span className="text-purple-400">→</span> <span>{aiRoute.destination}</span>
                </div>
                <div className="text-xs text-purple-700 font-medium">Confidence: {aiRoute.aiConfidence * 100}%</div>
                <div className="text-sm font-semibold text-gray-900">ETA: {new Date(aiRoute.predictedETA).toLocaleDateString()}</div>
                <div className="flex items-center text-xs text-emerald-600 font-bold"><Info size={14} className="mr-1"/> Fuel Savings: {aiRoute.estimatedFuelSavings}</div>
                <div className="text-xs text-gray-500 italic mt-2 border-t border-purple-200 pt-2">{aiRoute.weatherImpact}</div>
              </div>
            )}
          </div>
       </div>

       {/* Map Placeholder */}
       <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-8 max-w-md bg-white rounded-3xl shadow-lg border border-gray-100">
             <Crosshair size={48} className="mx-auto text-indigo-300 mb-4" />
             <h2 className="text-xl font-bold text-gray-900 mb-2">Map Engine Ready</h2>
             <p className="text-gray-500 text-sm">
                The GeoJSON data payload has been successfully fetched from the backend. 
                Install <code>react-leaflet</code> and <code>leaflet</code> to render the interactive OpenStreetMap tiles and plot the live vessel coordinates.
             </p>
             <div className="mt-6 bg-gray-900 text-green-400 p-4 rounded-xl text-left text-xs overflow-auto h-32 font-mono">
                {JSON.stringify(geoData, null, 2)}
             </div>
          </div>
       </div>
    </div>
  );
}
