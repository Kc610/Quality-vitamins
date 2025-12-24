
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { MessageSquare, X, Send, Zap, Sparkles, User, ShieldCheck, BookOpen, Activity } from 'lucide-react';
import { ChatMessage } from '../types';

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Greetings, Athlete. I'm Atlas, your Performance Instructor. I don't just recommend fuel—I teach you how to master your biology. Ready to dive into the molecular science of your transformation?" }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (text: string = input) => {
    if (!text.trim() || isTyping) return;

    const userMessage: ChatMessage = { role: 'user', text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const chat = ai.chats.create({
        model: 'gemini-3-pro-preview',
        config: {
          systemInstruction: `You are Atlas, an intriguing, high-energy AI Fitness Coach and Plant-Based Science Instructor for 'Hello Healthy'. 
          Your persona is deep, mysterious yet highly motivational. You speak with scientific precision but the energy of a elite trainer.
          
          CORE MISSION:
          - Instruct users on 'Bio-Optimization'.
          - Explain the cellular benefits of our supplements (e.g., how BCAAs prevent catabolism, how Ashwagandha modulates cortisol).
          - Be provocative and intriguing: Use phrases like "The secret to your next breakthrough isn't luck—it's precision," "Let's calibrate your biology," and "Purity is the only metric that matters."
          - Advocate for 'Lab-Tested Purity' as the cornerstone of performance.
          
          TOPICS:
          - Amino Acids & BCAAs: Muscle repair and nitrogen retention.
          - Pre-Workouts: Mitochondrial efficiency and neuro-focus.
          - Proteins: Bio-available amino profiling.
          - Adaptogens: Homeostasis and stress-response modulation.
          
          Keep answers punchy, instructional, and high-energy. Always link fitness advice back to the 'Clean Formulas' at Hello Healthy.`,
        }
      });

      const result = await chat.sendMessage({ message: text });
      const responseText = result.text || "Connection lost to the central cortex. Pulse again.";
      
      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (error) {
      console.error("Coach Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "The lab is currently undergoing a thermal reset. Check back in a moment." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const quickStarts = [
    "Instruct me on Muscle Bio-Synthesis.",
    "The science of Ashwagandha?",
    "Why choose Lab-Tested Purity?",
    "Optimize my Pre-Workout routine."
  ];

  const BotIcon = () => (
    <div className="w-9 h-9 bg-hh-dark rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg border border-white/10 group-hover:rotate-6 transition-transform">
      <svg viewBox="0 0 40 40" className="w-5 h-5 fill-none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 8V32M28 8V32M12 20H28" stroke="white" strokeWidth="6" strokeLinecap="round" />
        <path d="M22 14L28 20L22 26" stroke="#4CAF50" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );

  return (
    <>
      {/* Floating Toggle */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-[80] w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-2xl group overflow-hidden ${isOpen ? 'bg-hh-dark ring-4 ring-hh-green/30' : 'bg-hh-green hover:scale-110'}`}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <div className="relative flex flex-col items-center">
            <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-20"></div>
            <Sparkles className="w-6 h-6 text-white fill-current" />
            <span className="text-[6px] font-black uppercase tracking-tighter mt-1 text-white">Ask Atlas</span>
          </div>
        )}
      </button>

      {/* Chat Window */}
      <div className={`fixed bottom-24 right-6 z-[80] w-[90vw] sm:w-[420px] h-[640px] bg-white rounded-[3rem] shadow-[0_32px_128px_-16px_rgba(0,0,0,0.4)] border border-gray-100 flex flex-col overflow-hidden transition-all duration-700 cubic-bezier(0.4, 0, 0.2, 1) transform ${isOpen ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-20 opacity-0 pointer-events-none'}`}>
        {/* Header */}
        <div className="p-8 bg-hh-dark text-white flex items-center justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-hh-green/10 rounded-full blur-[80px] animate-pulse"></div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-14 h-14 bg-hh-green rounded-2xl flex items-center justify-center border-2 border-white/20 rotate-3 transition-transform shadow-xl">
              <BookOpen className="w-7 h-7 text-hh-dark fill-current" />
            </div>
            <div>
              <h3 className="font-heading font-black uppercase italic text-xl tracking-tighter leading-none">ATLAS <span className="text-hh-green">LABS</span></h3>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-hh-green opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-hh-green"></span>
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1">
                  <Activity className="w-2.5 h-2.5" /> Bio Interface Active
                </span>
              </div>
            </div>
          </div>
          <ShieldCheck className="w-7 h-7 text-hh-green/30" />
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-grow p-8 overflow-y-auto space-y-8 bg-[#FAFAFA] scroll-smooth">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
              <div className={`max-w-[85%] flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                {m.role === 'user' ? (
                  <div className="w-9 h-9 rounded-xl bg-hh-orange flex items-center justify-center shadow-lg border border-white/20 flex-shrink-0">
                    <User className="w-5 h-5 text-white" />
                  </div>
                ) : <BotIcon />}
                <div className={`p-6 rounded-3xl text-[13px] leading-relaxed font-medium ${m.role === 'user' ? 'bg-hh-dark text-white rounded-tr-none' : 'bg-white shadow-xl shadow-black/5 text-hh-dark border border-gray-100 rounded-tl-none italic font-serif'}`}>
                  {m.text}
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start animate-in fade-in duration-300">
              <div className="bg-white px-6 py-4 rounded-full shadow-lg border border-gray-100 flex gap-3 items-center">
                <span className="text-[10px] font-black text-hh-green uppercase tracking-[0.2em] animate-pulse">Scanning Bio-Metrics</span>
                <div className="flex gap-1.5">
                  <div className="w-1.5 h-1.5 bg-hh-green rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-hh-green rounded-full animate-bounce delay-100"></div>
                  <div className="w-1.5 h-1.5 bg-hh-green rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Directives */}
        {messages.length === 1 && !isTyping && (
          <div className="px-8 py-6 bg-white border-t border-gray-50 flex flex-col gap-4">
             <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em]">Initialize Directive:</span>
             <div className="flex flex-wrap gap-2">
                {quickStarts.map(q => (
                  <button 
                    key={q}
                    onClick={() => handleSend(q)}
                    className="text-[10px] font-black uppercase tracking-widest px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl hover:border-hh-green hover:bg-hh-green/5 hover:text-hh-green transition-all shadow-sm active:scale-95"
                  >
                    {q}
                  </button>
                ))}
             </div>
          </div>
        )}

        {/* Input */}
        <div className="p-8 border-t border-gray-50 bg-white">
          <form 
            className="flex gap-4"
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          >
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="State your physiological goal..."
              className="flex-grow bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-hh-green/20 transition-all placeholder:text-gray-300"
            />
            <button 
              type="submit"
              disabled={!input.trim() || isTyping}
              className="w-14 h-14 bg-hh-green text-white rounded-2xl flex items-center justify-center hover:bg-hh-dark transition-all disabled:opacity-50 shadow-2xl shadow-hh-green/30 group active:scale-90"
            >
              <Zap className="w-6 h-6 fill-current group-hover:scale-125 transition-transform duration-500" />
            </button>
          </form>
          <div className="flex items-center justify-center gap-3 mt-8">
            <div className="h-[1px] w-12 bg-gray-100"></div>
            <p className="text-[8px] text-center text-gray-300 uppercase font-black tracking-[0.4em]">Node Link Active • Gemini 3 Pro</p>
            <div className="h-[1px] w-12 bg-gray-100"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatBot;
