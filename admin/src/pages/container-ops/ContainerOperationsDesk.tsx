import React, { useState, useEffect } from 'react';
import { TerminalSquare, ShieldAlert, LogIn, LogOut, Wrench } from 'lucide-react';

export default function ContainerOperationsDesk() {
  const [operations, setOperations] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/container-ops/operations')
      .then(res => res.json())
      .then(setOperations)
      .catch(console.error);
  }, []);

  const getIcon = (type: string) => {
    if (type.includes('GateIn')) return <LogIn size={16} className="text-emerald-500" />;
    if (type.includes('GateOut')) return <LogOut size={16} className="text-amber-500" />;
    if (type.includes('Fumigation')) return <ShieldAlert size={16} className="text-purple-500" />;
    return <Wrench size={16} className="text-slate-500" />;
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8 h-[calc(100vh-4rem)] overflow-y-auto bg-gray-50/50">
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-black text-gray-900 flex items-center">
            <TerminalSquare className="mr-3 text-rose-600" size={32} /> Operations Desk
          </h1>
          <p className="text-gray-500 font-medium mt-1">Execute ground-level operations (Gate In/Out, Stuffing, Fumigation).</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="p-4 font-bold text-gray-700 text-xs uppercase tracking-wider">Time</th>
              <th className="p-4 font-bold text-gray-700 text-xs uppercase tracking-wider">Operation</th>
              <th className="p-4 font-bold text-gray-700 text-xs uppercase tracking-wider">Container No</th>
              <th className="p-4 font-bold text-gray-700 text-xs uppercase tracking-wider">Operator</th>
              <th className="p-4 font-bold text-gray-700 text-xs uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {operations.map(op => (
              <tr key={op.id} className="hover:bg-gray-50">
                <td className="p-4 text-sm font-bold text-gray-500">{new Date(op.timestamp).toLocaleString()}</td>
                <td className="p-4">
                  <div className="flex items-center text-sm font-bold text-gray-900">
                    <span className="mr-2 bg-gray-100 p-1.5 rounded-lg">{getIcon(op.type)}</span>
                    {op.type}
                  </div>
                </td>
                <td className="p-4 text-sm font-black text-gray-900 font-mono tracking-wider">{op.container?.containerNo}</td>
                <td className="p-4 text-sm font-bold text-gray-500">{op.performedBy || 'System'}</td>
                <td className="p-4">
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full">{op.status}</span>
                </td>
              </tr>
            ))}
            {operations.length === 0 && (
              <tr><td colSpan={5} className="p-8 text-center text-gray-400 font-medium">No operations logged today.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
