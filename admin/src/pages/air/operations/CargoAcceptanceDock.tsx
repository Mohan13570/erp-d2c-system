import React, { useState } from 'react';
import { ScanLine, Box, CheckCircle, Search, AlertTriangle } from 'lucide-react';

export default function CargoAcceptanceDock() {
  const [barcode, setBarcode] = useState('');
  const [cargoData, setCargoData] = useState<any>(null);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate fetching cargo details from barcode
    if(barcode) {
      setCargoData({
        id: barcode,
        description: 'Electronic Parts (DGR)',
        grossWeight: 1450.0,
        volume: 2.5,
        iataCode: 'DGR',
        status: 'Pending Acceptance'
      });
    }
  };

  const handleAccept = async () => {
    // API call to log operation
    await fetch('/api/air/operations/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bookingItemId: 'item-uuid-stub', 
        operationType: 'Acceptance',
        location: 'Cargo Dock A1',
        barcodeScanned: barcode
      })
    });
    setCargoData({...cargoData, status: 'Accepted'});
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">
      <h1 className="text-3xl font-black text-gray-900 flex items-center">
        <ScanLine className="mr-3 text-sky-600" size={32} /> Cargo Acceptance Dock
      </h1>
      
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-8">
        <form onSubmit={handleScan} className="flex gap-4">
          <input 
            type="text" 
            placeholder="Scan Barcode or QR Code..." 
            className="flex-1 p-4 border-2 border-sky-100 rounded-xl text-xl font-bold focus:border-sky-500 outline-none"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            autoFocus
          />
          <button type="submit" className="bg-sky-600 text-white px-8 rounded-xl font-bold hover:bg-sky-700 flex items-center">
            <Search className="mr-2" /> Lookup
          </button>
        </form>

        {cargoData && (
          <div className="border-t pt-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{cargoData.description}</h2>
                <div className="text-gray-500 font-medium">Barcode ID: {cargoData.id}</div>
              </div>
              <span className={`px-4 py-2 rounded-full font-bold text-sm ${cargoData.status === 'Accepted' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                {cargoData.status}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-50 p-6 rounded-2xl">
                <div className="text-sm font-bold text-gray-500 mb-1">Gross Weight</div>
                <div className="text-3xl font-black text-gray-900">{cargoData.grossWeight} kg</div>
              </div>
              <div className="bg-gray-50 p-6 rounded-2xl">
                <div className="text-sm font-bold text-gray-500 mb-1">Volume</div>
                <div className="text-3xl font-black text-gray-900">{cargoData.volume} cbm</div>
              </div>
              <div className="bg-gray-50 p-6 rounded-2xl flex items-center justify-center">
                {cargoData.iataCode === 'DGR' && (
                  <div className="text-center text-red-600">
                    <AlertTriangle size={32} className="mx-auto mb-2" />
                    <div className="font-bold">Dangerous Goods</div>
                  </div>
                )}
              </div>
            </div>

            {cargoData.status !== 'Accepted' && (
               <div className="flex justify-end gap-4">
                 <button className="px-6 py-3 bg-red-100 text-red-700 rounded-xl font-bold">Report Damage</button>
                 <button onClick={handleAccept} className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold flex items-center shadow-lg hover:bg-emerald-700">
                   <CheckCircle className="mr-2" /> Formal Acceptance
                 </button>
               </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
