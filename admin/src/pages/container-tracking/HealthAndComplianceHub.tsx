import React, { useState, useEffect } from 'react';
import { ShieldCheck, HeartPulse, AlertCircle, FileCheck2 } from 'lucide-react';

export default function HealthAndComplianceHub() {
  const [compliance, setCompliance] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/container-tracking/compliance')
      .then(res => res.json())
      .then(setCompliance)
      .catch(console.error);
  }, []);

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8 h-[calc(100vh-4rem)] overflow-y-auto bg-gray-50/50">
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-black text-gray-900 flex items-center">
            <ShieldCheck className="mr-3 text-violet-600" size={32} /> Health & Compliance Hub
          </h1>
          <p className="text-gray-500 font-medium mt-1">Monitor Container Health Scores and track CSC Plate / ISO Certification expirations.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <FileCheck2 className="mr-2 text-violet-500" size={24} /> Compliance Tracker
          </h2>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white border-b border-gray-100">
              <th className="p-4 font-bold text-gray-700 text-xs uppercase tracking-wider">Container No</th>
              <th className="p-4 font-bold text-gray-700 text-xs uppercase tracking-wider">Document Type</th>
              <th className="p-4 font-bold text-gray-700 text-xs uppercase tracking-wider">Document Ref</th>
              <th className="p-4 font-bold text-gray-700 text-xs uppercase tracking-wider">Expiry Date</th>
              <th className="p-4 font-bold text-gray-700 text-xs uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {compliance.map(cert => {
              const daysLeft = Math.ceil((new Date(cert.expiryDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
              const isExpired = daysLeft < 0;
              const isWarning = daysLeft >= 0 && daysLeft <= 30;
              
              return (
                <tr key={cert.id} className="hover:bg-gray-50">
                  <td className="p-4 text-sm font-black text-gray-900 font-mono">{cert.container?.containerNo}</td>
                  <td className="p-4 text-sm font-bold text-gray-700">{cert.documentType}</td>
                  <td className="p-4 text-sm text-gray-500 font-mono">{cert.documentNumber}</td>
                  <td className="p-4 text-sm font-bold text-gray-900">{new Date(cert.expiryDate).toLocaleDateString()}</td>
                  <td className="p-4">
                    {isExpired ? (
                      <span className="px-3 py-1 bg-rose-100 text-rose-700 text-xs font-bold rounded-full flex items-center inline-flex">
                        <AlertCircle size={12} className="mr-1" /> Expired
                      </span>
                    ) : isWarning ? (
                      <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">Expiring Soon ({daysLeft}d)</span>
                    ) : (
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">Valid</span>
                    )}
                  </td>
                </tr>
              )
            })}
            {compliance.length === 0 && (
              <tr><td colSpan={5} className="p-8 text-center text-gray-400 font-medium">No compliance records found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
