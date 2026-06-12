import React, { useState, useEffect } from 'react';
import { Users, Phone, Mail, Building, UserPlus, Target, ListTodo, Plus, DollarSign, X } from 'lucide-react';

export default function CRM() {
  const [activeTab, setActiveTab] = useState<'leads' | 'opportunities' | 'b2b' | 'd2c'>('leads');
  const [b2bCustomers, setB2BCustomers] = useState<any[]>([]);
  const [d2cCustomers, setD2CCustomers] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [opportunities, setOpportunities] = useState<any[]>([]);

  // Modals
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<any>({});

  const fetchData = async () => {
    try {
      const headers = { 'Content-Type': 'application/json' };
      const [custRes, leadRes, oppRes] = await Promise.all([
        fetch('/api/crm/customers', { headers }),
        fetch('/api/crm/leads', { headers }),
        fetch('/api/crm/opportunities', { headers })
      ]);
      
      if (custRes.ok) {
        const data = await custRes.json();
        setB2BCustomers(data.b2b);
        setD2CCustomers(data.d2c);
      }
      if (leadRes.ok) setLeads(await leadRes.json());
      if (oppRes.ok) setOpportunities(await oppRes.json());
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let endpoint = '';
    if (activeTab === 'leads') endpoint = 'leads';
    else if (activeTab === 'opportunities') endpoint = 'opportunities';
    else if (activeTab === 'b2b') endpoint = 'customers';
    else if (activeTab === 'd2c') endpoint = 'd2c-customers';

    try {
      const res = await fetch(`/api/crm/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setShowModal(false);
        setFormData({});
        fetchData();
      } else {
        const err = await res.json();
        alert('Error: ' + err.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (endpoint: string, id: string) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    try {
      const res = await fetch(`/api/crm/${endpoint}/${id}`, { method: 'DELETE' });
      if (res.ok) fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto h-[calc(100vh-4rem)] flex flex-col relative">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">CRM & Sales Pipeline</h1>
          <p className="text-gray-500 font-medium mt-1">Manage leads, opportunities, and customer accounts.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center space-x-2 transition-colors shadow-sm">
          <Plus size={18} />
          <span>Add New Record</span>
        </button>
      </div>

      <div className="bg-gray-100/80 backdrop-blur-md p-1.5 rounded-2xl w-fit flex space-x-1 mb-6 shadow-inner shrink-0">
        <button onClick={() => setActiveTab('leads')} className={`flex items-center px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'leads' ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}>
          <Target size={18} className="mr-2" /> Leads
        </button>
        <button onClick={() => setActiveTab('opportunities')} className={`flex items-center px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'opportunities' ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}>
          <ListTodo size={18} className="mr-2" /> Pipeline
        </button>
        <button onClick={() => setActiveTab('b2b')} className={`flex items-center px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'b2b' ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}>
          <Building size={18} className="mr-2" /> B2B Accounts
        </button>
        <button onClick={() => setActiveTab('d2c')} className={`flex items-center px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'd2c' ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}>
          <Users size={18} className="mr-2" /> Consumers
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pb-12">
        {activeTab === 'leads' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {leads.length === 0 && <p className="text-gray-500">No leads found. Create one!</p>}
            {leads.map(lead => (
              <div key={lead.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all relative">
                <button onClick={() => handleDelete('leads', lead.id)} className="absolute top-4 right-4 text-gray-300 hover:text-red-500"><X size={16}/></button>
                <h3 className="font-bold text-lg text-gray-900">{lead.firstName} {lead.lastName}</h3>
                <p className="text-indigo-600 font-semibold text-sm mb-4">{lead.companyName || 'Individual'}</p>
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center"><Mail size={14} className="mr-2 opacity-60"/> {lead.email || '-'}</div>
                  <div className="flex items-center"><Phone size={14} className="mr-2 opacity-60"/> {lead.phone || '-'}</div>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                  <span className={`px-2 py-1 text-xs font-bold rounded-lg ${lead.status === 'New' ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-700'}`}>{lead.status}</span>
                  <span className="text-xs text-gray-400">Source: {lead.source}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'opportunities' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-full">
             {['Prospecting', 'Proposal', 'Negotiation', 'Closed Won'].map(stage => (
               <div key={stage} className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex flex-col">
                 <h3 className="font-bold text-gray-700 mb-4 px-2 uppercase text-xs tracking-wider">{stage}</h3>
                 <div className="flex-1 space-y-4 overflow-y-auto">
                    {opportunities.filter(o => o.stage === stage).map(opp => (
                      <div key={opp.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm relative group">
                        <button onClick={() => handleDelete('opportunities', opp.id)} className="absolute top-2 right-2 text-gray-300 hover:text-red-500 hidden group-hover:block"><X size={14}/></button>
                        <h4 className="font-bold text-gray-900">{opp.name}</h4>
                        <p className="text-sm text-gray-500 mb-3">{opp.customer?.customerName || opp.lead?.firstName || 'No Account'}</p>
                        <div className="flex justify-between items-center text-sm font-semibold">
                          <span className="text-emerald-600">${opp.amount.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                 </div>
               </div>
             ))}
          </div>
        )}

        {activeTab === 'b2b' && (
          <table className="min-w-full bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            <thead className="bg-gray-50/80"><tr>
              {['Account Name', 'Group', 'Contacts', 'Contracts', 'Action'].map(h => <th key={h} className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">{h}</th>)}
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {b2bCustomers.length === 0 && <tr><td colSpan={5} className="p-6 text-gray-500">No B2B accounts.</td></tr>}
              {b2bCustomers.map(c => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-bold text-gray-900">{c.customerName}</td>
                  <td className="px-6 py-4"><span className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg">{c.customerGroup}</span></td>
                  <td className="px-6 py-4 text-sm text-gray-600">{c.contacts?.length || 0} Contacts</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{c.contracts?.length || 0} Contracts</td>
                  <td className="px-6 py-4"><button onClick={() => handleDelete('customers', c.id)} className="text-red-500 text-sm font-bold hover:underline">Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === 'd2c' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {d2cCustomers.length === 0 && <p className="text-gray-500">No D2C consumers.</p>}
            {d2cCustomers.map(c => (
              <div key={c.id} className="border border-gray-100 rounded-2xl p-6 bg-white shadow-sm relative group">
                <button onClick={() => handleDelete('d2c-customers', c.id)} className="absolute top-4 right-4 text-gray-300 hover:text-red-500 hidden group-hover:block"><X size={16}/></button>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-100 to-pink-100 flex items-center justify-center text-purple-700 font-bold text-lg">
                    {c.firstName[0]}{c.lastName[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{c.firstName} {c.lastName}</h3>
                    <p className="text-xs text-gray-500">{c.email}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-50">
                  <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-full">{c.tier}</span>
                  <span className="text-sm font-bold text-gray-400">{c.loyaltyPoints} Pts</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dynamic Modal Form */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">
              Create New {activeTab === 'leads' ? 'Lead' : activeTab === 'opportunities' ? 'Opportunity' : activeTab === 'b2b' ? 'B2B Account' : 'D2C Consumer'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {activeTab === 'leads' && (
                <>
                  <div className="flex gap-4">
                    <input required placeholder="First Name" className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50" onChange={e => setFormData({...formData, firstName: e.target.value})} />
                    <input required placeholder="Last Name" className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50" onChange={e => setFormData({...formData, lastName: e.target.value})} />
                  </div>
                  <input placeholder="Company Name" className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50" onChange={e => setFormData({...formData, companyName: e.target.value})} />
                  <input placeholder="Email" type="email" className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50" onChange={e => setFormData({...formData, email: e.target.value})} />
                </>
              )}

              {activeTab === 'opportunities' && (
                <>
                  <input required placeholder="Deal Name" className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50" onChange={e => setFormData({...formData, name: e.target.value})} />
                  <input required type="number" placeholder="Amount ($)" className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50" onChange={e => setFormData({...formData, amount: parseFloat(e.target.value)})} />
                  <select required className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50" onChange={e => setFormData({...formData, stage: e.target.value})}>
                    <option value="">Select Pipeline Stage</option>
                    <option value="Prospecting">Prospecting</option>
                    <option value="Proposal">Proposal</option>
                    <option value="Negotiation">Negotiation</option>
                    <option value="Closed Won">Closed Won</option>
                  </select>
                </>
              )}

              {activeTab === 'b2b' && (
                <>
                  <input required placeholder="Company / Account Name" className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50" onChange={e => setFormData({...formData, customerName: e.target.value})} />
                  <input placeholder="Customer Group (e.g. Commercial)" className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50" onChange={e => setFormData({...formData, customerGroup: e.target.value})} />
                </>
              )}

              {activeTab === 'd2c' && (
                <>
                  <div className="flex gap-4">
                    <input required placeholder="First Name" className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50" onChange={e => setFormData({...formData, firstName: e.target.value})} />
                    <input required placeholder="Last Name" className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50" onChange={e => setFormData({...formData, lastName: e.target.value})} />
                  </div>
                  <input required placeholder="Email" type="email" className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50" onChange={e => setFormData({...formData, email: e.target.value})} />
                </>
              )}

              <div className="pt-6 flex justify-end gap-3 border-t border-gray-100">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 text-gray-600 font-bold hover:bg-gray-100 rounded-xl">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl shadow-md hover:bg-indigo-700">Save Record</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
