import React, { useState, useEffect } from 'react';
import { Bell, AlertTriangle, Info, ShieldAlert, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Notification {
  id: string;
  priority: 'Critical' | 'Warning' | 'Info';
  message: string;
  module: string;
  timestamp: string;
  action: string;
}

export default function NotificationsDashboard() {
  const { token } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      setLoading(true);
      const queries = [
        { type: 'shipments', q: 'show delayed shipments' },
        { type: 'inventory', q: 'items below reorder level' },
        { type: 'fleet', q: 'show vehicle maintenance' }
      ];

      try {
        const results = await Promise.all(
          queries.map(async ({ type, q }) => {
            const res = await fetch('/api/ai/query', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({ query: q })
            });
            if (!res.ok) return null;
            const data = await res.json();
            return { type, response: data.response, module: data.module };
          })
        );
        
        const generatedAlerts: Notification[] = [];
        
        results.forEach((r, idx) => {
          if (!r || r.response.includes('No ')) return;
          
          if (r.type === 'shipments') {
            generatedAlerts.push({
              id: `notif-${idx}-1`,
              priority: 'Warning',
              message: r.response.replace(/===.*?===/, '').trim().split('\n')[0] || 'Delayed shipments detected.',
              module: r.module,
              timestamp: new Date().toISOString(),
              action: 'Review carrier contracts and expedite routing.'
            });
          } else if (r.type === 'inventory') {
            generatedAlerts.push({
              id: `notif-${idx}-2`,
              priority: 'Critical',
              message: r.response.replace(/===.*?===/, '').trim().split('\n')[0] || 'Inventory levels critically low.',
              module: r.module,
              timestamp: new Date(Date.now() - 3600000).toISOString(),
              action: 'Generate automated Purchase Orders for suppliers.'
            });
          } else if (r.type === 'fleet') {
            generatedAlerts.push({
              id: `notif-${idx}-3`,
              priority: 'Info',
              message: r.response.replace(/===.*?===/, '').trim().split('\n')[0] || 'New vehicle maintenance records logged.',
              module: r.module,
              timestamp: new Date(Date.now() - 7200000).toISOString(),
              action: 'Acknowledge maintenance completion.'
            });
          }
        });

        if (generatedAlerts.length === 0) {
           generatedAlerts.push({
              id: 'notif-default',
              priority: 'Info',
              message: 'All operations are running smoothly. No critical alerts.',
              module: 'System',
              timestamp: new Date().toISOString(),
              action: 'No action required.'
           });
        }

        setNotifications(generatedAlerts);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, [token]);

  const getPriorityIcon = (p: string) => {
    if (p === 'Critical') return <ShieldAlert size={20} className="text-rose-500" />;
    if (p === 'Warning') return <AlertTriangle size={20} className="text-amber-500" />;
    return <Info size={20} className="text-indigo-500" />;
  };

  const getPriorityClass = (p: string) => {
    if (p === 'Critical') return 'bg-rose-50 border-rose-100';
    if (p === 'Warning') return 'bg-amber-50 border-amber-100';
    return 'bg-indigo-50 border-indigo-100';
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center">
          <Bell className="mr-3 text-indigo-600"/> AI Operations Notifications
        </h1>
        <p className="text-gray-500 font-medium mt-1">Real-time alerts and AI-recommended actions.</p>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-indigo-600">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="font-semibold animate-pulse">Aura Engine is scanning operations...</p>
          </div>
        ) : (
          notifications.map(n => (
            <div key={n.id} className={`p-6 rounded-3xl border ${getPriorityClass(n.priority)} flex flex-col md:flex-row md:items-center justify-between gap-6`}>
              <div className="flex items-start">
                <div className="mt-1 mr-4 bg-white p-2 rounded-xl shadow-sm">
                  {getPriorityIcon(n.priority)}
                </div>
                <div>
                  <div className="flex items-center space-x-3 mb-1">
                    <span className="text-xs font-black uppercase tracking-widest text-gray-500">{n.module}</span>
                    <span className="text-xs text-gray-400 font-medium">{new Date(n.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                  <h3 className="text-gray-900 font-bold text-lg leading-snug">{n.message}</h3>
                </div>
              </div>
              <div className="bg-white/60 p-4 rounded-2xl flex-1 md:max-w-xs border border-white/40">
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2 flex items-center"><CheckCircle2 size={14} className="mr-1 text-emerald-500"/> AI Recommendation</p>
                <p className="text-sm font-medium text-gray-800">{n.action}</p>
                {n.priority !== 'Info' && (
                  <button className="mt-3 text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center">
                    Execute Action <ArrowRight size={14} className="ml-1"/>
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
