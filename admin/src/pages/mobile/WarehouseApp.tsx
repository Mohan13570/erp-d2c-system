import React from 'react';
import { ScanLine, PackageSearch, ArrowRightLeft, Search } from 'lucide-react';

export default function WarehouseApp() {
  return (
    <div className="h-screen w-full bg-[#1A1A1A] text-white flex flex-col font-sans sm:hidden">
      <div className="p-6 bg-yellow-500 text-black shadow-md flex justify-between items-center">
        <div>
           <p className="text-black/60 text-xs font-black uppercase tracking-widest mb-1">Zone 4 • Aisle B</p>
           <h1 className="text-2xl font-black">Warehouse Scanner</h1>
        </div>
      </div>

      <div className="flex-1 p-6 space-y-4 overflow-y-auto">
        <div className="bg-[#2A2A2A] rounded-2xl p-4 flex items-center mb-6">
           <Search size={20} className="text-gray-400 mr-3"/>
           <input type="text" placeholder="Search SKU or Bin..." className="bg-transparent border-none outline-none flex-1 text-white placeholder-gray-500 font-medium" />
        </div>

        <button className="w-full bg-yellow-500 text-black p-8 rounded-3xl flex flex-col items-center justify-center space-y-4 hover:bg-yellow-400 transition-colors shadow-xl">
           <div className="bg-black text-yellow-500 p-4 rounded-full">
             <ScanLine size={48} />
           </div>
           <span className="text-2xl font-black uppercase tracking-wider">Scan Barcode</span>
        </button>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-[#2A2A2A] p-6 rounded-3xl flex flex-col items-center justify-center text-center space-y-3">
             <PackageSearch size={32} className="text-blue-400"/>
             <span className="font-bold text-sm">Stock Check</span>
          </div>
          <div className="bg-[#2A2A2A] p-6 rounded-3xl flex flex-col items-center justify-center text-center space-y-3">
             <ArrowRightLeft size={32} className="text-rose-400"/>
             <span className="font-bold text-sm">Move Bin</span>
          </div>
        </div>
      </div>
    </div>
  );
}
