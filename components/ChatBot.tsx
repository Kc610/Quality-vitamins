import React, { useState, useRef, useEffect } from 'react';
import { X, Send, User, Activity, BrainCircuit, Link as LinkIcon, Loader2, AlertTriangle, Mic, MicOff, Volume2, VolumeX, RefreshCw, Bell, BellOff } from 'lucide-react';
import { ChatMessage } from '../types.ts';
import { useGemini } from '../hooks/useGemini.ts';
import { GoogleGenAI, Modality } from "@google/genai";

// Audio Decoding Utilities
const decodeBase64 = (base64: string) => {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

const decodeAudioData = async (data: Uint8Array, ctx: AudioContext): Promise<AudioBuffer> => {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length;
  const buffer = ctx.createBuffer(1, frameCount, 24000);
  const channelData = buffer.getChannelData(0);
  for (let i = 0; i < frameCount; i++) {
    channelData[i] = dataInt16[i] / 32768.0;
  }
  return buffer;
};

interface DisplayMessage extends ChatMessage {
  citations?: { uri: string; title: string; }[];
}

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isVoiceOutputEnabled, setIsVoiceOutputEnabled] = useState(true);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<DisplayMessage[]>([
    { role: 'model', text: "Roger that, Athlete. I'm Atlas, your Elite Performance Node. State your objective, and we'll engineer your victory." }
  ]);
  
  const { isLoading, streamingResponse, citations, error, generateStream } = useGemini();
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const currentAudioSource = useRef<AudioBufferSourceNode | null>(null);
  const isStreamingRef = useRef(false);

  // Procedural Sound Synthesis
  const playSystemSound = (type: 'send' | 'receive' | 'open') => {
    if (!isSoundEnabled) return;
    
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }
    
    const ctx = audioContextRef.current;
    if (ctx.state === 'suspended') ctx.resume();
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    const now = ctx.currentTime;
    
    if (type === 'send') {
      // Futuristic high-to-low "whoosh"
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.15);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (type === 'receive') {
      // Dual-tone digital notification
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.1);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (type === 'open') {
      // Low electronic swell
      osc.type = 'sine';
      osc.frequency.setValueAtTime(100, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.3);
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.1, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    }
  };

  // Initialize Web Speech API (Input)
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };
      recognition.onend = () => setIsListening(false);
      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setIsListening(true);
      recognitionRef.current?.start();
    }
  };

  const playTTS = async (text: string) => {
    if (!isVoiceOutputEnabled) return;
    
    try {
      setIsSpeaking(true);
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Puck' }, // Professional authoritative voice
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        if (currentAudioSource.current) {
          currentAudioSource.current.stop();
        }

        const audioBuffer = await decodeAudioData(decodeBase64(base64Audio), audioContextRef.current);
        const source = audioContextRef.current.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContextRef.current.destination);
        source.onended = () => setIsSpeaking(false);
        source.start();
        currentAudioSource.current = source;
      } else {
        setIsSpeaking(false);
      }
    } catch (err) {
      console.error("TTS Synthesis Failed:", err);
      setIsSpeaking(false);
    }
  };

  useEffect(() => {
    isStreamingRef.current = isLoading;
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [streamingResponse, isLoading, messages]);

  useEffect(() => {
    // When stream ends, play the TTS and notification sound
    if (!isLoading && streamingResponse && !isStreamingRef.current) {
      setMessages(prev => [...prev, { role: 'model', text: streamingResponse, citations: citations }]);
      playSystemSound('receive');
      if (isVoiceOutputEnabled) {
        playTTS(streamingResponse);
      }
    }
  }, [isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    playSystemSound('send');
    
    // Stop any current speaking
    if (currentAudioSource.current) {
      currentAudioSource.current.stop();
      setIsSpeaking(false);
    }

    const userMessage: ChatMessage = { role: 'user', text: input };
    const newHistory = [...messages, userMessage];
    
    setMessages(newHistory);
    setInput('');
    
    await generateStream(newHistory);
  };

  const handleToggleOpen = () => {
    if (!isOpen) playSystemSound('open');
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button 
        onClick={handleToggleOpen}
        className={`fixed bottom-6 right-6 sm:bottom-10 sm:right-10 z-[120] w-20 h-20 sm:w-24 sm:h-24 rounded-[2rem] flex items-center justify-center transition-all shadow-[0_30px_60px_rgba(76,175,80,0.5)] group border-4 border-white ${isOpen ? 'bg-hh-dark' : 'bg-hh-green hover:scale-110 active:scale-95'}`}
      >
        {isOpen ? (
          <X className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
        ) : (
          <div className="relative flex flex-col items-center">
            <BrainCircuit className="w-8 h-8 sm:w-10 sm:h-10 text-white animate-pulse" />
            <div className="absolute inset-0 bg-white opacity-20 animate-ping rounded-full"></div>
          </div>
        )}
      </button>

      <div className={`fixed bottom-32 right-4 sm:bottom-36 sm:right-10 z-[120] w-[calc(100%-2rem)] sm:w-[420px] h-[70vh] max-h-[650px] bg-white rounded-[3rem] shadow-[0_60px_120px_-20px_rgba(0,0,0,0.4)] border-2 border-gray-100 flex flex-col overflow-hidden transition-all duration-500 transform ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
        
        <div className="p-6 bg-hh-dark text-white flex items-center justify-between relative flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 bg-hh-green rounded-2xl flex items-center justify-center border-2 border-white/10 ${isSpeaking ? 'animate-pulse scale-110 shadow-[0_0_20px_rgba(76,175,80,0.6)]' : ''}`}>
              <Activity className={`w-6 h-6 text-hh-dark ${isSpeaking ? 'animate-bounce' : ''}`} />
            </div>
            <div>
              <h3 className="font-heading font-black uppercase text-xl sm:text-2xl tracking-tighter italic">ATLAS NODE</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className={`w-2 h-2 rounded-full shadow-[0_0_10px] ${isLoading || isSpeaking ? 'bg-hh-orange animate-ping shadow-hh-orange' : 'bg-hh-green shadow-hh-green'}`}></span>
                <span className="text-[8px] font-black uppercase tracking-[0.3em] text-gray-400">
                  {isSpeaking ? 'Neural Link Active' : isLoading ? 'Synthesizing...' : 'Biological Core Synced'}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsSoundEnabled(!isSoundEnabled)}
              className={`p-3 rounded-xl transition-all border ${isSoundEnabled ? 'bg-hh-green/10 border-hh-green/30 text-hh-green' : 'bg-white/5 border-white/10 text-gray-500'}`}
              title="Toggle System Sounds"
            >
              {isSoundEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
            </button>
            <button 
              onClick={() => {
                setIsVoiceOutputEnabled(!isVoiceOutputEnabled);
                if (isVoiceOutputEnabled && currentAudioSource.current) {
                  currentAudioSource.current.stop();
                  setIsSpeaking(false);
                }
              }}
              className={`p-3 rounded-xl transition-all border ${isVoiceOutputEnabled ? 'bg-hh-green/10 border-hh-green/30 text-hh-green' : 'bg-white/5 border-white/10 text-gray-500'}`}
              title="Toggle Neural Voice"
            >
              {isVoiceOutputEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div ref={scrollRef} className="flex-grow p-6 overflow-y-auto space-y-8 bg-white scroll-smooth no-scrollbar">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
              <div className={`max-w-[90%] flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-1 shadow-md border ${m.role === 'user' ? 'bg-hh-orange text-white' : 'bg-hh-dark'}`}>
                  {m.role === 'user' ? <User className="w-5 h-5" /> : <BrainCircuit className="w-5 h-5 text-hh-green" />}
                </div>
                <div className="space-y-3">
                  <div className={`p-6 rounded-[2rem] text-sm leading-relaxed font-bold shadow-sm border ${m.role === 'user' ? 'bg-hh-dark text-white border-transparent rounded-tr-none' : 'bg-hh-light text-hh-dark border-gray-100 rounded-tl-none italic'}`}>
                    {m.text}
                    {m.role === 'model' && i === messages.length - 1 && !isLoading && (
                      <button onClick={() => playTTS(m.text)} className="ml-3 inline-block opacity-30 hover:opacity-100 transition-opacity">
                        <RefreshCw className="w-3 h-3 text-hh-green" />
                      </button>
                    )}
                  </div>
                  {m.citations && m.citations.length > 0 && (
                    <div className="bg-hh-light/50 p-4 rounded-2xl border border-gray-100 space-y-3">
                       <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2"><LinkIcon className="w-3 h-3"/> Sources</p>
                       <div className="flex flex-col gap-2">
                         {m.citations.map((c, idx) => (
                           <a href={c.uri} target="_blank" rel="noopener noreferrer" key={idx} className="text-xs text-hh-green hover:underline truncate block" title={c.title}>
                             {idx + 1}. {c.title || c.uri}
                           </a>
                         ))}
                       </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isLoading && streamingResponse && (
             <div className="flex justify-start animate-in fade-in duration-300">
               <div className="max-w-[90%] flex gap-3">
                 <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-1 shadow-md border bg-hh-dark">
                    <BrainCircuit className="w-5 h-5 text-hh-green animate-spin" />
                 </div>
                 <div className="p-6 rounded-[2rem] text-sm leading-relaxed font-bold shadow-sm border bg-hh-light text-hh-dark border-gray-100 rounded-tl-none italic">
                    {streamingResponse}
                    <span className="w-2 h-3 bg-hh-green inline-block ml-1 animate-pulse"></span>
                 </div>
               </div>
             </div>
          )}

          {error && !isLoading && (
            <div className="bg-red-50 p-6 rounded-2xl border border-red-100 flex items-center gap-4 shadow-md">
               <AlertTriangle className="w-8 h-8 text-red-500 flex-shrink-0" />
               <div>
                  <h4 className="font-bold text-red-600 text-sm">SYNTHESIS ERROR</h4>
                  <p className="text-xs text-red-500 mt-1">{error}</p>
               </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-100 bg-white flex-shrink-0">
          <form className="flex gap-3" onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
            <div className="relative flex-grow">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isListening ? "Listening for objective..." : "State objective..."}
                className={`w-full bg-hh-light border-none rounded-xl pl-5 pr-12 py-4 text-sm font-bold focus:ring-2 focus:ring-hh-green/20 transition-all placeholder:text-gray-400 text-hh-dark ${isListening ? 'ring-2 ring-hh-green/40' : ''}`}
              />
              <button 
                type="button"
                onClick={toggleListening}
                className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all ${isListening ? 'bg-hh-green text-hh-dark animate-pulse' : 'text-gray-400 hover:text-hh-green'}`}
              >
                {isListening ? <Mic className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
            </div>
            <button 
              type="submit"
              disabled={!input.trim() || isLoading}
              className="w-16 h-16 bg-hh-green text-hh-dark rounded-xl flex items-center justify-center hover:bg-hh-dark hover:text-white transition-all disabled:opacity-50 shadow-lg active:scale-90"
            >
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
            </button>
          </form>
          {(isListening || isSpeaking) && (
            <div className="mt-2 text-[10px] font-black uppercase text-hh-green tracking-widest animate-pulse text-center">
              {isSpeaking ? 'Voice Transmission Active' : 'Neural Audio Link Active'}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ChatBot;
