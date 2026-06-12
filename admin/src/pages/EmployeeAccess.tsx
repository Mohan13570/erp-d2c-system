import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Users, Shield, Save, CheckCircle2, Trash2 } from 'lucide-react';

export default function EmployeeAccess() {
  const { user, token } = useAuth();
  const [employees, setEmployees] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [success, setSuccess] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newEmp, setNewEmp] = useState({ email: '', password: '', firstName: '', lastName: '', roleId: '' });
  const [errorMsg, setErrorMsg] = useState('');

  const fetchData = () => {
    if (user?.role !== 'System Admin') return;
    fetch('/api/rbac/users', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setEmployees(data.users || []);
        setRoles(data.roles || []);
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetchData();
  }, [user, token]);

  const handleUpdateRole = async (empId: string, roleId: string) => {
    try {
      const res = await fetch(`/api/rbac/users/${empId}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ roleId })
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteEmp = async (empId: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this employee?")) return;
    try {
      const res = await fetch(`/api/rbac/users/${empId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchData();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete employee');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateEmp = async () => {
    setErrorMsg('');
    if (!newEmp.email || !newEmp.password || !newEmp.firstName || !newEmp.lastName || !newEmp.roleId) {
      setErrorMsg('All fields are required, including role selection.');
      return;
    }
    try {
      const res = await fetch('/api/rbac/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(newEmp)
      });
      if (res.ok) {
        setShowModal(false);
        setNewEmp({ email: '', password: '', firstName: '', lastName: '', roleId: '' });
        fetchData();
      } else {
        const errData = await res.json();
        setErrorMsg(errData.error || 'Failed to create employee');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Network error occurred.');
    }
  };

  if (user?.role !== 'System Admin') {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500">
        <Shield className="w-16 h-16 text-red-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
        <p>You do not have Administrator privileges to view this page.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex justify-between items-center bg-white/60 backdrop-blur-xl p-6 rounded-3xl border border-white/40 shadow-sm">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Employee Directory</h1>
          <p className="text-gray-500 font-medium mt-1">Manage Aura employees and their system access roles.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/40 transition-all">
          + New Employee
        </button>
      </div>

      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 shadow-sm">
        <h3 className="text-sm font-bold text-indigo-900 mb-1 flex items-center"><Shield className="w-4 h-4 mr-2" /> Admin Security Notice</h3>
        <p className="text-sm text-indigo-700">For testing and demo purposes, all system employees (except those you specifically set a password for) use the default login password: <strong className="bg-indigo-200 px-2 py-0.5 rounded ml-1">employee123</strong></p>
      </div>

      {success && (
        <div className="p-4 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 flex items-center shadow-sm">
          <CheckCircle2 className="w-5 h-5 mr-2" />
          Employee access role updated successfully!
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white p-8 rounded-3xl w-full max-w-lg shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Register New Employee</h2>
            <div className="space-y-4">
              <input placeholder="Email" type="email" className="w-full p-3 border rounded-xl" value={newEmp.email} onChange={e => setNewEmp({...newEmp, email: e.target.value})} />
              <input placeholder="Password" type="password" className="w-full p-3 border rounded-xl" value={newEmp.password} onChange={e => setNewEmp({...newEmp, password: e.target.value})} />
              <div className="flex gap-4">
                <input placeholder="First Name" className="w-full p-3 border rounded-xl" value={newEmp.firstName} onChange={e => setNewEmp({...newEmp, firstName: e.target.value})} />
                <input placeholder="Last Name" className="w-full p-3 border rounded-xl" value={newEmp.lastName} onChange={e => setNewEmp({...newEmp, lastName: e.target.value})} />
              </div>
              <select className="w-full p-3 border rounded-xl bg-white" value={newEmp.roleId} onChange={e => setNewEmp({...newEmp, roleId: e.target.value})}>
                <option value="">-- Assign Initial Role --</option>
                {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            </div>
            {errorMsg && <p className="text-red-600 mt-4 font-medium text-sm">{errorMsg}</p>}
            <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
              <button onClick={() => { setShowModal(false); setErrorMsg(''); }} className="px-5 py-2.5 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition-colors">Cancel</button>
              <button onClick={handleCreateEmp} className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl shadow-md hover:bg-indigo-700 transition-colors">Register Employee</button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-50">
            <thead className="bg-gray-50/80">
              <tr>
                {['Name', 'Email', 'Assigned Role', 'Actions'].map(h => (
                  <th key={h} className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {employees.map(emp => (
                <tr key={emp.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">{emp.firstName} {emp.lastName}</div>
                    <div className="text-xs text-gray-500 font-mono mt-1">{emp.id.substring(0, 8)}</div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-600">{emp.email}</td>
                  <td className="px-6 py-4">
                    <select
                      className="text-sm font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={emp.roleId || ''}
                      onChange={(e) => handleUpdateRole(emp.id, e.target.value)}
                      disabled={emp.email === 'admin@aura.com'}
                    >
                      <option value="">No Role</option>
                      {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => handleDeleteEmp(emp.id)}
                      disabled={emp.email === 'admin@aura.com'}
                      className={`p-2 rounded-lg transition-colors ${emp.email === 'admin@aura.com' ? 'text-gray-300' : 'text-rose-500 hover:bg-rose-50'}`}
                      title={emp.email === 'admin@aura.com' ? "Cannot delete the primary admin" : "Delete Employee"}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {employees.length === 0 && <div className="text-center p-12 text-gray-400 font-medium">No employees found.</div>}
        </div>
      </div>
    </div>
  );
}
