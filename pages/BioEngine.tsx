
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Modality } from "@google/genai";
import { 
  Activity, 
  Zap, 
  Moon, 
  FlaskConical, 
  Terminal, 
  Dna, 
  ShieldAlert, 
  Cpu, 
  Volume2, 
  Loader2, 
  TrendingUp,
  BrainCircuit,
  Globe,
  Link as LinkIcon,
  ExternalLink,
  Video,
  Play,
  Download,
  Sparkles,
  Info
} from 'lucide-react';

const BioEngine: React.FC = () => {
  const [activeNode, setActiveNode] = useState<'performance' | 'recovery' | 'labs'>('performance');
  const [inputData, setInputData] = useState('');
  const [protocol, setProtocol] = useState<string | null>(null);
  const [sources, setSources] = useState<{title: string, uri: string}[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isResearchMode, setIsResearchMode] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [videoStatus, setVideoStatus] = useState<string>('');

  const audioContextRef = useRef<AudioContext | null>(null);

  const categories = [
    { id: 'performance', label: 'Performance Drive', icon: Zap, desc: 'Analyze training output & neural fatigue' },
    { id: 'recovery', label: 'Bio-Recovery', icon: Moon, desc: 'Optimize sleep & HRV metrics' },
    { id: 'labs', label: 'Lab-Sync', icon: FlaskConical, desc: 'Analyze bloodwork & bio-markers' }
  ] as const;

  const initAudio = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
  };

  const decodeAudio = async (base64: string) => {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    
    const dataInt16 = new Int16Array(bytes.buffer);
    const buffer = audioContextRef.current!.createBuffer(1, dataInt16.length, 24000);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < dataInt16.length; i++) channelData[i] = dataInt16[i] / 32768.0;
    return buffer;
  };

  const speakBriefing = async (text: string) => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Respond as Atlas. Give a 15-word tactical summary of this protocol: ${text}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio && audioContextRef.current) {
        const buffer = await decodeAudio(base64Audio);
        const source = audioContextRef.current.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContextRef.current.destination);
        source.start();
      }
    } catch (e) {
      console.error("TTS Node Error", e);
    }
  };

  const generateProtocol = async () => {
    if (!inputData.trim()) return;
    
    initAudio();
    setIsAnalyzing(true);
    setError(null);
    setProtocol(null);
    setSources([]);
    setGeneratedVideoUrl(null);

    try {
      if (!(await (window as any).aistudio.hasSelectedApiKey())) {
        await (window as any).aistudio.openSelectKey();
      }

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const tools = isResearchMode ? [{ googleSearch: {} }] : [];
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `SYSTEM: You are ATLAS, the Elite Performance Engine for Hello Healthy.
          CATEGORY: ${activeNode.toUpperCase()} 
          DATA: ${inputData}
          TASK: Analyze the provided biometric/training data and generate a structured 'TACTICAL PROTOCOL'. 
          ${isResearchMode ? 'IMPORTANT: Use your search tool to find peer-reviewed research or clinical news that supports your recommendations.' : ''}
          FORMAT: 
          1. BIO-ANALYSIS (Identify weaknesses and neural states)
          2. PROTOCOL DIRECTIVES (Exact actionable steps)
          3. RECOMMENDED HELLO HEALTHY STACK (Specific supplements like Ashwagandha, Bee Bread, or Creatine)
          TONE: Aggressive, high-performance coaching. Technical but motivating. Use Markdown.`,
        config: { 
          thinkingConfig: { thinkingBudget: 8000 },
          tools: tools
        }
      });

      const result = response.text || "Analysis complete. Node standby.";
      setProtocol(result);

      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (chunks) {
        const extractedSources = chunks
          .filter(chunk => chunk.web)
          .map(chunk => ({ title: chunk.web.title, uri: chunk.web.uri }));
        setSources(extractedSources);
      }

      speakBriefing(result);
    } catch (err: any) {
      console.error("Analysis Failed:", err);
      const msg = err.message || "";
      if (msg.includes("Requested entity was not found")) {
        await (window as any).aistudio.openSelectKey();
      }
      setError(msg || "Neural link severed. Re-initialize.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const visualizeProtocol = async () => {
    if (!protocol) return;
    
    setIsGeneratingVideo(true);
    setVideoStatus('Initializing Veo Core...');
    setGeneratedVideoUrl(null);

    try {
      if (!(await (window as any).aistudio.hasSelectedApiKey())) {
        await (window as any).aistudio.openSelectKey();
      }

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      setVideoStatus('Synthesizing Visual State...');
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: `Cinematic performance commercial for Hello Healthy. An elite athlete achieving peak state based on this protocol: ${protocol.substring(0, 500)}. 4k, hyper-realistic, volumetric lighting.`,
        config: {
          numberOfVideos: 1,
          resolution: '1080p',
          aspectRatio: '16:9'
        }
      });

      while (!operation.done) {
        setVideoStatus('Rendering Bio-Pixels (ETA 30-60s)...');
        await new Promise(resolve => setTimeout(resolve, 8000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (!downloadLink) throw new Error("Video synthesis returned no URI.");

      setVideoStatus('Finalizing Asset...');
      const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
      const blob = await response.blob();
      setGeneratedVideoUrl(URL.createObjectURL(blob));
    } catch (err: any) {
      console.error("Video Generation Error:", err);
      const msg = err.message || "";
      if (msg.includes("Requested entity was not found")) {
        await (window as any).aistudio.openSelectKey();
      }
      setError("Video synthesis failed. Verification of paid project tier required.");
    } finally {
      setIsGeneratingVideo(false);
      setVideoStatus('');
    }
  };

  return (
    <div className="min-h-screen bg-hh-dark text-white pt-24 pb-32 px-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ 
        backgroundImage: `radial-gradient(circle at 2px 2px, #4CAF50 1px, transparent 0)`,
        backgroundSize: '40px 40px'
      }}></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-hh-green/10 text-hh-green rounded-full font-black text-[10px] uppercase tracking-[0.4em] border border-hh-green/20 animate-pulse">
            <Cpu className="w-4 h-4" /> Analytical Engine v4.0 • Enterprise Grounding
          </div>
          <h1 className="font-heading text-6xl md:text-9xl font-black italic uppercase tracking-tighter leading-none mb-2">
            BIO <span className="text-hh-green">ENGINE</span>
          </h1>
          <p className="text-gray-500 font-medium uppercase tracking-[0.4em] text-[10px]">Neural Protocol Lab for Elite Athletes</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[3.5rem] p-8 md:p-10 space-y-10 shadow-2xl">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                   <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Analysis Node</h3>
                   <button 
                    onClick={() => setIsResearchMode(!isResearchMode)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${isResearchMode ? 'bg-hh-green text-hh-dark shadow-[0_0_20px_rgba(76,175,80,0.3)]' : 'bg-white/5 text-gray-500 border border-white/10'}`}
                   >
                     <Globe className="w-3 h-3" /> {isResearchMode ? 'Research Sync' : 'Internal Only'}
                   </button>
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => { setActiveNode(cat.id); setProtocol(null); }}
                      className={`flex items-center gap-5 p-5 rounded-3xl border-2 transition-all text-left group ${
                        activeNode === cat.id 
                        ? 'bg-hh-green border-hh-green text-hh-dark' 
                        : 'bg-white/5 border-white/5 text-gray-400 hover:border-white/10'
                      }`}
                    >
                      <div className={`p-3 rounded-2xl ${activeNode === cat.id ? 'bg-white/20' : 'bg-white/5 group-hover:bg-white/10'} transition-all`}>
                        <cat.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="font-black uppercase tracking-tighter text-base leading-none mb-1">{cat.label}</div>
                        <div className={`text-[9px] font-bold uppercase tracking-widest leading-none ${activeNode === cat.id ? 'text-hh-dark/70' : 'text-gray-500'}`}>{cat.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Biometric Data Buffer</label>
                <textarea
                  value={inputData}
                  onChange={(e) => setInputData(e.target.value)}
                  placeholder={`Input data stream... (e.g. HRV, Sleep quality, Training volume, Heart rate, Recovery feel)`}
                  className="w-full h-48 bg-hh-dark/50 border border-white/10 rounded-[2.5rem] p-8 text-sm font-bold placeholder:text-gray-700 focus:ring-4 focus:ring-hh-green/20 transition-all resize-none shadow-inner"
                />
              </div>

              <button
                onClick={generateProtocol}
                disabled={isAnalyzing || !inputData.trim()}
                className="w-full py-8 bg-hh-green text-hh-dark rounded-[2.5rem] font-heading font-black uppercase tracking-[0.4em] text-sm hover:bg-white transition-all shadow-4xl disabled:opacity-50 active:scale-95 flex items-center justify-center gap-4 group"
              >
                {isAnalyzing ? (
                  <><Loader2 className="w-6 h-6 animate-spin" /> SYNTHESIZING...</>
                ) : (
                  <>DEPLOY ANALYTICS <Terminal className="w-6 h-6 group-hover:translate-x-1 transition-transform" /></>
                )}
              </button>
            </div>

            <div className="p-8 bg-hh-orange/10 border border-hh-orange/20 rounded-[2.5rem] flex gap-5 shadow-xl">
              <ShieldAlert className="w-8 h-8 text-hh-orange flex-shrink-0" />
              <div>
                <p className="text-[10px] text-hh-orange font-black uppercase tracking-widest mb-1">Security Clearance</p>
                <p className="text-[9px] text-hh-orange/70 font-bold leading-relaxed">Neural assets are processed in isolated enclaves. All research grounded via real-time clinical indices.</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[4rem] p-10 md:p-16 h-full min-h-[700px] flex flex-col relative overflow-hidden shadow-2xl">
               {isAnalyzing ? (
                 <div className="flex-grow flex flex-col items-center justify-center text-center space-y-12 animate-in fade-in zoom-in-95">
                    <div className="relative w-40 h-40">
                       <div className="absolute inset-0 border-8 border-hh-green/10 border-t-hh-green rounded-full animate-spin"></div>
                       <div className="absolute inset-0 flex items-center justify-center">
                          <Activity className="w-16 h-16 text-hh-green animate-pulse" />
                       </div>
                    </div>
                    <div className="space-y-3">
                       <h4 className="text-4xl font-heading font-black italic uppercase tracking-tighter">Analyzing Biological State</h4>
                       <p className="text-[11px] text-gray-500 font-black uppercase tracking-[0.6em] italic">Synthesizing ground-truth performance data...</p>
                    </div>
                 </div>
               ) : protocol ? (
                 <div className="flex-grow animate-in fade-in slide-in-from-bottom-12 duration-1000">
                    <div className="flex items-center justify-between mb-12 pb-8 border-b border-white/10">
                       <div className="flex items-center gap-5">
                          <div className="w-14 h-14 bg-hh-green rounded-2xl flex items-center justify-center shadow-lg shadow-hh-green/20">
                             <BrainCircuit className="w-8 h-8 text-hh-dark" />
                          </div>
                          <div>
                            <h3 className="text-3xl font-heading font-black italic uppercase tracking-tighter leading-none">Directive</h3>
                            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-hh-green mt-1">Status: Validated</p>
                          </div>
                       </div>
                       <div className="flex gap-4">
                          <button 
                            onClick={() => speakBriefing(protocol)} 
                            className="p-5 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/5 text-hh-green hover:scale-110 active:scale-95"
                            title="Voice Briefing"
                          >
                             <Volume2 className="w-6 h-6" />
                          </button>
                          <button 
                            onClick={visualizeProtocol} 
                            disabled={isGeneratingVideo}
                            className={`p-5 rounded-2xl transition-all border border-white/5 flex items-center gap-3 font-black text-[10px] tracking-widest uppercase ${isGeneratingVideo ? 'bg-hh-orange/20 text-hh-orange animate-pulse' : 'bg-white/5 hover:bg-hh-green hover:text-hh-dark text-hh-green hover:scale-110 active:scale-95'}`}
                          >
                             {isGeneratingVideo ? <Loader2 className="w-5 h-5 animate-spin" /> : <Video className="w-5 h-5" />}
                             {isGeneratingVideo ? 'Rendering...' : 'Visualize Goal'}
                          </button>
                       </div>
                    </div>
                    
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                       <div className="space-y-12">
                          <div className="prose prose-invert prose-sm max-w-none prose-p:text-gray-300 prose-headings:font-heading prose-headings:italic prose-headings:uppercase prose-headings:tracking-tighter prose-strong:text-hh-green prose-code:bg-white/5 prose-code:px-2 prose-code:rounded">
                             <div className="whitespace-pre-wrap leading-relaxed font-bold text-base">
                               {protocol}
                             </div>
                          </div>

                          {sources.length > 0 && (
                            <div className="space-y-6 pt-10 border-t border-white/10">
                              <div className="flex items-center gap-3">
                                 <Globe className="w-5 h-5 text-hh-green" />
                                 <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-hh-green">Scientific References</h4>
                              </div>
                              <div className="grid grid-cols-1 gap-3">
                                {sources.slice(0, 4).map((source, idx) => (
                                  <a 
                                    key={idx} 
                                    href={source.uri} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="group flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 hover:border-hh-green/30 transition-all"
                                  >
                                     <div className="flex items-center gap-4 overflow-hidden">
                                        <LinkIcon className="w-4 h-4 text-gray-500 group-hover:text-hh-green flex-shrink-0" />
                                        <span className="text-[10px] font-bold text-gray-400 group-hover:text-white transition-colors truncate">{source.title}</span>
                                     </div>
                                     <ExternalLink className="w-3.5 h-3.5 text-gray-600 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0" />
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}
                       </div>

                       <div className="space-y-10">
                          {isGeneratingVideo ? (
                            <div className="aspect-video rounded-[3rem] bg-hh-dark/50 border-2 border-dashed border-hh-orange/30 flex flex-col items-center justify-center text-center p-12 space-y-6 animate-pulse">
                               <div className="w-20 h-20 bg-hh-orange/10 rounded-full flex items-center justify-center">
                                  <Loader2 className="w-10 h-10 text-hh-orange animate-spin" />
                               </div>
                               <div className="space-y-2">
                                  <p className="text-[11px] font-black uppercase tracking-[0.4em] text-hh-orange">Veo Synthesis Active</p>
                                  <p className="text-xs text-gray-500 font-bold italic">{videoStatus}</p>
                               </div>
                            </div>
                          ) : generatedVideoUrl ? (
                            <div className="space-y-6 animate-in zoom-in-95 duration-700">
                               <div className="flex items-center gap-3 ml-4">
                                  <Sparkles className="w-5 h-5 text-hh-orange" />
                                  <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-hh-orange">Goal Visualization</h4>
                               </div>
                               <div className="relative group rounded-[3rem] overflow-hidden shadow-4xl border-4 border-white/5">
                                  <video 
                                    src={generatedVideoUrl} 
                                    autoPlay 
                                    loop 
                                    muted 
                                    className="w-full h-auto aspect-video object-cover"
                                  />
                                  <div className="absolute inset-0 bg-hh-dark/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-6">
                                     <a 
                                      href={generatedVideoUrl} 
                                      download="hh-performance-vision.mp4"
                                      className="p-6 bg-white text-hh-dark rounded-full hover:bg-hh-green transition-all shadow-4xl hover:scale-110 active:scale-90"
                                     >
                                        <Download className="w-8 h-8" />
                                     </a>
                                  </div>
                               </div>
                               <p className="text-[9px] text-center text-gray-500 font-black uppercase tracking-[0.5em] italic">AI Visual Synthesis • Deployed via Veo 3.1</p>
                            </div>
                          ) : (
                            <div className="aspect-video rounded-[3rem] bg-white/5 border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-center p-12 space-y-6 group hover:border-hh-green/30 transition-all">
                               <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center group-hover:bg-hh-green/10 transition-all">
                                  <Video className="w-8 h-8 text-gray-600 group-hover:text-hh-green" />
                               </div>
                               <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.5em] leading-relaxed">Visualize your optimized performance state using the cinematic neural engine.</p>
                               <button 
                                onClick={visualizeProtocol}
                                className="px-8 py-4 bg-white/5 hover:bg-hh-green hover:text-hh-dark rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all"
                               >
                                 ACTIVATE VEO LINK
                               </button>
                            </div>
                          )}
                       </div>
                    </div>
                 </div>
               ) : error ? (
                  <div className="flex-grow flex flex-col items-center justify-center text-center p-16 bg-red-600/5 rounded-[4rem] border border-red-600/20 shadow-inner">
                    <ShieldAlert className="w-20 h-20 text-red-500 mb-8" />
                    <h3 className="text-3xl font-heading font-black uppercase italic mb-4 tracking-tighter">System Malfunction</h3>
                    <p className="text-red-500/70 font-bold mb-10 italic max-w-sm mx-auto">{error}</p>
                    <button onClick={() => (window as any).aistudio.openSelectKey()} className="px-14 py-6 bg-red-600 text-white rounded-[2rem] font-black uppercase text-[11px] tracking-[0.3em] shadow-2xl hover:bg-red-700 transition-all active:scale-95">
                      Verify Production Credentials
                    </button>
                  </div>
               ) : (
                 <div className="flex-grow flex flex-col items-center justify-center text-center opacity-30 select-none space-y-12">
                    <div className="relative">
                       <Dna className="w-40 h-40 text-gray-600 animate-pulse" />
                       <div className="absolute inset-0 bg-hh-green/20 blur-3xl rounded-full scale-150 -z-10"></div>
                    </div>
                    <div className="space-y-2">
                       <p className="text-2xl text-gray-500 font-black uppercase tracking-[0.5em] italic leading-none">Node Standby</p>
                       <p className="text-[9px] text-gray-600 font-black uppercase tracking-[0.4em]">Awaiting Biological Directive Ingress</p>
                    </div>
                 </div>
               )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BioEngine;
