import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Sparkles, BrainCircuit, Activity, CheckCircle, Database } from "lucide-react";

interface AIPipelineProps {
  progress: number;
  stage: 'fetching' | 'transcribing' | 'detecting' | 'rendering' | 'completed';
  url: string;
}

export default function AIPipelineView({ progress, stage, url }: AIPipelineProps) {
  const [tickerText, setTickerText] = useState("Initializing safe isolation sandbox...");
  const [fakeTranscript, setFakeTranscript] = useState<string[]>([]);

  const sampleTranscripts = [
    "So I asked myself, what if we tried something completely crazy?",
    "Most people waste years waiting for the perfect moment.",
    "But the absolute truth is that perfect moment never comes.",
    "You just have to build. You have to start. That is the whole trick.",
    "And boom! Suddenly everything starts aligning."
  ];

  // Dynamic status updates & transcript additions
  useEffect(() => {
    let text = "Analyzing incoming metadata stream...";
    if (stage === 'fetching') {
      text = "Locating CDN streams & establishing secure file ingestion pipe...";
    } else if (stage === 'transcribing') {
      text = "Piping audio track to Whisper AI transcribing models...";
      // Increment transcript simulation
      const interval = setInterval(() => {
        setFakeTranscript(prev => {
          if (prev.length >= 8) return prev.slice(1);
          const nextWord = sampleTranscripts[Math.floor(Math.random() * sampleTranscripts.length)];
          return [...prev, nextWord];
        });
      }, 1000);
      return () => clearInterval(interval);
    } else if (stage === 'detecting') {
      text = "Analyzing facial geometry and tracking speaker bounding-box coordinates with OpenCV...";
    } else if (stage === 'rendering') {
      text = "Calculating Gemini engagement scores, laughter frequencies, and story hooks...";
    }
    setTickerText(text);
  }, [stage]);

  return (
    <div className="bg-[#0F0F14] border border-gray-800 rounded-2xl p-6 sm:p-8 max-w-2xl mx-auto text-white shadow-2xl relative overflow-hidden backdrop-blur-md">
      
      {/* Background radial highlight */}
      <div className="absolute top-0 right-0 w-[180px] h-[180px] rounded-full bg-gradient-to-tr from-[#7B61FF] to-transparent opacity-10 blur-3xl pointer-events-none" />

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-800 pb-5 mb-6">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-[#00C2FF] uppercase bg-[#00C2FF]/10 px-2.5 py-1 rounded-full border border-[#00C2FF]/20">
            SYSTEM ENGINE IN PROCESS
          </span>
          <h2 className="text-xl font-bold tracking-tight mt-2 flex items-center gap-2">
            <BrainCircuit className="w-5.5 h-5.5 text-[#7B61FF] animate-pulse" />
            Active AI Pipeline
          </h2>
        </div>
        
        {/* Progress Circular Accent */}
        <div className="flex items-center gap-3">
          <span className="font-mono font-semibold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-[#7B61FF] to-[#00C2FF]">
            {progress}%
          </span>
          <span className="text-xs text-gray-400">processed</span>
        </div>
      </div>

      {/* Main Process Indicators */}
      <div className="space-y-4 mb-8">
        
        {/* Stage 1: Ingestion */}
        <div className="flex items-start gap-3">
          <div className="mt-1">
            {stage === 'fetching' ? (
              <div className="w-5 h-5 rounded-full border-2 border-t-transparent border-[#00C2FF] animate-spin" />
            ) : progress > 20 ? (
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            ) : (
              <div className="w-5 h-5 rounded-full bg-gray-800" />
            )}
          </div>
          <div className="flex-1">
            <h4 className={`text-sm font-semibold ${stage === 'fetching' ? 'text-[#00C2FF]' : 'text-gray-300'}`}>
              Video Ingestion & Stream Fetching
            </h4>
            <p className="text-xs text-gray-500 mt-0.5 max-w-md">
              Extracting HD video payloads from CDN servers.
            </p>
          </div>
        </div>

        {/* Stage 2: Whisper Transcribe */}
        <div className="flex items-start gap-3">
          <div className="mt-1">
            {stage === 'transcribing' ? (
              <div className="w-5 h-5 rounded-full border-2 border-t-transparent border-[#7B61FF] animate-spin" />
            ) : progress > 45 ? (
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            ) : (
              <div className="w-5 h-5 rounded-full bg-gray-800" />
            )}
          </div>
          <div className="flex-1">
            <h4 className={`text-sm font-semibold ${stage === 'transcribing' ? 'text-[#7B61FF]' : 'text-gray-300'}`}>
              Automatic Speech Transcription (Whisper AI)
            </h4>
            <p className="text-xs text-gray-500 mt-0.5 max-w-md">
              Converting multi-speaker voice signals to time-coded digital tokens.
            </p>
            
            {/* Real-time Flowing Subtitle Preview Terminal */}
            {stage === 'transcribing' && (
              <div className="mt-3 bg-black/60 border border-gray-800 rounded-lg p-3 font-mono text-[11px] text-gray-400 h-28 overflow-y-auto space-y-1">
                <span className="text-gray-600 block">[STREAMING AUDIO TO TOKENS]</span>
                {fakeTranscript.length === 0 && <span className="text-gray-600">Awaiting audio signals...</span>}
                {fakeTranscript.map((t, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ x: -5, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="flex justify-between items-center bg-white/5 px-2 py-0.5 rounded"
                  >
                    <span className="text-gray-300 text-left">{t}</span>
                    <span className="text-emerald-400 text-[10px] text-right">00:{(idx + 1) * 3}s</span>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Stage 3: Auto Zoom Speaker Layout */}
        <div className="flex items-start gap-3">
          <div className="mt-1">
            {stage === 'detecting' ? (
              <div className="w-5 h-5 rounded-full border-2 border-t-transparent border-[#00C2FF] animate-spin" />
            ) : progress > 75 ? (
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            ) : (
              <div className="w-5 h-5 rounded-full bg-gray-800" />
            )}
          </div>
          <div className="flex-1">
            <h4 className={`text-sm font-semibold ${stage === 'detecting' ? 'text-[#00C2FF]' : 'text-gray-300'}`}>
              Auto Face-Tracking & Reframing
            </h4>
            <p className="text-xs text-gray-500 mt-0.5 max-w-md">
              Scanning pixels to center speaker and adjust focal region layout.
            </p>
          </div>
        </div>

        {/* Stage 4: AI Peak Identification and Scoring */}
        <div className="flex items-start gap-3">
          <div className="mt-1">
            {stage === 'rendering' ? (
              <div className="w-5 h-5 rounded-full border-2 border-t-transparent border-[#7B61FF] animate-spin" />
            ) : progress >= 100 ? (
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            ) : (
              <div className="w-5 h-5 rounded-full bg-gray-800" />
            )}
          </div>
          <div className="flex-1">
            <h4 className={`text-sm font-semibold ${stage === 'rendering' ? 'text-[#7B61FF]' : 'text-gray-300'}`}>
              AI Viral Moment Detection & Clip Scoring
            </h4>
            <p className="text-xs text-gray-500 mt-0.5 max-w-md">
              Detecting laughter, hook dynamics, and storytelling climaxes.
            </p>
          </div>
        </div>
      </div>

      {/* Visual audio waveform simulator and action log */}
      <div className="bg-black/40 border border-gray-800 rounded-xl p-4 flex flex-col items-center">
        
        {/* Glowing Waveform Animations */}
        <div className="flex items-center gap-1.5 h-12 justify-center w-full mb-3 select-none">
          {Array.from({ length: 24 }).map((_, idx) => {
            const delay = (idx * 0.1).toFixed(1);
            const height = Math.floor(Math.random() * 26) + 12; // 12px to 38px
            return (
              <motion.div
                key={idx}
                animate={{
                  height: [10, height, 10],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1 + Math.random(),
                  delay: parseFloat(delay),
                }}
                className={`w-1 rounded-full ${
                  stage === 'transcribing'
                    ? "bg-gradient-to-t from-[#7B61FF] to-[#00C2FF]"
                    : "bg-gray-700 opacity-60"
                }`}
                style={{ height: '16px' }}
              />
            );
          })}
        </div>
        
        {/* Terminal Line Log Output */}
        <div className="flex items-center gap-2 text-xs font-mono text-gray-400 w-full justify-center">
          <Activity className="w-3.5 h-3.5 text-[#7B61FF] animate-pulse" />
          <span className="truncate">{tickerText}</span>
        </div>
      </div>

      {/* Subtle details container */}
      <div className="flex items-center justify-between mt-6 text-[11px] text-gray-500 font-mono">
        <span className="flex items-center gap-1">
          <Database className="w-3 h-3 text-[#7B61FF]" /> SQLite Data Cache Persistent
        </span>
        <span>URL: {url.substring(0, 32)}...</span>
      </div>
    </div>
  );
}
