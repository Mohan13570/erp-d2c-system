import React, { useState, useEffect } from 'react';
import { ShieldCheck, Plus, Search, FileSignature, UploadCloud, BrainCircuit, X } from 'lucide-react';

export default function CustomsWorkspace() {
  const [declarations, setDeclarations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showOcrModal, setShowOcrModal] = useState(false);
  const [ocrResult, setOcrResult] = useState<any>(null);
  const [ocrLoading, setOcrLoading] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5000/api/ocean/customs/declarations')
      .then(res => res.json())
      .then(data => {
        setDeclarations(data);
        setLoading(false);
      });
  }, []);

  const handleAIOCR = async () => {
    setOcrLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/ai/ocr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentType: 'Customs Invoice' })
      });
      const data = await res.json();
      setOcrResult(data.aiExtraction);
    } catch (e) {
      console.error(e);
    } finally {
      setOcrLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 relative h-[calc(100vh-4rem)]">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ShieldCheck className="text-indigo-600" /> Customs Clearance Gateway
          </h1>
          <p className="text-gray-500 mt-1">Manage Bills of Entry, HS Codes, Duties, and legal clearance.</p>
        </div>
        <div className="flex space-x-3">
          <button onClick={() => setShowOcrModal(true)} className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-xl flex items-center space-x-2 hover:shadow-lg transition">
            <BrainCircuit size={18} />
            <span>AI Document OCR</span>
          </button>
          <button className="bg-slate-900 text-white px-4 py-2 rounded-xl flex items-center space-x-2 hover:bg-slate-800 transition">
            <Plus size={18} />
            <span>File New Declaration</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center space-x-4">
           <div className="relative flex-1 max-w-md">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
             <input type="text" placeholder="Search Bill of Entry or Booking Ref..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
           </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 text-sm font-semibold">
              <tr>
                <th className="p-4">Declaration ID</th>
                <th className="p-4">Booking Ref</th>
                <th className="p-4">Status</th>
                <th className="p-4">Port of Clearance</th>
                <th className="p-4">Total Duty</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={6} className="p-8 text-center text-gray-500">Loading customs data...</td></tr>
              ) : declarations.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-gray-500">No customs declarations filed.</td></tr>
              ) : declarations.map((d: any) => (
                <tr key={d.id} className="hover:bg-gray-50">
                  <td className="p-4 font-semibold text-indigo-600">{d.billOfEntryNo || d.id.substring(0,8)}</td>
                  <td className="p-4 text-sm text-gray-600">{d.booking?.bookingNumber}</td>
                  <td className="p-4">
                     <span className={`px-2 py-1 rounded text-xs font-semibold ${d.status === 'Cleared' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {d.status}
                     </span>
                  </td>
                  <td className="p-4 text-sm text-gray-600">{d.portOfClearance?.name || 'Pending'}</td>
                  <td className="p-4 text-sm font-semibold text-gray-900">${d.totalDutyAmount.toFixed(2)}</td>
                  <td className="p-4 flex items-center space-x-2">
                     <button className="p-1.5 text-gray-400 hover:text-indigo-600 rounded bg-gray-100 hover:bg-indigo-50 transition" title="Examine">
                        <FileSignature size={16} />
                     </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showOcrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl relative">
            <button onClick={() => { setShowOcrModal(false); setOcrResult(null); }} className="absolute top-4 right-4 text-gray-400 hover:text-red-500"><X size={20}/></button>
            <h2 className="text-2xl font-bold mb-2 flex items-center"><BrainCircuit className="text-purple-600 mr-2"/> AI Document Processing</h2>
            <p className="text-sm text-gray-500 mb-6">Upload a Bill of Lading or Customs Invoice to automatically extract structured data via Neural OCR.</p>
            
            {!ocrResult ? (
              <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center bg-gray-50 hover:bg-gray-100 transition cursor-pointer" onClick={handleAIOCR}>
                {ocrLoading ? (
                  <div className="animate-pulse flex flex-col items-center">
                    <BrainCircuit size={48} className="text-purple-400 mb-4 animate-bounce" />
                    <p className="text-purple-700 font-bold">Neural Engine Processing Document...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <UploadCloud size={48} className="text-indigo-300 mb-4" />
                    <p className="text-indigo-700 font-bold">Click to Simulate Upload & OCR</p>
                    <p className="text-xs text-gray-400 mt-2">Supports PDF, PNG, JPG (Max 5MB)</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
                <div className="flex items-center text-emerald-700 font-bold mb-4">
                  <ShieldCheck size={20} className="mr-2"/> OCR Extraction Successful (Confidence: {ocrResult.confidenceScore * 100}%)
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-gray-500">Doc Type:</span> <span className="font-semibold text-gray-900">{ocrResult.documentType}</span></div>
                  <div><span className="text-gray-500">HS Code:</span> <span className="font-semibold text-gray-900">{ocrResult.extractedFields.hsCode}</span></div>
                  <div><span className="text-gray-500">Shipper:</span> <span className="font-semibold text-gray-900">{ocrResult.extractedFields.shipper}</span></div>
                  <div><span className="text-gray-500">Weight:</span> <span className="font-semibold text-gray-900">{ocrResult.extractedFields.totalWeight} kg</span></div>
                  <div><span className="text-gray-500">Port (Load):</span> <span className="font-semibold text-gray-900">{ocrResult.extractedFields.portOfLoading}</span></div>
                  <div><span className="text-gray-500">Port (Discharge):</span> <span className="font-semibold text-gray-900">{ocrResult.extractedFields.portOfDischarge}</span></div>
                </div>
                <button onClick={() => setShowOcrModal(false)} className="mt-6 w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700">Import Data to Declaration</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
