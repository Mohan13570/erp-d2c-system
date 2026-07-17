import React, { useState, useEffect } from 'react';
import { FileText, UploadCloud, History, Plus } from 'lucide-react';

export default function DocumentCenter() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<any>({});

  const fetchData = async () => {
    try {
      const res = await fetch('/api/documents');
      if (res.ok) setDocuments(await res.json());
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({...formData, fileUrl: `https://s3.lizome.erp/docs/${Math.floor(Math.random()*1000)}.pdf`})
      });
      if (res.ok) { setShowModal(false); fetchData(); }
    } catch (e) { console.error(e); }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto h-[calc(100vh-4rem)] flex flex-col relative">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Document Center</h1>
          <p className="text-gray-500 font-medium mt-1">Master BLs, House BLs, Commercial Invoices, and Versioning.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-slate-900 hover:bg-black text-white px-5 py-2.5 rounded-xl font-bold flex items-center space-x-2">
          <UploadCloud size={18} /><span>Upload Document</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
           {documents.map(d => (
             <div key={d.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative group hover:shadow-md transition-all">
               <div className="flex justify-between items-start mb-4">
                 <div className="bg-rose-50 text-rose-600 p-3 rounded-xl"><FileText size={24}/></div>
                 <span className="bg-gray-100 px-2 py-1 text-xs font-bold rounded uppercase">{d.documentType}</span>
               </div>
               <h3 className="font-bold text-gray-900">Entity: {d.entityType}</h3>
               <p className="text-xs font-mono text-gray-500 truncate mb-4">ID: {d.entityId}</p>
               
               <div className="bg-gray-50 p-3 rounded-xl">
                 <a href={d.fileUrl} target="_blank" className="text-sm font-bold text-indigo-600 hover:underline break-all">View Latest PDF</a>
                 <p className="text-xs text-gray-400 mt-2 flex items-center"><History size={12} className="mr-1"/> Versions: {d.versions?.length || 1}</p>
               </div>
             </div>
           ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">Upload Document</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
               <select required className="w-full p-3 border border-gray-200 rounded-xl" onChange={e => setFormData({...formData, documentType: e.target.value})}>
                 <option value="">Document Type</option>
                 <option value="Master BL">Master Bill of Lading</option>
                 <option value="House BL">House Bill of Lading</option>
                 <option value="Air Waybill">Air Waybill</option>
                 <option value="Commercial Invoice">Commercial Invoice</option>
                 <option value="Packing List">Packing List</option>
                 <option value="Certificate of Origin">Certificate of Origin</option>
               </select>
               <input required placeholder="Entity Type (e.g. Shipment, Quote)" className="w-full p-3 border border-gray-200 rounded-xl" onChange={e => setFormData({...formData, entityType: e.target.value})} />
               <input required placeholder="Entity ID Reference" className="w-full p-3 border border-gray-200 rounded-xl" onChange={e => setFormData({...formData, entityId: e.target.value})} />
               <div className="w-full p-8 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-400 bg-gray-50">
                 <UploadCloud size={32} className="mb-2"/>
                 <p className="text-sm font-semibold">Drop PDF file here</p>
               </div>
               <div className="pt-6 flex justify-end gap-3">
                 <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 text-gray-600 font-bold">Cancel</button>
                 <button type="submit" className="px-5 py-2.5 bg-slate-900 text-white font-bold rounded-xl">Upload & Save</button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
