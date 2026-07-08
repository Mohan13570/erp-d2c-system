import React, { useState, useEffect } from 'react';
import { Building2, Map, MapPin, Anchor, Plane, DollarSign, Percent, Plus, Search, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function CompanyManagement() {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState('branches');
  
  // Data States
  const [branches, setBranches] = useState<any[]>([]);
  const [countries, setCountries] = useState<any[]>([]);
  const [ports, setPorts] = useState<any[]>([]);
  const [taxes, setTaxes] = useState<any[]>([]);
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<any>({});

  const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

  const fetchData = async () => {
    try {
      const [brRes, coRes, poRes, txRes] = await Promise.all([
        fetch('/api/company-management/branches', { headers }),
        fetch('/api/company-management/countries', { headers }),
        fetch('/api/company-management/ports', { headers }),
        fetch('/api/company-management/taxes', { headers })
      ]);
      if(brRes.ok) setBranches(await brRes.json());
      if(coRes.ok) setCountries(await coRes.json());
      if(poRes.ok) setPorts(await poRes.json());
      if(txRes.ok) setTaxes(await txRes.json());
    } catch (e) {
      console.error('Failed to fetch data', e);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let endpoint = '';
    if (activeTab === 'branches') endpoint = 'branches';
    if (activeTab === 'locations') endpoint = 'countries';
    if (activeTab === 'hubs') endpoint = 'ports';
    if (activeTab === 'finance') endpoint = 'taxes';

    try {
      const res = await fetch(`/api/company-management/${endpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setShowModal(false);
        setFormData({});
        fetchData(); // refresh data
      } else {
        const err = await res.json();
        alert('Error: ' + err.error);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const tabs = [
    { id: 'branches', name: 'Branches & Offices', icon: Building2 },
    { id: 'locations', name: 'Countries', icon: Map },
    { id: 'hubs', name: 'Ports', icon: Anchor },
    { id: 'finance', name: 'Taxes', icon: DollarSign }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto h-[calc(100vh-4rem)] flex flex-col relative">
      <div className="flex justify-between items-center mb-8 shrink-0">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Company Management</h1>
          <p className="text-gray-500 font-medium mt-1">Configure global branches, master data, and localization settings.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-bold flex items-center space-x-2 transition-colors">
          <Plus size={18} />
          <span>Add New Record</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex-1 flex flex-col overflow-hidden">
        <div className="flex border-b border-gray-200 bg-gray-50/50 px-4 pt-4 shrink-0">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-3 font-semibold text-sm border-b-2 transition-colors ${
                activeTab === tab.id 
                  ? 'border-indigo-600 text-indigo-700 bg-white rounded-t-lg' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-t-lg'
              }`}
            >
              <tab.icon size={18} />
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        <div className="p-6 flex-1 overflow-y-auto bg-gray-50/20">
          {activeTab === 'branches' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {branches.length === 0 && <p className="text-gray-500">No branches found.</p>}
                {branches.map(b => (
                  <div key={b.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-4">
                      <Building2 size={24} />
                    </div>
                    <h3 className="font-bold text-lg text-gray-900">{b.name}</h3>
                    <div className="flex items-center text-gray-500 text-sm mt-2 space-x-2">
                      <MapPin size={14} />
                      <span>{b.companyName}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'locations' && (
            <div>
               <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {countries.length === 0 && <p className="text-gray-500">No countries found.</p>}
                {countries.map(c => (
                  <div key={c.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
                    <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                      {c.code}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{c.name}</h3>
                      <p className="text-xs text-gray-500">{c.currencyCode || 'N/A'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {activeTab === 'hubs' && (
            <div>
              <table className="w-full text-left text-sm bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 font-bold text-gray-700">Code</th>
                    <th className="px-4 py-3 font-bold text-gray-700">Name</th>
                    <th className="px-4 py-3 font-bold text-gray-700">Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {ports.map(p => (
                    <tr key={p.id}>
                      <td className="px-4 py-3 font-bold text-gray-900">{p.code}</td>
                      <td className="px-4 py-3">{p.name}</td>
                      <td className="px-4 py-3">{p.type}</td>
                    </tr>
                  ))}
                  {ports.length === 0 && <tr><td colSpan={3} className="px-4 py-8 text-center text-gray-500">No ports found</td></tr>}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'finance' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {taxes.map(t => (
                   <div key={t.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                   <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600 mb-4">
                     <Percent size={24} />
                   </div>
                   <h3 className="font-bold text-lg text-gray-900">{t.name}</h3>
                   <p className="text-3xl font-black text-indigo-600 mt-2">{t.rate}%</p>
                   <p className="text-gray-500 text-sm mt-1">{t.country}</p>
                 </div>
                ))}
                {taxes.length === 0 && <p className="text-gray-500">No tax configurations found.</p>}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Add New Record</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {activeTab === 'branches' && (
                <>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Branch Name</label>
                    <input required type="text" className="w-full border border-gray-300 rounded-xl px-3 py-2" 
                      onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Company Name</label>
                    <input required type="text" className="w-full border border-gray-300 rounded-xl px-3 py-2" placeholder="e.g. Aura"
                      onChange={e => setFormData({...formData, companyName: e.target.value})} />
                  </div>
                </>
              )}

              {activeTab === 'locations' && (
                <>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Country Name</label>
                    <input required type="text" className="w-full border border-gray-300 rounded-xl px-3 py-2" 
                      onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Country Code (e.g. US, UK)</label>
                    <input required type="text" className="w-full border border-gray-300 rounded-xl px-3 py-2" 
                      onChange={e => setFormData({...formData, code: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Currency Code (e.g. USD, GBP)</label>
                    <input required type="text" className="w-full border border-gray-300 rounded-xl px-3 py-2" 
                      onChange={e => setFormData({...formData, currencyCode: e.target.value})} />
                  </div>
                </>
              )}

              {activeTab === 'hubs' && (
                <>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Port Name</label>
                    <input required type="text" className="w-full border border-gray-300 rounded-xl px-3 py-2" 
                      onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Port Code (e.g. USLAX)</label>
                    <input required type="text" className="w-full border border-gray-300 rounded-xl px-3 py-2" 
                      onChange={e => setFormData({...formData, code: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Type</label>
                    <select required className="w-full border border-gray-300 rounded-xl px-3 py-2"
                      onChange={e => setFormData({...formData, type: e.target.value})}>
                      <option value="">Select Type</option>
                      <option value="Ocean">Ocean</option>
                      <option value="Air">Air</option>
                    </select>
                  </div>
                </>
              )}

              {activeTab === 'finance' && (
                <>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Tax Name</label>
                    <input required type="text" className="w-full border border-gray-300 rounded-xl px-3 py-2" placeholder="e.g. VAT, GST"
                      onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Rate (%)</label>
                    <input required type="number" step="0.1" className="w-full border border-gray-300 rounded-xl px-3 py-2" 
                      onChange={e => setFormData({...formData, rate: parseFloat(e.target.value)})} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Country</label>
                    <input required type="text" className="w-full border border-gray-300 rounded-xl px-3 py-2" 
                      onChange={e => setFormData({...formData, country: e.target.value})} />
                  </div>
                </>
              )}

              <div className="pt-4 flex justify-end space-x-3 border-t border-gray-100">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 font-bold text-gray-600 hover:bg-gray-100 rounded-xl">Cancel</button>
                <button type="submit" className="px-4 py-2 font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm">Save Record</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
