import { motion } from "motion/react";
import { Zap, Play, Sparkles } from "lucide-react";

interface SplashViewProps {
  onStart: () => void;
}

export default function SplashView({ onStart }: SplashViewProps) {
  return (
    <div className="relative min-h-screen bg-[#0B0B0F] flex flex-col items-center justify-center overflow-hidden px-4 text-white">
      {/* Cinematic Tech Grid Wallpaper Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f29370a_1px,transparent_1px),linear-gradient(to_bottom,#1f29370a_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      {/* Soft Neon Purple/Blue Radiant Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] sm:w-[500px] sm:h-[500px] rounded-full bg-gradient-to-tr from-[#7B61FF] to-[#00C2FF] opacity-15 blur-[80px] sm:blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[250px] h-[250px] rounded-full bg-[#7B61FF] opacity-5 blur-[90px] pointer-events-none" />

      {/* Main Core Logo Area */}
      <div className="relative z-10 max-w-2xl text-center flex flex-col items-center">
        
        {/* Animated Premium Logo Icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative mb-8"
        >
          {/* Glowing Shadow Border Ring */}
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#7B61FF] to-[#00C2FF] opacity-75 blur-md animate-pulse" />
          
          <div className="relative w-24 h-24 bg-[#0F0F16] border border-gray-800 rounded-full flex items-center justify-center shadow-2xl">
            {/* Logo Vector Style Symbol: Glowing Pilot play button and motion lines */}
            <svg
              className="w-12 h-12 text-[#7B61FF]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              {/* Pilot Wings Wing Left */}
              <path
                d="M3 12C3 12 7 9 10 12C13 15 13 18 10 18C7 18 3 12 3 12Z"
                stroke="url(#purpleGlow)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Pilot Wings Wing Right */}
              <path
                d="M21 12C21 12 17 9 14 12C11 15 11 18 14 18C17 18 21 12 21 12Z"
                stroke="url(#blueGlow)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Play Button Flipped Center */}
              <polygon
                points="9.5,8.5 16,12 9.5,15.5"
                fill="url(#logoGradient)"
                stroke="#ffffff"
                strokeWidth="1"
              />
              <defs>
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7B61FF" />
                  <stop offset="100%" stopColor="#00C2FF" />
                </linearGradient>
                <linearGradient id="purpleGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7B61FF" />
                  <stop offset="100%" stopColor="#7B61FF" />
                </linearGradient>
                <linearGradient id="blueGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00C2FF" />
                  <stop offset="100%" stopColor="#00C2FF" />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Small Sparkle badge */}
            <span className="absolute -top-1 -right-1 bg-gradient-to-r from-[#7B61FF] to-[#00C2FF] text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-full border border-black shadow">
              AI
            </span>
          </div>
        </motion.div>

        {/* Title and Tagline */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-4xl sm:text-6xl font-black tracking-tight mb-4"
        >
          ClipPilot <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7B61FF] to-[#00C2FF]">AI</span>
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-gray-400 text-lg sm:text-xl font-medium tracking-wide max-w-md mx-auto mb-10"
        >
          “Turn Any Video Into Viral Clips Instantly”
        </motion.p>

        {/* Start Button & Instant Features highlights */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="flex flex-col items-center gap-6 w-full max-w-sm"
        >
          <button
            onClick={onStart}
            className="group relative w-full inline-flex items-center justify-center py-4 px-8 text-base font-bold text-white bg-gradient-to-r from-[#7B61FF] to-[#00C2FF] rounded-xl overflow-hidden shadow-[0_0_30px_rgba(123,97,255,0.3)] transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
          >
            {/* Hover overlay highlights */}
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <Play className="mr-2 w-5 h-5 fill-white" />
            GET STARTED
          </button>

          {/* Key capability bullet metrics */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-gray-400 mt-2">
            <span className="flex items-center gap-1 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-[#00C2FF]" /> Get Instant Viral Clips
            </span>
            <span className="flex items-center gap-1 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full">
              <Zap className="w-3.5 h-3.5 text-[#7B61FF]" /> Instant Rendering
            </span>
            <span className="flex items-center gap-1 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full">
              <Play className="w-3.5 h-3.5 text-[#00C2FF]" /> Multiplatform Downloader
            </span>
          </div>
        </motion.div>
      </div>

      {/* Tech decoration footer */}
      <div className="absolute bottom-6 text-center text-[10px] text-gray-600 font-mono tracking-widest z-10 select-none">
        CLIPPILOT CORE v4.2 // ENTERPRISE PIPELINE
      </div>
    </div>
  );
}
