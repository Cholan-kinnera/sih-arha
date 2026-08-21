import React, { useState } from 'react';
import { Sparkles, ChevronUp, ChevronDown, Send, ArrowRight } from 'lucide-react';
import { useUiStore } from '../../stores/useUiStore';
import { Button } from '../ui/Button';

export const AssistantDock: React.FC = () => {
  const { assistantDockExpanded, toggleAssistantDock } = useUiStore();
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    {
      sender: 'ai',
      text: 'Hello Arjun. I am your CBIP Assistant. I can explain scheme requirements or hand off to the Eligibility Engine to evaluate your status.',
    },
  ]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userText = query.trim();
    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setQuery('');

    // Simulate AI explanation vs Engine handoff
    setTimeout(() => {
      if (userText.toLowerCase().includes('eligible') || userText.toLowerCase().includes('qualify')) {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'ai',
            text: "I'll check your eligibility against scheme criteria using the Deterministic Eligibility Engine...",
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'ai',
            text: `Regarding "${userText}": CBIP checks scheme guidelines against verified evidence. You can view required documents in the Documents tab.`,
          },
        ]);
      }
    }, 600);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-3 pointer-events-none">
      <div className="max-w-3xl mx-auto pointer-events-auto">
        <div className="bg-zinc-900/95 border border-zinc-800 rounded-2xl shadow-2xl backdrop-blur-md overflow-hidden transition-all duration-300">
          {/* Header Bar */}
          <div
            onClick={toggleAssistantDock}
            className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-zinc-800/40 transition-colors border-b border-zinc-800/50"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-md bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-semibold text-zinc-200 tracking-wide uppercase">
                CBIP AI Assistant & Handoff Surface
              </span>
            </div>

            <button className="text-zinc-400 hover:text-zinc-100 p-1">
              {assistantDockExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>

          {/* Expanded Conversation Surface */}
          {assistantDockExpanded && (
            <div className="p-4 max-h-64 overflow-y-auto space-y-3 border-b border-zinc-800/50 text-sm">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xl rounded-xl px-3.5 py-2 text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-zinc-800/80 text-zinc-200 border border-zinc-700/50'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Single-line Input Bar */}
          <form onSubmit={handleSend} className="flex items-center gap-2 px-3 py-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask CBIP about scheme requirements, eligibility, or required evidence..."
              className="flex-1 bg-transparent text-xs text-zinc-100 placeholder-zinc-500 px-3 py-1.5 focus:outline-none"
            />
            <Button variant="primary" size="sm" type="submit" className="gap-1 text-xs py-1">
              <span>Ask</span>
              <Send className="w-3 h-3" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
