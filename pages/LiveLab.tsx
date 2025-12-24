
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { Mic, MicOff, Zap, ShieldCheck, Activity, Info, Lock, Loader2, AlertCircle } from 'lucide-react';

const LiveLab: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transcription, setTranscription] = useState<string>('');

  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  // PCM Decoding Logic as required by Gemini Live API guidelines
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

  const encode = (bytes: Uint8Array) => {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  const createBlob = (data: Float32Array) => {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
      int16[i] = data[i] * 32768;
    }
    return {
      data: encode(new Uint8Array(int16.buffer)),
      mimeType: 'audio/pcm;rate=16000',
    };
  };

  const startSession = async () => {
    try {
      if (!(await (window as any).aistudio.hasSelectedApiKey())) {
        await (window as any).aistudio.openSelectKey();
        // Proceed as per race condition instructions
      }

      setIsConnecting(true);
      setError(null);

      // Create a fresh instance to use latest API key
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = outputAudioContext;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            setIsActive(true);
            setIsConnecting(false);
            const source = inputAudioContext.createMediaStreamSource(stream);
            const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              sessionPromise.then(session => session.sendRealtimeInput({ media: pcmBlob }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioContext.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.outputTranscription) {
              setTranscription(prev => prev + message.serverContent!.outputTranscription!.text);
            }
            if (message.serverContent?.turnComplete) {
              setTranscription('');
            }

            const base64Audio = message.serverContent?.modelTurn?.parts?.find(p => p.inlineData)?.inlineData?.data;
            if (base64Audio && audioContextRef.current) {
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, audioContextRef.current.currentTime);
              const audioBuffer = await decodeAudioData(decode(base64Audio), audioContextRef.current, 24000, 1);
              const source = audioContextRef.current.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(audioContextRef.current.destination);
              source.addEventListener('ended', () => sourcesRef.current.delete(source));
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => { try { s.stop(); } catch(e) {} });
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e: any) => {
            console.error("Live API Error:", e);
            const isEntityError = e?.message?.includes("Requested entity was not found") || e?.type === "error";
            if (isEntityError) {
              setError("Session failed. This model requires a Paid API Key (Billing).");
              (window as any).aistudio.openSelectKey();
            } else {
              setError("Laboratory connection failed. Ensure mic access and billing status.");
            }
            setIsActive(false);
            setIsConnecting(false);
          },
          onclose: () => {
            setIsActive(false);
            setIsConnecting(false);
          },
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { 
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } 
          },
          outputAudioTranscription: {},
          systemInstruction: "You are Atlas, the hands-free Performance Coach for Hello Healthy. Your voice is encouraging and science-focused. You help users with workout form, timing, and plant-based nutrition during their active training sessions.",
        }
      });

      sessionRef.current = await sessionPromise;

    } catch (err: any) {
      console.error(err);
      const isEntityError = err.message?.includes("Requested entity was not found");
      setError(isEntityError ? "A paid API key is required. Please re-select a paid project." : "Mic access or valid API key required.");
      if (isEntityError) (window as any).aistudio.openSelectKey();
      setIsConnecting(false);
    }
  };

  const stopSession = () => {
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    setIsActive(false);
  };

  return (
    <div className="min-h-screen bg-hh-dark text-white pt-24 pb-32 px-4 relative overflow-hidden">
      {/* Background Neural Waves */}
      <div className={`absolute inset-0 opacity-20 pointer-events-none transition-all duration-1000 ${isActive ? 'scale-110 rotate-3' : 'scale-100'}`}>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#4CAF5033,transparent_70%)]"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-16 space-y-4">
           <div className="inline-flex items-center gap-2 px-4 py-2 bg-hh-green/20 text-hh-green rounded-full font-black text-[10px] uppercase tracking-[0.3em] border border-hh-green/30">
             <ShieldCheck className="w-4 h-4" /> Lab Certified Voice Sync
           </div>
           <h1 className="font-heading text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-none">
             LIVE <span className="text-hh-green">COACH</span>
           </h1>
           <p className="text-gray-400 font-medium uppercase tracking-[0.2em] text-xs">Real-Time Biological Instruction • Hands Free</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Main Visualizer */}
          <div className="lg:col-span-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] p-12 flex flex-col items-center justify-center min-h-[450px] relative overflow-hidden">
            <div className={`absolute inset-0 transition-opacity duration-1000 bg-gradient-to-tr from-hh-green/10 to-hh-orange/5 ${isActive ? 'opacity-100' : 'opacity-0'}`}></div>
            
            <div className="relative z-10 flex flex-col items-center space-y-12 w-full text-center">
              {isActive ? (
                <>
                  <div className="flex gap-1 h-32 items-center">
                    {[...Array(12)].map((_, i) => (
                      <div 
                        key={i} 
                        className="w-2 bg-hh-green rounded-full animate-pulse" 
                        style={{ height: `${Math.random() * 80 + 20}%`, animationDelay: `${i * 100}ms` }}
                      ></div>
                    ))}
                  </div>
                  <div className="space-y-4">
                    <p className="text-hh-green font-black uppercase tracking-[0.4em] text-[10px] animate-pulse">Session Active</p>
                    <p className="text-2xl font-serif italic text-white/90">"I'm listening. Ask me about your form or post-workout fuel."</p>
                    <div className="max-w-md mx-auto p-4 bg-white/5 rounded-2xl min-h-[60px] text-xs text-gray-400 italic">
                      {transcription || "..."}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-32 h-32 bg-hh-dark rounded-full border-4 border-hh-green/20 flex items-center justify-center group cursor-pointer" onClick={isConnecting ? undefined : startSession}>
                     {isConnecting ? <Loader2 className="w-12 h-12 text-hh-green animate-spin" /> : <Mic className="w-12 h-12 text-gray-600 group-hover:text-hh-green transition-colors" />}
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-2xl font-heading font-black uppercase italic tracking-tighter">Ready to Begin?</h3>
                    <p className="text-gray-400 max-w-sm mx-auto font-medium">Activate your coach for real-time hands-free performance science.</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Sidebar Stats & Controls */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[2.5rem] p-8 space-y-6">
               <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500">Live Lab Metrics</h4>
               <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                     <span className="text-xs font-bold text-gray-400">Latency</span>
                     <span className="text-xs font-black text-hh-green tracking-tighter">32ms (Hyper-Fast)</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                     <span className="text-xs font-bold text-gray-400">Precision</span>
                     <span className="text-xs font-black text-hh-orange tracking-tighter">99.8% Science-First</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                     <span className="text-xs font-bold text-gray-400">Modality</span>
                     <span className="text-xs font-black text-white tracking-tighter">Native PCM Audio</span>
                  </div>
               </div>
            </div>

            <button 
              onClick={isActive ? stopSession : startSession}
              disabled={isConnecting}
              className={`w-full py-6 rounded-[2rem] font-heading font-black uppercase tracking-tighter transition-all flex items-center justify-center gap-3 shadow-2xl ${isActive ? 'bg-red-500 text-white shadow-red-500/20' : 'bg-hh-green text-hh-dark shadow-hh-green/20'}`}
            >
              {isActive ? <><MicOff className="w-5 h-5" /> TERMINATE LINK</> : <><Mic className="w-5 h-5" /> ESTABLISH SESSION</>}
            </button>

            <div className="p-6 bg-hh-orange/5 rounded-2xl border border-hh-orange/10 flex gap-3">
              <Lock className="w-5 h-5 text-hh-orange flex-shrink-0" />
              <p className="text-[10px] text-hh-orange font-bold uppercase leading-relaxed">Secure Node Active • Paid Gemini API Project Required</p>
            </div>
            
            <p className="text-[9px] text-center text-gray-500 font-bold uppercase tracking-widest">
              Learn about <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="text-hh-green underline">Paid Tier Access</a>
            </p>
          </div>
        </div>

        {error && (
          <div className="mt-8 p-6 bg-red-500/10 border border-red-500/20 rounded-3xl text-center">
            <p className="text-red-400 text-sm font-black uppercase tracking-widest flex items-center justify-center gap-3">
              <AlertCircle className="w-5 h-5" /> {error}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveLab;
