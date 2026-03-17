'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Trash2, Cpu } from 'lucide-react';
import api from '../../lib/api';

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'ai',
      content: "Welcome to the ELITE Learning AI. I'm connected to a real neural network to give you the best study assistance. Ask me anything!",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await api.post('/ai/ask', { message: input });
      
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: response.data.response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error: any) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: error.response?.data?.message || "I'm having trouble connecting to my neural core. Please check your API configuration.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-120px)] flex flex-col pt-4">
      {/* Dynamic Header */}
      <div className="bg-white dark:bg-gray-800 rounded-t-3xl p-6 border-b dark:border-gray-700 flex items-center justify-between shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 animate-gradient-x"></div>
        <div className="flex items-center space-x-5">
          <div className="relative">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-blue-500/50 animate-pulse">
              <Cpu className="w-8 h-8" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-4 border-white dark:border-gray-800 shadow-md"></div>
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center tracking-tight">
              Real AI Assistant
              <Sparkles className="w-5 h-5 ml-2 text-yellow-500 fill-yellow-500" />
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest">
              Powered by Advanced Neural Core
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
            <div className="hidden md:block bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-xl text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-tighter border border-blue-100 dark:border-blue-900">
                GPT-3.5 Active
            </div>
            <button 
              onClick={() => setMessages([{ id: '1', role: 'ai', content: "Neural memory flushed. I'm ready for fresh inquiries.", timestamp: new Date() }])}
              className="p-3 text-gray-400 hover:text-red-500 transition rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-700 border border-transparent hover:border-red-100 dark:hover:border-red-900"
            >
              <Trash2 className="w-6 h-6" />
            </button>
        </div>
      </div>

      {/* Futuristic Chat Container */}
      <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-white dark:bg-gray-800 custom-scrollbar border-x dark:border-gray-700 shadow-inner">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in zoom-in-95 duration-500`}>
            <div className={`flex max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start space-x-3`}>
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform hover:scale-110 ${msg.role === 'user' ? 'bg-gradient-to-br from-blue-500 to-blue-700 ml-4 shadow-lg' : 'bg-gray-100 dark:bg-gray-700 mr-4 border dark:border-gray-600 shadow-md'}`}>
                {msg.role === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
              </div>
              <div className={`p-5 rounded-3xl shadow-xl text-base leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 border dark:border-gray-700 rounded-tl-none'
              }`}>
                {msg.content}
                <div className={`flex items-center mt-3 opacity-40 text-[10px] font-bold uppercase tracking-widest ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'user' ? 'User Identity Validated' : 'AI Core Processing Complete'} • {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start items-center space-x-4">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/10 flex items-center justify-center animate-pulse">
              <Bot className="w-5 h-5 text-blue-600" />
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 p-5 rounded-3xl border dark:border-gray-700 flex space-x-2">
              <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce [animation-duration:0.8s]"></div>
              <div className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:0.2s]"></div>
              <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:0.4s]"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Premium Input Console */}
      <div className="p-8 bg-white dark:bg-gray-800 rounded-b-3xl border-t dark:border-gray-700 shadow-2xl">
        <form onSubmit={handleSend} className="relative flex items-center group">
          <div className="absolute inset-y-0 left-6 flex items-center text-gray-400 group-focus-within:text-blue-500 transition-colors">
            <Sparkles className="w-5 h-5 shadow-glow" />
          </div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your study inquiry here..."
            className="w-full pl-14 pr-20 py-5 bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-blue-500 rounded-3xl dark:text-white text-base shadow-2xl transition-all outline-none font-medium"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="absolute right-3 p-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 shadow-xl shadow-blue-500/40"
          >
            <Send className="w-6 h-6" />
          </button>
        </form>
      </div>

      <style jsx global>{`
        @keyframes gradient-x {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s linear infinite;
        }
        .shadow-glow {
          filter: drop-shadow(0 0 5px rgba(59, 130, 246, 0.5));
        }
      `}</style>
    </div>
  );
}
