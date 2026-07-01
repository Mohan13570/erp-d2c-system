import React, { useState, useEffect } from 'react';
import { Ship, ThermometerSnowflake, Flame } from 'lucide-react';

export default function CargoAndPortTerminal() {
  const [cargoOps, setCargoOps] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/container-ops/cargo')
      .then(res => res.json())
      .then(setCargoOps)
      .catch(console.error);
  }, []);

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8 h-[calc(100vh-4rem)] overflow-y-auto bg-gray-50/50">
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-black text-gray-900 flex items-center">
            <Ship className="mr-3 text-blue-600" size={32} /> Cargo & Port Terminal
          </h1>
          <p className="text-gray-500 font-medium mt-1">Monitor Reefer Temps, Dangerous Goods (DG), and Terminal Berths.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50">
          <h2 className="text-xl font-bold text-gray-900 flex items-center"><ThermometerSnowflake className="mr-2 text-blue-500" size={24} /> Cargo Safety Log</h2>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white border-b border-gray-100">
              <th className="p-4 font-bold text-gray-700 text-xs uppercase tracking-wider">Container No</th>
              <th className="p-4 font-bold text-gray-700 text-xs uppercase tracking-wider">Verification Type</th>
              <th className="p-4 font-bold text-gray-700 text-xs uppercase tracking-wider">VGM / Temp</th>
              <th className="p-4 font-bold text-gray-700 text-xs uppercase tracking-wider">DG Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {cargoOps.map(op => (
              <tr key={op.id} className="hover:bg-gray-50">
                <td className="p-4 text-sm font-black text-gray-900 font-mono tracking-wider">{op.container?.containerNo}</td>
                <td className="p-4 text-sm font-bold text-gray-700">{op.type}</td>
                <td className="p-4">
                  {op.reeferTemperature !== null ? (
                    <span className="flex items-center text-sm font-bold text-blue-600">
                      {op.reeferTemperature}°C
                    </span>
                  ) : op.verifiedWeight ? (
                    <span className="text-sm font-bold text-gray-600">{op.verifiedWeight} KG</span>
                  ) : (
                    <span className="text-xs text-gray-400">N/A</span>
                  )}
                </td>
                <td className="p-4">
                  {op.isDangerousGoods ? (
                    <span className="px-3 py-1 bg-rose-100 text-rose-700 text-xs font-bold rounded-full flex items-center inline-flex">
                      <Flame size={12} className="mr-1" /> HAZMAT
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full">Standard</span>
                  )}
                </td>
              </tr>
            ))}
            {cargoOps.length === 0 && (
              <tr><td colSpan={4} className="p-8 text-center text-gray-400 font-medium">No cargo safety operations logged.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
