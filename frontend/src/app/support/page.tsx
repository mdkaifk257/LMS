'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Trash2 } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export default function AISupport() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'ai',
      content: "Hello! I'm your LearnFlow AI Assistant. How can I help you with your learning journey today?",
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
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulated AI response logic
    setTimeout(() => {
      let aiResponse = "";
      const lowerInput = input.toLowerCase();

      if (lowerInput.includes('progress')) {
        aiResponse = "You can track your real-time progress right on your Dashboard! Each course card shows exactly how many lessons you've completed.";
      } else if (lowerInput.includes('buy') || lowerInput.includes('enroll') || lowerInput.includes('purchase')) {
        aiResponse = "To enroll in a new course, visit the 'Browse Courses' page. Click 'Buy Now' to see our simulated payment options via QR code or UPI.";
      } else if (lowerInput.includes('certificate')) {
        aiResponse = "Certificates are automatically generated once you complete 100% of all lessons in a course. You can view them in your profile soon!";
      } else if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
        aiResponse = "Hi there! I'm here to assist you. Ask me anything about your courses, progress, or how to use LearnFlow.";
      } else {
        aiResponse = "That's an interesting question! As your AI tutor, I recommend checking the course syllabus or your personal dashboard for the latest updates. Is there anything specific about LearnFlow features I can help with?";
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-120px)] flex flex-col pt-4">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-t-3xl p-6 border-b dark:border-gray-700 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
            <Bot className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
              LearnFlow AI Assistant
              <Sparkles className="w-4 h-4 ml-2 text-yellow-500 fill-yellow-500" />
            </h1>
            <p className="text-xs text-green-500 font-medium flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              Online & Ready to Help
            </p>
          </div>
        </div>
        <button 
          onClick={() => setMessages([{ id: '1', role: 'ai', content: "Chat cleared. How else can I help you?", timestamp: new Date() }])}
          className="p-2 text-gray-400 hover:text-red-500 transition rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50 dark:bg-gray-900/50 custom-scrollbar">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            <div className={`flex max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-end space-x-2`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-blue-600 ml-2' : 'bg-gray-200 dark:bg-gray-700 mr-2 border dark:border-gray-600'}`}>
                {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
              </div>
              <div className={`p-4 rounded-2xl shadow-sm text-sm ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-br-none' 
                  : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border dark:border-gray-700 rounded-bl-none'
              }`}>
                {msg.content}
                <p className={`text-[10px] mt-2 opacity-50 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <Bot className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border dark:border-gray-700 flex space-x-1">
              <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 bg-white dark:bg-gray-800 rounded-b-3xl border-t dark:border-gray-700">
        <form onSubmit={handleSend} className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your AI Learning Assistant..."
            className="w-full pl-6 pr-14 py-4 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 dark:text-white text-sm shadow-inner transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="absolute right-2 p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition disabled:opacity-50 disabled:hover:bg-blue-600 shadow-lg shadow-blue-500/30"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
        <p className="text-[10px] text-center text-gray-400 mt-4 uppercase tracking-widest font-bold">
          Powered by LearnFlow AI Core
        </p>
      </div>
    </div>
  );
}
