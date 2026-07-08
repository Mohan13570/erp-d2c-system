import React, { useState, useCallback } from 'react';
import ReactFlow, { 
  MiniMap, 
  Controls, 
  Background, 
  useNodesState, 
  useEdgesState, 
  addEdge,
  type Connection,
  type Edge
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Save, Plus, Settings } from 'lucide-react';
import axios from 'axios';

const initialNodes = [
  { id: '1', type: 'input', data: { label: 'Start Request' }, position: { x: 250, y: 25 } },
  { id: '2', data: { label: 'Manager Approval' }, position: { x: 250, y: 125 } },
  { id: '3', type: 'output', data: { label: 'End Request' }, position: { x: 250, y: 250 } },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e2-3', source: '2', target: '3' },
];

export default function WorkflowBuilder() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isSaving, setIsSaving] = useState(false);

  const onConnect = useCallback((params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const addNode = () => {
    const newNode = {
      id: (nodes.length + 1).toString(),
      data: { label: `New Node ${nodes.length + 1}` },
      position: { x: Math.random() * 500, y: Math.random() * 500 },
    };
    setNodes((nds) => nds.concat(newNode));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await axios.post('http://localhost:5000/api/workflow', {
        name: 'New Approval Matrix',
        category: 'Finance',
        nodes,
        edges
      });
      alert('Workflow Saved & Published!');
    } catch (e) {
      alert('Failed to save workflow');
    }
    setIsSaving(false);
  };

  return (
    <div className="flex h-[calc(100vh-64px)] w-full overflow-hidden bg-slate-50 dark:bg-slate-900">
      
      {/* Sidebar Palette */}
      <div className="w-64 border-r bg-white dark:bg-slate-950 p-4 space-y-4 shadow-sm z-10 flex flex-col">
        <h2 className="font-bold text-lg mb-2">Workflow Toolkit</h2>
        <Button variant="outline" className="w-full justify-start border-indigo-200 hover:bg-indigo-50" onClick={addNode}>
          <Plus className="mr-2 h-4 w-4" /> Add Action Node
        </Button>
        <div className="flex-1 overflow-y-auto space-y-3 mt-4 text-sm text-slate-500">
          <div className="p-3 border rounded bg-slate-50 cursor-move hover:shadow-sm transition-all border-dashed">Decision Node</div>
          <div className="p-3 border rounded bg-indigo-50/50 text-indigo-700 cursor-move hover:shadow-sm transition-all">Approval Step</div>
          <div className="p-3 border rounded bg-amber-50/50 text-amber-700 cursor-move hover:shadow-sm transition-all">Email Notification</div>
          <div className="p-3 border rounded bg-emerald-50/50 text-emerald-700 cursor-move hover:shadow-sm transition-all">Webhook Call</div>
        </div>
        
        <div className="pt-4 border-t space-y-2">
          <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" onClick={handleSave} disabled={isSaving}>
            <Save className="mr-2 h-4 w-4" /> {isSaving ? 'Saving...' : 'Save & Publish'}
          </Button>
          <Button variant="outline" className="w-full">
            <Play className="mr-2 h-4 w-4 text-emerald-500" /> Simulate Engine
          </Button>
        </div>
      </div>

      {/* React Flow Canvas */}
      <div className="flex-1 h-full relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          attributionPosition="bottom-right"
        >
          <Controls />
          <MiniMap 
            nodeColor={(n) => {
              if (n.type === 'input') return '#4f46e5';
              if (n.type === 'output') return '#e11d48';
              return '#94a3b8';
            }}
          />
          <Background color="#e2e8f0" gap={16} />
        </ReactFlow>
        
        {/* Floating Header */}
        <div className="absolute top-4 left-4 z-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-3 rounded-lg shadow-sm border flex items-center space-x-3">
          <div className="h-8 w-8 rounded bg-indigo-100 flex items-center justify-center">
            <Settings className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Finance Approval Chain V1</h3>
            <p className="text-xs text-slate-500">Unsaved Changes • 3 Nodes</p>
          </div>
        </div>
      </div>
      
    </div>
  );
}
