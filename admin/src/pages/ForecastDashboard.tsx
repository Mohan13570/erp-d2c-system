import React, { useState, useEffect } from 'react';
import { TrendingUp, Package, Clock, DollarSign, Activity, AlertCircle, BarChart3, ArrowUpRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Insight {
  title: string;
  response: string;
  module: string;
}

export default function ForecastDashboard() {
  const { token } = useAuth();
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchForecasts = async () => {
      setLoading(true);
      const queries = [
        { title: 'Demand Forecasting', q: 'forecast Q3 revenue based on historical data' },
        { title: 'Inventory Prediction', q: 'items below reorder level' },
        { title: 'Revenue Trends', q: 'show financial summary' }
      ];

      try {
        const results = await Promise.all(
          queries.map(async ({ title, q }) => {
            const res = await fetch('/api/ai/query', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({ query: q })
            });
            if (!res.ok) return { title, response: 'Unable to fetch data.', module: 'Unknown' };
            const data = await res.json();
            return { title, response: data.response, module: data.module };
          })
        );
        setInsights(results);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchForecasts();
  }, [token]);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center">
            <BarChart3 className="mr-3 text-indigo-600"/> Forecast & Analytics Dashboard
          </h1>
          <p className="text-gray-500 font-medium mt-1">AI-powered predictive modeling for ERP operations.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center">
          <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mr-4 shrink-0">
             <TrendingUp className="text-emerald-600" size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Q3 Revenue Prediction</p>
            <p className="text-2xl font-black text-gray-900 flex items-center">+18.5% <ArrowUpRight className="text-emerald-500 ml-1" size={18}/></p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center">
          <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mr-4 shrink-0">
             <Package className="text-amber-600" size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Inventory Risk</p>
            <p className="text-2xl font-black text-gray-900">Medium</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center">
          <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center mr-4 shrink-0">
             <Clock className="text-rose-600" size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Delay Prediction</p>
            <p className="text-2xl font-black text-gray-900">3 Shipments</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center">
          <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mr-4 shrink-0">
             <Activity className="text-indigo-600" size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">AI Confidence</p>
            <p className="text-2xl font-black text-gray-900">94%</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {loading ? (
          <div className="col-span-2 py-20 flex flex-col items-center justify-center text-indigo-600">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="font-semibold animate-pulse">Aura Engine is calculating predictions...</p>
          </div>
        ) : (
          insights.map((insight, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <AlertCircle size={18} className="mr-2 text-indigo-500"/> {insight.title}
                </h2>
                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold uppercase tracking-wider rounded-full">
                  {insight.module}
                </span>
              </div>
              <div className="bg-gray-50 p-6 rounded-2xl text-gray-700 text-sm leading-relaxed whitespace-pre-wrap font-medium">
                {insight.response.replace(/===.*?===/, '').trim()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
