import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { askAssistant } from '../services/api';

export default function AssistantModal({ isOpen, onClose, initialContext = null }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm your OmniSense Assistant. I can help you understand your analyses, findings, evidence, and recommended actions." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setLoading(true);
    
    try {
      const res = await askAssistant(userMessage, initialContext || { location: 'Dashboard' });
      if (res.success) {
        setMessages(prev => [...prev, { role: 'assistant', content: res.data.answer }]);
      } else {
        throw new Error('Backend failed');
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I couldn't process that request. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 0.3 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 w-full max-w-sm sm:max-w-md bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] z-50 flex flex-col border border-indigo-50 overflow-hidden"
            style={{ height: '500px', maxHeight: 'calc(100vh - 48px)' }}
          >
            {/* Header */}
            <div className="bg-indigo-600 text-white p-4 flex justify-between items-center shrink-0 shadow-sm relative z-10">
              <div>
                <h3 className="font-bold text-base">OmniSense Assistant</h3>
                <p className="text-indigo-100 text-xs">Context-aware reasoning assistant</p>
              </div>
              <button onClick={onClose} className="text-indigo-100 hover:text-white transition-colors bg-indigo-500/30 p-1.5 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-br-sm shadow-md' : 'bg-white text-slate-800 border border-slate-100 rounded-bl-sm shadow-sm'}`}>
                    {msg.content.split('\n').map((line, i) => (
                      <React.Fragment key={i}>
                        {line}
                        {i !== msg.content.split('\n').length - 1 && <br />}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
                    <span className="text-xs font-medium text-slate-500">Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input Area */}
            <div className="p-3 bg-white border-t border-slate-100 shrink-0">
              <div className="flex items-end bg-slate-50 border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500/50 transition-all p-1">
                <textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about your analysis..."
                  className="flex-1 max-h-32 min-h-[40px] bg-transparent border-none focus:outline-none resize-none px-3 py-2 text-sm text-slate-800"
                  rows={1}
                />
                <button 
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                  className="m-1 shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors shadow-sm"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <div className="text-center mt-2">
                <p className="text-[10px] text-slate-400">Press Enter to send, Shift + Enter for new line</p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
