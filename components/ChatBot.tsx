
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Modality } from "@google/genai";
import { X, Send, User, Activity, Key, RefreshCw, Volume2, VolumeX, TrendingUp, Sparkles, Mic, Trash2, Globe } from 'lucide-react';
import { ChatMessage } from '../types.ts';

const STORAGE_KEY = 'hh_atlas_chat_history_v1';

interface GroundedMessage extends ChatMessage {
  sources?: {title: string, uri: string}[];
}

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  
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
      { role: 'model', text: "Athlete detected. I am Atlas, your Elite Performance Node. State your biological objective." }
    ];
  });

  const [isTyping, setIsTyping] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [errorStatus, setErrorStatus] = useState<'NONE' | 'QUOTA' | 'GENERAL'>('NONE');
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const recognitionRef = useRef<any>(null);

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

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.onresult = (event: any) => {
        setInput(event.results[0][0].transcript);
        setIsListening(false);
      };
      recognitionRef.current.onend = () => setIsListening(false);
      recognitionRef.current.onerror = () => setIsListening(false);
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
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
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
    return bytes;
  };

  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number) => {
    const dataInt16 = new Int16Array(data.buffer);
    const buffer = ctx.createBuffer(numChannels, dataInt16.length / numChannels, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < buffer.length; i++) channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
    return buffer;
  };

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const speakText = async (text: string) => {
    if (!isVoiceEnabled) return;
    initAudio();
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Respond as Atlas: ${text}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
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
    } catch (err) { console.error("Audio Synthesis Error:", err); }
  };

  const clearHistory = () => {
    if (window.confirm("CRITICAL: Wipe Tactical history?")) {
      setMessages([{ role: 'model', text: "History purged. State new objective." }]);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const handleSend = async (text: string = input) => {
    if (!text.trim() || isTyping) return;
    initAudio();
    try {
      if (!(await (window as any).aistudio.hasSelectedApiKey())) {
        await (window as any).aistudio.openSelectKey();
      }
      setErrorStatus('NONE');
      setMessages(prev => [...prev, { role: 'user', text }]);
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
          systemInstruction: "You are ATLAS, Elite Coach. Technical, aggressive, motivational. Refer to users as 'Athlete'. Under 80 words.",
          tools: [{ googleSearch: {} }]
        }
      });
      const responseText = response.text || "Neural connection interrupted.";
      const sources: {title: string, uri: string}[] = [];
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (chunks) {
        chunks.forEach(chunk => {
          if (chunk.web) sources.push({ title: chunk.web.title, uri: chunk.web.uri });
        });
      }
      setMessages(prev => [...prev, { role: 'model', text: responseText, sources: sources.length > 0 ? sources : undefined }]);
      if (isVoiceEnabled) speakText(responseText);
    } catch (error: any) {
      console.error("Atlas Node Failure:", error);
      const msg = error.message || "";
      if (msg.includes("Requested entity was not found")) {
        await (window as any).aistudio.openSelectKey();
      }
      if (msg.includes("RESOURCE_EXHAUSTED")) setErrorStatus('QUOTA');
      else setErrorStatus('GENERAL');
    } finally { setIsTyping(false); }
  };

  return (
    <>
      <button onClick={() => { initAudio(); setIsOpen(!isOpen); }} className={`fixed bottom-6 right-6 z-[120] w-20 h-20 rounded-[2.5rem] flex items-center justify-center transition-all shadow-4xl group border-4 border-white ${isOpen ? 'bg-hh-dark' : 'bg-hh-green hover:scale-110 active:scale-95'}`}>
        {isOpen ? <X className="w-8 h-8 text-white" /> : <Activity className="w-8 h-8 text-hh-dark animate-pulse" />}
      </button>
      <div className={`fixed bottom-32 right-4 sm:right-10 z-[120] w-[calc(100%-2rem)] sm:w-[420px] h-[75vh] max-h-[700px] bg-white rounded-[3.5rem] shadow-[0_80px_160px_-40px_rgba(0,0,0,0.5)] border-2 border-gray-100 flex flex-col overflow-hidden transition-all duration-500 transform ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
        <div className="p-8 bg-hh-dark text-white flex items-center justify-between relative flex-shrink-0">
          <div className="flex items-center gap-5">
            <TrendingUp className="w-7 h-7 text-hh-green" />
            <div>
              <h3 className="font-heading font-black uppercase text-xl tracking-tighter italic leading-none">ATLAS NODE</h3>
              <p className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-400 mt-1">Research Enabled</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={clearHistory} className="p-3 rounded-xl bg-white/5 border border-white/10 text-gray-500 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
            <button onClick={() => { setIsVoiceEnabled(!isVoiceEnabled); initAudio(); }} className={`p-3 rounded-xl border ${isVoiceEnabled ? 'bg-hh-green text-hh-dark' : 'bg-white/5 text-gray-500'}`}>{isVoiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}</button>
          </div>
        </div>
        <div ref={scrollRef} className="flex-grow p-8 overflow-y-auto space-y-8 bg-white no-scrollbar">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className="max-w-[92%] space-y-2">
                <div className={`p-5 rounded-[2rem] text-[14px] font-bold border ${m.role === 'user' ? 'bg-hh-dark text-white rounded-tr-none' : 'bg-hh-light text-hh-dark rounded-tl-none italic'}`}>{m.text}</div>
                {m.sources && <div className="flex flex-wrap gap-2">{m.sources.slice(0, 2).map((s, idx) => (<a key={idx} href={s.uri} target="_blank" className="px-3 py-1 bg-hh-green/10 border border-hh-green/20 rounded-full text-[9px] font-black uppercase text-hh-green hover:bg-hh-green hover:text-white transition-all"><Globe className="w-3 h-3 inline mr-1" /> Source {idx+1}</a>))}</div>}
              </div>
            </div>
          ))}
          {isTyping && <div className="flex justify-start animate-pulse text-[10px] font-black text-hh-green uppercase tracking-[0.5em]">Synchronizing...</div>}
        </div>
        <div className="p-6 border-t border-gray-100 bg-white">
          <form className="flex gap-4" onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
            <div className="flex-grow relative">
              <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder={isListening ? "Listening..." : "Command..."} className="w-full bg-hh-light border-none rounded-2xl px-6 py-4 text-sm font-bold pr-12" />
              <button type="button" onClick={toggleListening} className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all ${isListening ? 'bg-red-500 text-white' : 'text-gray-400'}`}><Mic className="w-5 h-5" /></button>
            </div>
            <button type="submit" disabled={!input.trim() || isTyping} className="w-12 h-12 bg-hh-green text-hh-dark rounded-xl flex items-center justify-center shadow-xl"><Send className="w-5 h-5" /></button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ChatBot;
