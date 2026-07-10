import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, User, Headset } from 'lucide-react';

export default function VendorChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const loadHistory = () => {
    fetch('http://localhost:5000/api/vendor-support/chat')
      .then(res => res.json())
      .then(data => setMessages(data))
      .catch(console.error);
  };

  useEffect(() => {
    loadHistory();
    // Simulate polling for new messages (would use Socket.io in production)
    const interval = setInterval(loadHistory, 3000);
    return () => clearInterval(interval);
  }, []);

  const sendMessage = () => {
    if(!input.trim()) return;
    fetch('http://localhost:5000/api/vendor-support/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sender: 'Vendor', message: input })
    }).then(() => {
      setInput("");
      loadHistory();
    });
  };

  return (
    <div className="p-6 h-[calc(100vh-80px)] flex flex-col space-y-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Live Support Chat</h1>
        <p className="text-muted-foreground">Real-time communication with the Enterprise Procurement Team.</p>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden">
        <CardHeader className="border-b">
          <CardTitle className="text-lg flex items-center gap-2">
            <Headset className="w-5 h-5" /> Enterprise Help Desk
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m: any) => (
            <div key={m.id} className={`flex ${m.sender === 'Vendor' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] p-3 rounded-lg flex gap-3 ${m.sender === 'Vendor' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-900'}`}>
                {m.sender !== 'Vendor' && <Headset className="w-5 h-5 mt-1 opacity-70" />}
                <div>
                  <p className="text-sm">{m.message}</p>
                  <span className="text-[10px] opacity-70 mt-1 block">
                    {new Date(m.createdAt).toLocaleTimeString()}
                  </span>
                </div>
                {m.sender === 'Vendor' && <User className="w-5 h-5 mt-1 opacity-70" />}
              </div>
            </div>
          ))}
          {messages.length === 0 && <p className="text-center text-muted-foreground py-10">No messages yet. Send a message to start.</p>}
        </CardContent>
        <div className="p-4 border-t flex gap-2">
          <input 
            type="text" 
            className="flex-1 border rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" 
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button onClick={sendMessage} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center gap-2">
            <Send className="w-4 h-4" /> Send
          </button>
        </div>
      </Card>
    </div>
  );
}
