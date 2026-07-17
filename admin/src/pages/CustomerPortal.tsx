import React, { useState, useEffect, useRef } from 'react';
import { Package, FileText, ReceiptText, LifeBuoy, Download, MessageSquare, Send, X, Bot } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function CustomerPortal() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('shipments');
  const [data, setData] = useState<any[]>([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user'|'bot', content: string}[]>([
    { role: 'bot', content: 'Hello! I am Lizome, your AI Assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [aiTyping, setAiTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Mocking fetch since we don't have true auth ID wired yet
    const type = activeTab === 'shipments' ? 'shipments' : 'tickets';
    fetch(`/api/portals/customer/CUSTOMER_123/${type}`)
      .then(r => r.json())
      .then(setData)
      .catch(console.error);
  }, [activeTab]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setAiTyping(true);

    try {
      const res = await fetch('/api/ai/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userMsg })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'bot', content: data.response }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'bot', content: "I'm having trouble connecting to my neural network right now. Please try again later." }]);
    } finally {
      setAiTyping(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto flex flex-col h-[calc(100vh-4rem)] relative">
      <div className="flex justify-between items-center mb-8 shrink-0">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Client Portal</h1>
          <p className="text-gray-500 font-medium mt-1">Welcome back, {user?.firstName || 'Valued Client'}.</p>
        </div>
      </div>

      <div className="flex space-x-4 mb-8 border-b border-gray-200">
        <button onClick={() => setActiveTab('shipments')} className={`pb-4 px-2 font-bold flex items-center space-x-2 border-b-2 ${activeTab === 'shipments' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-gray-500 hover:text-gray-900'}`}><Package size={18}/><span>Shipments</span></button>
        <button onClick={() => setActiveTab('invoices')} className={`pb-4 px-2 font-bold flex items-center space-x-2 border-b-2 ${activeTab === 'invoices' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-gray-500 hover:text-gray-900'}`}><ReceiptText size={18}/><span>Invoices</span></button>
        <button onClick={() => setActiveTab('documents')} className={`pb-4 px-2 font-bold flex items-center space-x-2 border-b-2 ${activeTab === 'documents' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-gray-500 hover:text-gray-900'}`}><FileText size={18}/><span>Documents</span></button>
        <button onClick={() => setActiveTab('support')} className={`pb-4 px-2 font-bold flex items-center space-x-2 border-b-2 ${activeTab === 'support' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-gray-500 hover:text-gray-900'}`}><LifeBuoy size={18}/><span>Support</span></button>
      </div>

      <div className="flex-1 overflow-y-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        {activeTab === 'shipments' && (
          <div className="text-center py-12">
            <Package size={48} className="mx-auto text-indigo-200 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Active Shipments</h3>
            <p className="text-gray-500">You currently have no active freight or cargo shipments.</p>
          </div>
        )}
        {activeTab === 'invoices' && (
          <div className="text-center py-12">
            <ReceiptText size={48} className="mx-auto text-emerald-200 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">All Caught Up</h3>
            <p className="text-gray-500">You have no unpaid invoices.</p>
          </div>
        )}
        {activeTab === 'documents' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-gray-100 rounded-xl flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer">
               <div className="flex items-center space-x-3"><FileText className="text-indigo-500"/><span className="font-semibold text-gray-800">Master_Contract_2025.pdf</span></div>
               <Download size={18} className="text-gray-400"/>
            </div>
          </div>
        )}
        {activeTab === 'support' && (
          <div className="max-w-md">
            <h3 className="text-lg font-bold mb-4">Raise a Support Ticket</h3>
            <input placeholder="Subject" className="w-full p-3 border border-gray-200 rounded-xl mb-4" />
            <textarea placeholder="Describe your issue..." rows={4} className="w-full p-3 border border-gray-200 rounded-xl mb-4"></textarea>
            <button className="bg-indigo-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-indigo-700">Submit Ticket</button>
          </div>
        )}
      </div>

      {/* AI Chatbot FAB */}
      <button 
        onClick={() => setChatOpen(true)}
        className={`fixed bottom-8 right-8 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 rounded-full shadow-2xl hover:shadow-indigo-500/50 transition-all z-40 ${chatOpen ? 'scale-0' : 'scale-100'}`}>
        <MessageSquare size={28} />
      </button>

      {/* AI Chat Window */}
      <div className={`fixed bottom-8 right-8 w-96 h-[32rem] bg-white rounded-3xl shadow-2xl border border-gray-200 flex flex-col z-50 transition-all origin-bottom-right duration-300 ${chatOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}>
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 rounded-t-3xl flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <Bot size={24} />
            <div>
              <h3 className="font-bold">Lizome AI Support</h3>
              <p className="text-xs text-indigo-100">Always online</p>
            </div>
          </div>
          <button onClick={() => setChatOpen(false)} className="text-white hover:bg-white/20 p-1.5 rounded-lg transition"><X size={20}/></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
               <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-br-sm' : 'bg-white border border-gray-100 text-gray-800 shadow-sm rounded-bl-sm'}`}>
                  {msg.content}
               </div>
            </div>
          ))}
          {aiTyping && (
             <div className="flex justify-start">
               <div className="bg-white border border-gray-100 text-gray-500 shadow-sm rounded-2xl rounded-bl-sm p-3 text-sm flex gap-1">
                 <span className="animate-bounce">●</span><span className="animate-bounce delay-100">●</span><span className="animate-bounce delay-200">●</span>
               </div>
             </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <form onSubmit={handleChatSubmit} className="p-3 bg-white border-t border-gray-100 rounded-b-3xl flex gap-2 shrink-0">
          <input 
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type your message..." 
            className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 text-sm"
          />
          <button type="submit" disabled={!input.trim()} className="bg-indigo-600 text-white p-2 rounded-xl disabled:opacity-50 hover:bg-indigo-700 transition">
            <Send size={18} />
          </button>
        </form>
      </div>

    </div>
  );
}
