import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Pause, CheckSquare, Clock, Map, Navigation2, FileText, CheckCircle } from 'lucide-react';

export default function TripExecutionWorkspace() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState<any>(null);
  const [timeline, setTimeline] = useState<any[]>([]);

  const fetchTrip = async () => {
    try {
      const [tRes, lRes] = await Promise.all([
        fetch('/api/road/planning/trips'),
        fetch(`/api/road/dispatch/${id}/timeline`)
      ]);
      if (tRes.ok) {
        const trips = await tRes.json();
        setTrip(trips.find((t: any) => t.id === id));
      }
      if (lRes.ok) setTimeline(await lRes.json());
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => { if (id) fetchTrip(); }, [id]);

  const updateStatus = async (action: string, status: string) => {
    try {
      await fetch(`/api/road/dispatch/${id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, status, location: 'GPS Coords', remarks: `Trip ${action}` })
      });
      fetchTrip();
    } catch (e) { console.error(e); }
  };

  if (!trip) return <div className="p-8 font-bold text-gray-500">Loading trip workspace...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto h-[calc(100vh-4rem)] flex flex-col space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100 shrink-0">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Workspace: {trip.tripNumber}</h1>
          <div className="flex space-x-4 mt-2 text-sm font-bold text-gray-500">
            <span>Driver: {trip.driver?.name}</span>
            <span>Vehicle: {trip.vehicle?.registrationNo}</span>
            <span className="text-indigo-600">Status: {trip.status}</span>
          </div>
        </div>
        <div className="flex space-x-3">
          {trip.status !== 'In-Transit' && trip.status !== 'Completed' && (
            <button onClick={() => updateStatus('START', 'In-Transit')} className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center hover:bg-emerald-700">
              <Play size={18} className="mr-2" /> Start Trip
            </button>
          )}
          {trip.status === 'In-Transit' && (
            <button onClick={() => updateStatus('PAUSE', 'Paused')} className="bg-amber-500 text-white px-5 py-2.5 rounded-xl font-bold flex items-center hover:bg-amber-600">
              <Pause size={18} className="mr-2" /> Pause Trip
            </button>
          )}
          {trip.status === 'Paused' && (
            <button onClick={() => updateStatus('RESUME', 'In-Transit')} className="bg-sky-500 text-white px-5 py-2.5 rounded-xl font-bold flex items-center hover:bg-sky-600">
              <Play size={18} className="mr-2" /> Resume Trip
            </button>
          )}
          {trip.status === 'In-Transit' && (
            <button onClick={() => updateStatus('COMPLETE', 'Completed')} className="bg-gray-800 text-white px-5 py-2.5 rounded-xl font-bold flex items-center hover:bg-gray-900">
              <CheckCircle size={18} className="mr-2" /> Complete Trip
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-6 flex-1 min-h-0">
        <div className="w-1/3 flex flex-col space-y-6 overflow-hidden">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col flex-1">
            <h2 className="p-6 font-bold text-gray-900 border-b border-gray-100 flex items-center">
              <Clock size={18} className="mr-2 text-indigo-500" /> Execution Timeline
            </h2>
            <div className="flex-1 overflow-y-auto p-6 relative">
              <div className="absolute left-[39px] top-6 bottom-6 w-0.5 bg-gray-100"></div>
              <div className="space-y-6 relative">
                {timeline.map((log: any) => (
                  <div key={log.id} className="flex gap-4 relative">
                    <div className="w-4 h-4 rounded-full border-4 border-white shadow-sm shrink-0 z-10 mt-1 bg-indigo-500"></div>
                    <div>
                      <p className="font-bold text-gray-900">{log.action}</p>
                      <p className="text-xs font-bold text-gray-400">{new Date(log.timestamp).toLocaleString()}</p>
                      <p className="text-sm text-gray-500 mt-1">{log.remarks}</p>
                    </div>
                  </div>
                ))}
                {timeline.length === 0 && <p className="text-gray-400 text-sm font-medium italic pl-10">No execution logs yet.</p>}
              </div>
            </div>
          </div>
        </div>

        <div className="w-2/3 flex flex-col space-y-6 overflow-hidden">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col h-1/2">
             <h2 className="p-6 font-bold text-gray-900 border-b border-gray-100 flex items-center">
               <Navigation2 size={18} className="mr-2 text-indigo-500" /> GPS Telemetry Map
             </h2>
             <div className="flex-1 bg-gray-50 m-6 rounded-xl border border-gray-200 flex items-center justify-center">
               <Map size={48} className="text-gray-300 mb-2" />
               <span className="text-gray-400 font-bold ml-4">Live Telemetry Map Overlay</span>
             </div>
          </div>
          
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col h-1/2">
             <h2 className="p-6 font-bold text-gray-900 border-b border-gray-100 flex items-center justify-between">
               <div className="flex items-center"><CheckSquare size={18} className="mr-2 text-indigo-500" /> Cargo & Stops Progress</div>
               <button className="text-xs bg-indigo-50 text-indigo-600 font-bold px-3 py-1 rounded">Scan Barcode</button>
             </h2>
             <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {trip.stops?.map((s: any, idx: number) => (
                  <div key={s.id} className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex justify-between items-center">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs font-black uppercase tracking-wider ${s.type === 'Pickup' ? 'text-emerald-600' : 'text-rose-600'}`}>{s.type}</span>
                        <span className="text-gray-300">•</span>
                        <span className="font-bold text-gray-900">{s.locationName}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{s.booking?.bookingNumber} - {s.booking?.totalGrossWeight}kg</p>
                    </div>
                    <div>
                      <span className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-600">{s.status}</span>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
