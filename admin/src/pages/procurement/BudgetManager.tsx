import React, { useState, useEffect } from 'react';
import { Activity, Plus, Search } from 'lucide-react';

export default function BudgetManager() {
  const [budgets, setBudgets] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/procurement/finance/budgets')
      .then(res => res.json())
      .then(setBudgets)
      .catch(console.error);
  }, []);

  return (
    <div className="space-y-6 h-[calc(100vh-6rem)] flex flex-col">
      <div className="flex justify-between items-center flex-shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Activity className="mr-3 text-amber-600" size={32} />
            Budget Control Center
          </h1>
          <p className="text-gray-500 mt-1">Define departmental allocations, enforce limits, and view consumption.</p>
        </div>
        <button className="bg-amber-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-amber-700 transition">
          <Plus className="w-4 h-4 mr-2" /> Allocate Budget
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto">
        {budgets.map((b: any) => {
          const util = ((b.consumedAmount / b.totalBudget) * 100).toFixed(1);
          return (
            <div key={b.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{b.department || 'Corporate'}</h3>
                  <p className="text-xs text-gray-500 mt-1">FY {b.fiscalYear}</p>
                </div>
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">{b.status}</span>
              </div>
              
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Utilization</span>
                <span className="text-sm font-bold text-gray-900">{util}%</span>
              </div>
              
              <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
                <div 
                  className={`h-2 rounded-full ${parseFloat(util) > 90 ? 'bg-rose-500' : 'bg-amber-500'}`} 
                  style={{width: `${Math.min(parseFloat(util), 100)}%`}}
                ></div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                <div>
                  <p className="text-xs text-gray-500">Allocated</p>
                  <p className="font-bold text-gray-900 font-mono mt-1">{b.currency} {b.totalBudget.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Consumed</p>
                  <p className="font-bold text-gray-900 font-mono mt-1">{b.currency} {b.consumedAmount.toLocaleString()}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}