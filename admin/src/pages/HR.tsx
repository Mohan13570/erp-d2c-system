import { useState, useEffect } from 'react';
import { UserPlus, Calendar, DollarSign, Users, Briefcase } from 'lucide-react';

interface Employee {
  employee: string;
  employeeName: string;
  departmentId?: string;
  designation?: string;
  employmentType: string;
  joinDate: string;
  salary?: number;
  status: string;
}

interface Attendance {
  id: string;
  employeeId: string;
  date: string;
  clockIn?: string;
  clockOut?: string;
  hoursWorked?: number;
  employee: Employee;
}

interface Payroll {
  id: string;
  period: string;
  totalGross: number;
  totalNet: number;
  status: string;
  createdAt: string;
}

export default function HRView() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [payroll, setPayroll] = useState<Payroll[]>([]);
  const [activeTab, setActiveTab] = useState<'employees'|'attendance'|'payroll'>('employees');
  
  const [showEmpModal, setShowEmpModal] = useState(false);
  const [newEmp, setNewEmp] = useState({ employeeName: '', designation: '', employmentType: 'Full-time', salary: 0 });

  const [showAttModal, setShowAttModal] = useState(false);
  const [newAtt, setNewAtt] = useState({ employeeId: '', date: '', hoursWorked: 0 });

  const [showPayrollModal, setShowPayrollModal] = useState(false);
  const [newPayroll, setNewPayroll] = useState({ period: '', totalGross: 0, totalNet: 0, status: 'Processed' });

  const fetchData = async () => {
    fetch('/api/hr/employees').then(r => r.json()).then(setEmployees);
    fetch('/api/hr/attendance').then(r => r.json()).then(setAttendance);
    fetch('/api/hr/payroll').then(r => r.json()).then(setPayroll);
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreateEmp = async () => {
    if (!newEmp.employeeName) return alert('Name required');
    await fetch('/api/hr/employees', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({...newEmp, salary: Number(newEmp.salary)})});
    setShowEmpModal(false);
    fetchData();
  };

  const handleLogAttendance = async () => {
    if (!newAtt.employeeId || !newAtt.date) return alert('Missing fields');
    await fetch('/api/hr/attendance', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({...newAtt, hoursWorked: Number(newAtt.hoursWorked)})});
    setShowAttModal(false);
    fetchData();
  };

  const handleRunPayroll = async () => {
    if (!newPayroll.period) return alert('Period required');
    await fetch('/api/hr/payroll', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({...newPayroll, totalGross: Number(newPayroll.totalGross), totalNet: Number(newPayroll.totalNet)})});
    setShowPayrollModal(false);
    fetchData();
  };

  const handleDeleteEmp = async (id: string) => {
    if(!window.confirm('Delete this employee?')) return;
    await fetch(`/api/hr/employees/${id}`, { method: 'DELETE' });
    fetchData();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">HR & Payroll</h1>
          <p className="text-gray-500 mt-1">Manage employees, attendance, and run payroll.</p>
        </div>
        <div className="flex gap-3">
          {activeTab === 'employees' && (
            <button onClick={() => setShowEmpModal(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center">
              <UserPlus className="w-5 h-5 mr-2" /> Add Employee
            </button>
          )}
          {activeTab === 'attendance' && (
            <button onClick={() => setShowAttModal(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center">
              <Calendar className="w-5 h-5 mr-2" /> Log Attendance
            </button>
          )}
          {activeTab === 'payroll' && (
            <button onClick={() => setShowPayrollModal(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center">
              <DollarSign className="w-5 h-5 mr-2" /> Run Payroll
            </button>
          )}
        </div>
      </div>

      <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl w-fit">
        {[
          { id: 'employees', label: 'Employees', icon: Users },
          { id: 'attendance', label: 'Attendance', icon: Calendar },
          { id: 'payroll', label: 'Payroll', icon: DollarSign }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`flex items-center px-5 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === t.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <t.icon size={16} className="mr-2" /> {t.label}
          </button>
        ))}
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        {activeTab === 'employees' && (
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50/50">
              <tr>
                {['Name', 'Designation', 'Type', 'Status', 'Salary', 'Action'].map(h => <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {employees.map(e => (
                <tr key={e.employee} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 font-bold">{e.employeeName}</td>
                  <td className="px-6 py-4 text-sm">{e.designation || '-'}</td>
                  <td className="px-6 py-4 text-sm">{e.employmentType}</td>
                  <td className="px-6 py-4 text-sm"><span className={`px-2 py-1 rounded-full text-xs font-bold ${e.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{e.status}</span></td>
                  <td className="px-6 py-4 font-semibold text-indigo-600">${e.salary?.toLocaleString() || 0}</td>
                  <td className="px-6 py-4"><button onClick={() => handleDeleteEmp(e.employee)} className="text-red-500 font-bold hover:underline">Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        
        {activeTab === 'attendance' && (
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50/50">
              <tr>
                {['Date', 'Employee', 'Hours Worked', 'Status'].map(h => <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {attendance.map(a => (
                <tr key={a.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 font-medium">{new Date(a.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 font-bold">{a.employee?.employeeName || a.employeeId}</td>
                  <td className="px-6 py-4">{a.hoursWorked} hrs</td>
                  <td className="px-6 py-4 text-sm"><span className="px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">Logged</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === 'payroll' && (
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50/50">
              <tr>
                {['Period', 'Processed Date', 'Total Gross', 'Total Net', 'Status'].map(h => <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {payroll.map(p => (
                <tr key={p.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 font-bold text-indigo-600">{p.period}</td>
                  <td className="px-6 py-4 text-sm">{new Date(p.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 font-bold">${p.totalGross.toLocaleString()}</td>
                  <td className="px-6 py-4 font-black text-emerald-600">${p.totalNet.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm"><span className="px-2 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">{p.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showEmpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">Add Employee</h2>
            <div className="space-y-4">
              <input placeholder="Full Name" className="w-full p-3 border rounded-xl" onChange={e => setNewEmp({...newEmp, employeeName: e.target.value})} />
              
              <select className="w-full p-3 border rounded-xl" onChange={e => setNewEmp({...newEmp, designation: e.target.value})} value={['Software Engineer', 'DevOps Engineer', 'HR Manager', 'Sales Executive', 'Marketing Specialist', 'Accountant', 'Operations Lead', ''].includes(newEmp.designation) ? newEmp.designation : 'Other'}>
                <option value="">Select Designation/Type...</option>
                <option value="Software Engineer">Software Engineer</option>
                <option value="DevOps Engineer">DevOps Engineer</option>
                <option value="HR Manager">HR Manager</option>
                <option value="Sales Executive">Sales Executive</option>
                <option value="Marketing Specialist">Marketing Specialist</option>
                <option value="Accountant">Accountant</option>
                <option value="Operations Lead">Operations Lead</option>
                <option value="Other">Other</option>
              </select>
              
              {!['Software Engineer', 'DevOps Engineer', 'HR Manager', 'Sales Executive', 'Marketing Specialist', 'Accountant', 'Operations Lead', ''].includes(newEmp.designation) && (
                <input placeholder="Type Custom Designation" className="w-full p-3 border rounded-xl bg-indigo-50 border-indigo-100" value={newEmp.designation === 'Other' ? '' : newEmp.designation} onChange={e => setNewEmp({...newEmp, designation: e.target.value})} autoFocus />
              )}

              <select className="w-full p-3 border rounded-xl" onChange={e => setNewEmp({...newEmp, employmentType: e.target.value})} value={newEmp.employmentType}>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contractor">Contractor</option>
                <option value="Intern">Intern</option>
              </select>

              <input type="number" placeholder="Annual Salary" className="w-full p-3 border rounded-xl" onChange={e => setNewEmp({...newEmp, salary: Number(e.target.value)})} />
            </div>
            <div className="flex justify-end gap-3 mt-8">
              <button onClick={() => setShowEmpModal(false)} className="px-5 py-2.5 text-gray-600 font-bold hover:bg-gray-100 rounded-xl">Cancel</button>
              <button onClick={handleCreateEmp} className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl">Create</button>
            </div>
          </div>
        </div>
      )}

      {showAttModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">Log Attendance</h2>
            <div className="space-y-4">
              <select className="w-full p-3 border rounded-xl" onChange={e => setNewAtt({...newAtt, employeeId: e.target.value})}>
                <option value="">Select Employee...</option>
                {employees.map(e => <option key={e.employee} value={e.employee}>{e.employeeName}</option>)}
              </select>
              <input type="date" className="w-full p-3 border rounded-xl" onChange={e => setNewAtt({...newAtt, date: e.target.value})} />
              <input type="number" placeholder="Hours Worked (e.g. 8)" className="w-full p-3 border rounded-xl" onChange={e => setNewAtt({...newAtt, hoursWorked: Number(e.target.value)})} />
            </div>
            <div className="flex justify-end gap-3 mt-8">
              <button onClick={() => setShowAttModal(false)} className="px-5 py-2.5 text-gray-600 font-bold hover:bg-gray-100 rounded-xl">Cancel</button>
              <button onClick={handleLogAttendance} className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl">Save</button>
            </div>
          </div>
        </div>
      )}

      {showPayrollModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">Run Payroll</h2>
            <div className="space-y-4">
              <input placeholder="Period (e.g. May 2026)" className="w-full p-3 border rounded-xl" onChange={e => setNewPayroll({...newPayroll, period: e.target.value})} />
              <input type="number" placeholder="Total Gross Amount" className="w-full p-3 border rounded-xl" onChange={e => setNewPayroll({...newPayroll, totalGross: Number(e.target.value)})} />
              <input type="number" placeholder="Total Net Amount" className="w-full p-3 border rounded-xl" onChange={e => setNewPayroll({...newPayroll, totalNet: Number(e.target.value)})} />
            </div>
            <div className="flex justify-end gap-3 mt-8">
              <button onClick={() => setShowPayrollModal(false)} className="px-5 py-2.5 text-gray-600 font-bold hover:bg-gray-100 rounded-xl">Cancel</button>
              <button onClick={handleRunPayroll} className="px-5 py-2.5 bg-emerald-600 text-white font-bold rounded-xl">Process</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
