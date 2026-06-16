import React, { useState, useEffect, useRef } from 'react';
import { Bot, Sparkles, Send, Box, BrainCircuit, Activity } from 'lucide-react';

export default function AIHub() {
  const [messages, setMessages] = useState<{role: string, text: string, module?: string}[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch Historical Chat Logs
    fetch('/api/ai/logs')
      .then(r => r.json())
      .then((logs: any[]) => {
        if (!logs || logs.length === 0) {
          setMessages([{ role: 'ai', text: 'Hello! I am Aura, your local AI assistant. I can forecast demand, analyze shipments, and optimize routes. How can I help?' }]);
          return;
        }
        // Logs are returned desc (newest first). Reverse to oldest first.
        const history: any[] = [];
        logs.reverse().forEach(log => {
          history.push({ role: 'user', text: log.query });
          history.push({ role: 'ai', text: log.response, module: log.module });
        });
        setMessages(history);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendQuery = async () => {
    if (!input.trim()) return;
    const query = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: query }]);
    setLoading(true);

    try {
      const res = await fetch('/api/ai/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'ai', text: data.response, module: data.module }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: 'Sorry, I am experiencing a temporary connection issue.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto h-[calc(100vh-4rem)] flex flex-col relative">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center"><Sparkles className="mr-3 text-indigo-600"/> AI Operations Hub</h1>
        <p className="text-gray-500 font-medium mt-1">Predictive analytics and intelligent automated assistance.</p>
      </div>

      <div className="flex flex-1 space-x-6 min-h-0">
        <div className="w-1/3 flex flex-col space-y-4">
           <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-3xl text-white shadow-lg">
             <BrainCircuit size={32} className="mb-4 text-indigo-200"/>
             <h3 className="font-bold text-lg mb-1">Aura Engine Active</h3>
             <p className="text-indigo-100 text-sm opacity-80">Processing live data from 18 modules for immediate insights.</p>
           </div>
           <div className="bg-white border border-gray-100 p-6 rounded-3xl flex-1 overflow-y-auto">
             <h4 className="font-bold text-gray-800 mb-4 flex items-center"><Activity size={16} className="mr-2 text-rose-500"/> Suggested Prompts</h4>
             <ul className="space-y-3">
               <li onClick={() => setInput("How many active shipments do we have?")} className="text-sm p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-indigo-50 hover:text-indigo-700 transition-colors">How many active shipments do we have?</li>
               <li onClick={() => setInput("Forecast Q3 revenue.")} className="text-sm p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-indigo-50 hover:text-indigo-700 transition-colors">Forecast Q3 revenue based on historical data.</li>
               <li onClick={() => setInput("What's the optimal route for vehicle V-102?")} className="text-sm p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-indigo-50 hover:text-indigo-700 transition-colors">What's the optimal route for vehicle V-102?</li>
             </ul>
           </div>
        </div>

        <div className="w-2/3 bg-white rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col overflow-hidden">
          <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-[#FAFAFA]">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.role === 'ai' && <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3 mt-1 shrink-0"><Bot size={16} className="text-indigo-600"/></div>}
                <div className={`p-4 rounded-2xl max-w-[80%] ${m.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-sm shadow-md' : 'bg-white border border-gray-100 text-gray-800 rounded-tl-sm shadow-sm'}`}>
                  {m.module && <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400 block mb-1">{m.module} Module</span>}
                  <p className="text-sm leading-relaxed">{m.text}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3"><Bot size={16} className="text-indigo-600 animate-pulse"/></div>
                <div className="p-4 bg-white border border-gray-100 rounded-2xl rounded-tl-sm shadow-sm flex items-center space-x-1">
                   <div className="w-2 h-2 bg-indigo-300 rounded-full animate-bounce"></div>
                   <div className="w-2 h-2 bg-indigo-300 rounded-full animate-bounce delay-100"></div>
                   <div className="w-2 h-2 bg-indigo-300 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>
          <div className="p-4 bg-white border-t border-gray-100 flex items-center space-x-3">
            <input 
              type="text" 
              value={input} 
              onChange={e => setInput(e.target.value)} 
              onKeyPress={e => e.key === 'Enter' && sendQuery()}
              placeholder="Ask Aura anything about your operations..." 
              className="flex-1 p-4 bg-gray-50 border-transparent focus:bg-white focus:border-indigo-300 rounded-2xl transition-all"
            />
            <button onClick={sendQuery} disabled={loading} className="bg-indigo-600 text-white p-4 rounded-2xl hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-md">
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
