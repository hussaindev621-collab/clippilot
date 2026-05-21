import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Maximize, Type, Scan, Eye, Sliders, Play, Pause, 
  Sparkles, Download, ArrowLeft, Layers, ShieldCheck,
  Settings, Video
} from "lucide-react";
import { Clip, CaptionStyle } from "../types";

interface ClipEditorViewProps {
  clip: Clip;
  onBack: () => void;
  onExport: (exportedSettings: {
    aspectRatio: '9:16' | '1:1' | '16:9';
    captionStyle: CaptionStyle;
    trimStart: number;
    trimEnd: number;
    videoCodec: 'H.264' | 'HEVC' | 'AV1';
    containerFormat: 'MP4' | 'MOV' | 'MKV';
    bitrate: '2m' | '5m' | '10m';
    frameRate: '24fps' | '30fps' | '60fps';
    audioCodec: 'AAC' | 'MP3' | 'Opus';
  }) => void;
}

export default function ClipEditorView({ clip, onBack, onExport }: ClipEditorViewProps) {
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '1:1' | '16:9'>('9:16');
  const [isPlaying, setIsPlaying] = useState(true);
  const [showSafeZones, setShowSafeZones] = useState(true);
  
  // Advanced Export States
  const [videoCodec, setVideoCodec] = useState<'H.264' | 'HEVC' | 'AV1'>('H.264');
  const [containerFormat, setContainerFormat] = useState<'MP4' | 'MOV' | 'MKV'>('MP4');
  const [bitrate, setBitrate] = useState<'2m' | '5m' | '10m'>('5m');
  const [frameRate, setFrameRate] = useState<'24fps' | '30fps' | '60fps'>('30fps');
  const [audioCodec, setAudioCodec] = useState<'AAC' | 'MP3' | 'Opus'>('AAC');

  // Crop window horizontal offset (in percentage)
  const [cropOffset, setCropOffset] = useState(clip.speakerPosition.x);
  
  // Subtitle custom state
  const [captionStyle, setCaptionStyle] = useState<CaptionStyle>({
    font: 'Space Grotesk',
    color: '#FFD700', // Electric Yellow
    size: 28,
    uppercase: true,
    neonGlow: true,
    backgroundType: 'outline',
    positionY: 65 // lower third
  });

  // Timeline Trim States
  const [trimStart, setTrimStart] = useState(clip.start);
  const [trimEnd, setTrimEnd] = useState(clip.end);
  const totalDuration = clip.end - clip.start;
  const [currentPlaybackTime, setCurrentPlaybackTime] = useState(clip.start);

  // Subtitle playback manager
  const [activeWordIdx, setActiveWordIdx] = useState(0);
  const activeTranscriptLines = clip.transcript;

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentPlaybackTime(prev => {
          if (prev >= trimEnd) {
            return trimStart; // Loop back
          }
          return prev + 0.2;
        });
      }, 200);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, trimStart, trimEnd]);

  // Find matching words or sentences based on currentPlaybackTime
  const getCurrentCaptionText = () => {
    const currentLine = activeTranscriptLines.find(
      line => currentPlaybackTime >= line.start && currentPlaybackTime <= (line.start + line.duration)
    );
    if (!currentLine) return "";
    return currentLine.text;
  };

  const fonts: CaptionStyle['font'][] = ['Impact', 'Space Grotesk', 'Inter', 'JetBrains Mono', 'Montserrat'];
  const colors = [
    { name: 'Electric Yellow', hex: '#FFD700' },
    { name: 'Neon Lime', hex: '#39FF14' },
    { name: 'Hot Pink', hex: '#FF1493' },
    { name: 'Electric Cyan', hex: '#00F0FF' },
    { name: 'Polar White', hex: '#FFFFFF' },
    { name: 'Solar Orange', hex: '#FF5F1F' }
  ];

  return (
    <div className="text-white max-w-6xl mx-auto px-2">
      
      {/* Back button header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-800">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Viral Clips
        </button>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-gray-500">Edit Mode:</span>
          <span className="text-xs bg-[#7B61FF]/20 border border-[#7B61FF]/30 text-[#7B61FF] font-mono px-2.5 py-0.5 rounded-full uppercase">
            HD CAPTION ENGINE v2
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ==================================================== */}
        {/* LEFT COLUMN: VISUAL PREVIEW & SAFE ZONE MASKS */}
        {/* ==================================================== */}
        <div className="lg:col-span-5 flex flex-col items-center">
          
          {/* Main Visual Aspect Frame Frame */}
          <div className="relative w-full max-w-[340px] aspect-[9/16] bg-[#07070B] border border-gray-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col items-center justify-center">
            
            {/* Background Looping Moving Visual Abstract Art (representing video stream) */}
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#110B29] to-[#040407] flex items-center justify-center overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border border-[#7B61FF]/20 rounded-full animate-ping opacity-30 pointer-events-none" />
              <div className="absolute w-[800px] h-[5px] bg-[#00C2FF]/10 rotate-[32deg] top-1/4 animate-pulse pointer-events-none" />
              <div className="absolute w-[800px] h-[5px] bg-[#7B61FF]/10 rotate-[-12deg] bottom-1/3 animate-pulse pointer-events-none" />

              {/* Speaker graphic simulated avatar */}
              <div 
                className="absolute flex flex-col items-center transition-all duration-300"
                style={{
                  left: `${50 + (cropOffset - 35)}%`,
                  top: '32%',
                  transform: 'translate(-50%, -50%) scale(1.1)'
                }}
              >
                <div className="relative w-28 h-28 rounded-full border-2 border-dashed border-[#7B61FF]/40 p-1 bg-black/40">
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-[#7B61FF]/30 to-[#00C2FF]/30 flex items-center justify-center font-bold text-gray-400">
                    S1
                  </div>
                </div>
                <div className="mt-3 bg-black/60 border border-white/10 px-3 py-1 rounded-full text-[10px] font-mono tracking-widest text-[#00C2FF]">
                  SPEAKER ZOOM ACTIVE
                </div>
              </div>
            </div>

            {/* Simulated Live Video Timeline Overlay */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-mono tracking-widest text-white bg-black/50 px-2 py-0.5 rounded border border-white/10 uppercase">
                Preview Time: {currentPlaybackTime.toFixed(1)}s
              </span>
            </div>

            {/* Subtitles Overlay Frame */}
            <div 
              className="absolute z-30 left-0 right-0 px-4 text-center select-none pointer-events-none transition-all duration-300"
              style={{
                top: `${captionStyle.positionY}%`,
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPlaybackTime}
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="inline-block max-w-[280px]"
                >
                  <span
                    style={{
                      fontFamily: captionStyle.font === 'Impact' ? 'Impact, Charcoal, sans-serif' : captionStyle.font,
                      color: captionStyle.color,
                      fontSize: `${captionStyle.size}px`,
                      textTransform: captionStyle.uppercase ? 'uppercase' : 'none',
                      textShadow: captionStyle.neonGlow 
                        ? `0 0 10px ${captionStyle.color}, 0 0 20px ${captionStyle.color}`
                        : captionStyle.backgroundType === 'outline' 
                          ? '-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000'
                          : 'none'
                    }}
                    className={`px-3 py-1 pb-2 tracking-wide font-black ${
                      captionStyle.backgroundType === 'semi-black' ? 'bg-black/75 px-3.5 py-1.5 rounded-xl border border-white/10' : ''
                    }`}
                  >
                    {getCurrentCaptionText() || "ClipPilot Captions"}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Interactive Safe Zones overlay Mask */}
            <AnimatePresence>
              {showSafeZones && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 pointer-events-none z-10 border border-red-500/20"
                >
                  {/* Left safe zone bounds */}
                  <div className="absolute left-0 bottom-24 p-4 font-mono text-[9px] text-[#FF1493] space-y-2 max-w-[180px]">
                    <div className="bg-black/75 px-2 py-1.5 rounded-md border border-[#FF1493]/20 flex items-center gap-1.5 backdrop-blur-sm">
                      <span className="w-1.5 h-1.5 bg-[#FF1493] rounded-full" />
                      <span>@creatorshub_cliplink</span>
                    </div>
                    <div className="bg-black/75 px-2 py-1 rounded-md border border-[#FF1493]/20 backdrop-blur-sm inline-block max-w-[150px] truncate">
                      Secrets of AI automation revealed #shorts
                    </div>
                  </div>

                  {/* Right engagement icons */}
                  <div className="absolute right-3 bottom-24 flex flex-col gap-4 text-center text-white/80 scale-90">
                    <div className="flex flex-col items-center"><div className="w-9 h-9 rounded-full bg-black/60 border border-white/10 flex items-center justify-center">❤️</div><span className="text-[9px] font-mono">1.2M</span></div>
                    <div className="flex flex-col items-center"><div className="w-9 h-9 rounded-full bg-black/60 border border-white/10 flex items-center justify-center">💬</div><span className="text-[9px] font-mono">24.5k</span></div>
                    <div className="flex flex-col items-center"><div className="w-9 h-9 rounded-full bg-black/60 border border-white/10 flex items-center justify-center">🔗</div><span className="text-[9px] font-mono">Share</span></div>
                  </div>

                  {/* Safe bounds warning top indicator */}
                  <div className="absolute top-24 left-1/2 -translate-x-1/2 bg-[#FF1493]/10 border border-[#FF1493]/30 px-3 py-1 rounded text-[9px] tracking-wide font-mono text-[#FF1493] flex items-center gap-1.5 backdrop-blur-sm">
                    <ShieldCheck className="w-3.5 h-3.5" /> SHORTS SAFE ADAPTIVE BOUNDS
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Quick Aspect Switch & Toggle Controls */}
          <div className="w-full max-w-[340px] mt-4 flex items-center justify-between gap-3 bg-white/5 border border-gray-800 p-2.5 rounded-xl text-xs font-semibold">
            <div className="flex items-center gap-1.5">
              <span className="text-gray-400">Crop Safe Mask:</span>
              <button 
                onClick={() => setShowSafeZones(!showSafeZones)}
                className={`px-3 py-1 rounded-lg border transition cursor-pointer ${
                  showSafeZones 
                    ? 'bg-[#00C2FF]/10 text-[#00C2FF] border-[#00C2FF]/20' 
                    : 'bg-black/40 text-gray-500 border-gray-800'
                }`}
              >
                {showSafeZones ? "ON" : "OFF"}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-gray-400 font-mono">Zoom Frame:</span>
              <input
                type="range"
                min="10"
                max="90"
                value={cropOffset}
                onChange={(e) => setCropOffset(parseFloat(e.target.value))}
                className="w-20 accent-[#7B61FF] cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* ==================================================== */}
        {/* RIGHT COLUMN: RICH STYLING INTERFACES */}
        {/* ==================================================== */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="bg-[#0F0F14] border border-gray-800 rounded-2xl p-5 sm:p-6 space-y-6">
            
            {/* 1. Title Trim Details */}
            <div>
              <span className="text-[10px] font-mono tracking-widest text-[#7B61FF] uppercase block mb-1">
                STEP 1 // CHOOSE ASPECTS & ASPECT-RATIO
              </span>
              <h3 className="text-lg font-bold flex items-center gap-2 mb-3">
                <Maximize className="w-5 h-5 text-[#7B61FF]" /> Format Aspect Ratio
              </h3>
              
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: '9:16', label: 'Vertical (9:16)', desc: 'TikTok, Reels, Shorts', active: aspectRatio === '9:16' },
                  { id: '1:1', label: 'Square (1:1)', desc: 'Instagram Grid', active: aspectRatio === '1:1' },
                  { id: '16:9', label: 'Landscape (16:9)', desc: 'Full YouTube Format', active: aspectRatio === '16:9' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setAspectRatio(item.id as any)}
                    className={`text-left p-3 rounded-xl border transition cursor-pointer ${
                      item.active 
                        ? 'bg-[#7B61FF]/10 border-[#7B61FF] text-white shadow-[0_0_15px_rgba(123,97,255,0.15)]' 
                        : 'bg-black/40 border-gray-800 text-gray-400 hover:border-gray-700'
                    }`}
                  >
                    <span className="block font-semibold text-xs">{item.label}</span>
                    <span className="block text-[10px] text-gray-500 mt-1 leading-normal">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Captions customizer */}
            <div className="border-t border-gray-800/80 pt-5">
              <span className="text-[10px] font-mono tracking-widest text-[#00C2FF] uppercase block mb-1">
                STEP 2 // STYLE ANIMATED SUBTITLES
              </span>
              <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
                <Type className="w-5 h-5 text-[#00C2FF]" /> Animated Subtitle Graphics
              </h3>

              {/* Fonts */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-400 font-mono mb-2 uppercase">A. Font Family Style</label>
                  <div className="flex flex-wrap gap-2">
                    {fonts.map((f) => (
                      <button
                        key={f}
                        onClick={() => setCaptionStyle(prev => ({ ...prev, font: f }))}
                        style={{ fontFamily: f === 'Impact' ? 'Impact, Charcoal, sans-serif' : f }}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-semibold tracking-wide transition cursor-pointer ${
                          captionStyle.font === f 
                            ? 'bg-[#00C2FF]/10 border-[#00C2FF] text-[#00C2FF]' 
                            : 'bg-black/40 border-gray-800 text-gray-400 hover:border-gray-700'
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Accent Colors */}
                <div>
                  <label className="block text-xs text-gray-400 font-mono mb-2 uppercase">B. Highlight Caption Color</label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {colors.map((c) => (
                      <button
                        key={c.hex}
                        onClick={() => setCaptionStyle(prev => ({ ...prev, color: c.hex }))}
                        className={`p-2 rounded-lg border text-2xs font-semibold flex flex-col items-center gap-1 transition-all duration-300 cursor-pointer ${
                          captionStyle.color === c.hex 
                            ? 'border-white bg-white/10 scale-[1.03]' 
                            : 'border-transparent bg-black/40 text-gray-400'
                        }`}
                      >
                        <span className="w-5 h-5 rounded-full border border-black" style={{ backgroundColor: c.hex }} />
                        <span className="text-[9px] truncate w-full text-center">{c.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* FX Enhancer Parameters */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="space-y-2">
                    <label className="block text-xs text-gray-400 font-mono uppercase">C. Word Cases</label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setCaptionStyle(prev => ({ ...prev, uppercase: true }))}
                        className={`flex-1 py-1.5 px-2 text-xs rounded-lg border font-semibold cursor-pointer ${
                          captionStyle.uppercase 
                            ? 'bg-white/10 border-white text-white' 
                            : 'bg-black/40 border-gray-800 text-gray-400'
                        }`}
                      >
                        UPPERCASE
                      </button>
                      <button
                        onClick={() => setCaptionStyle(prev => ({ ...prev, uppercase: false }))}
                        className={`flex-1 py-1.5 px-2 text-xs rounded-lg border font-semibold cursor-pointer ${
                          !captionStyle.uppercase 
                            ? 'bg-white/10 border-white text-white' 
                            : 'bg-black/40 border-gray-800 text-gray-400'
                        }`}
                      >
                        Normal
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs text-gray-400 font-mono uppercase">D. Neon Glow Glows</label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setCaptionStyle(prev => ({ ...prev, neonGlow: true }))}
                        className={`flex-1 py-1.5 px-2 text-xs rounded-lg border font-semibold cursor-pointer ${
                          captionStyle.neonGlow 
                            ? 'bg-gradient-to-r from-[#7B61FF]/20 to-[#00C2FF]/20 border-[#7B61FF] text-[#00C2FF]' 
                            : 'bg-black/40 border-gray-800 text-gray-400'
                        }`}
                      >
                        GLOW ON
                      </button>
                      <button
                        onClick={() => setCaptionStyle(prev => ({ ...prev, neonGlow: false }))}
                        className={`flex-1 py-1.5 px-2 text-xs rounded-lg border font-semibold cursor-pointer ${
                          !captionStyle.neonGlow 
                            ? 'bg-white/5 border-gray-800 text-gray-500' 
                            : 'bg-black/40 border-gray-800 text-gray-400'
                        }`}
                      >
                        OFF
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs text-gray-400 font-mono uppercase">E. Background Backdrop</label>
                    <select
                      value={captionStyle.backgroundType}
                      onChange={(e) => setCaptionStyle(prev => ({ ...prev, backgroundType: e.target.value as any }))}
                      className="w-full bg-black/40 border border-gray-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-[#7B61FF] cursor-pointer"
                    >
                      <option value="none">Standard TextOnly</option>
                      <option value="outline">High Contrast Black Outlined</option>
                      <option value="semi-black">Translucent Obsidian Box</option>
                    </select>
                  </div>
                </div>

                {/* Subtitle Positioning Slider */}
                <div className="bg-black/20 p-3 rounded-xl border border-gray-800/80">
                  <div className="flex justify-between text-xs font-mono text-gray-400 mb-2">
                    <span>CAPTION HEIGHT POSITION:</span>
                    <span className="text-[#00C2FF] font-bold">{captionStyle.positionY}% from top</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="85"
                    value={captionStyle.positionY}
                    onChange={(e) => setCaptionStyle(prev => ({ ...prev, positionY: parseInt(e.target.value) }))}
                    className="w-full accent-[#00C2FF] cursor-pointer"
                  />
                  <span className="text-[10px] text-gray-500 leading-none mt-1.5 block">
                    Use higher zones for facial dialogues or lower zones for standard horizontal titles.
                  </span>
                </div>
              </div>
            </div>

            {/* 3. Drag-trim Timeline Selection */}
            <div className="border-t border-gray-800/80 pt-5">
              <span className="text-[10px] font-mono tracking-widest text-[#7B61FF] uppercase block mb-1">
                STEP 3 // DRAG-TRIM TIMELINE RANGE
              </span>
              <h3 className="text-lg font-bold flex items-center gap-2 mb-3">
                <Sliders className="w-5 h-5 text-[#7B61FF]" /> Clip Timeline Trimmer
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-gray-400">Trim Segment Bounds:</span>
                  <span className="text-gray-200">
                    <strong className="text-[#7B61FF]">{trimStart.toFixed(1)}s</strong> to <strong className="text-[#00C2FF]">{trimEnd.toFixed(1)}s</strong> ({(trimEnd - trimStart).toFixed(1)}s segment)
                  </span>
                </div>

                <div className="flex gap-4">
                  <div className="flex-1 space-y-1">
                    <span className="text-[10px] text-gray-500 font-mono block">START STAMP:</span>
                    <input
                      type="number"
                      step="0.5"
                      min={clip.start}
                      max={trimEnd - 5}
                      value={trimStart}
                      onChange={(e) => setTrimStart(Math.max(clip.start, parseFloat(e.target.value)))}
                      className="w-full bg-black/40 border border-gray-800 rounded-lg p-2 text-xs font-mono text-white focus:outline-none focus:border-[#7B61FF]"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <span className="text-[10px] text-gray-500 font-mono block">END STAMP:</span>
                    <input
                      type="number"
                      step="0.5"
                      min={trimStart + 5}
                      max={clip.end}
                      value={trimEnd}
                      onChange={(e) => setTrimEnd(Math.min(clip.end, parseFloat(e.target.value)))}
                      className="w-full bg-black/40 border border-gray-800 rounded-lg p-2 text-xs font-mono text-white focus:outline-none focus:border-[#7B61FF]"
                    />
                  </div>
                </div>

                {/* Subtitle Play/Pause block controller */}
                <div className="flex items-center gap-3 bg-black/50 border border-gray-800/80 py-3 px-4 rounded-xl">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-2.5 rounded-lg bg-[#7B61FF] hover:bg-[#6C52EE] transition flex items-center justify-center text-white cursor-pointer"
                  >
                    {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
                  </button>
                  <div className="flex-1 flex flex-col justify-center">
                    <span className="text-[10px] text-gray-500 font-mono leading-none">REAL-TIME WORK timeline</span>
                    <span className="text-xs text-gray-300 font-semibold mt-1 truncate">
                      {isPlaying 
                        ? `Playing preview: active subtitle loops continuously` 
                        : "Ready for export: settings locked"
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Advanced Export Settings */}
            <div className="border-t border-gray-800/80 pt-5 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-[#00C2FF] uppercase block mb-1">
                    STEP 4 // FINE-TUNE PRESET ENCODERS
                  </span>
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <Settings className="w-5 h-5 text-[#00C2FF]" /> Advanced Export Settings
                  </h3>
                </div>
                <span className="text-2xs font-mono text-gray-500 bg-white/5 border border-white/5 px-2 py-1 rounded">
                  ENCODER API v1.4
                </span>
              </div>

              {/* Bitrate & Frame Rate Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Frame Rate */}
                <div className="space-y-2">
                  <label className="block text-xs text-gray-400 font-mono uppercase">A. Target Frame Rate</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: '24fps', val: '24 fps', desc: 'Cinema vibe' },
                      { id: '30fps', val: '30 fps', desc: 'Standard (Select)' },
                      { id: '60fps', val: '60 fps', desc: 'Super Fluid' }
                    ].map((fps) => (
                      <button
                        key={fps.id}
                        type="button"
                        onClick={() => setFrameRate(fps.id as any)}
                        className={`py-2 px-1 text-center rounded-xl border transition flex flex-col items-center justify-center cursor-pointer ${
                          frameRate === fps.id
                            ? 'bg-[#00C2FF]/10 border-[#00C2FF] text-[#00C2FF] shadow-[0_0_12px_rgba(0,194,255,0.15)]'
                            : 'bg-black/40 border-gray-800 text-gray-400 hover:border-gray-700'
                        }`}
                      >
                        <span className="font-bold text-xs font-mono">{fps.val}</span>
                        <span className="text-[8px] text-gray-500 mt-0.5 leading-none">{fps.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Video Bitrate */}
                <div className="space-y-2">
                  <label className="block text-xs text-gray-400 font-mono uppercase">B. Video Encoding Bitrate</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: '2m', val: '2 Mbps', desc: 'Lightweight' },
                      { id: '5m', val: '5 Mbps', desc: 'HD Quality' },
                      { id: '10m', val: '10 Mbps', desc: 'Studio Ultra' }
                    ].map((b) => (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => setBitrate(b.id as any)}
                        className={`py-2 px-1 text-center rounded-xl border transition flex flex-col items-center justify-center cursor-pointer ${
                          bitrate === b.id
                            ? 'bg-[#7B61FF]/10 border-[#7B61FF] text-[#7B61FF] shadow-[0_0_12px_rgba(123,97,255,0.15)]'
                            : 'bg-black/40 border-gray-800 text-gray-400 hover:border-gray-700'
                        }`}
                      >
                        <span className="font-bold text-xs font-mono">{b.val}</span>
                        <span className="text-[8px] text-gray-500 mt-0.5 leading-none">{b.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Codecs & Container Formatting */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* Video Codec */}
                <div className="space-y-2">
                  <label className="block text-xs text-gray-400 font-mono uppercase">C. Video Codec</label>
                  <select
                    value={videoCodec}
                    onChange={(e) => setVideoCodec(e.target.value as any)}
                    className="w-full bg-black/40 border border-gray-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#7B61FF] cursor-pointer"
                  >
                    <option value="H.264">H.264 (Maximum Compatibility)</option>
                    <option value="HEVC">HEVC / H.265 (High Efficiency)</option>
                    <option value="AV1">AV1 (Next-Gen Open Format)</option>
                  </select>
                </div>

                {/* Container format */}
                <div className="space-y-2">
                  <label className="block text-xs text-gray-400 font-mono uppercase">D. Container Format</label>
                  <select
                    value={containerFormat}
                    onChange={(e) => setContainerFormat(e.target.value as any)}
                    className="w-full bg-black/40 border border-gray-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#7B61FF] cursor-pointer"
                  >
                    <option value="MP4">MP4 (Recommended)</option>
                    <option value="MOV">MOV (QuickTime Standard)</option>
                    <option value="MKV">MKV (Matroska Vector)</option>
                  </select>
                </div>

                {/* Audio Codec */}
                <div className="space-y-2">
                  <label className="block text-xs text-gray-400 font-mono uppercase">E. Audio Encoder Codec</label>
                  <select
                    value={audioCodec}
                    onChange={(e) => setAudioCodec(e.target.value as any)}
                    className="w-full bg-black/40 border border-gray-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#00C2FF] cursor-pointer"
                  >
                    <option value="AAC">AAC (High Fidelity)</option>
                    <option value="MP3">MP3 (Legacy Audio)</option>
                    <option value="Opus">Opus (Ultra Low Latency)</option>
                  </select>
                </div>

              </div>

              {/* Dynamic Info Banner based on choices */}
              <div className="bg-black/30 p-3 sm:p-4 rounded-xl border border-gray-800/80 flex items-start gap-2.5 text-[11px] text-gray-400 leading-normal">
                <Video className="w-4 h-4 text-[#00C2FF] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-white font-medium block">Active Export Configuration Profile:</span>
                  Directly multiplexing {videoCodec} video with {audioCodec} audio inside an {containerFormat} wrapper at {frameRate === '24fps' ? '24' : frameRate === '30fps' ? '30' : '60'} frames per second and an average target bandwidth bitstream of {bitrate === '2m' ? '2' : bitrate === '5m' ? '5' : '10'} Mbps. This ensures outstanding mobile responsiveness and instant zero-flicker loading in feed visualizers.
                </div>
              </div>

            </div>

            {/* Launch Compile HD Button */}
            <div className="pt-2">
              <button
                onClick={() => onExport({ aspectRatio, captionStyle, trimStart, trimEnd, videoCodec, containerFormat, bitrate, frameRate, audioCodec })}
                className="w-full relative group inline-flex items-center justify-center bg-gradient-to-r from-[#7B61FF] to-[#00C2FF] text-sm font-bold py-4 rounded-xl overflow-hidden shadow-[0_4px_25px_rgba(123,97,255,0.25)] transition hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              >
                {/* Background light rays effect */}
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Sparkles className="w-4 h-4 mr-2" /> COMPILE VERTICAL CLIP & EXPORT HD
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
