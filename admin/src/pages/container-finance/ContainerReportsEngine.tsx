import React, { useState } from 'react';
import { FileText, Download, FileSpreadsheet, DownloadCloud } from 'lucide-react';

export default function ContainerReportsEngine() {
  const [downloading, setDownloading] = useState('');

  const triggerExport = async (format: string) => {
    setDownloading(format);
    try {
      const res = await fetch(`/api/container-finance/reports/export/${format}`);
      const data = await res.json();
      alert(`Report generated! Downloading from: ${data.url}`);
    } catch (error) {
      console.error(error);
    }
    setDownloading('');
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 h-[calc(100vh-4rem)] overflow-y-auto bg-gray-50/50">
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-black text-gray-900 flex items-center">
            <DownloadCloud className="mr-3 text-cyan-600" size={32} /> Reports Engine
          </h1>
          <p className="text-gray-500 font-medium mt-1">Generate Excel and PDF audits for Inventory, Demurrage, and Compliance.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* EXCEL EXPORT */}
        <div className="bg-white p-12 text-center rounded-3xl border border-gray-100 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md cursor-pointer" onClick={() => triggerExport('excel')}>
          <FileSpreadsheet size={64} className="mx-auto text-emerald-500 mb-6" />
          <h3 className="text-2xl font-black text-gray-900">Raw Data (Excel/CSV)</h3>
          <p className="text-gray-500 mt-2 max-w-sm mx-auto font-medium mb-8">
            Export the complete financial ledger and yard operations log to .xlsx format for external BI tools.
          </p>
          <button className="bg-emerald-50 text-emerald-700 px-6 py-3 rounded-xl font-black flex items-center mx-auto hover:bg-emerald-100 transition-colors">
            {downloading === 'excel' ? 'Generating...' : <><Download size={18} className="mr-2" /> Download XLSX</>}
          </button>
        </div>

        {/* PDF EXPORT */}
        <div className="bg-white p-12 text-center rounded-3xl border border-gray-100 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md cursor-pointer" onClick={() => triggerExport('pdf')}>
          <FileText size={64} className="mx-auto text-rose-500 mb-6" />
          <h3 className="text-2xl font-black text-gray-900">Compliance Audit (PDF)</h3>
          <p className="text-gray-500 mt-2 max-w-sm mx-auto font-medium mb-8">
            Generate printable, signed PDF reports highlighting CSC Plate expirations and HAZMAT logs.
          </p>
          <button className="bg-rose-50 text-rose-700 px-6 py-3 rounded-xl font-black flex items-center mx-auto hover:bg-rose-100 transition-colors">
            {downloading === 'pdf' ? 'Generating...' : <><Download size={18} className="mr-2" /> Download PDF</>}
          </button>
        </div>
      </div>
    </div>
  );
}
