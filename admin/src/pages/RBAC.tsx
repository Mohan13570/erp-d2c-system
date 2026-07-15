import { useState, useEffect } from 'react';
import { Shield, Users, Key, ShieldAlert, Search, ChevronLeft, ChevronRight, FileText, Eye, AlertTriangle, X, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Policy { id: string; module: string; action: string; }
interface Role { id: string; name: string; description: string; isSystem: boolean; permissions: Policy[]; }
interface AuditLog { id: string; action: string; tableName: string; recordId: string; oldState: string | null; newState: string | null; ipAddress: string | null; createdAt: string; user?: { firstName: string; lastName: string; email: string }; d2cCustomer?: { firstName: string; lastName: string; email: string }; }

export default function RBAC() {
  const { token } = useAuth();
  const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

  const [tab, setTab] = useState<'roles' | 'audit'>('roles');
  const [data, setData] = useState<{ users: any[], roles: Role[] }>({ users: [], roles: [] });
  const [loading, setLoading] = useState(true);

  // Roles modal state
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [editingRole, setEditingRole] = useState<string | null>(null);
  const [newRole, setNewRole] = useState({ name: '', description: '', policies: [] as { module: string, action: string }[] });

  // Audit Log pagination & filtering state
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [auditSearch, setAuditSearch] = useState('');
  const [auditAction, setAuditAction] = useState('All');
  const [auditTable, setAuditTable] = useState('All');
  const [auditPage, setAuditPage] = useState(1);
  const [auditTotalPages, setAuditTotalPages] = useState(1);

  // Inspector modal for JSON changes
  const [inspectLog, setInspectLog] = useState<AuditLog | null>(null);

  const fetchUsersAndRoles = () => {
    if (!token) return;
    setLoading(true);
    fetch('/api/rbac/users', { headers })
      .then(r => r.json())
      .then(res => {
        setData({ users: res.users || [], roles: res.roles || [] });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const fetchAuditLogs = () => {
    if (!token) return;
    setLoading(true);
    let url = `/api/rbac/audit-logs?paginate=true&page=${auditPage}&search=${auditSearch}`;
    if (auditAction !== 'All') url += `&action=${auditAction}`;
    if (auditTable !== 'All') url += `&tableName=${auditTable}`;
    
    fetch(url, { headers })
      .then(r => r.json())
      .then(res => {
        setAuditLogs(res.logs || []);
        setAuditTotalPages(res.pagination?.totalPages || 1);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    if (tab === 'roles') {
      fetchUsersAndRoles();
    } else {
      fetchAuditLogs();
    }
  }, [tab, auditPage, auditSearch, auditAction, auditTable, token]);

  const handleSaveRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRole.name) return;
    
    try {
      if (editingRole) {
        await fetch(`/api/rbac/roles/${editingRole}/permissions`, {
          method: 'PUT',
          headers,
          body: JSON.stringify({ policies: newRole.policies })
        });
      } else {
        await fetch('/api/rbac/roles', {
          method: 'POST',
          headers,
          body: JSON.stringify(newRole)
        });
      }
      setShowRoleModal(false);
      setEditingRole(null);
      setNewRole({ name: '', description: '', policies: [] });
      fetchUsersAndRoles();
    } catch(err) {
      console.error(err);
    }
  };

  const handleDeleteRole = async (id: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this role?')) return;
    try {
      const res = await fetch(`/api/rbac/roles/${id}`, { method: 'DELETE', headers });
      if (res.ok) {
        fetchUsersAndRoles();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to delete role');
      }
    } catch(err) {
      console.error(err);
    }
  };

  const getActionBadge = (a: string) => {
    if (a === 'CREATE') return 'bg-emerald-50 text-emerald-700 border border-emerald-100';
    if (a === 'UPDATE') return 'bg-blue-50 text-blue-700 border border-blue-100';
    if (a === 'DELETE') return 'bg-rose-50 text-rose-700 border border-rose-100';
    return 'bg-gray-50 text-gray-700 border border-gray-100';
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in duration-500 pb-12">
      {/* Header card with glass blur */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/60 backdrop-blur-xl p-6 rounded-3xl border border-white/40 shadow-sm">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Auth & RBAC</h1>
          <p className="text-gray-500 font-medium mt-1">Role-based access control and system audit logs.</p>
        </div>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600"><Users size={24} /></div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">System Users</p>
            <p className="text-3xl font-black text-gray-900">{data.users.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600"><Shield size={24} /></div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Defined Roles</p>
            <p className="text-3xl font-black text-gray-900">{data.roles.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-amber-50 rounded-2xl text-amber-600"><Key size={24} /></div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Security State</p>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700">Audit Active</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="bg-gray-100/80 backdrop-blur-md p-1.5 rounded-2xl w-fit flex space-x-1 border border-white/50 shadow-inner">
          <button onClick={() => setTab('roles')}
            className={`flex items-center px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${tab === 'roles' ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}>
            <Shield size={18} className="mr-2" /> Roles & Policies
          </button>
          <button onClick={() => setTab('audit')}
            className={`flex items-center px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${tab === 'audit' ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}>
            <FileText size={18} className="mr-2" /> System Audit Logs
          </button>
        </div>

        {/* Filters specific to active tab */}
        {tab === 'audit' && (
          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:flex-initial">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search audit trail..." 
                className="pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm w-full md:w-56 bg-white font-medium"
                value={auditSearch}
                onChange={(e) => { setAuditSearch(e.target.value); setAuditPage(1); }}
              />
            </div>
            <select 
              className="p-2.5 border rounded-xl text-sm bg-white font-bold text-gray-700 outline-none"
              value={auditAction}
              onChange={e => { setAuditAction(e.target.value); setAuditPage(1); }}
            >
              <option value="All">All Actions</option>
              <option value="CREATE">CREATE</option>
              <option value="UPDATE">UPDATE</option>
              <option value="DELETE">DELETE</option>
            </select>
            <select 
              className="p-2.5 border rounded-xl text-sm bg-white font-bold text-gray-700 outline-none"
              value={auditTable}
              onChange={e => { setAuditTable(e.target.value); setAuditPage(1); }}
            >
              <option value="All">All Entities</option>
              <option value="User">Users</option>
              <option value="Role">Roles</option>
              <option value="Item">Items</option>
              <option value="SalesOrder">Sales Orders</option>
              <option value="StockLevel">Stock Levels</option>
              <option value="StockLedger">Stock Ledgers</option>
            </select>
          </div>
        )}
      </div>

      {/* Main Tab content containers */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden min-h-[400px] flex flex-col justify-between relative">
        {loading && <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center"><div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" /></div>}

        {/* ROLES TAB */}
        {tab === 'roles' && (
          <div className="p-8 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-bold text-gray-900 text-xl">Roles & Access Schemes</h2>
                <p className="text-gray-400 text-xs mt-1">Configure module-wise permission keys.</p>
              </div>
              <button onClick={() => setShowRoleModal(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm flex items-center transition-colors">
                + Add Role
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.roles.map((r) => (
                <div key={r.id} className="p-5 bg-gray-50 border border-gray-100 rounded-2xl flex flex-col justify-between shadow-sm">
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-900 flex items-center text-sm">{r.name} {r.isSystem && <ShieldAlert size={14} className="ml-2 text-indigo-500" />}</h3>
                        <p className="text-xs text-gray-400 mt-1 font-medium">{r.description || 'No description provided.'}</p>
                      </div>
                      <span className="text-[10px] font-bold bg-white border border-gray-200 px-3 py-1 rounded-full text-indigo-600 shadow-sm">{r.permissions?.length || 0} Modules</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {r.permissions?.map((p: any, i: number) => (
                        <span key={i} className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 bg-indigo-50/50 text-indigo-700 border border-indigo-100/50 rounded-lg">{p.module}</span>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100 text-xs font-bold">
                    {r.name !== 'System Admin' && (
                      <button onClick={() => {
                        setEditingRole(r.id);
                        setNewRole({ name: r.name, description: r.description || '', policies: r.permissions || [] });
                        setShowRoleModal(true);
                      }} className="text-indigo-600 hover:underline">Edit Access</button>
                    )}
                    {!r.isSystem && <button onClick={() => handleDeleteRole(r.id)} className="text-rose-600 hover:underline">Delete Role</button>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AUDIT LOG TAB */}
        {tab === 'audit' && (
          <div className="flex-1 flex flex-col justify-between">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-50">
                <thead className="bg-gray-50/80">
                  <tr>
                    {['Timestamp', 'Performed By', 'Action', 'Target Table', 'Record ID', ''].map(h => <th key={h} className="px-8 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">{h}</th>)}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 bg-white">
                  {auditLogs.length === 0 ? (
                    <tr><td colSpan={6} className="px-8 py-12 text-center text-gray-400 font-semibold">No audit logs matching selection.</td></tr>
                  ) : auditLogs.map(log => {
                    const actorName = log.user ? `${log.user.firstName} ${log.user.lastName}` : (log.d2cCustomer ? `${log.d2cCustomer.firstName} ${log.d2cCustomer.lastName} (D2C)` : 'System');
                    return (
                      <tr key={log.id} className="hover:bg-gray-50/30 transition-colors">
                        <td className="px-8 py-4 text-xs font-semibold text-gray-500">{new Date(log.createdAt).toLocaleString()}</td>
                        <td className="px-8 py-4">
                          <div className="text-sm font-bold text-gray-900">{actorName}</div>
                          <div className="text-[10px] font-semibold text-gray-400 font-mono mt-0.5">{log.user?.email || log.d2cCustomer?.email || 'Aura System'}</div>
                        </td>
                        <td className="px-8 py-4"><span className={`px-2.5 py-1 text-[9px] font-black rounded-lg ${getActionBadge(log.action)}`}>{log.action}</span></td>
                        <td className="px-8 py-4 text-xs font-mono font-bold text-indigo-600">{log.tableName}</td>
                        <td className="px-8 py-4 text-xs font-mono font-medium text-gray-500">{log.recordId.substring(0, 8).toUpperCase()}</td>
                        <td className="px-8 py-4 text-right">
                          {(log.oldState || log.newState) && (
                            <button onClick={() => setInspectLog(log)} className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors flex items-center gap-1.5 ml-auto">
                              <Eye size={16} /> <span className="text-[10px] font-bold uppercase tracking-wider">Inspect State</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Audit Logs Pagination */}
            {auditTotalPages > 1 && (
              <div className="p-5 border-t flex justify-end items-center space-x-3 bg-gray-50/50">
                <button 
                  disabled={auditPage === 1}
                  onClick={() => setAuditPage(prev => Math.max(prev - 1, 1))}
                  className="p-2 border rounded-lg bg-white disabled:opacity-40 hover:bg-gray-50"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-xs font-bold text-gray-500">Page {auditPage} of {auditTotalPages}</span>
                <button 
                  disabled={auditPage === auditTotalPages}
                  onClick={() => setAuditPage(prev => Math.min(prev + 1, auditTotalPages))}
                  className="p-2 border rounded-lg bg-white disabled:opacity-40 hover:bg-gray-50"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* CREATE/EDIT ROLE MODAL */}
      {showRoleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white p-8 rounded-3xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">{editingRole ? `Edit Access: ${newRole.name}` : 'Create Custom Role'}</h2>
            <form onSubmit={handleSaveRole} className="space-y-4">
              <input required disabled={!!editingRole} placeholder="Role Name (e.g. Inventory Clerk)" className="w-full p-3 border rounded-xl font-medium disabled:opacity-50" value={newRole.name} onChange={e => setNewRole({...newRole, name: e.target.value})} />
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
                        <input type="checkbox" className="rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer" checked={isChecked} onChange={(e) => {
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

              <div className="flex justify-end gap-3 mt-8 pt-4 border-t">
                <button type="button" onClick={() => { setShowRoleModal(false); setEditingRole(null); setNewRole({ name: '', description: '', policies: [] }); }} className="px-5 py-2.5 text-gray-600 font-bold hover:bg-gray-100 rounded-xl">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl shadow-lg">{editingRole ? 'Save Changes' : 'Create Role'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AUDIT LOG INSPECTOR MODAL */}
      {inspectLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white p-8 rounded-3xl w-full max-w-4xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  Inspect Transaction Audit <span className={`px-3 py-1 rounded-full text-xs ${getActionBadge(inspectLog.action)}`}>{inspectLog.action}</span>
                </h2>
                <p className="text-xs text-gray-400 font-semibold mt-1">Entity: {inspectLog.tableName} | Record ID: {inspectLog.recordId}</p>
              </div>
              <button onClick={() => setInspectLog(null)} className="p-2 hover:bg-gray-100 rounded-full"><X size={20} /></button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {/* Old State */}
              <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                <div className="bg-rose-50 text-rose-700 px-4 py-2.5 border-b border-rose-100 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle size={14} /> Old State (Pre-transaction)
                </div>
                <div className="p-4 bg-gray-50/50 max-h-96 overflow-auto font-mono text-[11px] leading-relaxed text-gray-600">
                  {inspectLog.oldState ? (
                    <pre className="whitespace-pre-wrap">{JSON.stringify(JSON.parse(inspectLog.oldState), null, 2)}</pre>
                  ) : (
                    <p className="text-gray-400 italic">No pre-existing state (Creation Event)</p>
                  )}
                </div>
              </div>

              {/* New State */}
              <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                <div className="bg-emerald-50 text-emerald-700 px-4 py-2.5 border-b border-emerald-100 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 size={14} /> New State (Post-transaction)
                </div>
                <div className="p-4 bg-gray-50/50 max-h-96 overflow-auto font-mono text-[11px] leading-relaxed text-gray-600">
                  {inspectLog.newState ? (
                    <pre className="whitespace-pre-wrap">{JSON.stringify(JSON.parse(inspectLog.newState), null, 2)}</pre>
                  ) : (
                    <p className="text-gray-400 italic">No final state (Deletion Event)</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-8 pt-4 border-t">
              <button onClick={() => setInspectLog(null)} className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl shadow-md hover:bg-indigo-700">Close Inspector</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
