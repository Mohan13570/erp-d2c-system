import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  GitBranch, CheckCircle2, Clock, AlertOctagon, Send, FileCheck, 
  Activity, BellRing, Settings, PlayCircle, Search, MoreVertical
} from 'lucide-react';

const MOCK_WORKFLOW = {
  overview: {
    currentStage: 'DISPATCHED',
    previousStage: 'WAREHOUSE_RECEIVED',
    nextStage: 'IN_TRANSIT',
    owner: 'Logistics Control Tower',
    department: 'OPERATIONS',
    progress: 45
  },
  stages: [
    { name: 'Booking Approved', status: 'COMPLETED', time: 'Jul 20, 09:00 AM' },
    { name: 'Pickup Scheduled', status: 'COMPLETED', time: 'Jul 20, 11:30 AM' },
    { name: 'Warehouse Received', status: 'COMPLETED', time: 'Jul 21, 08:15 AM' },
    { name: 'Dispatched', status: 'IN_PROGRESS', time: 'Started 2 hours ago' },
    { name: 'In Transit', status: 'PENDING', time: '--' },
    { name: 'Delivered', status: 'PENDING', time: '--' }
  ],
  rules: [
    { rule: 'If IN_TRANSIT, notify Customer via SMS', active: true },
    { rule: 'If DELAY > 2hrs, escalate to Fleet Manager', active: true },
    { rule: 'Require manual approval for CUSTOMS clearance', active: true }
  ],
  exceptions: [
    { id: 'EXC-991', type: 'DELAY', severity: 'HIGH', status: 'OPEN', raisedBy: 'System', date: 'Jul 22, 08:00 AM', remarks: 'Traffic incident on Route 44.' },
    { id: 'EXC-882', type: 'DOCUMENT_MISSING', severity: 'MEDIUM', status: 'RESOLVED', raisedBy: 'Warehouse Agent', date: 'Jul 21, 10:00 AM', remarks: 'Commercial invoice uploaded late.' }
  ],
  approvals: [
    { type: 'Customs Clearance', status: 'PENDING', requestedBy: 'Agent Smith', date: 'Jul 22, 07:00 AM' }
  ],
  notifications: [
    { channel: 'SMS', recipient: '+15550199', status: 'SENT', time: 'Jul 21, 08:20 AM', message: 'Your package reached the warehouse.' },
    { channel: 'EMAIL', recipient: 'customer@acme.com', status: 'QUEUED', time: 'Jul 22, 08:05 AM', message: 'Delay Notice: Traffic incident.' }
  ],
  timeline: [
    { action: 'Exception EXC-991 Raised', actor: 'System', time: 'Jul 22, 08:00 AM', category: 'EXCEPTION' },
    { action: 'Stage advanced to DISPATCHED', actor: 'Workflow Engine', time: 'Jul 22, 06:00 AM', category: 'WORKFLOW' },
    { action: 'Document Packing List approved', actor: 'Compliance Officer', time: 'Jul 21, 14:00 PM', category: 'AUDIT' }
  ]
};

export default function ShipmentWorkflowHub() {
  const { id } = useParams();
  const shipmentId = id || 'TRK-90218-444';
  const [data, setData] = useState(MOCK_WORKFLOW);
  const [isAdvancing, setIsAdvancing] = useState(false);

  const advanceWorkflow = () => {
    setIsAdvancing(true);
    setTimeout(() => {
      setData({
        ...data,
        overview: {
          ...data.overview,
          currentStage: 'IN_TRANSIT',
          previousStage: 'DISPATCHED',
          nextStage: 'DELIVERED',
          progress: 65
        },
        stages: data.stages.map(s => 
          s.name === 'Dispatched' ? { ...s, status: 'COMPLETED', time: 'Just now' } :
          s.name === 'In Transit' ? { ...s, status: 'IN_PROGRESS', time: 'Started just now' } : s
        ),
        timeline: [
          { action: 'Stage advanced to IN_TRANSIT', actor: 'Admin Override', time: 'Just now', category: 'WORKFLOW' },
          ...data.timeline
        ]
      });
      setIsAdvancing(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* STICKY HEADER */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <GitBranch className="w-7 h-7 text-indigo-600 bg-indigo-100 p-1 rounded-lg" /> 
            Workflow Automation & Exceptions
          </h1>
          <div className="flex items-center gap-4 mt-2 text-sm font-bold text-slate-500">
            <span>Shipment: <span className="text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded">{shipmentId}</span></span>
            <span>Current Stage: <span className="text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded uppercase tracking-wider text-xs">{data.overview.currentStage.replace(/_/g, ' ')}</span></span>
            <span className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded uppercase tracking-wider text-xs font-black">HIGH PRIORITY</span>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-bold transition-colors">
            Refresh State
          </button>
          <button 
            onClick={advanceWorkflow}
            disabled={isAdvancing}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors"
          >
            <PlayCircle className="w-4 h-4" /> 
            {isAdvancing ? 'Processing Rules...' : 'Force Advance Workflow'}
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        
        {/* MAIN SCROLLABLE CONTENT (SECTIONS 1-9) */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth">
          
          {/* SECTION 1: WORKFLOW OVERVIEW */}
          <section id="overview" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-end mb-4">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Workflow Engine Status</p>
                <h2 className="text-2xl font-black text-slate-900">Active Automation Pipeline</h2>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Owner</p>
                <p className="text-sm font-bold text-slate-800">{data.overview.owner} ({data.overview.department})</p>
              </div>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-slate-100 rounded-full h-3 mb-2 overflow-hidden">
              <div className="bg-indigo-600 h-3 rounded-full transition-all duration-1000" style={{ width: \`\${data.overview.progress}%\` }}></div>
            </div>
            <div className="flex justify-between text-xs font-bold text-slate-500 uppercase">
              <span>Prev: {data.overview.previousStage.replace(/_/g, ' ')}</span>
              <span className="text-indigo-600">Now: {data.overview.currentStage.replace(/_/g, ' ')}</span>
              <span>Next: {data.overview.nextStage.replace(/_/g, ' ')}</span>
            </div>
          </section>

          {/* SECTION 2: SHIPMENT WORKFLOW (PIPELINE) */}
          <section id="pipeline" className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 p-6 pb-4 border-b border-slate-100">
              <GitBranch className="w-5 h-5 text-indigo-600"/> Stage Pipeline Execution
            </h2>
            <div className="p-6 grid grid-cols-2 lg:grid-cols-3 gap-6">
              {data.stages.map((stage, i) => (
                <div key={i} className={\`p-4 rounded-xl border-2 \${
                  stage.status === 'COMPLETED' ? 'border-emerald-200 bg-emerald-50 text-emerald-900' :
                  stage.status === 'IN_PROGRESS' ? 'border-indigo-400 bg-indigo-50 text-indigo-900 shadow-sm' :
                  'border-slate-100 bg-slate-50 text-slate-400'
                }\`}>
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-sm">{stage.name}</span>
                    {stage.status === 'COMPLETED' && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                    {stage.status === 'IN_PROGRESS' && <Activity className="w-5 h-5 text-indigo-500 animate-pulse" />}
                  </div>
                  <p className="text-xs font-medium opacity-80">{stage.time}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* SECTION 3: AUTOMATION RULES */}
            <section id="rules" className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 mb-4 pb-4 border-b border-slate-100">
                <Settings className="w-5 h-5 text-slate-600"/> Active Trigger Rules
              </h2>
              <div className="space-y-3">
                {data.rules.map((rule, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span className="text-sm font-medium text-slate-700">{rule.rule}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* SECTION 6: APPROVAL WORKFLOW */}
            <section id="approvals" className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 mb-4 pb-4 border-b border-slate-100">
                <FileCheck className="w-5 h-5 text-amber-600"/> Pending Approvals
              </h2>
              <div className="space-y-3">
                {data.approvals.map((app, i) => (
                  <div key={i} className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex justify-between items-center">
                    <div>
                      <p className="font-bold text-amber-900 text-sm">{app.type}</p>
                      <p className="text-xs font-medium text-amber-700 mt-0.5">Requested by {app.requestedBy} • {app.date}</p>
                    </div>
                    <button className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">
                      Review
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* SECTION 4 & 5: EXCEPTION MANAGEMENT */}
          <section id="exceptions" className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 border-l-4 border-l-rose-500">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
              <AlertOctagon className="w-5 h-5 text-rose-600"/> Exception Management
            </h2>
            <div className="space-y-4">
              {data.exceptions.map((exc, i) => (
                <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-start gap-4">
                    <div className={\`p-2 rounded-lg \${exc.severity === 'HIGH' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'}\`}>
                      <AlertOctagon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-black text-slate-900 text-sm">{exc.id} • {exc.type.replace(/_/g, ' ')}</span>
                        <span className={\`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase \${exc.status === 'OPEN' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}\`}>
                          {exc.status}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-slate-500">Raised by {exc.raisedBy} • {exc.date}</p>
                      <p className="text-sm font-medium text-slate-800 mt-2 bg-white p-2 rounded border border-slate-100">{exc.remarks}</p>
                    </div>
                  </div>
                  {exc.status === 'OPEN' && (
                    <button className="mt-4 md:mt-0 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors">
                      Resolve Issue
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* SECTION 7: NOTIFICATIONS (BULLMQ) */}
            <section id="notifications" className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 mb-4 pb-4 border-b border-slate-100">
                <BellRing className="w-5 h-5 text-blue-600"/> BullMQ Notification Queue
              </h2>
              <div className="space-y-3">
                {data.notifications.map((notif, i) => (
                  <div key={i} className="p-3 bg-slate-50 border border-slate-100 rounded-lg flex justify-between items-center">
                    <div>
                      <p className="text-sm font-bold text-slate-800 flex items-center gap-2">
                        {notif.channel} to {notif.recipient}
                      </p>
                      <p className="text-xs font-medium text-slate-500 mt-1 truncate max-w-[200px]">{notif.message}</p>
                    </div>
                    <span className={\`text-[10px] font-bold px-2 py-1 rounded \${notif.status === 'SENT' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}\`}>
                      {notif.status}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* SECTION 8 & 9: AUDIT & TIMELINE */}
            <section id="timeline" className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 mb-4 pb-4 border-b border-slate-100">
                <Clock className="w-5 h-5 text-slate-600"/> Activity & Audit Timeline
              </h2>
              <div className="relative border-l-2 border-slate-100 ml-3 space-y-6">
                {data.timeline.map((event, i) => (
                  <div key={i} className="pl-6 relative">
                    <div className="absolute w-3 h-3 bg-indigo-500 rounded-full -left-[7px] top-1.5 ring-4 ring-white"></div>
                    <p className="text-sm font-bold text-slate-800">{event.action}</p>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">{event.actor} • {event.time}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

        </div>

        {/* SECTION 10: STICKY RIGHT SIDEBAR */}
        <aside className="w-80 bg-white border-l border-slate-200 flex flex-col shrink-0 sticky top-0 overflow-y-auto">
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 p-3 bg-indigo-50 text-indigo-700 font-bold text-sm rounded-xl hover:bg-indigo-100 transition-colors">
                <PlayCircle className="w-4 h-4"/> Advance Workflow
              </button>
              <button className="w-full flex items-center gap-3 p-3 bg-rose-50 text-rose-700 font-bold text-sm rounded-xl hover:bg-rose-100 transition-colors">
                <AlertOctagon className="w-4 h-4"/> Raise Exception
              </button>
              <button className="w-full flex items-center gap-3 p-3 bg-emerald-50 text-emerald-700 font-bold text-sm rounded-xl hover:bg-emerald-100 transition-colors">
                <CheckCircle2 className="w-4 h-4"/> Approve Step
              </button>
              <button className="w-full flex items-center gap-3 p-3 bg-slate-100 text-slate-700 font-bold text-sm rounded-xl hover:bg-slate-200 transition-colors">
                <Send className="w-4 h-4"/> Notify Customer
              </button>
            </div>
          </div>
          
          <div className="p-6 flex-1">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-500"/> Live Engine Status
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 text-slate-700 rounded-xl border border-slate-200 text-xs font-bold flex justify-between items-center">
                <span>Socket.IO Realtime</span>
                <div className="flex items-center gap-1 text-emerald-600"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div> Connected</div>
              </div>
              <div className="p-3 bg-slate-50 text-slate-700 rounded-xl border border-slate-200 text-xs font-bold flex justify-between items-center">
                <span>BullMQ Workers</span>
                <span className="text-emerald-600">Active (3)</span>
              </div>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}
