import React, { useState } from 'react';
import { Package, Truck, Navigation, Save, Calendar, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function RoadBookingWizard() {
  const navigate = useNavigate();
  const [loadType, setLoadType] = useState('FTL');
  const [booking, setBooking] = useState({
    bookingNumber: `RB-${Math.floor(100000 + Math.random() * 900000)}`,
    totalGrossWeight: '',
    totalVolume: '',
    isHazardous: false
  });
  
  const [items, setItems] = useState([{ description: '', quantity: 1, grossWeight: 0, volume: 0, packageType: 'Pallet' }]);
  
  const handleSave = async () => {
    try {
      const res = await fetch('/api/road/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...booking, loadType, items })
      });
      if (res.ok) {
        navigate('/road/hub');
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 h-[calc(100vh-4rem)] overflow-y-auto">
      <div>
        <h1 className="text-3xl font-black text-gray-900 flex items-center">
          <Truck className="mr-3 text-emerald-600" size={32} />
          Create Road Booking ({loadType})
        </h1>
        <p className="text-gray-500 font-medium mt-1">Book Full Truck Load (FTL) or Less Than Truck Load (LTL).</p>
      </div>

      <div className="flex space-x-2 bg-gray-100/50 p-1.5 rounded-2xl w-fit">
        {['FTL', 'LTL'].map(type => (
          <button
            key={type}
            onClick={() => setLoadType(type)}
            className={`px-8 py-2.5 rounded-xl font-bold text-sm transition-all ${loadType === type ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {type === 'FTL' ? 'Full Truck Load' : 'Less Than Truck Load'}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <Navigation className="mr-2 text-indigo-500" size={20} /> Booking Details
        </h2>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Booking Reference</label>
            <input value={booking.bookingNumber} readOnly className="w-full bg-gray-50 p-3 rounded-xl border border-gray-200 font-mono text-gray-500" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Customer ID (Optional)</label>
            <input type="text" placeholder="CUST-102" className="w-full bg-white p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Total Gross Weight (kg)</label>
            <input type="number" onChange={(e) => setBooking({...booking, totalGrossWeight: e.target.value})} className="w-full bg-white p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Total Volume (cbm)</label>
            <input type="number" onChange={(e) => setBooking({...booking, totalVolume: e.target.value})} className="w-full bg-white p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none" />
          </div>
          
          <div className="col-span-2 mt-2">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input type="checkbox" checked={booking.isHazardous} onChange={(e) => setBooking({...booking, isHazardous: e.target.checked})} className="w-5 h-5 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500" />
              <span className="text-sm font-bold text-gray-900">Contains Hazardous Materials (Dangerous Goods)</span>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <Package className="mr-2 text-indigo-500" size={20} /> Cargo Items
          </h2>
          <button onClick={() => setItems([...items, { description: '', quantity: 1, grossWeight: 0, volume: 0, packageType: 'Pallet' }])} className="text-emerald-600 font-bold flex items-center hover:bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors">
            <Plus size={16} className="mr-1" /> Add Item
          </button>
        </div>
        
        <div className="space-y-4">
          {items.map((item, i) => (
            <div key={i} className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="flex-1 space-y-4">
                <input placeholder="Cargo Description" className="w-full bg-white p-3 rounded-xl border border-gray-200 text-sm font-medium" value={item.description} onChange={(e) => { const newItems = [...items]; newItems[i].description = e.target.value; setItems(newItems); }} />
                <div className="grid grid-cols-4 gap-4">
                  <input type="number" placeholder="Qty" className="w-full bg-white p-2.5 rounded-xl border border-gray-200 text-sm" value={item.quantity} onChange={(e) => { const newItems = [...items]; newItems[i].quantity = parseInt(e.target.value) || 0; setItems(newItems); }} />
                  <input type="number" placeholder="Weight" className="w-full bg-white p-2.5 rounded-xl border border-gray-200 text-sm" value={item.grossWeight} onChange={(e) => { const newItems = [...items]; newItems[i].grossWeight = parseFloat(e.target.value) || 0; setItems(newItems); }} />
                  <input type="number" placeholder="CBM" className="w-full bg-white p-2.5 rounded-xl border border-gray-200 text-sm" value={item.volume} onChange={(e) => { const newItems = [...items]; newItems[i].volume = parseFloat(e.target.value) || 0; setItems(newItems); }} />
                  <select className="w-full bg-white p-2.5 rounded-xl border border-gray-200 text-sm" value={item.packageType} onChange={(e) => { const newItems = [...items]; newItems[i].packageType = e.target.value; setItems(newItems); }}>
                    <option>Pallet</option><option>Carton</option><option>Drum</option><option>Loose</option>
                  </select>
                </div>
              </div>
              <button onClick={() => setItems(items.filter((_, idx) => idx !== i))} className="p-3 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors shrink-0">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-4 pb-12">
        <button onClick={() => navigate('/road/hub')} className="px-6 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl shadow-sm hover:bg-gray-50 transition-colors">Cancel</button>
        <button onClick={handleSave} className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl shadow-sm hover:bg-emerald-700 transition-colors flex items-center">
          <Save size={18} className="mr-2" /> Submit Booking
        </button>
      </div>
    </div>
  );
}
