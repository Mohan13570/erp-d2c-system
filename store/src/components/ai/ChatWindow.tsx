import React, { useState } from 'react';

export default function ChatWindow() {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      // Placeholder: In a real app, dispatch an action or call API
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <section className="flex-1 flex flex-col bg-white p-4">
      <div className="flex-1 overflow-y-auto mb-4">
        {/* Placeholder for chat messages */}
        <p className="text-gray-500">Chat messages will appear here.</p>
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          type="button"
          onClick={handleSend}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
        >
          Send
        </button>
      </div>
    </section>
  );
}
