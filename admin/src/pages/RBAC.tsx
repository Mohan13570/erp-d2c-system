import { useState, useEffect } from 'react';
import { Shield, Users, Key, ShieldAlert } from 'lucide-react';

export default function RBAC() {
  const [data, setData] = useState<any>({ users: [], roles: [], logs: [] });
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [editingRole, setEditingRole] = useState<string | null>(null);
  const [newRole, setNewRole] = useState({ name: '', description: '', policies: [{ module: 'All', action: 'Read' }] as any[] });

  const fetchData = () => {
    fetch('/api/rbac/users')
      .then(r => r.json())
      .then(setData)
      .catch(() => {});
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRole.name) return;
    
    if (editingRole) {
      await fetch(`/api/rbac/roles/${editingRole}/permissions`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ policies: newRole.policies })
      });
    } else {
      await fetch('/api/rbac/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRole)
      });
    }
    
    setShowRoleModal(false);
    setEditingRole(null);
    setNewRole({ name: '', description: '', policies: [{ module: 'All', action: 'Read' }] });
    fetchData();
  };

  const handleDeleteRole = async (id: string) => {
    if (!window.confirm('Delete role?')) return;
    await fetch(`/api/rbac/roles/${id}`, { method: 'DELETE' });
    fetchData();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500 pb-12">
      <div className="flex justify-between items-center bg-white/60 backdrop-blur-xl p-6 rounded-3xl border border-white/40 shadow-sm">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Auth & RBAC</h1>
          <p className="text-gray-500 font-medium mt-1">Role-based access control and system audit logs.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <Users size={32} className="text-indigo-600 mb-4" />
          <p className="text-gray-500 font-medium mb-1">System Users</p>
          <p className="text-4xl font-black text-gray-900">{data.users.length}</p>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <Shield size={32} className="text-emerald-600 mb-4" />
          <p className="text-gray-500 font-medium mb-1">Defined Roles</p>
          <p className="text-4xl font-black text-gray-900">{data.roles.length}</p>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <Key size={32} className="text-amber-600 mb-4" />
          <p className="text-gray-500 font-medium mb-1">Active Sessions</p>
          <p className="text-4xl font-black text-gray-900">1</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-gray-900 text-xl">Roles & Policies</h2>
            <button onClick={() => setShowRoleModal(true)} className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100">
              + Add Role
            </button>
          </div>
          <div className="space-y-3">
            {data.roles.map((r: any) => (
              <div key={r.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex justify-between items-center">
                <div>
                  <p className="font-bold text-gray-900 flex items-center">{r.name} {r.isSystem && <ShieldAlert size={14} className="ml-2 text-indigo-600" />}</p>
                  <p className="text-xs text-gray-500 mt-1">{r.description}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold bg-white border border-gray-200 px-3 py-1 rounded-full text-gray-600">{r.permissions?.length || 0} Policies</span>
                  {r.name !== 'System Admin' && (
                    <button onClick={() => {
                      setEditingRole(r.id);
                      setNewRole({ name: r.name, description: r.description || '', policies: r.permissions || [] });
                      setShowRoleModal(true);
                    }} className="text-xs text-indigo-600 font-bold hover:underline">Edit Access</button>
                  )}
                  {!r.isSystem && <button onClick={() => handleDeleteRole(r.id)} className="text-xs text-red-500 font-bold hover:underline">Delete</button>}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 flex flex-col space-y-6">
          <h2 className="font-bold text-gray-900 text-xl">Recent Logins</h2>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Company Logins */}
            <div>
              <h3 className="font-bold text-gray-700 mb-4 text-sm uppercase tracking-wider">🏢 Company Logins</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {data.logs.filter((l: any) => l.action === 'Login' && l.tableName === 'User').map((l: any) => (
                  <div key={l.id} className="p-4 border-l-4 border-indigo-500 bg-gray-50 rounded-r-2xl border border-y-gray-100 border-r-gray-100 text-sm">
                    <div className="flex justify-between mb-1">
                      <span className="font-bold text-gray-900">{l.user?.firstName} {l.user?.lastName}</span>
                      <span className="text-xs text-gray-400 font-medium">{new Date(l.createdAt).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{l.user?.email}</p>
                    <p className="text-xs text-gray-400 font-mono mt-2">IP: {l.ipAddress || 'Unknown'}</p>
                  </div>
                ))}
                {data.logs.filter((l: any) => l.action === 'Login' && l.tableName === 'User').length === 0 && <p className="text-sm text-gray-400">No company logins found.</p>}
              </div>
            </div>

            {/* Store Logins */}
            <div>
              <h3 className="font-bold text-gray-700 mb-4 text-sm uppercase tracking-wider">🛒 Store Logins</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {data.logs.filter((l: any) => l.action === 'Login' && l.tableName === 'D2CCustomer').map((l: any) => (
                  <div key={l.id} className="p-4 border-l-4 border-emerald-500 bg-emerald-50/30 rounded-r-2xl border border-y-gray-100 border-r-gray-100 text-sm">
                    <div className="flex justify-between mb-1">
                      <span className="font-bold text-gray-900">{l.d2cCustomer?.firstName} {l.d2cCustomer?.lastName}</span>
                      <span className="text-xs text-gray-400 font-medium">{new Date(l.createdAt).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{l.d2cCustomer?.email}</p>
                    <p className="text-xs text-gray-400 font-mono mt-2">IP: {l.ipAddress || 'Unknown'}</p>
                  </div>
                ))}
                {data.logs.filter((l: any) => l.action === 'Login' && l.tableName === 'D2CCustomer').length === 0 && <p className="text-sm text-gray-400">No store logins found.</p>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showRoleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white p-8 rounded-3xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">{editingRole ? `Edit Access: ${newRole.name}` : 'Create Custom Role'}</h2>
            <form onSubmit={handleSaveRole} className="space-y-4">
              <input required disabled={!!editingRole} placeholder="Role Name (e.g. Content Creator)" className="w-full p-3 border rounded-xl font-medium disabled:opacity-50" value={newRole.name} onChange={e => setNewRole({...newRole, name: e.target.value})} />
              <input placeholder="Description" disabled={!!editingRole} className="w-full p-3 border rounded-xl disabled:opacity-50" value={newRole.description} onChange={e => setNewRole({...newRole, description: e.target.value})} />
              
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Allowed Modules</label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {[
                    'Dashboard', 'Analytics', 'CRM & Sales',
                    'Inventory', 'Sales Orders', 'Supply Chain', 'Manufacturing', 'Projects', 'Assets',
                    'HR & Payroll', 'Finance', 'Company Stock',
                    'Marketing', 'Returns',
                    'Auth & RBAC', 'User Access'
                  ].map(mod => {
                    const isChecked = newRole.policies.some((p: any) => p.module === mod);
                    return (
                      <label key={mod} className="flex items-center space-x-2 text-sm font-medium text-gray-700 cursor-pointer">
                        <input type="checkbox" className="rounded text-indigo-600 focus:ring-indigo-500" checked={isChecked} onChange={(e) => {
                          if (e.target.checked) {
                            setNewRole({...newRole, policies: [...newRole.policies, { module: mod, action: 'All' }]});
                          } else {
                            setNewRole({...newRole, policies: newRole.policies.filter((p: any) => p.module !== mod)});
                          }
                        }} />
                        <span>{mod}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button type="button" onClick={() => { setShowRoleModal(false); setEditingRole(null); setNewRole({ name: '', description: '', policies: [{ module: 'All', action: 'Read' }] }); }} className="px-5 py-2.5 text-gray-600 font-bold hover:bg-gray-100 rounded-xl">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl shadow-lg">{editingRole ? 'Save Changes' : 'Create Role'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
