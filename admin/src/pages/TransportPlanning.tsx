import React, { useState } from 'react';
import { Route, MapPin, Truck, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function TransportPlanning() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    pickupLocation: '',
    deliveryLocation: '',
    vehicleReq: 'Standard Truck',
    priority: 'Medium',
    shipmentIds: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const payload = {
        ...formData,
        shipmentIds: formData.shipmentIds.split(',').map(s => s.trim()).filter(s => s)
      };

      const res = await fetch('/api/road/plans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error('Failed to create transport plan');
      }

      setSuccess(true);
      setFormData({
        pickupLocation: '',
        deliveryLocation: '',
        vehicleReq: 'Standard Truck',
        priority: 'Medium',
        shipmentIds: ''
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center">
            <Route className="mr-3 text-indigo-600"/> Transport Planning
          </h1>
          <p className="text-gray-500 font-medium mt-1">Create and manage upcoming transport plans.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Create New Transport Plan</h2>
        
        {success && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl font-medium">
            Transport plan created successfully!
          </div>
        )}
        
        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-700 rounded-xl font-medium flex items-center">
            <AlertTriangle className="mr-2" size={18}/> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center"><MapPin size={14} className="mr-1"/> Pickup Location</label>
              <input 
                required 
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="Warehouse A"
                value={formData.pickupLocation}
                onChange={e => setFormData({...formData, pickupLocation: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center"><MapPin size={14} className="mr-1"/> Delivery Location</label>
              <input 
                required 
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="Distribution Center B"
                value={formData.deliveryLocation}
                onChange={e => setFormData({...formData, deliveryLocation: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center"><Truck size={14} className="mr-1"/> Vehicle Requirement</label>
              <select 
                className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                value={formData.vehicleReq}
                onChange={e => setFormData({...formData, vehicleReq: e.target.value})}
              >
                <option value="Standard Truck">Standard Truck</option>
                <option value="Refrigerated">Refrigerated</option>
                <option value="Flatbed">Flatbed</option>
                <option value="Van">Van</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center"><AlertTriangle size={14} className="mr-1"/> Trip Priority</label>
              <select 
                className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                value={formData.priority}
                onChange={e => setFormData({...formData, priority: e.target.value})}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Shipments (Comma Separated IDs)</label>
            <textarea 
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              placeholder="e.g. ship-123, ship-456"
              rows={3}
              value={formData.shipmentIds}
              onChange={e => setFormData({...formData, shipmentIds: e.target.value})}
            ></textarea>
          </div>

          <div className="pt-4 flex justify-end">
            <button 
              type="submit" 
              disabled={loading}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-xl transition-colors shadow-sm"
            >
              {loading ? 'Creating Plan...' : 'Create Transport Plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
