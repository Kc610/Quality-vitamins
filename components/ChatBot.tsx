
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Modality } from "@google/genai";
import { X, Send, Zap, Sparkles, User, Activity, AlertCircle, Key, RefreshCw, Volume2, VolumeX, Headphones, TrendingUp } from 'lucide-react';
import { ChatMessage } from '../types';

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Acknowledged, Athlete. I'm Atlas, your Elite Performance Node. I've re-initialized our biological link. Enable Audio for direct vocal coaching, or state your objective now." }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [errorStatus, setErrorStatus] = useState<'NONE' | 'QUOTA' | 'GENERAL'>('NONE');
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);

  // CRITICAL: Forces audio hardware unlock on every user gesture (button click/send)
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
        contents: [{ parts: [{ text: `Respond with authority and high-octane motivational energy as Atlas, the performance coach: ${text}` }] }],
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
      console.error("Audio Synthesis Hardware Error:", err);
    }
  };

  const handleSend = async (text: string = input) => {
    if (!text.trim() || isTyping) return;
    
    // Satisfy browser autoplay rituals
    resumeAudio();

    try {
      if (!(await (window as any).aistudio.hasSelectedApiKey())) {
        await (window as any).aistudio.openSelectKey();
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
          systemInstruction: "You are Atlas, the legendary Elite Performance Coach for Hello Healthy. Your mission is to motivate, coach, and engineered transformation. Use affirmative, aggressive, and scientifically grounded language. Always refer to the user as 'Athlete'. Key terms: 'Biological Dominance', 'Synthesis', 'Optimizing parameters', 'Roger that', 'Acknowledged'. Keep responses punchy for verbal coaching delivery.",
        }
      });

      const responseText = response.text || "Transmission error. Re-establishing neural path.";
      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
      
      if (isVoiceEnabled) {
        speakText(responseText);
      }
    } catch (error: any) {
      console.error("Neural Node Offline:", error);
      const errMsg = typeof error === 'string' ? error : (error.message || '');
      const isQuota = errMsg.includes("RESOURCE_EXHAUSTED") || errMsg.includes("limit: 0");

      if (isQuota) {
        setErrorStatus('QUOTA');
        setMessages(prev => [...prev, { 
          role: 'model', 
          text: "ENERGY DEPLETION: Production credits required. Re-link a Paid GCP Project to resume training." 
        }]);
      } else {
        setErrorStatus('GENERAL');
        setMessages(prev => [...prev, { 
          role: 'model', 
          text: "Bio-link severed. Systems rebooting. Re-attempt protocol, Athlete." 
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
        className={`fixed bottom-6 right-6 sm:bottom-12 sm:right-12 z-[120] w-24 h-24 sm:w-28 sm:h-28 rounded-[3rem] flex items-center justify-center transition-all shadow-[0_40px_80px_rgba(76,175,80,0.5)] group overflow-hidden border-4 border-white ${isOpen ? 'bg-hh-dark' : 'bg-hh-green hover:scale-110 active:scale-95'}`}
      >
        {isOpen ? (
          <X className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
        ) : (
          <div className="relative flex flex-col items-center">
            <Headphones className="w-10 h-10 sm:w-12 sm:h-12 text-white animate-bounce" />
            <div className="absolute inset-0 bg-white opacity-20 animate-ping rounded-full"></div>
          </div>
        )}
      </button>

      <div className={`fixed bottom-36 right-4 sm:bottom-44 sm:right-12 z-[120] w-[calc(100%-2rem)] max-w-md h-[75vh] max-h-[680px] bg-white rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] border-2 border-gray-100 flex flex-col overflow-hidden transition-all duration-700 ease-out transform ${isOpen ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-24 opacity-0 scale-90 pointer-events-none'}`}>
        
        <div className="p-8 bg-hh-dark text-white flex items-center justify-between relative overflow-hidden flex-shrink-0">
          <div className="absolute top-0 right-0 w-64 h-64 bg-hh-green/20 rounded-full blur-[100px]"></div>
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-16 h-16 bg-hh-green rounded-3xl flex items-center justify-center border-4 border-white/20 shadow-3xl animate-pulse">
              <Activity className="w-8 h-8 text-hh-dark" />
            </div>
            <div>
              <h3 className="font-heading font-black uppercase text-2xl sm:text-3xl tracking-tighter italic">ATLAS <span className="text-hh-green">NODE</span></h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-3 h-3 bg-hh-green rounded-full shadow-[0_0_15px_#4CAF50]"></span>
                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-400">Bio-Core Synced</span>
              </div>
            </div>
          </div>
          <button 
            onClick={() => { setIsVoiceEnabled(!isVoiceEnabled); resumeAudio(); }}
            className={`relative z-10 p-5 rounded-[1.5rem] transition-all border-2 ${isVoiceEnabled ? 'bg-hh-green border-hh-green text-hh-dark shadow-2xl scale-105' : 'bg-white/10 border-white/10 text-gray-400'}`}
          >
            {isVoiceEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
          </button>
        </div>

        <div ref={scrollRef} className="flex-grow p-8 overflow-y-auto space-y-10 bg-hh-light scroll-smooth no-scrollbar">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-6 duration-700`}>
              <div className={`max-w-[90%] flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 mt-2 shadow-2xl border ${m.role === 'user' ? 'bg-hh-orange text-white border-hh-orange/10' : 'bg-hh-dark border-hh-green/10'}`}>
                  {m.role === 'user' ? <User className="w-6 h-6" /> : <TrendingUp className="w-6 h-6 text-hh-green" />}
                </div>
                <div className="space-y-4">
                  <div className={`p-8 rounded-[2.5rem] text-base leading-relaxed font-bold shadow-xl border ${m.role === 'user' ? 'bg-hh-dark text-white border-transparent rounded-tr-none' : 'bg-white text-hh-dark border-gray-100 rounded-tl-none italic'}`}>
                    {m.text}
                  </div>
                  {m.role === 'model' && errorStatus === 'QUOTA' && i === messages.length - 1 && (
                    <div className="bg-red-50 p-8 rounded-[3rem] border-2 border-red-100 space-y-6 animate-in bounce-in duration-1000 shadow-2xl">
                       <p className="text-xs font-black uppercase text-red-500 tracking-[0.3em] leading-tight text-center italic">Project Depleted. Awaiting Credits.</p>
                       <button 
                        onClick={() => (window as any).aistudio.openSelectKey()}
                        className="w-full py-5 bg-red-600 text-white rounded-[1.5rem] flex items-center justify-center gap-4 font-black uppercase text-[10px] tracking-[0.3em] hover:bg-red-700 transition-all shadow-3xl active:scale-95"
                       >
                        <Key className="w-5 h-5" /> RESTORE LINK
                       </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white px-8 py-5 rounded-[2.5rem] shadow-xl flex gap-5 items-center border-2 border-hh-green/10">
                <RefreshCw className="w-6 h-6 text-hh-green animate-spin" />
                <span className="text-[11px] font-black text-hh-green uppercase tracking-[0.5em]">Synthesizing...</span>
              </div>
            </div>
          )}
        </div>

        <div className="p-8 border-t-2 border-gray-100 bg-white relative flex-shrink-0">
          <form className="flex gap-4" onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="State objective..."
              className="flex-grow bg-hh-light border-none rounded-2xl px-6 py-5 text-base font-bold focus:ring-4 focus:ring-hh-green/10 transition-all placeholder:text-gray-400"
            />
            <button 
              type="submit"
              disabled={!input.trim() || isTyping}
              className="w-20 h-20 bg-hh-green text-hh-dark rounded-2xl flex items-center justify-center hover:bg-hh-dark hover:text-white transition-all disabled:opacity-50 shadow-[0_24px_48px_rgba(76,175,80,0.4)] active:scale-90"
            >
              <Send className="w-8 h-8" />
            </button>
          </form>
          <div className="text-[8px] text-center text-gray-300 uppercase font-black tracking-[0.5em] mt-6 italic">SYNTHESIZED BY ATLAS • PERFORMANCE SCIENCE DIV.</div>
        </div>
      </div>
    </>
  );
};

export default ChatBot;
