
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Modality } from "@google/genai";
import { X, Send, Zap, Sparkles, User, Activity, AlertCircle, Key, RefreshCw, Volume2, VolumeX, Headphones, TrendingUp } from 'lucide-react';
import { ChatMessage } from '../types';

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Roger that, Athlete. I'm Atlas, your Elite Performance Node. State your objective, and we'll engineer your victory." }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [errorStatus, setErrorStatus] = useState<'NONE' | 'QUOTA' | 'GENERAL'>('NONE');
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);

  const resumeAudio = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
  };

  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  const decodeAudioData = async (
    data: Uint8Array,
    ctx: AudioContext,
    sampleRate: number,
    numChannels: number,
  ): Promise<AudioBuffer> => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const speakText = async (text: string) => {
    if (!isVoiceEnabled) return;
    resumeAudio();

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Act as Atlas, the high-octane motivational performance coach. Respond to this: ${text}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio && audioContextRef.current) {
        const audioBuffer = await decodeAudioData(decode(base64Audio), audioContextRef.current, 24000, 1);
        const source = audioContextRef.current.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContextRef.current.destination);
        source.start();
      }
    } catch (err) {
      console.error("Audio Synthesis Error:", err);
    }
  };

  const handleSend = async (text: string = input) => {
    if (!text.trim() || isTyping) return;
    
    resumeAudio();

    try {
      if (!(await (window as any).aistudio.hasSelectedApiKey())) {
        await (window as any).aistudio.openSelectKey();
        return; // Don't proceed until key is selected
      }

      setErrorStatus('NONE');
      const userMessage: ChatMessage = { role: 'user', text };
      setMessages(prev => [...prev, userMessage]);
      setInput('');
      setIsTyping(true);

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          ...messages.map(m => ({ role: m.role, parts: [{ text: m.text }] })),
          { role: 'user', parts: [{ text }] }
        ],
        config: {
          systemInstruction: "You are Atlas, the legendary Elite Performance Coach for Hello Healthy. Use high-octane, affirmative, and scientifically grounded language. Refer to the user as 'Athlete'. Key terms: 'Biological Dominance', 'Synthesis', 'Optimizing parameters'. Responses must be punchy and high-energy.",
        }
      });

      const responseText = response.text || "Neural link severed. Rebooting.";
      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
      
      if (isVoiceEnabled) {
        speakText(responseText);
      }
    } catch (error: any) {
      console.error("Atlas Node Offline:", error);
      const errMsg = typeof error === 'string' ? error : (error.message || '');
      const isQuota = errMsg.includes("RESOURCE_EXHAUSTED") || errMsg.includes("limit: 0");

      if (isQuota) {
        setErrorStatus('QUOTA');
        setMessages(prev => [...prev, { 
          role: 'model', 
          text: "ENERGY DEPLETION: Neural production requires credits. Please link a Paid project." 
        }]);
      } else {
        setErrorStatus('GENERAL');
        setMessages(prev => [...prev, { 
          role: 'model', 
          text: "Link severed. Re-attempt directive, Athlete." 
        }]);
      }
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => { setIsOpen(!isOpen); resumeAudio(); }}
        className={`fixed bottom-6 right-6 sm:bottom-10 sm:right-10 z-[120] w-20 h-20 sm:w-24 sm:h-24 rounded-[2rem] flex items-center justify-center transition-all shadow-[0_30px_60px_rgba(76,175,80,0.5)] group border-4 border-white ${isOpen ? 'bg-hh-dark' : 'bg-hh-green hover:scale-110 active:scale-95'}`}
      >
        {isOpen ? (
          <X className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
        ) : (
          <div className="relative flex flex-col items-center">
            <Headphones className="w-8 h-8 sm:w-10 sm:h-10 text-white animate-bounce" />
            <div className="absolute inset-0 bg-white opacity-20 animate-ping rounded-full"></div>
          </div>
        )}
      </button>

      <div className={`fixed bottom-32 right-4 sm:bottom-36 sm:right-10 z-[120] w-[calc(100%-2rem)] sm:w-[380px] h-[70vh] max-h-[600px] bg-white rounded-[3rem] shadow-[0_60px_120px_-20px_rgba(0,0,0,0.4)] border-2 border-gray-100 flex flex-col overflow-hidden transition-all duration-500 transform ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
        
        {/* Header - Solid Background */}
        <div className="p-6 bg-hh-dark text-white flex items-center justify-between relative flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-hh-green rounded-2xl flex items-center justify-center border-2 border-white/10 animate-pulse">
              <Activity className="w-6 h-6 text-hh-dark" />
            </div>
            <div>
              <h3 className="font-heading font-black uppercase text-xl sm:text-2xl tracking-tighter italic">ATLAS NODE</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 bg-hh-green rounded-full shadow-[0_0_10px_#4CAF50]"></span>
                <span className="text-[8px] font-black uppercase tracking-[0.3em] text-gray-400">Biological Core Synced</span>
              </div>
            </div>
          </div>
          <button 
            onClick={() => { setIsVoiceEnabled(!isVoiceEnabled); resumeAudio(); }}
            className={`p-4 rounded-xl transition-all border ${isVoiceEnabled ? 'bg-hh-green border-hh-green text-hh-dark scale-105' : 'bg-white/10 border-white/10 text-gray-400'}`}
          >
            {isVoiceEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
        </div>

        {/* Messages Container - Non-Transparent */}
        <div ref={scrollRef} className="flex-grow p-6 overflow-y-auto space-y-8 bg-white scroll-smooth no-scrollbar">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
              <div className={`max-w-[90%] flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-1 shadow-md border ${m.role === 'user' ? 'bg-hh-orange text-white' : 'bg-hh-dark'}`}>
                  {m.role === 'user' ? <User className="w-5 h-5" /> : <TrendingUp className="w-5 h-5 text-hh-green" />}
                </div>
                <div className="space-y-3">
                  <div className={`p-6 rounded-[2rem] text-sm leading-relaxed font-bold shadow-sm border ${m.role === 'user' ? 'bg-hh-dark text-white border-transparent rounded-tr-none' : 'bg-hh-light text-hh-dark border-gray-100 rounded-tl-none italic'}`}>
                    {m.text}
                  </div>
                  {m.role === 'model' && errorStatus === 'QUOTA' && i === messages.length - 1 && (
                    <div className="bg-red-50 p-6 rounded-2xl border border-red-100 space-y-4 shadow-md">
                       <p className="text-[10px] font-black uppercase text-red-500 tracking-widest text-center italic">Awaiting Paid Credits</p>
                       <button 
                        onClick={() => (window as any).aistudio.openSelectKey()}
                        className="w-full py-4 bg-red-600 text-white rounded-xl flex items-center justify-center gap-3 font-black uppercase text-[9px] tracking-widest hover:bg-red-700 transition-all active:scale-95"
                       >
                        <Key className="w-4 h-4" /> RESTORE LINK
                       </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-hh-light px-6 py-4 rounded-full shadow-sm flex gap-4 items-center border border-gray-100">
                <RefreshCw className="w-4 h-4 text-hh-green animate-spin" />
                <span className="text-[10px] font-black text-hh-green uppercase tracking-[0.4em]">Synthesizing...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Area - Solid */}
        <div className="p-6 border-t border-gray-100 bg-white flex-shrink-0">
          <form className="flex gap-3" onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="State objective..."
              className="flex-grow bg-hh-light border-none rounded-xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-hh-green/20 transition-all placeholder:text-gray-400 text-hh-dark"
            />
            <button 
              type="submit"
              disabled={!input.trim() || isTyping}
              className="w-16 h-16 bg-hh-green text-hh-dark rounded-xl flex items-center justify-center hover:bg-hh-dark hover:text-white transition-all disabled:opacity-50 shadow-lg active:scale-90"
            >
              <Send className="w-6 h-6" />
            </button>
          </form>
          <div className="text-[7px] text-center text-gray-400 uppercase font-black tracking-[0.5em] mt-4 italic">SYNTHESIZED BY PERFORMANCE SCIENCE DIV • ATLAS V2</div>
        </div>
      </div>
    </>
  );
};

export default ChatBot;
