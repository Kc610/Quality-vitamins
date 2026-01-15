
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { Mic, MicOff, Zap, ShieldCheck, Activity, Info, Lock, Loader2, AlertCircle, Headphones } from 'lucide-react';

const LiveLab: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transcription, setTranscription] = useState<string>('');

  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

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
      }

      setIsConnecting(true);
      setError(null);

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = outputAudioContext;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
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
            if (message.serverContent?.inputTranscription) {
                // Could handle user transcription here if needed
            }
            if (message.serverContent?.turnComplete) {
              setTranscription('');
            }

            const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
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
            const errMsg = e.message || '';
            if (errMsg.includes("Requested entity was not found") || errMsg.includes("404")) {
                setError("Paid API Key or Project Access Required.");
                (window as any).aistudio.openSelectKey();
            } else {
                setError("Neural link instability. Verify microphone permissions.");
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
          inputAudioTranscription: {},
          systemInstruction: "You are Atlas, the hands-free performance optimization coach for Hello Healthy. Your mission is to provide concise, scientifically grounded, and high-energy biological advice. Speak like a professional elite coach who values human peak performance.",
        }
      });

      sessionRef.current = await sessionPromise;

    } catch (err: any) {
      console.error("Session Init Error:", err);
      setError("Initialization failed. Check API key project tier.");
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
      <div className={`absolute inset-0 opacity-20 pointer-events-none transition-all duration-1000 ${isActive ? 'scale-110 rotate-3' : 'scale-100'}`}>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#4CAF5033,transparent_70%)]"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-16 space-y-4">
           <div className="inline-flex items-center gap-2 px-4 py-2 bg-hh-green/20 text-hh-green rounded-full font-black text-[10px] uppercase tracking-[0.3em] border border-hh-green/30">
             <Headphones className="w-4 h-4" /> Real-Time Bio-Sync Enabled
           </div>
           <h1 className="font-heading text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-none">
             LIVE <span className="text-hh-green">LAB</span>
           </h1>
           <p className="text-gray-400 font-medium uppercase tracking-[0.2em] text-xs">Direct Voice Link to Elite Performance Coaching</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] p-12 flex flex-col items-center justify-center min-h-[450px] relative overflow-hidden group">
            <div className={`absolute inset-0 transition-opacity duration-1000 bg-gradient-to-tr from-hh-green/20 to-hh-orange/10 ${isActive ? 'opacity-100' : 'opacity-0'}`}></div>
            
            <div className="relative z-10 flex flex-col items-center space-y-12 w-full text-center">
              {isActive ? (
                <>
                  <div className="flex gap-2 h-40 items-center justify-center">
                    {[...Array(16)].map((_, i) => (
                      <div 
                        key={i} 
                        className="w-2.5 bg-hh-green rounded-full animate-bounce shadow-[0_0_15px_#4CAF50]" 
                        style={{ height: `${Math.random() * 80 + 20}%`, animationDuration: `${Math.random() * 0.5 + 0.5}s` }}
                      ></div>
                    ))}
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-center justify-center gap-2">
                        <Activity className="w-4 h-4 text-hh-green animate-pulse" />
                        <p className="text-hh-green font-black uppercase tracking-[0.4em] text-[10px]">Neural Stream Active</p>
                    </div>
                    <p className="text-2xl font-heading font-black italic text-white/90 uppercase tracking-tighter italic">"Protocol streaming. State objective."</p>
                    <div className="max-w-md mx-auto p-6 bg-white/5 backdrop-blur-sm rounded-3xl min-h-[80px] text-xs text-gray-400 italic border border-white/5 leading-relaxed">
                      {transcription || "Listening for biological directives..."}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <button 
                    onClick={isConnecting ? undefined : startSession}
                    className="w-40 h-40 bg-hh-dark rounded-full border-4 border-hh-green/30 flex items-center justify-center group cursor-pointer hover:border-hh-green transition-all shadow-[0_0_50px_rgba(76,175,80,0.1)] relative"
                  >
                     {isConnecting ? (
                        <Loader2 className="w-16 h-16 text-hh-green animate-spin" />
                     ) : (
                        <>
                            <div className="absolute inset-0 bg-hh-green/10 rounded-full animate-ping group-hover:bg-hh-green/20"></div>
                            <Mic className="w-16 h-16 text-gray-400 group-hover:text-hh-green transition-colors relative z-10" />
                        </>
                     )}
                  </button>
                  <div className="space-y-4">
                    <h3 className="text-3xl font-heading font-black uppercase italic tracking-tighter">Initiate Bio-Link</h3>
                    <p className="text-gray-400 max-w-sm mx-auto font-medium text-sm">Synchronize your training environment with Atlas in real-time. Hands-free instruction for peak output.</p>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[2.5rem] p-10 space-y-8">
               <div className="flex items-center justify-between">
                   <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500">Node telemetry</h4>
                   <Zap className="w-4 h-4 text-hh-orange" />
               </div>
               <div className="space-y-4">
                  <div className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/5">
                     <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Buffer Delay</span>
                     <span className="text-xs font-black text-hh-green">ULTRA-LOW</span>
                  </div>
                  <div className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/5">
                     <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Encryption</span>
                     <span className="text-xs font-black text-hh-orange">MIL-SPEC</span>
                  </div>
                  <div className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/5">
                     <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Sample Rate</span>
                     <span className="text-xs font-black text-white">24kHz PCM</span>
                  </div>
               </div>
            </div>

            <button 
              onClick={isActive ? stopSession : startSession}
              disabled={isConnecting}
              className={`w-full py-7 rounded-[2.5rem] font-heading font-black uppercase tracking-widest text-sm transition-all flex items-center justify-center gap-4 shadow-4xl ${isActive ? 'bg-red-600 text-white shadow-red-600/30 hover:bg-red-700' : 'bg-hh-green text-hh-dark shadow-hh-green/30 hover:bg-white'}`}
            >
              {isActive ? <><MicOff className="w-5 h-5" /> TERMINATE PROTOCOL</> : <><Mic className="w-5 h-5" /> DEPLOY NODE</>}
            </button>

            <div className="p-8 bg-hh-orange/10 rounded-[2.5rem] border border-hh-orange/20 flex gap-4">
              <Lock className="w-6 h-6 text-hh-orange flex-shrink-0" />
              <div>
                <p className="text-[10px] text-hh-orange font-black uppercase tracking-widest mb-1">Billing Verification</p>
                <p className="text-[9px] text-hh-orange/70 font-bold leading-relaxed">Advanced multimodal logic requires a linked paid Google Cloud project. Standard quota does not apply.</p>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-10 p-8 bg-red-600/10 border border-red-600/30 rounded-[3rem] text-center animate-in shake">
            <p className="text-red-500 text-xs font-black uppercase tracking-[0.4em] flex items-center justify-center gap-4">
              <AlertCircle className="w-6 h-6" /> {error}
            </p>
            <button 
              onClick={() => (window as any).aistudio.openSelectKey()}
              className="mt-6 text-[10px] font-black uppercase tracking-widest text-white underline hover:text-hh-green"
            >
              Refresh Production Credentials
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveLab;
