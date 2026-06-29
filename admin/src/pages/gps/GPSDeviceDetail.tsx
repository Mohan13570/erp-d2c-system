import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Cpu, Wifi, Battery, Server, RefreshCcw, DownloadCloud, Activity, Zap } from 'lucide-react';

export default function GPSDeviceDetail() {
  const { id } = useParams();
  const [device, setDevice] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('diagnostics');

  useEffect(() => {
    fetch(`/api/gps/devices/${id}`).then(r => r.json()).then(setDevice).catch(console.error);
  }, [id]);

  const handleRestart = async () => {
     if(confirm('Are you sure you want to remotely restart this device? It will lose connection for about 45 seconds.')) {
        await fetch(`/api/gps/devices/${id}/restart`, { method: 'POST' });
        alert('Restart command issued.');
     }
  };

  const handleFirmware = async () => {
     const fw = prompt('Enter new firmware version (e.g., 1.0.1):');
     if(fw) {
        await fetch(`/api/gps/devices/${id}/firmware`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ version: fw }) });
        alert(`Firmware update ${fw} queued for OTA download.`);
     }
  };

  if (!device) return <div className="p-8 text-center font-bold text-gray-500 animate-pulse">Loading Device Diagnostics...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto h-[calc(100vh-4rem)] flex flex-col relative">
      <Link to="/gps/devices" className="absolute top-8 right-8 p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 font-bold flex items-center gap-2 shadow-sm"><ArrowLeft size={16}/> Back to Hardware</Link>

      <div className="flex items-start gap-6 mb-8 mt-2">
         <div className="w-24 h-24 bg-slate-900 rounded-3xl flex items-center justify-center text-emerald-400 shadow-xl border-4 border-slate-800 shrink-0 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay"></div>
            <Cpu size={48} />
         </div>
         <div>
            <div className="flex items-center gap-3">
               <h1 className="text-4xl font-black text-gray-900 tracking-tight font-mono">{device.imei}</h1>
               <span className={`px-4 py-1 rounded-full font-bold text-sm border flex items-center gap-1.5 ${device.isOnline ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                  <div className={`w-2 h-2 rounded-full ${device.isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
                  {device.isOnline ? 'Online - Broadcasting' : 'Offline'}
               </span>
            </div>
            <p className="text-xl font-bold text-gray-500 mt-1 flex items-center gap-3">
               <span>FW: v{device.firmwareVersion}</span> 
               <span>•</span>
               <span>{device.simProvider || 'Unknown Network'} (SIM: {device.simNumber})</span>
            </p>
         </div>
      </div>

      <div className="flex gap-2 bg-gray-100 p-1.5 rounded-2xl mb-6 w-max shrink-0">
         {['diagnostics', 'configuration', 'logs', 'commands'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-2.5 rounded-xl font-bold capitalize transition-all ${activeTab === tab ? 'bg-white shadow text-indigo-600' : 'text-gray-500 hover:bg-gray-200'}`}>
               {tab}
            </button>
         ))}
      </div>

      <div className="flex-1 overflow-auto">
         {activeTab === 'diagnostics' && (
            <div className="grid grid-cols-3 gap-6">
               <div className="col-span-2 space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                     <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-4"><h3 className="font-bold text-gray-500 uppercase text-sm tracking-wider">Signal Strength</h3><Wifi className="text-indigo-500"/></div>
                        <div className="flex items-end gap-2">
                           <h2 className="text-5xl font-black text-gray-900 tracking-tighter">{device.signalStrength}</h2><span className="text-xl font-bold text-gray-400 mb-1">%</span>
                        </div>
                        <div className="w-full bg-gray-100 h-2 rounded-full mt-4 overflow-hidden"><div className="bg-indigo-500 h-full rounded-full" style={{width: `${device.signalStrength}%`}}></div></div>
                     </div>
                     <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-4"><h3 className="font-bold text-gray-500 uppercase text-sm tracking-wider">Battery Health</h3><Battery className="text-emerald-500"/></div>
                        <div className="flex items-end gap-2">
                           <h2 className="text-5xl font-black text-gray-900 tracking-tighter">{device.batteryHealth}</h2><span className="text-xl font-bold text-gray-400 mb-1">%</span>
                        </div>
                        <div className="w-full bg-gray-100 h-2 rounded-full mt-4 overflow-hidden"><div className="bg-emerald-500 h-full rounded-full" style={{width: `${device.batteryHealth}%`}}></div></div>
                     </div>
                  </div>
                  
                  <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-xl">
                     <h3 className="font-bold text-xl mb-6 flex items-center gap-2"><Server className="text-blue-400"/> Remote Configuration Settings</h3>
                     <div className="grid grid-cols-2 gap-y-6 gap-x-12">
                        <div className="flex justify-between border-b border-slate-700 pb-2"><span className="text-slate-400 font-medium">Heartbeat Rate</span><span className="font-bold font-mono">{device.configuration?.pollingRateSec || 5}s</span></div>
                        <div className="flex justify-between border-b border-slate-700 pb-2"><span className="text-slate-400 font-medium">Data Batching</span><span className="font-bold text-emerald-400">{device.configuration?.dataCompression ? 'Enabled' : 'Disabled'}</span></div>
                        <div className="flex justify-between border-b border-slate-700 pb-2"><span className="text-slate-400 font-medium">Overspeed Limit</span><span className="font-bold font-mono">{device.configuration?.speedLimitKmh || 80} km/h</span></div>
                        <div className="flex justify-between border-b border-slate-700 pb-2"><span className="text-slate-400 font-medium">Last Calibrated</span><span className="font-bold font-mono">{new Date(device.configuration?.lastCalibrated).toLocaleDateString()}</span></div>
                     </div>
                  </div>
               </div>

               <div className="space-y-6">
                  <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                     <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Zap className="text-orange-500"/> Quick Commands</h3>
                     <div className="space-y-3">
                        <button onClick={handleRestart} className="w-full py-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl font-bold flex items-center justify-between px-4 transition-colors">
                           <span>Remote Restart Device</span><RefreshCcw size={18} className="text-gray-500"/>
                        </button>
                        <button onClick={handleFirmware} className="w-full py-4 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 rounded-xl font-bold flex items-center justify-between px-4 transition-colors">
                           <span>Push Firmware Update (OTA)</span><DownloadCloud size={18} className="text-indigo-500"/>
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         )}
         
         {activeTab === 'logs' && (
            <div className="bg-slate-900 rounded-3xl p-8 shadow-xl text-white font-mono h-full">
               <h3 className="font-bold text-xl mb-6 text-slate-300">Device Hardware Log</h3>
               <div className="space-y-3">
                  {device.logs?.map((log: any) => (
                     <div key={log.id} className="flex gap-4 text-sm border-b border-slate-800 pb-2">
                        <span className="text-slate-500 w-48 shrink-0">{new Date(log.timestamp).toLocaleString()}</span>
                        <span className={`w-32 shrink-0 font-bold ${log.type === 'FirmwareUpdate' ? 'text-indigo-400' : log.type === 'Reboot' ? 'text-orange-400' : 'text-emerald-400'}`}>[{log.type}]</span>
                        <span className="text-slate-300">{log.message}</span>
                     </div>
                  ))}
                  {device.logs?.length === 0 && <p className="text-slate-500 italic">No logs recorded.</p>}
               </div>
            </div>
         )}
      </div>
    </div>
  );
}
