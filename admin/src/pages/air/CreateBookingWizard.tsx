import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, Box, ArrowRight, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function CreateBookingWizard() {
  const navigate = useNavigate();
  const [airports, setAirports] = useState([]);
  
  const [origin, setOrigin] = useState('');
  const [dest, setDest] = useState('');
  const [items, setItems] = useState([{ description: '', length: 0, width: 0, height: 0, grossWeight: 0, quantity: 1, iataCode: '' }]);
  
  useEffect(() => {
    fetch('/api/air/master-data/airports').then(r => r.json()).then(setAirports);
  }, []);

  const addItem = () => setItems([...items, { description: '', length: 0, width: 0, height: 0, grossWeight: 0, quantity: 1, iataCode: '' }]);

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    (newItems[index] as any)[field] = value;
    setItems(newItems);
  };

  const calculateVolWeight = (l: number, w: number, h: number, q: number) => {
    return ((l * w * h) / 6000) * q;
  };

  const submitBooking = async () => {
    const payload = {
      originAirportId: origin,
      destAirportId: dest,
      items: items
    };

    const res = await fetch('/api/air/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      navigate('/air/bookings');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">
      <h1 className="text-3xl font-black text-gray-900 flex items-center">
        <Plane className="mr-3 text-sky-600" /> New Air Freight Booking
      </h1>
      
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-8">
        
        {/* Routing */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 border-b pb-2 mb-4">1. Origin & Destination</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Origin Airport</label>
              <select className="w-full p-3 border rounded-xl" value={origin} onChange={e => setOrigin(e.target.value)}>
                <option value="">Select Origin...</option>
                {airports.map((a: any) => <option key={a.id} value={a.id}>{a.iataCode} - {a.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Destination Airport</label>
              <select className="w-full p-3 border rounded-xl" value={dest} onChange={e => setDest(e.target.value)}>
                <option value="">Select Destination...</option>
                {airports.map((a: any) => <option key={a.id} value={a.id}>{a.iataCode} - {a.name}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Cargo Details */}
        <div>
          <div className="flex justify-between items-center border-b pb-2 mb-4">
            <h2 className="text-xl font-bold text-gray-900">2. Cargo Dimensions & Volumetric Weight</h2>
            <button onClick={addItem} className="text-sm font-bold text-sky-600 hover:text-sky-800">+ Add Piece</button>
          </div>
          
          <div className="space-y-4">
            {items.map((item, idx) => {
              const volWeight = calculateVolWeight(item.length, item.width, item.height, item.quantity);
              const chargeable = Math.max(item.grossWeight, volWeight);
              return (
                <div key={idx} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 grid grid-cols-1 md:grid-cols-7 gap-4 items-center">
                  <div className="col-span-2">
                    <label className="text-xs font-bold text-gray-500">Description</label>
                    <input type="text" className="w-full p-2 border rounded-lg text-sm" value={item.description} onChange={e => updateItem(idx, 'description', e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500">L x W x H (cm)</label>
                    <div className="flex gap-1">
                      <input type="number" className="w-full p-2 border rounded-lg text-sm px-1" placeholder="L" value={item.length} onChange={e => updateItem(idx, 'length', Number(e.target.value))} />
                      <input type="number" className="w-full p-2 border rounded-lg text-sm px-1" placeholder="W" value={item.width} onChange={e => updateItem(idx, 'width', Number(e.target.value))} />
                      <input type="number" className="w-full p-2 border rounded-lg text-sm px-1" placeholder="H" value={item.height} onChange={e => updateItem(idx, 'height', Number(e.target.value))} />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500">Qty</label>
                    <input type="number" className="w-full p-2 border rounded-lg text-sm" value={item.quantity} onChange={e => updateItem(idx, 'quantity', Number(e.target.value))} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500">Gross Wt (kg)</label>
                    <input type="number" className="w-full p-2 border rounded-lg text-sm" value={item.grossWeight} onChange={e => updateItem(idx, 'grossWeight', Number(e.target.value))} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500">IATA Code</label>
                    <select className="w-full p-2 border rounded-lg text-sm" value={item.iataCode} onChange={e => updateItem(idx, 'iataCode', e.target.value)}>
                      <option value="">None</option>
                      <option value="DGR">DGR (Dangerous)</option>
                      <option value="PER">PER (Perishable)</option>
                      <option value="AVI">AVI (Live Animal)</option>
                    </select>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-gray-500">Chargeable Weight</div>
                    <div className="text-lg font-black text-sky-600">{chargeable.toFixed(2)} kg</div>
                    <div className="text-[10px] text-gray-400">Vol: {volWeight.toFixed(2)}kg</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="pt-6 border-t flex justify-end">
          <button onClick={submitBooking} className="bg-sky-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-sky-700 shadow-md flex items-center">
            Generate Booking <ArrowRight className="ml-2" size={18}/>
          </button>
        </div>
      </div>
    </div>
  );
}
