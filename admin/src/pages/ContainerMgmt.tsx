import React, { useState, useEffect } from 'react';
import { Box, LogIn, LogOut, ArrowRightLeft, Plus, Sparkles, AlertTriangle, TrendingUp, BrainCircuit } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ContainerMgmt() {
  const { token } = useAuth();
  const [statuses, setStatuses] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<any>({});
  
  const [showAI, setShowAI] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiData, setAiData] = useState<any>({ summary: '', risk: '', idle: '', util: '' });

  const fetchAIInsights = async () => {
    setAiLoading(true);
    try {
      const runQuery = async (query: string) => {
        const res = await fetch('/api/ai/query', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ query })
        });
        const data = await res.json();
        return data.response;
      };

      const [summary, risk, idle, util] = await Promise.all([
        runQuery('summarize container operations'),
        runQuery('show containers needing attention'),
        runQuery('find idle containers'),
        runQuery('analyze container utilization')
      ]);

      setAiData({ summary, risk, idle, util });
    } catch (err) {
      console.error('AI Error:', err);
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    if (showAI && !aiData.summary) fetchAIInsights();
  }, [showAI]);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/containers');
      if (res.ok) setStatuses(await res.json());
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/containers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) { setShowModal(false); fetchData(); }
    } catch (e) { console.error(e); }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto h-[calc(100vh-4rem)] flex flex-col relative">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Container Management</h1>
          <p className="text-gray-500 font-medium mt-1">Track Stuffing, Destuffing, and Container returns.</p>
        </div>
        <div className="flex space-x-3">
          <button onClick={() => setShowAI(!showAI)} className={`px-5 py-2.5 rounded-xl font-bold flex items-center space-x-2 transition-colors ${showAI ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}>
            <Sparkles size={18} /><span>{showAI ? 'Hide AI Insights' : 'AI Insights'}</span>
          </button>
          <button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center space-x-2">
            <Plus size={18} /><span>Log Status</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6">
        
        {showAI && (
          <div className="bg-white rounded-3xl p-6 border border-indigo-100 shadow-[0_4px_24px_rgba(79,70,229,0.05)]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-gray-900 flex items-center"><BrainCircuit className="text-indigo-600 mr-2"/> Container AI Intelligence</h2>
              <button onClick={fetchAIInsights} disabled={aiLoading} className="text-sm font-bold text-indigo-600 hover:text-indigo-700">{aiLoading ? 'Analyzing...' : 'Refresh Data'}</button>
            </div>
            
            {aiLoading ? (
               <div className="py-10 text-center text-gray-500 font-medium">Running AI models...</div>
            ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 
                 <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100">
                   <h3 className="font-bold text-blue-800 mb-2 flex items-center"><Box size={16} className="mr-1"/> Status Overview</h3>
                   <div className="whitespace-pre-wrap text-sm text-blue-900/80">{aiData.summary}</div>
                 </div>

                 <div className="bg-rose-50 p-5 rounded-2xl border border-rose-100">
                   <h3 className="font-bold text-rose-800 mb-2 flex items-center"><AlertTriangle size={16} className="mr-1"/> Risk & Attention</h3>
                   <div className="whitespace-pre-wrap text-sm text-rose-900/80">{aiData.risk}</div>
                 </div>

                 <div className="bg-amber-50 p-5 rounded-2xl border border-amber-100">
                   <h3 className="font-bold text-amber-800 mb-2 flex items-center"><AlertTriangle size={16} className="mr-1"/> Idle Containers</h3>
                   <div className="whitespace-pre-wrap text-sm text-amber-900/80">{aiData.idle}</div>
                 </div>

                 <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100">
                   <h3 className="font-bold text-emerald-800 mb-2 flex items-center"><TrendingUp size={16} className="mr-1"/> Capacity Utilization</h3>
                   <div className="whitespace-pre-wrap text-sm text-emerald-900/80">{aiData.util}</div>
                 </div>

               </div>
            )}
          </div>
        )}

        <table className="min-w-full bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
           <thead className="bg-gray-50"><tr>
             {['Container No', 'Status', 'Location', 'Timestamp'].map(h => <th key={h} className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">{h}</th>)}
           </tr></thead>
           <tbody className="divide-y divide-gray-50">
             {statuses.map(s => (
               <tr key={s.id}>
                 <td className="px-6 py-4 font-black text-gray-900">{s.containerNo}</td>
                 <td className="px-6 py-4">
                   <span className={`px-2 py-1 text-xs font-bold rounded-lg ${s.status === 'Stuffing' ? 'bg-green-50 text-green-700' : s.status === 'Destuffing' ? 'bg-orange-50 text-orange-700' : 'bg-gray-100 text-gray-700'}`}>
                     {s.status}
                   </span>
                 </td>
                 <td className="px-6 py-4 text-sm font-semibold">{s.location}</td>
                 <td className="px-6 py-4 text-sm text-gray-500">{new Date(s.timestamp).toLocaleString()}</td>
               </tr>
             ))}
           </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">Log Container Status</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
               <input required placeholder="Container Number (e.g. HLXU1234567)" className="w-full p-3 border border-gray-200 rounded-xl uppercase font-mono" onChange={e => setFormData({...formData, containerNo: e.target.value})} />
               <select required className="w-full p-3 border border-gray-200 rounded-xl" onChange={e => setFormData({...formData, status: e.target.value})}>
                 <option value="">Select Status</option>
                 <option value="Stuffing">Stuffing</option>
                 <option value="Destuffing">Destuffing</option>
                 <option value="Empty">Empty</option>
                 <option value="Returned">Returned</option>
               </select>
               <input required placeholder="Current Location (e.g. Warehouse A)" className="w-full p-3 border border-gray-200 rounded-xl" onChange={e => setFormData({...formData, location: e.target.value})} />
               <div className="pt-6 flex justify-end gap-3">
                 <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 text-gray-600 font-bold">Cancel</button>
                 <button type="submit" className="px-5 py-2.5 bg-blue-600 text-white font-bold rounded-xl">Save</button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
