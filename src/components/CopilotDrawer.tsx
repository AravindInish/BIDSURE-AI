import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  HelpCircle, 
  ShieldAlert, 
  CheckCircle2, 
  FileText,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { Tender, VendorBid, CopilotMessage } from '../types';
import { askCopilotApi } from '../services/apiService';

interface CopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentTender: Tender;
  currentBid: VendorBid;
}

export const CopilotDrawer: React.FC<CopilotDrawerProps> = ({
  isOpen,
  onClose,
  currentTender,
  currentBid,
}) => {
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      content: `Hello Officer Sharma. I am **BidSure Copilot**, your procurement intelligence assistant. 

Currently analyzing **${currentBid.vendorName}** under Tender **${currentTender.tenderId}** (${currentTender.title}).
• Overall Compliance Score: **${currentBid.complianceScore}/100**
• Risk Level: **${currentBid.riskLevel} (${currentBid.riskScore}/100)**
• Key Flag: OEM Authorization warranty duration shortfall (12 mos vs 24 mos mandated).

How may I assist your verification review today?`,
      timestamp: 'Just now',
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    'What requirements has this vendor failed?',
    'Why is this bid marked medium risk?',
    'Show me all missing documents.',
    'Which documents need manual verification?',
    'Explain the compliance score.',
    'Compare Vendor A and Vendor B.',
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || inputQuery.trim();
    if (!query || loading) return;

    const userMsg: CopilotMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const response = await askCopilotApi(query, {
        tender: currentTender,
        bid: currentBid,
      });

      const assistantMsg: CopilotMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        content: response.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: response.source,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'assistant',
          content: 'Unable to query AI engine. Please verify network connectivity or review local compliance tab.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[460px] bg-white shadow-2xl z-50 flex flex-col border-l border-emerald-900/15 animate-in slide-in-from-right duration-300">
      {/* Drawer Header */}
      <div className="bg-[#06452D] text-white p-4 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#0B5D3B] flex items-center justify-center border border-emerald-400/40 text-amber-300">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-sm flex items-center gap-1.5 font-serif">
              BidSure Copilot
              <span className="text-[10px] bg-emerald-800 text-emerald-200 px-1.5 py-0.2 rounded font-mono">
                GeM AI
              </span>
            </h3>
            <p className="text-[11px] text-emerald-200/80">
              Procurement Officer Decision-Support
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Advisory Notice */}
      <div className="bg-amber-50 border-b border-amber-200/80 px-4 py-2 text-[11px] text-amber-900 flex items-start gap-2">
        <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <span>
          <strong>Advisory Tool:</strong> Copilot provides explainable analysis. Qualification or disqualification remains strictly under the authority of the procurement officer.
        </span>
      </div>

      {/* Suggested Chips */}
      <div className="p-3 bg-slate-50 border-b border-slate-200 overflow-x-auto">
        <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
          <HelpCircle className="w-3 h-3 text-emerald-700" />
          <span>Suggested Queries</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="text-[11px] bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 border border-slate-200 hover:border-emerald-300 rounded-full px-2.5 py-1 text-left transition-colors cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#F8FAF9]">
        {messages.map((m) => {
          const isAi = m.sender === 'assistant';
          return (
            <div
              key={m.id}
              className={`flex gap-2.5 ${isAi ? 'justify-start' : 'justify-end'}`}
            >
              {isAi && (
                <div className="w-7 h-7 rounded-lg bg-[#0B5D3B] text-white flex items-center justify-center shrink-0 mt-1 shadow-xs">
                  <Bot className="w-4 h-4 text-emerald-300" />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-xl p-3 text-xs leading-relaxed shadow-xs ${
                  isAi
                    ? 'bg-white text-slate-800 border border-slate-200/90'
                    : 'bg-[#0B5D3B] text-white'
                }`}
              >
                <div className="whitespace-pre-line">{m.content}</div>
                <div
                  className={`mt-2 flex items-center justify-between text-[10px] ${
                    isAi ? 'text-slate-400' : 'text-emerald-200'
                  }`}
                >
                  <span>{m.timestamp}</span>
                  {m.source && (
                    <span className="font-mono bg-slate-100 text-slate-600 px-1 rounded">
                      {m.source}
                    </span>
                  )}
                </div>
              </div>
              {!isAi && (
                <div className="w-7 h-7 rounded-lg bg-slate-700 text-white flex items-center justify-center shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div className="flex gap-2.5 items-center text-slate-500 text-xs">
            <div className="w-7 h-7 rounded-lg bg-[#0B5D3B] text-white flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-emerald-300" />
            </div>
            <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-700" />
              <span>Analyzing tender clauses and bid attachments...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Form */}
      <div className="p-3 bg-white border-t border-slate-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask about compliance, clauses, missing documents..."
            className="flex-1 text-xs border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || loading}
            className="px-3 py-2 bg-[#0B5D3B] hover:bg-[#06452D] disabled:opacity-50 text-white rounded-lg transition-colors cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
