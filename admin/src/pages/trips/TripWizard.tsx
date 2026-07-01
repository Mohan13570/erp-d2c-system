import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Route, Truck, DollarSign, Plus, Trash2, MapPin } from 'lucide-react';

export default function TripWizard() {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
     origin: '',
     destination: '',
     vehicleId: '',
     driverId: '',
     totalDistanceKm: '',
     estimatedHours: '',
     revenue: ''
  });
  
  const [stops, setStops] = useState([{ type: 'Pickup', locationName: '', sequence: 1 }]);

  useEffect(() => {
     fetch('/api/vehicles').then(r => r.json()).then(setVehicles);
     fetch('/api/drivers').then(r => r.json()).then(setDrivers);
  }, []);

  const addStop = () => setStops([...stops, { type: 'Delivery', locationName: '', sequence: stops.length + 1 }]);
  const removeStop = (idx: number) => setStops(stops.filter((_, i) => i !== idx));
  const updateStop = (idx: number, field: string, val: string) => {
     const n = [...stops];
     n[idx] = { ...n[idx], [field]: val };
     setStops(n);
  };

  const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     const payload = {
        ...formData,
        totalDistanceKm: parseFloat(formData.totalDistanceKm) || 0,
        estimatedHours: parseFloat(formData.estimatedHours) || 0,
        revenue: parseFloat(formData.revenue) || 0,
        stops
     };
     
     const res = await fetch('/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
     });
     
     if (res.ok) navigate('/trips');
     else alert('Failed to create trip');
  };

  return (
    <div className="p-8 max-w-4xl mx-auto h-[calc(100vh-4rem)] flex flex-col">
       <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate('/trips')} className="p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50"><ArrowLeft size={16}/></button>
          <div>
             <h1 className="text-3xl font-black text-gray-900 tracking-tight">Plan New Trip</h1>
             <p className="text-gray-500 font-medium mt-1">Configure routing, assets, and multi-stop waypoints.</p>
          </div>
       </div>
       
       <form onSubmit={handleSubmit} className="flex-1 overflow-auto bg-white rounded-3xl shadow-sm border border-gray-100 p-8 space-y-8">
          
          <div className="space-y-4">
             <h3 className="font-bold text-lg border-b pb-2 flex items-center gap-2"><Route className="text-indigo-500"/> Core Route Details</h3>
             <div className="grid grid-cols-2 gap-6">
                <div>
                   <label className="block text-sm font-bold text-gray-700 mb-2">Origin</label>
                   <input required type="text" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-indigo-500" value={formData.origin} onChange={e => setFormData({...formData, origin: e.target.value})} placeholder="e.g. Warehouse A"/>
                </div>
                <div>
                   <label className="block text-sm font-bold text-gray-700 mb-2">Destination</label>
                   <input required type="text" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-indigo-500" value={formData.destination} onChange={e => setFormData({...formData, destination: e.target.value})} placeholder="e.g. Distribution Center B"/>
                </div>
                <div>
                   <label className="block text-sm font-bold text-gray-700 mb-2">Total Distance (km)</label>
                   <input type="number" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-indigo-500" value={formData.totalDistanceKm} onChange={e => setFormData({...formData, totalDistanceKm: e.target.value})} />
                </div>
                <div>
                   <label className="block text-sm font-bold text-gray-700 mb-2">Estimated Time (Hours)</label>
                   <input type="number" step="0.1" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-indigo-500" value={formData.estimatedHours} onChange={e => setFormData({...formData, estimatedHours: e.target.value})} />
                </div>
             </div>
          </div>

          <div className="space-y-4">
             <div className="flex justify-between items-end border-b pb-2">
                <h3 className="font-bold text-lg flex items-center gap-2"><MapPin className="text-orange-500"/> Waypoints & Stops</h3>
                <button type="button" onClick={addStop} className="text-indigo-600 font-bold text-sm flex items-center gap-1 hover:text-indigo-800"><Plus size={16}/> Add Stop</button>
             </div>
             <div className="space-y-3">
                {stops.map((stop, idx) => (
                   <div key={idx} className="flex gap-4 items-center bg-gray-50 p-3 rounded-xl border border-gray-200">
                      <span className="font-black text-gray-400 w-6 text-right">{idx+1}.</span>
                      <select className="p-2 border border-gray-300 rounded-lg outline-none bg-white font-bold" value={stop.type} onChange={e => updateStop(idx, 'type', e.target.value)}>
                         <option>Pickup</option>
                         <option>Delivery</option>
                      </select>
                      <input required type="text" className="flex-1 p-2 border border-gray-300 rounded-lg outline-none focus:border-indigo-500" placeholder="Location name..." value={stop.locationName} onChange={e => updateStop(idx, 'locationName', e.target.value)} />
                      {idx > 0 && <button type="button" onClick={() => removeStop(idx)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={18}/></button>}
                   </div>
                ))}
             </div>
          </div>

          <div className="space-y-4">
             <h3 className="font-bold text-lg border-b pb-2 flex items-center gap-2"><Truck className="text-emerald-500"/> Asset Assignment</h3>
             <div className="grid grid-cols-2 gap-6">
                <div>
                   <label className="block text-sm font-bold text-gray-700 mb-2">Assign Vehicle</label>
                   <select required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-indigo-500" value={formData.vehicleId} onChange={e => setFormData({...formData, vehicleId: e.target.value})}>
                      <option value="">Select Vehicle...</option>
                      {vehicles.map(v => <option key={v.id} value={v.id}>{v.plateNumber} ({v.type})</option>)}
                   </select>
                </div>
                <div>
                   <label className="block text-sm font-bold text-gray-700 mb-2">Assign Driver</label>
                   <select required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-indigo-500" value={formData.driverId} onChange={e => setFormData({...formData, driverId: e.target.value})}>
                      <option value="">Select Driver...</option>
                      {drivers.map(d => <option key={d.id} value={d.id}>{d.firstName} {d.lastName}</option>)}
                   </select>
                </div>
             </div>
          </div>

          <div className="space-y-4">
             <h3 className="font-bold text-lg border-b pb-2 flex items-center gap-2"><DollarSign className="text-blue-500"/> Financials</h3>
             <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Contracted Revenue ($)</label>
                <input required type="number" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-indigo-500 text-lg font-bold text-emerald-700" value={formData.revenue} onChange={e => setFormData({...formData, revenue: e.target.value})} placeholder="0.00" />
             </div>
          </div>

          <div className="pt-6 border-t">
             <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-xl font-black text-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
                Dispatch & Create Trip
             </button>
          </div>
       </form>
    </div>
  );
}
