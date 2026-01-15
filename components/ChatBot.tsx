
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Modality } from "@google/genai";
import { X, Send, User, Activity, Key, RefreshCw, Volume2, VolumeX, Headphones, TrendingUp, Sparkles, Mic, Trash2, Globe, ExternalLink } from 'lucide-react';
import { ChatMessage } from '../types.ts';

const STORAGE_KEY = 'hh_atlas_chat_history_v1';

interface GroundedMessage extends ChatMessage {
  sources?: {title: string, uri: string}[];
}

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  
  // Initialize messages from localStorage or default welcome message
  const [messages, setMessages] = useState<GroundedMessage[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error("Critical Failure: Chat history buffer corrupted.", e);
      }
    }
    return [
      { role: 'model', text: "Athlete detected. I am Atlas, your Elite Performance Node. State your biological objective and we'll synchronize your parameters for maximum dominance." }
    ];
  });

  const [isTyping, setIsTyping] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [errorStatus, setErrorStatus] = useState<'NONE' | 'QUOTA' | 'GENERAL'>('NONE');
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const recognitionRef = useRef<any>(null);

  // Persist messages to localStorage on every change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  const initAudio = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
  };

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech Recognition Error:", event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser protocol.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      initAudio();
      setIsListening(true);
      recognitionRef.current.start();
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
    initAudio();

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Respond as Atlas, a high-intensity performance coach, keep it under 30 words: ${text}` }] }],
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

  const clearHistory = () => {
    if (window.confirm("CRITICAL: Wipe all tactical chat history?")) {
      const resetMessages: GroundedMessage[] = [
        { role: 'model', text: "History purged. System re-initialized. State your new objective, Athlete." }
      ];
      setMessages(resetMessages);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const handleSend = async (text: string = input) => {
    if (!text.trim() || isTyping) return;
    
    initAudio();

    try {
      if (!(await (window as any).aistudio.hasSelectedApiKey())) {
        await (window as any).aistudio.openSelectKey();
        return; 
      }

      setErrorStatus('NONE');
      const userMessage: GroundedMessage = { role: 'user', text };
      setMessages(prev => [...prev, userMessage]);
      setInput('');
      setIsTyping(true);

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: [
          ...messages.map(m => ({ role: m.role, parts: [{ text: m.text }] })),
          { role: 'user', parts: [{ text }] }
        ],
        config: {
          systemInstruction: "You are ATLAS, the legendary Elite Performance Coach for Hello Healthy. Your language is technical, aggressive, affirmative, and motivational. Refer to users as 'Athlete'. Use Google Search grounding for any queries about biological research, products, or health news. Core values: 100% Purity, Biological Dominance, Neural Clarity. Keep responses under 80 words.",
          tools: [{ googleSearch: {} }]
        }
      });

      const responseText = response.text || "Neural connection interrupted. Re-synchronize, Athlete.";
      
      // Extract grounding sources
      const sources: {title: string, uri: string}[] = [];
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (chunks) {
        chunks.forEach(chunk => {
          if (chunk.web) {
            sources.push({ title: chunk.web.title, uri: chunk.web.uri });
          }
        });
      }

      const modelMessage: GroundedMessage = { 
        role: 'model', 
        text: responseText,
        sources: sources.length > 0 ? sources : undefined
      };

      setMessages(prev => [...prev, modelMessage]);
      
      if (isVoiceEnabled) {
        speakText(responseText);
      }
    } catch (error: any) {
      console.error("Atlas Node Failure:", error);
      const errMsg = error.message || '';
      if (errMsg.includes("RESOURCE_EXHAUSTED") || errMsg.includes("limit: 0")) {
        setErrorStatus('QUOTA');
        setMessages(prev => [...prev, { 
          role: 'model', 
          text: "ENERGY CRITICAL: Project quota depleted. Paid credentials required to maintain the neural link." 
        }]);
      } else {
        setErrorStatus('GENERAL');
        setMessages(prev => [...prev, { 
          role: 'model', 
          text: "Protocol error. Re-engage when ready, Athlete." 
        }]);
      }
    } finally {
      setIsTyping(false);
    }
  };

  const toggleOpen = () => {
    initAudio();
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button 
        onClick={toggleOpen}
        className={`fixed bottom-6 right-6 sm:bottom-10 sm:right-10 z-[120] w-20 h-20 sm:w-24 sm:h-24 rounded-[2.5rem] flex items-center justify-center transition-all shadow-4xl group border-4 border-white ${isOpen ? 'bg-hh-dark' : 'bg-hh-green hover:scale-110 active:scale-95'}`}
      >
        {isOpen ? (
          <X className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
        ) : (
          <div className="relative flex flex-col items-center">
            <Activity className="w-8 h-8 sm:w-10 sm:h-10 text-hh-dark animate-pulse" />
            <div className="absolute -top-1 -right-1 bg-white text-hh-green text-[9px] font-black px-1.5 py-0.5 rounded-full ring-2 ring-hh-green">LIVE</div>
          </div>
        )}
      </button>

      <div className={`fixed bottom-32 right-4 sm:bottom-36 sm:right-10 z-[120] w-[calc(100%-2rem)] sm:w-[420px] h-[75vh] max-h-[700px] bg-white rounded-[3.5rem] shadow-[0_80px_160px_-40px_rgba(0,0,0,0.5)] border-2 border-gray-100 flex flex-col overflow-hidden transition-all duration-500 transform ${isOpen ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-95 pointer-events-none'}`}>
        
        <div className="p-8 bg-hh-dark text-white flex items-center justify-between relative flex-shrink-0">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-hh-green rounded-2xl flex items-center justify-center border-2 border-white/20 animate-pulse shadow-[0_0_20px_rgba(76,175,80,0.3)]">
              <TrendingUp className="w-7 h-7 text-hh-dark" />
            </div>
            <div>
              <h3 className="font-heading font-black uppercase text-2xl tracking-tighter italic leading-none">ATLAS NODE</h3>
              <div className="flex items-center gap-2 mt-2">
                <span className="w-2.5 h-2.5 bg-hh-green rounded-full shadow-[0_0_12px_#4CAF50]"></span>
                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-400">Grounded Research Enabled</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
                onClick={clearHistory}
                className="p-4 rounded-2xl transition-all border bg-white/5 border-white/10 text-gray-500 hover:text-red-500 hover:border-red-500/30"
                title="Wipe History"
            >
                <Trash2 className="w-5 h-5" />
            </button>
            <button 
                onClick={() => { setIsVoiceEnabled(!isVoiceEnabled); initAudio(); }}
                className={`p-4 rounded-2xl transition-all border ${isVoiceEnabled ? 'bg-hh-green border-hh-green text-hh-dark shadow-lg' : 'bg-white/5 border-white/10 text-gray-500'}`}
                title={isVoiceEnabled ? "Mute Voice" : "Enable Voice"}
            >
                {isVoiceEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div ref={scrollRef} className="flex-grow p-8 overflow-y-auto space-y-10 bg-white scroll-smooth no-scrollbar">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
              <div className={`max-w-[92%] flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 mt-1 shadow-lg border ${m.role === 'user' ? 'bg-hh-green text-hh-dark border-transparent' : 'bg-hh-dark text-white border-white/10'}`}>
                  {m.role === 'user' ? <User className="w-6 h-6" /> : <Sparkles className="w-6 h-6 text-hh-green" />}
                </div>
                <div className="space-y-3">
                  <div className={`p-6 rounded-[2.5rem] text-[15px] leading-relaxed font-bold shadow-sm border ${m.role === 'user' ? 'bg-hh-dark text-white border-transparent rounded-tr-none' : 'bg-hh-light text-hh-dark border-gray-100 rounded-tl-none italic'}`}>
                    {m.text}
                  </div>
                  
                  {m.role === 'model' && m.sources && (
                    <div className="flex flex-wrap gap-2 mt-2">
                       {m.sources.slice(0, 3).map((s, idx) => (
                         <a 
                          key={idx} 
                          href={s.uri} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-1 bg-hh-green/10 border border-hh-green/20 rounded-full text-[9px] font-black uppercase tracking-widest text-hh-green hover:bg-hh-green hover:text-white transition-all"
                         >
                            <Globe className="w-3 h-3" /> Source {idx + 1}
                         </a>
                       ))}
                    </div>
                  )}

                  {m.role === 'model' && errorStatus === 'QUOTA' && i === messages.length - 1 && (
                    <div className="bg-red-50 p-6 rounded-[2rem] border border-red-100 space-y-4 shadow-xl">
                       <p className="text-[10px] font-black uppercase text-red-500 tracking-widest text-center italic">Deployment Interrupted</p>
                       <button 
                        onClick={() => (window as any).aistudio.openSelectKey()}
                        className="w-full py-5 bg-red-600 text-white rounded-2xl flex items-center justify-center gap-3 font-black uppercase text-[10px] tracking-[0.2em] hover:bg-red-700 transition-all active:scale-95 shadow-lg shadow-red-500/20"
                       >
                        <Key className="w-5 h-5" /> RESTORE PRODUCTION LINK
                       </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-hh-light px-8 py-5 rounded-full shadow-md flex gap-5 items-center border border-gray-100 animate-pulse">
                <RefreshCw className="w-5 h-5 text-hh-green animate-spin" />
                <span className="text-[11px] font-black text-hh-green uppercase tracking-[0.5em]">Optimizing parameters...</span>
              </div>
            </div>
          )}
        </div>

        <div className="p-8 border-t border-gray-100 bg-white flex-shrink-0">
          <form className="flex gap-4" onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
            <div className="flex-grow relative">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isListening ? "Listening..." : "State directive..."}
                className={`w-full bg-hh-light border-none rounded-2xl px-6 py-5 text-base font-bold focus:ring-4 focus:ring-hh-green/10 transition-all placeholder:text-gray-400 text-hh-dark pr-14 ${isListening ? 'ring-2 ring-hh-green animate-pulse' : ''}`}
              />
              <button
                type="button"
                onClick={toggleListening}
                className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all ${isListening ? 'bg-red-500 text-white scale-110 shadow-lg' : 'text-gray-400 hover:text-hh-green'}`}
              >
                <Mic className="w-6 h-6" />
              </button>
            </div>
            <button 
              type="submit"
              disabled={!input.trim() || isTyping}
              className="w-16 h-16 bg-hh-green text-hh-dark rounded-2xl flex items-center justify-center hover:bg-hh-dark hover:text-white transition-all disabled:opacity-50 shadow-2xl active:scale-90"
            >
              <Send className="w-7 h-7" />
            </button>
          </form>
          <div className="text-[8px] text-center text-gray-400 uppercase font-black tracking-[0.6em] mt-5 italic opacity-60">
             Biological Dominance Protocol v3.0 • Lab-Secured
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatBot;
