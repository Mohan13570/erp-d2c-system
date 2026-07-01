import React, { useState, useEffect } from 'react';
import { ThermometerSnowflake, Zap, BellRing, Activity } from 'lucide-react';
import io from 'socket.io-client';

export default function ReeferTelemetryDashboard() {
  const [logs, setLogs] = useState<any[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Connect to global WebSocket
    const socket = io('http://localhost:5000');
    
    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));
    
    socket.on('reefer-update', (data) => {
      setLogs((prev) => [data, ...prev].slice(0, 20)); // Keep last 20
    });

    return () => { socket.disconnect(); };
  }, []);

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8 h-[calc(100vh-4rem)] overflow-y-auto bg-gray-50/50">
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-black text-gray-900 flex items-center">
            <ThermometerSnowflake className="mr-3 text-cyan-500" size={32} /> Reefer IoT Telemetry
          </h1>
          <p className="text-gray-500 font-medium mt-1">Live WebSocket feed monitoring Temperature, Humidity, and Power Status.</p>
        </div>
        <div className="flex items-center px-4 py-2 bg-gray-100 rounded-xl">
          <div className={`w-3 h-3 rounded-full mr-2 ${connected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></div>
          <span className="text-sm font-bold text-gray-700">{connected ? 'Live Stream Active' : 'Disconnected'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 font-bold mb-1 flex items-center"><ThermometerSnowflake size={16} className="mr-2" /> Avg Fleet Temp</h3>
          <p className="text-4xl font-black text-gray-900">-18.4°C</p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 font-bold mb-1 flex items-center"><Zap size={16} className="mr-2" /> Active Units</h3>
          <p className="text-4xl font-black text-gray-900">42</p>
        </div>
        <div className="bg-rose-50 p-6 rounded-3xl shadow-sm border border-rose-100">
          <h3 className="text-rose-700 font-bold mb-1 flex items-center"><BellRing size={16} className="mr-2" /> Critical Alarms</h3>
          <p className="text-4xl font-black text-rose-700">0</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <Activity className="mr-2 text-cyan-500" size={24} /> Live Telemetry Feed
          </h2>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="p-4 font-bold text-gray-700 text-xs uppercase tracking-wider">Timestamp</th>
              <th className="p-4 font-bold text-gray-700 text-xs uppercase tracking-wider">Container No</th>
              <th className="p-4 font-bold text-gray-700 text-xs uppercase tracking-wider">Temperature</th>
              <th className="p-4 font-bold text-gray-700 text-xs uppercase tracking-wider">Power</th>
              <th className="p-4 font-bold text-gray-700 text-xs uppercase tracking-wider">Alarm Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {logs.map((log, i) => (
              <tr key={i} className={`hover:bg-gray-50 ${log.hasAlarm ? 'bg-rose-50/50' : ''}`}>
                <td className="p-4 text-sm font-bold text-gray-500">{new Date(log.timestamp).toLocaleTimeString()}</td>
                <td className="p-4 text-sm font-black text-gray-900 font-mono">{log.containerId}</td>
                <td className="p-4">
                  <span className={`text-sm font-bold ${log.temperature > -18 ? 'text-rose-600' : 'text-cyan-600'}`}>
                    {log.temperature}°C
                  </span>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs font-bold rounded ${log.powerStatus === 'On' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                    {log.powerStatus}
                  </span>
                </td>
                <td className="p-4">
                  {log.hasAlarm ? (
                    <span className="text-rose-600 font-bold text-sm flex items-center"><BellRing size={16} className="mr-1" /> {log.alarmDetails}</span>
                  ) : (
                    <span className="text-gray-400 font-medium text-sm">Nominal</span>
                  )}
                </td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr><td colSpan={5} className="p-12 text-center text-gray-400 font-medium">Waiting for WebSocket telemetry...</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
