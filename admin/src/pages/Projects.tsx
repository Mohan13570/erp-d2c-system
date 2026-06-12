import { useState, useEffect } from 'react';
import { CheckSquare, Circle, Clock } from 'lucide-react';

interface Task { id: string; subject: string; status: string; priority: string; assignedTo: string; dueDate: string; }
interface Project { id: string; name: string; status: string; budget: number; startDate: string; endDate: string; tasks: Task[]; }

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showProjModal, setShowProjModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newProj, setNewProj] = useState({ name: '', status: 'Open', budget: 0, startDate: '', endDate: '' });
  const [newTask, setNewTask] = useState({ projectId: '', subject: '', priority: 'Medium', assignedTo: '', dueDate: '' });

  const fetchData = () => {
    fetch('/api/projects/projects').then(r => r.json()).then(setProjects);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const priorityColor = (p: string) => p === 'High' ? 'bg-rose-100 text-rose-700' : p === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600';
  const statusIcon = (s: string) => s === 'Completed' ? <CheckSquare size={16} className="text-emerald-500" /> : s === 'In Progress' ? <Clock size={16} className="text-amber-500 animate-spin" style={{ animationDuration: '3s' }} /> : <Circle size={16} className="text-gray-400" />;

  const handleCreateProj = async () => {
    const res = await fetch('/api/projects/projects', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newProj) });
    if(res.ok) { setShowProjModal(false); fetchData(); } else alert('Failed to create project');
  };

  const handleCreateTask = async () => {
    if(!newTask.projectId) return alert('Select a project');
    const res = await fetch(`/api/projects/projects/${newTask.projectId}/tasks`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newTask) });
    if(res.ok) { setShowTaskModal(false); fetchData(); } else alert('Failed to create task');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Project Management</h1>
          <p className="text-gray-500 mt-1">Track projects, tasks, and team assignments.</p>
        </div>
        <div className="flex space-x-3">
          <button onClick={() => setShowTaskModal(true)} className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-5 py-2.5 rounded-xl font-medium shadow-sm flex items-center">
            New Task
          </button>
          <button onClick={() => setShowProjModal(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm flex items-center">
            New Project
          </button>
        </div>
      </div>

      {showProjModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-3xl w-full max-w-lg shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">Create Project</h2>
            <div className="space-y-4">
              <input placeholder="Project Name" className="w-full p-3 border rounded-xl" onChange={e => setNewProj({...newProj, name: e.target.value})} />
              <input type="number" placeholder="Budget ($)" className="w-full p-3 border rounded-xl" onChange={e => setNewProj({...newProj, budget: Number(e.target.value)})} />
              <div className="flex gap-4">
                <input type="date" className="w-full p-3 border rounded-xl text-gray-500" onChange={e => setNewProj({...newProj, startDate: e.target.value})} />
                <input type="date" className="w-full p-3 border rounded-xl text-gray-500" onChange={e => setNewProj({...newProj, endDate: e.target.value})} />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-8">
              <button onClick={() => setShowProjModal(false)} className="px-5 py-2.5 text-gray-600 font-bold hover:bg-gray-100 rounded-xl">Cancel</button>
              <button onClick={handleCreateProj} className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl shadow-md">Create</button>
            </div>
          </div>
        </div>
      )}

      {showTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-3xl w-full max-w-lg shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">Create Task</h2>
            <div className="space-y-4">
              <select className="w-full p-3 border rounded-xl" onChange={e => setNewTask({...newTask, projectId: e.target.value})}>
                <option value="">Select Project...</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              <input placeholder="Task Subject" className="w-full p-3 border rounded-xl" onChange={e => setNewTask({...newTask, subject: e.target.value})} />
              <input placeholder="Assignee (e.g. John Doe)" className="w-full p-3 border rounded-xl" onChange={e => setNewTask({...newTask, assignedTo: e.target.value})} />
              <div className="flex gap-4">
                <select className="w-full p-3 border rounded-xl bg-white" onChange={e => setNewTask({...newTask, priority: e.target.value})}>
                  <option value="Medium">Medium Priority</option>
                  <option value="High">High Priority</option>
                  <option value="Low">Low Priority</option>
                </select>
                <input type="date" className="w-full p-3 border rounded-xl text-gray-500" onChange={e => setNewTask({...newTask, dueDate: e.target.value})} />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-8">
              <button onClick={() => setShowTaskModal(false)} className="px-5 py-2.5 text-gray-600 font-bold hover:bg-gray-100 rounded-xl">Cancel</button>
              <button onClick={handleCreateTask} className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl shadow-md">Create Task</button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {projects.map(proj => (
          <div key={proj.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{proj.name}</h2>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                  <span>{new Date(proj.startDate).toLocaleDateString()} → {new Date(proj.endDate).toLocaleDateString()}</span>
                  {proj.budget && <span className="font-medium text-gray-700">Budget: ${proj.budget.toLocaleString()}</span>}
                </div>
              </div>
              <span className={`px-3 py-1 text-sm font-semibold rounded-full ${proj.status === 'Open' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'}`}>{proj.status}</span>
            </div>
            <div className="divide-y divide-gray-50">
              {proj.tasks.map(task => (
                <div key={task.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center space-x-3">
                    {statusIcon(task.status)}
                    <span className="text-sm font-medium text-gray-900">{task.subject}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    {task.assignedTo && <span className="text-xs text-gray-500">{task.assignedTo}</span>}
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${priorityColor(task.priority)}`}>{task.priority}</span>
                    {task.dueDate && <span className="text-xs text-gray-400">{new Date(task.dueDate).toLocaleDateString()}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
