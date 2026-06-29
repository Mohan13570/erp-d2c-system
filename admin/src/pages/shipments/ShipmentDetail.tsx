import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Map, Activity, CheckCircle, FileText, DollarSign, Package } from 'lucide-react';

export default function ShipmentDetail() {
  const { id } = useParams();
  const [shipment, setShipment] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetch(`/api/shipments/${id}`).then(r => r.json()).then(setShipment).catch(console.error);
  }, [id]);

  if (!shipment) return <div className="p-8">Loading shipment details...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto flex flex-col h-[calc(100vh-4rem)]">
      <div className="mb-6 flex justify-between items-start shrink-0">
        <div>
          <Link to="/shipments/list" className="flex items-center text-sm font-bold text-gray-500 hover:text-indigo-600 mb-2">
            <ArrowLeft size={16} className="mr-1"/> Back to List
          </Link>
          <div className="flex items-center gap-4">
             <h1 className="text-4xl font-black text-gray-900">{shipment.trackingNumber}</h1>
             <span className="px-4 py-1.5 bg-indigo-50 text-indigo-700 font-bold rounded-full">{shipment.status}</span>
          </div>
          <p className="text-gray-500 font-medium mt-2">{shipment.freightType} Freight • Incoterms: {shipment.incoterms || 'N/A'}</p>
        </div>
      </div>

      <div className="flex gap-2 mb-6 border-b border-gray-100 pb-2 shrink-0 overflow-x-auto">
        {['overview', 'timeline', 'tracking', 'cargo', 'charges', 'documents'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-5 py-2.5 rounded-lg font-bold capitalize whitespace-nowrap transition-colors ${activeTab === tab ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 grid grid-cols-2 gap-8">
                 <div>
                    <p className="text-sm font-semibold text-gray-400 uppercase">Shipper</p>
                    <p className="font-bold text-gray-900 mt-1">{shipment.shipper || 'Not specified'}</p>
                 </div>
                 <div>
                    <p className="text-sm font-semibold text-gray-400 uppercase">Consignee</p>
                    <p className="font-bold text-gray-900 mt-1">{shipment.consignee || 'Not specified'}</p>
                 </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600"><CheckCircle size={24}/></div>
                    <div>
                      <h3 className="font-bold text-gray-900">Workflow Engine Status</h3>
                      <p className="text-sm text-gray-500">Currently in {shipment.status} phase.</p>
                    </div>
                 </div>
                 <button className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold">Advance Status</button>
              </div>
            </div>
            <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl">
               <h3 className="font-bold mb-4 flex items-center gap-2"><DollarSign size={20}/> Profitability</h3>
               <div className="space-y-4">
                 <div className="flex justify-between border-b border-slate-700 pb-2"><span className="text-slate-400">Total Cost</span><span>${shipment.charges?.totalCost || 0}</span></div>
                 <div className="flex justify-between border-b border-slate-700 pb-2"><span className="text-slate-400">Revenue</span><span>${shipment.charges?.expectedRevenue || 0}</span></div>
                 <div className="flex justify-between pt-2"><span className="font-bold">Net Margin</span><span className="font-black text-emerald-400">${(shipment.charges?.expectedRevenue || 0) - (shipment.charges?.totalCost || 0)}</span></div>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'timeline' && (
           <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-indigo-100 before:to-transparent">
                {shipment.timeline?.map((t: any, i: number) => (
                  <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-indigo-100 text-indigo-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                      <Activity size={16} />
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-gray-50 p-4 rounded-2xl border border-gray-100">
                      <div className="flex items-center justify-between space-x-2 mb-1">
                        <div className="font-bold text-gray-900">{t.status}</div>
                        <time className="text-xs font-medium text-indigo-600">{new Date(t.timestamp).toLocaleString()}</time>
                      </div>
                      <div className="text-sm text-gray-500">{t.remarks || 'No remarks added.'}</div>
                    </div>
                  </div>
                ))}
              </div>
           </div>
        )}
      </div>
    </div>
  );
}
