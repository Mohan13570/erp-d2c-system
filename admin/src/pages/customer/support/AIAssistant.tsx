import React, { useState } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';

export default function AIAssistant() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hello! I am your Enterprise D2C Logistics AI. I can help you track shipments, generate invoices, or answer compliance questions. How can I assist you today?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = () => {
    if(!input.trim()) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    // Simulate API Call
    setTimeout(() => {
       let aiResponse = "I can certainly help with that. Let me look up your account details...";
       if (userMsg.toLowerCase().includes('track') || userMsg.toLowerCase().includes('where is')) {
          aiResponse = "I see you're asking about a shipment. Booking BKG-772910 (Shanghai -> LA) just cleared Customs at the Port of Los Angeles. It is expected to arrive at the final warehouse tomorrow by 2:00 PM.";
       } else if (userMsg.toLowerCase().includes('invoice') || userMsg.toLowerCase().includes('bill')) {
          aiResponse = "You currently have 1 overdue invoice: INV-10042 for $0.00. Should I redirect you to the payment gateway?";
       }

       setMessages(prev => [...prev, { role: 'assistant', text: aiResponse }]);
       setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-100 bg-indigo-600 flex items-center space-x-3 text-white">
        <Bot size={24} />
        <div>
          <h2 className="font-bold">Logistics AI Assistant</h2>
          <p className="text-xs text-indigo-200">Powered by Enterprise LLM</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
             <div className={`flex items-start max-w-[70%] space-x-3 ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
               <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-900 text-white'}`}>
                 {msg.role === 'user' ? <User size={16} /> : <Sparkles size={16} />}
               </div>
               <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-100 text-gray-800'}`}>
                 {msg.text}
               </div>
             </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="flex items-center space-x-2 bg-white border border-gray-100 p-4 rounded-2xl">
               <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
               <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
               <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
             </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-gray-100">
         <div className="relative flex items-center">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about shipments, invoices, or analytics..." 
              className="w-full pl-4 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm"
            />
            <button 
              onClick={handleSend}
              className="absolute right-2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
               <Send size={18} />
            </button>
         </div>
         <div className="flex space-x-2 mt-3 overflow-x-auto pb-1">
            {['Track my latest shipment', 'Show me overdue invoices', 'What is my average transit time?'].map((suggestion, idx) => (
               <button key={idx} onClick={() => { setInput(suggestion); setTimeout(handleSend, 100); }} className="whitespace-nowrap px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs rounded-full font-medium transition">
                 {suggestion}
               </button>
            ))}
         </div>
      </div>
    </div>
  );
}
