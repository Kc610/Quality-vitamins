
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { Mic, MicOff, Zap, ShieldCheck, Activity, Lock, Loader2, AlertCircle, Headphones } from 'lucide-react';

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
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
    return bytes;
  };

  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number) => {
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
    for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
  };

  // Fixed MIME type to include mandatory sample rate for PCM audio
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
            if (message.serverContent?.turnComplete) setTranscription('');

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
            const msg = e.message || "";
            if (msg.includes("Requested entity was not found")) {
              (window as any).aistudio.openSelectKey();
            }
            setError("Neural link instability. Verify credentials.");
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
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
          outputAudioTranscription: {},
          inputAudioTranscription: {},
          systemInstruction: "You are Atlas, elite performance coach. Concise, scientific, high-energy advice.",
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (err: any) {
      setError("Initialization failed. Check API Key Tier.");
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
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-16 space-y-4">
           <div className="inline-flex items-center gap-2 px-4 py-2 bg-hh-green/20 text-hh-green rounded-full font-black text-[10px] uppercase tracking-[0.3em] border border-hh-green/30">
             <Headphones className="w-4 h-4" /> Real-Time Bio-Sync
           </div>
           <h1 className="font-heading text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-none">
             LIVE <span className="text-hh-green">LAB</span>
           </h1>
           <p className="text-gray-400 font-medium uppercase tracking-[0.2em] text-xs">Direct Voice Link to Atlas</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] p-12 flex flex-col items-center justify-center min-h-[450px] relative overflow-hidden">
            {isActive ? (
                <>
                  <div className="flex gap-2 h-40 items-center justify-center mb-12">
                    {[...Array(16)].map((_, i) => (
                      <div key={i} className="w-2.5 bg-hh-green rounded-full animate-bounce" style={{ height: `${Math.random() * 80 + 20}%`, animationDuration: `${Math.random() * 0.5 + 0.5}s` }}></div>
                    ))}
                  </div>
                  <div className="p-6 bg-white/5 rounded-3xl min-h-[80px] text-xs text-gray-400 italic border border-white/5 text-center">{transcription || "Listening..."}</div>
                </>
            ) : (
                <button onClick={isConnecting ? undefined : startSession} className="w-40 h-40 bg-hh-dark rounded-full border-4 border-hh-green/30 flex items-center justify-center group hover:border-hh-green shadow-2xl">
                   {isConnecting ? <Loader2 className="w-16 h-16 text-hh-green animate-spin" /> : <Mic className="w-16 h-16 text-gray-400 group-hover:text-hh-green" />}
                </button>
            )}
        </div>

        <div className="mt-8 flex flex-col gap-6">
            <button onClick={isActive ? stopSession : startSession} disabled={isConnecting} className={`w-full py-7 rounded-[2.5rem] font-heading font-black uppercase tracking-widest text-sm transition-all ${isActive ? 'bg-red-600 text-white shadow-xl' : 'bg-hh-green text-hh-dark shadow-xl'}`}>
              {isActive ? <><MicOff className="w-5 h-5 inline mr-2" /> TERMINATE</> : <><Mic className="w-5 h-5 inline mr-2" /> DEPLOY NODE</>}
            </button>
            {error && <div className="p-6 bg-red-600/10 border border-red-600/30 rounded-2xl text-red-500 text-[10px] font-black uppercase text-center">{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default LiveLab;
