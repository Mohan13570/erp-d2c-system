import React, { useState, useEffect } from 'react';
import { employeePortalService } from '../services/employeeApi';
import { Users, Search, Mail, Phone, Briefcase, Building2, ShieldCheck, ChevronRight } from 'lucide-react';

export default function EmployeeDirectory() {
  const [directory, setDirectory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    employeePortalService.getDirectory()
      .then(res => {
        if (res.data.success) setDirectory(res.data.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const mockDirectory = directory.length > 0 ? directory : [
    {
      id: '1',
      firstName: 'Aura',
      lastName: 'Employee',
      officialEmail: 'employee@aura.com',
      primaryMobile: '+91 98765 43210',
      employeeCode: 'EMP-001',
      employmentInfo: { designation: { name: 'Logistics Operations Specialist' } }
    },
    {
      id: '2',
      firstName: 'Mohan',
      lastName: 'Manager',
      officialEmail: 'manager@aura.com',
      primaryMobile: '+91 98765 43211',
      employeeCode: 'EMP-002',
      employmentInfo: { designation: { name: 'Fleet Operations Manager' } }
    },
    {
      id: '3',
      firstName: 'System',
      lastName: 'Admin',
      officialEmail: 'admin@aura.com',
      primaryMobile: '+91 98765 43212',
      employeeCode: 'EMP-000',
      employmentInfo: { designation: { name: 'VP of HR & Systems' } }
    }
  ];

  const filtered = mockDirectory.filter(emp => {
    const query = search.toLowerCase();
    const name = `${emp.firstName} ${emp.lastName}`.toLowerCase();
    const email = (emp.officialEmail || '').toLowerCase();
    const desig = (emp.employmentInfo?.designation?.name || '').toLowerCase();
    return name.includes(query) || email.includes(query) || desig.includes(query);
  });

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto animate-pulse">
        <div className="h-8 w-48 bg-slate-200 rounded-lg col-span-3" />
        {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-36 bg-white rounded-2xl border border-slate-200" />)}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* ── Breadcrumbs & Page Header ──────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <nav className="flex items-center space-x-2 text-xs font-semibold text-slate-500 mb-1">
            <span>Home</span>
            <ChevronRight size={12} />
            <span>Employee Portal</span>
            <ChevronRight size={12} />
            <span className="text-blue-600 font-bold">Employee Directory</span>
          </nav>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Company Employee Directory
          </h1>
          <p className="text-sm text-slate-500 font-normal mt-0.5">
            Search colleague contact details across corporate departments.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, email, role..."
            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-sm font-medium"
          />
        </div>
      </div>

      {/* Privacy Notice Banner */}
      <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 text-xs text-blue-800 flex items-center gap-2 font-medium">
        <ShieldCheck size={16} className="text-blue-600 shrink-0" />
        <span>Privacy Safeguard: Personal addresses, compensation, and tax information are hidden from directory queries.</span>
      </div>

      {/* ── Directory Grid Cards ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((emp, idx) => (
          <div key={idx} className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-3 hover:border-blue-500 hover:shadow-md transition-all shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-base uppercase shrink-0 shadow-sm">
                {emp.firstName?.[0]}{emp.lastName?.[0]}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">
                  {emp.firstName} {emp.lastName}
                </p>
                <p className="text-xs text-blue-600 font-semibold truncate">
                  {emp.employmentInfo?.designation?.name || 'Logistics Specialist'}
                </p>
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100 font-medium">
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-slate-400 shrink-0" />
                <a href={`mailto:${emp.officialEmail}`} className="hover:text-blue-600 truncate">
                  {emp.officialEmail || 'email@company.com'}
                </a>
              </div>
              {emp.primaryMobile && (
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-slate-400 shrink-0" />
                  <span>{emp.primaryMobile}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
