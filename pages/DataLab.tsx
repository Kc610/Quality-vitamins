
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Modality } from "@google/genai";
import { Terminal, Zap, ShieldCheck, Activity, Loader2, AlertTriangle, Send, Link as LinkIcon, RefreshCw, Volume2, VolumeX } from 'lucide-react';

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

const DataLab: React.FC = () => {
  const [input, setInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [citations, setCitations] = useState<{uri: string, title: string}[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);

  const audioContextRef = useRef<AudioContext | null>(null);
  const currentAudioSource = useRef<AudioBufferSourceNode | null>(null);

  const speak = async (text: string) => {
    if (!isVoiceEnabled) return;
    try {
      setIsSpeaking(true);
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Analyze report: ${text}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        if (currentAudioSource.current) currentAudioSource.current.stop();
        const audioBuffer = await decodeAudioData(decodeBase64(base64Audio), audioContextRef.current);
        const source = audioContextRef.current.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContextRef.current.destination);
        source.onended = () => setIsSpeaking(false);
        source.start();
        currentAudioSource.current = source;
      }
    } catch (err) {
      console.error("Audio Synthesis Error:", err);
      setIsSpeaking(false);
    }
  };

  const handleAnalyze = async () => {
    if (!input.trim() || isAnalyzing) return;
    setIsAnalyzing(true);
    setError(null);
    setReport(null);
    setCitations([]);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `You are an Elite Biological Performance Engine. Analyze these metrics: ${input}. Provide 3 short, actionable tips for biological dominance. Focus on cellular optimization. Use high-octane performance language.`,
        config: {
          tools: [{ googleSearch: {} }],
          thinkingConfig: { thinkingBudget: 16000 }
        },
      });

      const text = response.text;
      const grounding = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      
      if (text) {
        setReport(text);
        if (grounding) {
          const newCits = grounding.filter(c => c.web).map(c => ({ uri: c.web!.uri!, title: c.web!.title || 'Source' }));
          setCitations(newCits);
        }
        speak(text);
      }
    } catch (err: any) {
      console.error(err);
      setError("Neural analysis link severed. Ensure project credits are active.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-hh-dark text-white pt-20 sm:pt-24 pb-20 sm:pb-32 px-4 sm:px-6 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(76,175,80,0.1),transparent_60%)] pointer-events-none"></div>
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <header className="text-center mb-10 sm:mb-16 space-y-4">
           <div className="inline-flex items-center gap-2 px-4 py-2 bg-hh-green/10 text-hh-green rounded-full font-black text-[8px] sm:text-[9px] uppercase tracking-[0.3em] sm:tracking-[0.4em] border border-hh-green/20">
             <Terminal className="w-3 h-3 sm:w-4 h-4" /> BIOLOGICAL DIAGNOSTIC INTERFACE
           </div>
           <h1 className="font-heading text-4xl sm:text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-none">
             NEURAL <span className="text-hh-green">DATA LAB</span>
           </h1>
           <p className="text-gray-500 font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[8px] sm:text-[10px]">Protocol-driven Biological Synthesis</p>
        </header>

        <div className="grid lg:grid-cols-12 gap-8 sm:gap-10 items-start">
          {/* Input Terminal */}
          <div className="lg:col-span-5 space-y-6 sm:space-y-8 animate-in slide-in-from-left duration-700">
            <div className="bg-hh-card rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 border border-white/5 shadow-4xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 sm:p-8 opacity-10 group-hover:rotate-12 transition-transform duration-1000">
                <Activity className="w-16 h-16 sm:w-20 h-20 text-hh-green" />
              </div>

              <div className="mb-6 sm:mb-8">
                <h3 className="font-heading font-black text-xl sm:text-2xl italic uppercase tracking-tighter text-white">DATA INJECTION</h3>
                <p className="text-[8px] sm:text-[9px] font-black uppercase text-gray-500 tracking-widest mt-1">Status: Ready for Payload</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                    <Zap className="w-3 h-3 text-hh-green" /> Biological Markers
                  </label>
                  <textarea 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Input metrics (e.g., HRV: 65, Resting HR: 52, Sleep: 7.2h, Blood Glucose: 95mg/dL...)"
                    className="w-full bg-hh-dark/50 border border-white/10 rounded-2xl sm:rounded-3xl px-6 py-6 sm:px-8 sm:py-8 text-white text-xs sm:text-sm focus:ring-2 focus:ring-hh-green/40 h-40 sm:h-56 resize-none placeholder:text-gray-700 font-mono"
                  />
                </div>

                <button 
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !input.trim()}
                  className="w-full py-5 sm:py-6 bg-hh-green text-hh-dark rounded-2xl sm:rounded-[2rem] font-heading font-black text-xs sm:text-sm uppercase tracking-widest flex items-center justify-center gap-3 sm:gap-4 hover:bg-white transition-all shadow-3xl disabled:opacity-50 active:scale-95"
                >
                  {isAnalyzing ? <Loader2 className="w-5 h-5 sm:w-6 h-6 animate-spin" /> : <><Send className="w-4 h-4 sm:w-5 h-5" /> SYNTHESIZE REPORT</>}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4 sm:gap-6 p-6 sm:p-8 bg-hh-green/5 rounded-[1.5rem] sm:rounded-[2.5rem] border border-hh-green/10">
              <ShieldCheck className="w-8 h-8 sm:w-10 h-10 text-hh-green flex-shrink-0" />
              <div>
                <h4 className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-white">Neural Integrity Guaranteed</h4>
                <p className="text-[8px] sm:text-[9px] text-gray-500 uppercase font-bold mt-1 tracking-wider leading-relaxed">
                  Clinical-grade synthesis with zero data retention via Gemini 3 neural core.
                </p>
              </div>
            </div>
          </div>

          {/* Report Output */}
          <div className="lg:col-span-7 bg-white rounded-[2.5rem] sm:rounded-[4rem] min-h-[400px] sm:min-h-[600px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)] border border-gray-100 flex flex-col relative overflow-hidden animate-in fade-in zoom-in-95 duration-700">
            <div className="p-6 sm:p-8 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-20">
               <div className="flex items-center gap-3 sm:gap-4">
                  <div className={`w-8 h-8 sm:w-10 h-10 rounded-xl flex items-center justify-center shadow-lg border ${isSpeaking ? 'bg-hh-green text-hh-dark animate-pulse' : 'bg-hh-dark text-white'}`}>
                     <Activity className={`w-4 h-4 sm:w-5 h-5 ${isSpeaking ? 'animate-bounce' : ''}`} />
                  </div>
                  <div>
                    <h4 className="font-heading font-black text-xs sm:text-sm text-hh-dark uppercase italic tracking-tighter">PERFORMANCE DEPLOYMENT</h4>
                    <div className="flex items-center gap-2">
                       <span className={`w-1 h-1 sm:w-1.5 h-1.5 rounded-full ${isAnalyzing ? 'bg-hh-orange animate-ping' : 'bg-hh-green'}`}></span>
                       <span className="text-[7px] sm:text-[8px] font-black uppercase text-gray-400 tracking-widest">{isAnalyzing ? 'ACTIVE SYNTHESIS' : 'SYSTEM IDLE'}</span>
                    </div>
                  </div>
               </div>
               <button 
                onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
                className={`p-2 sm:p-3 rounded-xl transition-all border ${isVoiceEnabled ? 'bg-hh-green/10 border-hh-green/30 text-hh-green' : 'bg-gray-100 border-gray-200 text-gray-400'}`}
               >
                 {isVoiceEnabled ? <Volume2 className="w-4 h-4 sm:w-5 h-5" /> : <VolumeX className="w-4 h-4 sm:w-5 h-5" />}
               </button>
            </div>

            <div className="flex-grow p-6 sm:p-10 md:p-16 overflow-y-auto no-scrollbar">
              {isAnalyzing ? (
                <div className="flex flex-col items-center justify-center h-full space-y-6 sm:space-y-10 py-10 sm:py-20">
                   <div className="relative w-24 h-24 sm:w-32 h-32">
                      <div className="absolute inset-0 border-4 sm:border-8 border-hh-green/10 border-t-hh-green rounded-full animate-spin"></div>
                      <Zap className="absolute inset-0 m-auto w-8 h-8 sm:w-10 h-10 text-hh-green animate-pulse" />
                   </div>
                   <div className="text-center space-y-2">
                      <h4 className="font-heading font-black text-xl sm:text-2xl uppercase italic tracking-tighter text-hh-dark">Sequencing Biology</h4>
                      <p className="text-[8px] sm:text-[10px] text-gray-400 font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] animate-pulse">Mapping molecular pathways...</p>
                   </div>
                </div>
              ) : report ? (
                <div className="space-y-8 sm:space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-500">
                  <div className="prose prose-sm font-bold text-hh-dark italic leading-relaxed text-base sm:text-xl border-l-4 border-hh-green pl-6 sm:pl-8">
                    {report}
                  </div>
                  
                  {citations.length > 0 && (
                    <div className="bg-hh-light/50 p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] border border-gray-100 space-y-4 sm:space-y-6">
                       <h5 className="text-[8px] sm:text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2 sm:gap-3">
                         <LinkIcon className="w-3 h-3 sm:w-4 h-4 text-hh-green" /> LAB VALIDATION SOURCES
                       </h5>
                       <div className="grid gap-2 sm:gap-3">
                         {citations.map((c, i) => (
                           <a key={i} href={c.uri} target="_blank" rel="noopener noreferrer" className="text-[10px] sm:text-xs text-hh-green hover:underline flex items-center gap-3 font-bold group">
                              <span className="w-5 h-5 sm:w-6 h-6 bg-hh-green/10 rounded-lg flex items-center justify-center text-[7px] sm:text-[8px] group-hover:bg-hh-green group-hover:text-white transition-all">{i+1}</span>
                              <span className="truncate">{c.title}</span>
                           </a>
                         ))}
                       </div>
                    </div>
                  )}

                  <div className="flex justify-center">
                    <button onClick={() => speak(report)} className="flex items-center gap-2 sm:gap-3 text-[8px] sm:text-[10px] font-black uppercase text-hh-green tracking-[0.2em] sm:tracking-[0.3em] hover:text-hh-dark transition-all">
                      <RefreshCw className="w-3 h-3 sm:w-4 h-4" /> Re-transmit Neural Data
                    </button>
                  </div>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-6 sm:space-y-8 py-10 sm:py-20 animate-in shake">
                  <AlertTriangle className="w-16 h-16 sm:w-20 h-20 text-red-500" />
                  <div className="space-y-4">
                    <h4 className="font-heading font-black text-xl sm:text-2xl uppercase italic tracking-tighter text-red-600">Calibration Failure</h4>
                    <p className="text-xs sm:text-sm text-red-400 font-bold italic max-w-sm mx-auto">{error}</p>
                  </div>
                  <button onClick={handleAnalyze} className="px-8 py-3 bg-red-600 text-white rounded-xl font-black uppercase text-[9px] tracking-widest shadow-xl">Retry Synthesis</button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-6 sm:space-y-8 opacity-20 grayscale py-10 sm:py-20">
                   <Zap className="w-24 h-24 sm:w-32 h-32 text-gray-300" />
                   <div className="space-y-2">
                     <p className="text-xl sm:text-2xl font-heading font-black uppercase italic tracking-[0.3em] sm:tracking-[0.4em] text-hh-dark">STANDBY FOR DATA</p>
                     <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-gray-400">Inject markers to initialize lab report</p>
                   </div>
                </div>
              )}
            </div>

            <div className="p-6 sm:p-10 border-t border-gray-50 bg-gray-50/50 flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6">
              <div className="flex items-center gap-3 sm:gap-4">
                 <div className="w-2 h-2 sm:w-3 h-3 bg-hh-green rounded-full shadow-[0_0_10px_#4CAF50]"></div>
                 <span className="text-[7px] sm:text-[9px] font-black uppercase text-gray-400 tracking-widest">Master Protocol: GEMINI-3-PRO // v1.2</span>
              </div>
              <p className="text-[7px] sm:text-[8px] font-black uppercase tracking-[0.4em] sm:tracking-[0.5em] text-gray-300">© HELLO HEALTHY DATA FOUNDRY // 2025</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataLab;
