import React, { useState, useEffect } from 'react';
import { Package, Search, Plus, AlertCircle, ShoppingCart } from 'lucide-react';

export default function PartsInventory() {
  const [parts, setParts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('/api/maintenance-ops/inventory/parts')
      .then(res => res.json())
      .then(setParts)
      .catch(console.error);
  }, []);

  const filteredParts = parts.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8 h-[calc(100vh-4rem)] overflow-y-auto bg-gray-50/50">
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-black text-gray-900 flex items-center">
            <Package className="mr-3 text-cyan-600" size={32} /> Spare Parts Inventory
          </h1>
          <p className="text-gray-500 font-medium mt-1">Manage warehouse stock, reorder levels, and issue parts to Job Cards.</p>
        </div>
        <div className="flex space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            <input 
              type="text"
              placeholder="Search SKU or Name..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center px-4 py-2 bg-cyan-600 text-white font-bold rounded-xl hover:bg-cyan-700 transition-colors shadow-lg shadow-cyan-200">
            <Plus size={18} className="mr-2" /> Receive Stock
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {filteredParts.map(part => (
          <div key={part.id} className={`bg-white rounded-3xl p-6 shadow-sm border transition-colors relative overflow-hidden ${part.stockLevel <= part.reorderLevel ? 'border-rose-200' : 'border-gray-100'}`}>
            {part.stockLevel <= part.reorderLevel && (
              <div className="absolute top-0 right-0 bg-rose-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl flex items-center">
                <AlertCircle size={14} className="mr-1" /> Low Stock
              </div>
            )}
            <h3 className="text-xl font-bold text-gray-900 mb-1">{part.name}</h3>
            <p className="text-sm font-medium text-gray-500 mb-6 font-mono">{part.sku} • {part.category}</p>
            
            <div className="flex justify-between items-end mb-6">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">In Stock</p>
                <p className={`text-4xl font-black ${part.stockLevel <= part.reorderLevel ? 'text-rose-600' : 'text-gray-900'}`}>{part.stockLevel}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Reorder</p>
                <p className="text-lg font-bold text-gray-700">{part.reorderLevel}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-100">
              <button className="py-2 bg-gray-50 text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center">
                Issue Part
              </button>
              <button className="py-2 bg-cyan-50 text-cyan-700 text-sm font-bold rounded-xl hover:bg-cyan-100 transition-colors flex items-center justify-center">
                <ShoppingCart size={16} className="mr-1" /> Reorder
              </button>
            </div>
          </div>
        ))}
        {filteredParts.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-400 font-medium bg-white rounded-3xl border border-gray-100 border-dashed">
            No parts found in inventory.
          </div>
        )}
      </div>
    </div>
  );
}
