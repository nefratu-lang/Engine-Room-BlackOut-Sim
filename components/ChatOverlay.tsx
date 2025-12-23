
import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage } from '../types';

interface Props {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
}

export const ChatOverlay: React.FC<Props> = ({ messages, onSendMessage }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (!isOpen) setHasUnread(true);
  }, [messages]);

  useEffect(() => {
    if (isOpen) setHasUnread(false);
  }, [isOpen]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 left-4 z-50 bg-slate-800 border border-slate-600 p-3 rounded-full shadow-lg hover:bg-slate-700 transition-colors group"
      >
        <div className="relative">
          <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          {hasUnread && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>}
        </div>
      </button>
    );
  }

  return (
    <div className="fixed bottom-20 left-4 z-50 w-80 bg-slate-900/90 backdrop-blur border border-slate-700 rounded-lg shadow-xl flex flex-col overflow-hidden max-h-[400px]">
      <div className="bg-slate-800 p-3 flex justify-between items-center border-b border-slate-700">
        <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Comms Channel</span>
        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2 h-64">
        {messages.length === 0 && <div className="text-xs text-slate-500 text-center italic mt-4">Channel Open. No traffic.</div>}
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.isSystem ? 'items-center' : 'items-start'}`}>
            {msg.isSystem ? (
              <span className="text-[10px] text-yellow-500 uppercase font-mono my-1">- {msg.text} -</span>
            ) : (
              <div className="bg-slate-800/50 rounded p-2 max-w-[90%] border-l-2 border-cyan-500">
                 <div className="text-[10px] text-cyan-600 font-bold mb-0.5">{msg.sender}</div>
                 <div className="text-xs text-slate-200">{msg.text}</div>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="p-2 bg-slate-800 border-t border-slate-700 flex gap-2">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type message..."
          className="flex-1 bg-slate-900 border border-slate-600 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-cyan-500"
        />
        <button type="submit" className="bg-cyan-700 hover:bg-cyan-600 text-white px-3 py-1 rounded text-xs font-bold">SEND</button>
      </form>
    </div>
  );
};
