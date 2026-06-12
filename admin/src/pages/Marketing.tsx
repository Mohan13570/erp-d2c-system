import { useState, useEffect } from 'react';
import { Megaphone, Plus, Mail, Smartphone, Target, Users } from 'lucide-react';

interface Campaign {
  id: string;
  name: string;
  channel: string;
  status: string;
  budget: number;
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
  startDate: string;
}

export default function MarketingView() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newCampaign, setNewCampaign] = useState({ name: '', channel: 'Email', status: 'Active', budget: 0, spend: 0, impressions: 0, clicks: 0, conversions: 0 });

  const fetchCampaigns = () => {
    fetch('/api/marketing/campaigns')
      .then(r => r.json())
      .then(setCampaigns)
      .catch(() => {});
  };

  useEffect(() => { fetchCampaigns(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/marketing/campaigns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({...newCampaign, budget: Number(newCampaign.budget), spend: Number(newCampaign.spend), impressions: Number(newCampaign.impressions), clicks: Number(newCampaign.clicks), conversions: Number(newCampaign.conversions)})
    });
    setShowModal(false);
    fetchCampaigns();
  };

  const handleDelete = async (id: string) => {
    if(!window.confirm('Delete campaign?')) return;
    await fetch(`/api/marketing/campaigns/${id}`, { method: 'DELETE' });
    fetchCampaigns();
  };

  const getIcon = (channel: string) => {
    if(channel === 'Email') return <Mail size={20} className="text-blue-500" />;
    if(channel === 'Social') return <Smartphone size={20} className="text-pink-500" />;
    if(channel === 'Search') return <Target size={20} className="text-emerald-500" />;
    return <Megaphone size={20} className="text-indigo-500" />;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Marketing</h1>
          <p className="text-gray-500 mt-1">Manage ad campaigns, budgets, and track performance.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm flex items-center">
          <Plus className="w-5 h-5 mr-2" /> New Campaign
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Total Budget</p>
            <p className="text-3xl font-black text-gray-900">${campaigns.reduce((a,c) => a + c.budget, 0).toLocaleString()}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600"><Megaphone size={24} /></div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Total Spend</p>
            <p className="text-3xl font-black text-rose-600">${campaigns.reduce((a,c) => a + c.spend, 0).toLocaleString()}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center text-rose-600"><Target size={24} /></div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Total Conversions</p>
            <p className="text-3xl font-black text-emerald-600">{campaigns.reduce((a,c) => a + c.conversions, 0).toLocaleString()}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600"><Users size={24} /></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map(c => (
          <div key={c.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow relative overflow-hidden group">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
                  {getIcon(c.channel)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{c.name}</h3>
                  <p className="text-xs text-gray-500 font-medium">{c.channel}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${c.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>{c.status}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Budget</p>
                <p className="font-semibold text-gray-900">${c.budget.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Spend</p>
                <p className="font-semibold text-rose-600">${c.spend.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Impressions</p>
                <p className="font-semibold text-gray-900">{c.impressions.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Conversions</p>
                <p className="font-semibold text-emerald-600">{c.conversions.toLocaleString()}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
              <span className="text-xs text-gray-400 font-medium">Started: {new Date(c.startDate).toLocaleDateString()}</span>
              <button onClick={() => handleDelete(c.id)} className="text-xs font-bold text-red-500 hover:text-red-700">Delete</button>
            </div>
          </div>
        ))}
        {campaigns.length === 0 && (
          <div className="col-span-full p-12 text-center text-gray-400 border border-dashed border-gray-200 rounded-3xl">
            No marketing campaigns active. Create one to get started.
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white p-8 rounded-3xl w-full max-w-lg shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">Create Campaign</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input required placeholder="Campaign Name" className="col-span-2 w-full p-3 border rounded-xl" onChange={e => setNewCampaign({...newCampaign, name: e.target.value})} />
                
                <select required className="w-full p-3 border rounded-xl" onChange={e => setNewCampaign({...newCampaign, channel: e.target.value})}>
                  <option>Email</option>
                  <option>Social</option>
                  <option>Search</option>
                  <option>Affiliate</option>
                </select>
                
                <select required className="w-full p-3 border rounded-xl" onChange={e => setNewCampaign({...newCampaign, status: e.target.value})}>
                  <option>Active</option>
                  <option>Paused</option>
                  <option>Completed</option>
                </select>

                <input required type="number" placeholder="Budget ($)" className="w-full p-3 border rounded-xl" onChange={e => setNewCampaign({...newCampaign, budget: Number(e.target.value)})} />
                <input required type="number" placeholder="Spend ($)" className="w-full p-3 border rounded-xl" onChange={e => setNewCampaign({...newCampaign, spend: Number(e.target.value)})} />
                
                <input required type="number" placeholder="Impressions" className="w-full p-3 border rounded-xl" onChange={e => setNewCampaign({...newCampaign, impressions: Number(e.target.value)})} />
                <input required type="number" placeholder="Clicks" className="w-full p-3 border rounded-xl" onChange={e => setNewCampaign({...newCampaign, clicks: Number(e.target.value)})} />
                <input required type="number" placeholder="Conversions" className="col-span-2 w-full p-3 border rounded-xl" onChange={e => setNewCampaign({...newCampaign, conversions: Number(e.target.value)})} />
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 text-gray-600 font-bold hover:bg-gray-100 rounded-xl">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl shadow-lg">Launch Campaign</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
