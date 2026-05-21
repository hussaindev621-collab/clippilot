import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, Download, Film, Database, HelpCircle, AlertOctagon, 
  RotateCw, Play, ArrowRight, ExternalLink, Scissors, Check, Sliders, VolumeX
} from "lucide-react";

// Components
import SplashView from "./components/SplashView";
import AIPipelineView from "./components/AIPipelineView";
import ClipEditorView from "./components/ClipEditorView";
import HistoryListView from "./components/HistoryListView";
import DisclaimerBanner from "./components/DisclaimerBanner";

import { VideoJob, Clip, DownloadJob, CaptionStyle } from "./types";

export default function App() {
  const [screen, setScreen] = useState<'splash' | 'dashboard' | 'pipeline' | 'editor'>('splash');
  const [activeTab, setActiveTab] = useState<'clipper' | 'downloader' | 'storage'>('clipper');
  
  // Jobs and Downloader lists
  const [jobs, setJobs] = useState<VideoJob[]>([]);
  const [downloads, setDownloads] = useState<DownloadJob[]>([]);
  
  // Ingest URL fields
  const [url, setUrl] = useState('');
  const [topicPreference, setTopicPreference] = useState('');
  
  // Downloader Extraction Details
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedInfo, setExtractedInfo] = useState<{
    url: string;
    title: string;
    thumbnail: string;
    formats: Array<{ resolution: string; size: string; format: string; available: boolean }>;
  } | null>(null);

  // Active Process trackers
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [activeJob, setActiveJob] = useState<VideoJob | null>(null);
  const [selectedJob, setSelectedJob] = useState<VideoJob | null>(null);
  
  // Editing state
  const [selectedClip, setSelectedClip] = useState<Clip | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportedUrl, setExportedUrl] = useState<string | null>(null);

  // Fast Platform chip lists for easier clip pasting
  const platforms = [
    { name: "YouTube", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", color: "hover:border-red-500 hover:text-red-500" },
    { name: "TikTok", url: "https://www.tiktok.com/@tiktok/video/7123456789", color: "hover:border-teal-400 hover:text-teal-400" },
    { name: "Instagram Reels", url: "https://www.instagram.com/reel/Cg123456789/", color: "hover:border-pink-500 hover:text-pink-500" },
    { name: "Twitter / X", url: "https://twitter.com/nasa/status/123456789", color: "hover:border-blue-400 hover:text-blue-400" },
    { name: "Vimeo", url: "https://vimeo.com/712345", color: "hover:border-sky-500 hover:text-sky-500" }
  ];

  // Fetch initial histories
  const fetchHistory = async () => {
    try {
      const resJobs = await fetch("/api/jobs");
      const dJobs = await resJobs.json();
      if (dJobs && dJobs.jobs) {
        setJobs(dJobs.jobs);
        // Sync active completed job if none is visible yet
        if (dJobs.jobs.length > 0 && !selectedJob) {
          const completed = dJobs.jobs.find((j: any) => j.status === 'completed');
          if (completed) setSelectedJob(completed);
        }
      }

      const resDl = await fetch("/api/downloads");
      const dDl = await resDl.json();
      if (dDl && dDl.downloads) {
        setDownloads(dDl.downloads);
      }
    } catch (err) {
      console.error("Historical fetching error:", err);
    }
  };

  useEffect(() => {
    if (screen === 'dashboard') {
      fetchHistory();
    }
  }, [screen]);

  // Long polling loop for processing jobs
  useEffect(() => {
    let pollingInterval: NodeJS.Timeout | null = null;
    
    if (activeJobId && screen === 'pipeline') {
      pollingInterval = setInterval(async () => {
        try {
          const response = await fetch(`/api/jobs/${activeJobId}`);
          const data = await response.json();
          if (data) {
            setActiveJob(data);
            if (data.status === 'completed') {
              setActiveJobId(null);
              setSelectedJob(data);
              await fetchHistory();
              setScreen('dashboard');
              setActiveTab('clipper');
            } else if (data.status === 'failed') {
              setActiveJobId(null);
              alert(`Clipping process failed: ${data.error || "Unknown server rendering error"}`);
              setScreen('dashboard');
            }
          }
        } catch (err) {
          console.error("Polling job status error:", err);
        }
      }, 1500);
    }

    return () => {
      if (pollingInterval) clearInterval(pollingInterval);
    };
  }, [activeJobId, screen]);

  // Periodic polling for downloader jobs in history
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    const hasActiveDl = downloads.some(d => d.status === 'downloading');
    
    if (hasActiveDl && screen === 'dashboard') {
      timer = setInterval(async () => {
        const resDl = await fetch("/api/downloads");
        const data = await resDl.json();
        if (data && data.downloads) {
          setDownloads(data.downloads);
        }
      }, 1500);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [downloads, screen]);

  // Actions
  const handleLaunchAnalyze = async () => {
    if (!url) {
      alert("Please paste or choose a valid video URL first");
      return;
    }
    try {
      setScreen('pipeline');
      const response = await fetch("/api/jobs/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, topicPreference })
      });
      const data = await response.json();
      if (data && data.jobId) {
        setActiveJobId(data.jobId);
        setActiveJob({
          id: data.jobId,
          url,
          title: "Analyzing content stream...",
          thumbnail: "",
          durationString: "Calculating...",
          status: 'processing',
          progress: 5,
          progressStage: 'fetching',
          clips: [],
          createdAt: new Date().toISOString()
        });
      }
    } catch (err) {
      console.error("Submit analyze job error:", err);
      alert("Internal connection failure starting analysis. Please retry.");
      setScreen('dashboard');
    }
  };

  const handleExtractDownloader = async () => {
    if (!url) {
      alert("Please paste a valid video link to parse");
      return;
    }
    setIsExtracting(true);
    setExtractedInfo(null);
    try {
      const res = await fetch("/api/downloader/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url })
      });
      const data = await res.json();
      if (data && data.formats) {
        setExtractedInfo(data);
      }
    } catch (err) {
      console.error("Parsing formatting formats error:", err);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleSubmitDownload = async (resolution: string) => {
    if (!url || !extractedInfo) return;
    try {
      const response = await fetch("/api/downloader/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          resolution,
          title: extractedInfo.title
        })
      });
      const data = await response.json();
      if (data && data.id) {
        setUrl('');
        setExtractedInfo(null);
        setActiveTab('storage');
        await fetchHistory();
      }
    } catch (err) {
      console.error("Submit download job error:", err);
    }
  };

  const handleExportFinished = async (settings: {
    aspectRatio: '9:16' | '1:1' | '16:9';
    captionStyle: CaptionStyle;
    trimStart: number;
    trimEnd: number;
    videoCodec: 'H.264' | 'HEVC' | 'AV1';
    containerFormat: 'MP4' | 'MOV' | 'MKV';
    bitrate: '2m' | '5m' | '10m';
    frameRate: '24fps' | '30fps' | '60fps';
    audioCodec: 'AAC' | 'MP3' | 'Opus';
  }) => {
    if (!selectedClip) return;
    setIsExporting(true);
    setExportedUrl(null);
    try {
      const res = await fetch("/api/clips/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clipId: selectedClip.id,
          ...settings
        })
      });
      const data = await res.json();
      if (data && data.success) {
        setExportedUrl(data.downloadUrl);
      }
    } catch (err) {
      console.error("Rendering clip error:", err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleClearDatabase = async () => {
    const confirmClear = window.confirm("Are you sure you want to delete all clipped edits and downloaded lists from database storage?");
    if (!confirmClear) return;
    try {
      await fetch("/api/clear-db", { method: "POST" });
      setJobs([]);
      setDownloads([]);
      setSelectedJob(null);
      fetchHistory();
    } catch (err) {
      console.error("Clearing DB error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0F] select-none text-white relative flex flex-col justify-between">
      
      {/* Background Star highlights */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-[#7B61FF]/5 to-transparent pointer-events-none" />

      {/* ==================================================== */}
      {/* 1. SCREEN: SPLASH PORTAL */}
      {/* ==================================================== */}
      <AnimatePresence mode="wait">
        {screen === 'splash' && (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 z-50 bg-[#0B0B0F]"
          >
            <SplashView onStart={() => setScreen('dashboard')} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Container */}
      <div className="relative z-10 flex-1 flex flex-col">
        
        {/* Applet Top Header Nav */}
        <header className="border-b border-gray-800/80 bg-black/40 backdrop-blur-md sticky top-0 z-30 px-4 py-4 sm:px-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            
            <div className="flex items-center gap-3">
              {/* Premium pilot wing play logomark */}
              <div 
                onClick={() => setScreen('splash')} 
                className="w-10 h-10 bg-gradient-to-tr from-[#7B61FF] to-[#00C2FF] rounded-xl flex items-center justify-center cursor-pointer shadow-[0_0_15px_rgba(123,97,255,0.2)] hover:scale-105 transition"
              >
                <svg className="w-5.5 h-5.5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tight flex items-center gap-1.5">
                  ClipPilot <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-white/10 uppercase tracking-widest text-[#00C2FF]">AI</span>
                </h1>
                <p className="text-[10px] text-gray-400 font-mono tracking-wide hidden sm:block">
                  NEON CLIPPING PLATFORM // V4.2
                </p>
              </div>
            </div>

            {/* Navigation Tabs bar */}
            {screen !== 'splash' && (
              <div className="flex bg-black/60 p-1 rounded-xl border border-gray-800">
                <button
                  onClick={() => { setActiveTab('clipper'); setSelectedClip(null); }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'clipper' 
                      ? 'bg-[#7B61FF] text-white shadow' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Film className="w-3.5 h-3.5" /> <span className="hidden sm:inline">AI Clipper</span>
                </button>
                <button
                  onClick={() => { setActiveTab('downloader'); setSelectedClip(null); }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'downloader' 
                      ? 'bg-[#00C2FF] text-black shadow' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Download className="w-3.5 h-3.5" /> <span className="hidden sm:inline">HD Downloader</span>
                </button>
                <button
                  onClick={() => { setActiveTab('storage'); setSelectedClip(null); }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'storage' 
                      ? 'bg-white/10 text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Database className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Archives ({jobs.filter(j => j.status === 'completed').length + downloads.filter(d => d.status === 'completed').length})</span>
                </button>
              </div>
            )}

          </div>
        </header>

        {/* Dashboard Frame */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 sm:px-6">
          <AnimatePresence mode="wait">
            
            {/* ==================================================== */}
            {/* 2. SCREEN: PIPELINE PROGRESS STREAM */}
            {/* ==================================================== */}
            {screen === 'pipeline' && activeJob && (
              <motion.div
                key="pipeline-screen"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="py-6"
              >
                <AIPipelineView 
                  progress={activeJob.progress} 
                  stage={activeJob.progressStage} 
                  url={activeJob.url} 
                />
              </motion.div>
            )}

            {/* ==================================================== */}
            {/* 3. SCREEN: ACTIVE CAPTION EDITOR */}
            {/* ==================================================== */}
            {screen === 'editor' && selectedClip && (
              <motion.div
                key="editor-screen"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="py-3"
              >
                <ClipEditorView
                  clip={selectedClip}
                  onBack={() => { setScreen('dashboard'); setSelectedClip(null); }}
                  onExport={handleExportFinished}
                />
              </motion.div>
            )}

            {/* ==================================================== */}
            {/* 4. MASTER INTERFACE MODULES (CLIPPER / DOWNLOADER / STORAGE) */}
            {/* ==================================================== */}
            {screen === 'dashboard' && (
              <motion.div
                key="dashboard-modules"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-8"
              >
                
                {/* I. ACTIVE VIEW: AI CLIP GENERATOR */}
                {activeTab === 'clipper' && (
                  <div className="space-y-8">
                    
                    {/* Input Paste Hero Banner */}
                    <div className="bg-gradient-to-r from-[#171329] to-[#0D1620] border border-gray-800 rounded-3xl p-6 sm:p-10 text-center relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-[180px] h-[180px] rounded-full bg-gradient-to-tr from-[#7B61FF] to-transparent opacity-10 blur-3xl" />
                      
                      <div className="max-w-2xl mx-auto space-y-4">
                        <span className="inline-flex items-center gap-1.5 text-[10px] text-[#00C2FF] font-mono tracking-widest uppercase bg-[#00C2FF]/10 px-3 py-1 rounded-full border border-[#00C2FF]/20">
                          <Sparkles className="w-3.5 h-3.5 animate-pulse" /> REVOLUTIONARY MOMENT DETECTOR
                        </span>
                        
                        <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-none">
                          Paste Video Link & Cut Virals
                        </h2>
                        <p className="text-gray-400 text-sm max-w-md mx-auto">
                          Paste URLs from YouTube, TikTok, Instagram, X/Twitter, or Facebook. Our AI transcribes, segments, and crops Speaker highlights.
                        </p>

                        {/* Large paste field */}
                        <div className="pt-2">
                          <div className="bg-black/80 border-2 border-gray-800 focus-within:border-[#7B61FF] rounded-2xl p-2.5 flex flex-col sm:flex-row gap-3 transition shadow-inner">
                            <input
                              type="text"
                              placeholder="Paste public video URL (e.g., https://youtube.com/...)"
                              value={url}
                              onChange={(e) => setUrl(e.target.value)}
                              className="bg-transparent flex-1 focus:outline-none p-2 text-sm text-gray-100 placeholder-gray-600 font-medium"
                            />
                            <button
                              onClick={handleLaunchAnalyze}
                              className="bg-gradient-to-r from-[#7B61FF] to-[#00C2FF] text-white hover:opacity-90 font-bold px-6 py-3 rounded-xl text-xs tracking-wider flex items-center justify-center gap-1.5 uppercase shadow-[0_4px_15px_rgba(123,97,255,0.25)] transition duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                            >
                              GET FREE VIRAL CLIPS <ArrowRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Preference keyword search */}
                        <div className="pt-1 flex flex-col sm:flex-row items-center gap-3 justify-center text-xs text-gray-400">
                          <span className="font-mono">Preference Filter (Optional):</span>
                          <input
                            type="text"
                            placeholder="e.g., Motivation speech, comedy peaks"
                            value={topicPreference}
                            onChange={(e) => setTopicPreference(e.target.value)}
                            className="bg-white/5 border border-gray-800 rounded-lg py-1 px-3 text-2xs focus:outline-none focus:border-[#7B61FF] text-white w-full sm:w-64 font-mono"
                          />
                        </div>

                        {/* Supported Platform Shortcuts cards */}
                        <div className="pt-4 border-t border-gray-900/40">
                          <span className="text-[10px] text-gray-500 font-mono block mb-2.5 uppercase tracking-wider">Fast Presets Demo: Click platform link to copy path</span>
                          <div className="flex flex-wrap items-center justify-center gap-2">
                            {platforms.map((p) => (
                              <button
                                key={p.name}
                                onClick={() => { setUrl(p.url); setTopicPreference(`Creative ${p.name} clip moment`); }}
                                className={`text-[10px] bg-[#0E0E12] border border-gray-800 rounded-full px-3 py-1 font-semibold text-gray-400 transition cursor-pointer ${p.color}`}
                              >
                                {p.name}
                              </button>
                            ))}
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* Results Showcase Section */}
                    {selectedJob && (
                      <div className="space-y-6 pt-2">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-850 pb-4">
                          <div>
                            <span className="text-[10px] font-mono tracking-widest text-[#7B61FF] bg-[#7B61FF]/10 border border-[#7B61FF]/20 px-2 py-0.5 rounded-full uppercase">
                              Active Clip Workspace
                            </span>
                            <h3 className="text-xl font-bold mt-1 tracking-tight flex items-center gap-2 text-[#7B61FF]">
                              {selectedJob.title}
                            </h3>
                          </div>
                          
                          {/* Jobs index size */}
                          <div className="text-xs font-mono text-gray-400">
                            Found <span className="text-white font-bold">{selectedJob.clips.length} viral reels</span> ready for export
                          </div>
                        </div>

                        {/* Grid list of Generated Highlights */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {selectedJob.clips.map((clip) => (
                            <div 
                              key={clip.id}
                              className="bg-[#0F0F14] border border-gray-800 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-gray-700 transition shadow-lg group"
                            >
                              
                              {/* Visual clip card head banner */}
                              <div className="relative aspect-video bg-indigo-950/20 flex flex-col justify-between p-4 overflow-hidden">
                                
                                {/* Background design highlight */}
                                <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-[#7B61FF] to-[#00C2FF]" />
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120px] h-[120px] rounded-full bg-[#7B61FF] opacity-10 blur-2xl group-hover:scale-110 transition pointer-events-none" />

                                <div className="flex items-center justify-between z-10 w-full">
                                  {/* Dynamic Score Dial Dial */}
                                  <div className="bg-[#1C1C24] border border-[#7B61FF]/40 rounded-lg px-2 py-1 flex items-center gap-1">
                                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                                    <span className="font-mono text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">
                                      {clip.score}% Viral
                                    </span>
                                  </div>

                                  <span className="text-[10px] font-mono text-gray-400 bg-black/50 px-2 py-0.5 rounded border border-white/5">
                                    00:{clip.start} - 00:{clip.end}
                                  </span>
                                </div>

                                {/* Custom dialog mockup lines */}
                                <div className="z-10 mt-6 bg-black/60 border border-white/10 rounded-xl p-2.5 flex items-center gap-2">
                                  <VolumeX className="w-3.5 h-3.5 text-gray-500" />
                                  <span className="text-[11px] font-mono italic text-gray-300 line-clamp-1">
                                    "{clip.transcript[0]?.text || "Speech transcript text..."}"
                                  </span>
                                </div>
                              </div>

                              {/* Clip descriptions info */}
                              <div className="p-4 flex-1 flex flex-col justify-between">
                                <div className="space-y-2">
                                  <h4 className="font-bold text-sm text-gray-100 group-hover:text-[#7B61FF] transition leading-snug">
                                    {clip.title}
                                  </h4>
                                  <p className="text-xs text-gray-400 leading-relaxed font-normal">
                                    {clip.explanation}
                                  </p>
                                </div>

                                <div className="grid grid-cols-2 gap-2 mt-5 pt-3 border-t border-gray-800/80">
                                  
                                  <button
                                    onClick={() => { setSelectedClip(clip); setScreen('editor'); }}
                                    className="py-2.5 px-3 bg-black/40 border border-[#7B61FF]/40 hover:bg-[#7B61FF]/10 text-[#7B61FF] font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer"
                                  >
                                    <Scissors className="w-3.5 h-3.5" /> STYLIZE CLIP
                                  </button>

                                  <button
                                    onClick={() => { setSelectedClip(clip); setScreen('editor'); }}
                                    className="py-2.5 px-3 bg-gradient-to-r from-[#7B61FF] to-[#00C2FF] hover:opacity-90 font-bold text-xs rounded-xl text-white flex items-center justify-center gap-1.5 transition cursor-pointer"
                                  >
                                    <Download className="w-3.5 h-3.5" /> EXPORT HD
                                  </button>
                                </div>
                              </div>

                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                )}

                {/* II. ACTIVE VIEW: HD VIDEO DOWNLOADER */}
                {activeTab === 'downloader' && (
                  <div className="space-y-6 max-w-4xl mx-auto">
                    
                    {/* Header segment intro */}
                    <div className="text-center space-y-2 mb-6">
                      <span className="text-[10px] font-mono bg-[#00C2FF]/10 border border-[#00C2FF]/20 px-2.5 py-1 rounded-full text-[#00C2FF] uppercase tracking-wider">
                        DIRECT MULTIPURPOSE FORMAT FETCHER
                      </span>
                      <h3 className="text-2xl font-black">Paste & Download HD</h3>
                      <p className="text-xs text-gray-400 max-w-sm mx-auto">
                        Extract multiple quality options & sizes directly from standard platforms with zero watermark blocks.
                      </p>
                    </div>

                    {/* Simple Paste Field */}
                    <div className="bg-[#0F0F14] border border-gray-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row gap-3 shadow-lg">
                      <input
                        type="text"
                        placeholder="Paste video URL to extract options..."
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="bg-black/60 border border-gray-800 rounded-xl p-3 flex-1 text-sm focus:outline-none focus:border-[#00C2FF] text-white"
                      />
                      <button
                        onClick={handleExtractDownloader}
                        disabled={isExtracting}
                        className="bg-[#00C2FF] hover:opacity-90 text-black py-3 px-6 rounded-xl font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-1.5 transition cursor-pointer"
                      >
                        {isExtracting ? (
                          <span className="w-4 h-4 border-2 border-t-transparent border-black rounded-full animate-spin" />
                        ) : (
                          <>DOWNLOAD <Sliders className="w-3.5 h-3.5" /></>
                        )}
                      </button>
                    </div>

                    {/* Extraction Details Showcase Cards */}
                    {extractedInfo && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-[#0F0F14] border border-gray-800 rounded-2xl p-5 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center shadow-2xl relative overflow-hidden"
                      >
                        {/* Background light rays */}
                        <div className="absolute top-0 right-0 w-[150px] h-[150px] rounded-full bg-gradient-to-tr from-[#00C2FF]/5 to-transparent blur-3xl" />

                        {/* Thumbnail details */}
                        <div className="md:col-span-4 flex flex-col items-center">
                          <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-gray-800 bg-black/60 shadow-md">
                            <img
                              src={extractedInfo.thumbnail}
                              alt={extractedInfo.title}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/10" />
                          </div>
                          <span className="mt-3 text-xs font-mono font-medium text-gray-400 break-all w-full text-center truncate">
                            {extractedInfo.title}
                          </span>
                        </div>

                        {/* Formatting Quality Selectors */}
                        <div className="md:col-span-8 space-y-3">
                          <label className="text-[10px] font-mono text-gray-400 block uppercase tracking-widest">
                            STEP 2 // CHOOSE DIRECT VIDEO RESOLUTION
                          </label>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {extractedInfo.formats.map((f, idx) => (
                              <div
                                key={idx}
                                className="bg-black/40 border border-gray-800 rounded-xl p-3.5 flex items-center justify-between gap-4 justify-between hover:border-gray-750 transition"
                              >
                                <div>
                                  <span className="block font-bold text-xs text-white">{f.resolution}</span>
                                  <span className="block text-[10px] text-gray-500 font-mono mt-0.5">{f.format} // {f.size}</span>
                                </div>
                                
                                <button
                                  onClick={() => handleSubmitDownload(f.resolution)}
                                  className="px-3.5 py-2 bg-[#00C2FF]/10 text-[#00C2FF] border border-[#00C2FF]/30 hover:bg-[#00C2FF] hover:text-black hover:border-transparent rounded-lg text-2xs font-bold font-mono transition uppercase flex items-center gap-1 cursor-pointer"
                                >
                                  ADD DOWNLOAD
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                      </motion.div>
                    )}

                  </div>
                )}

                {/* III. ACTIVE VIEW: HISTORY ARCHIVES VIEW */}
                {activeTab === 'storage' && (
                  <HistoryListView
                    jobs={jobs}
                    downloads={downloads}
                    onSelectJob={(j) => { setSelectedJob(j); setActiveTab('clipper'); }}
                    onRefresh={fetchHistory}
                    onClearAll={handleClearDatabase}
                  />
                )}

              </motion.div>
            )}

          </AnimatePresence>
        </main>
      </div>

      {/* Cloud Export rendering overlay */}
      <AnimatePresence>
        {isExporting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#0B0B0F]/95 z-50 flex items-center justify-center p-6"
          >
            <div className="bg-[#0F0F14] border border-gray-800 rounded-2xl p-6 sm:p-8 max-w-md w-full text-center space-y-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#7B61FF]/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="relative inline-flex items-center justify-center mb-2">
                <div className="w-16 h-16 rounded-full border-4 border-t-transparent border-[#7B61FF] animate-spin" />
                <Scissors className="w-6 h-6 text-[#00C2FF] absolute animate-bounce" />
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-mono tracking-widest text-[#00C2FF] uppercase block">
                  ASYNCHRONOUS EXPORT ACTIVE
                </span>
                <h3 className="text-lg font-bold">Rendering HD Clip Stream</h3>
                <p className="text-xs text-gray-400 select-all leading-normal">
                  Burning animated subtitle tokens onto 9:16 canvas masks. Exporting H264 MP4 1080p @30fps.
                </p>
              </div>

              {/* Step indicator slider simulation */}
              <div className="bg-black/40 border border-gray-850 p-3.5 rounded-xl font-mono text-[10px] text-gray-500 space-y-1">
                <div className="text-left py-0.5 flex justify-between">
                  <span>► [PIXEL CROP] 9:16 Re-centering</span><span className="text-emerald-400">DONE</span>
                </div>
                <div className="text-left py-0.5 flex justify-between">
                  <span>► [BURN CAPTION] Space Grotesk Outline</span><span className="text-emerald-400 animate-pulse">PROCESSING...</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Export finished details dialog */}
      <AnimatePresence>
        {exportedUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6"
          >
            <div className="bg-[#0F0F14] border border-gray-800 rounded-2xl p-6 sm:p-8 max-w-sm w-full text-center space-y-6 shadow-2xl relative">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                <Check className="w-6 h-6 stroke-[3]" />
              </div>

              <div className="space-y-1.5">
                <h4 className="font-bold text-lg">Clip Export Complete!</h4>
                <p className="text-xs text-gray-400 leading-normal">
                  Your vertical video is rendered and successfully cached in cloud CDN storage. Ready for download.
                </p>
              </div>

              <div className="space-y-3">
                <a
                  href={exportedUrl}
                  download="ClipPilotAI_Viral_Reel.mp4"
                  className="w-full inline-flex items-center justify-center font-bold text-sm bg-gradient-to-r from-emerald-500 to-teal-400 text-black py-3 rounded-xl hover:opacity-95 transition shadow-lg cursor-pointer"
                >
                  DOWNLOAD TO HOME DISK <ExternalLink className="w-4 h-4 ml-2" />
                </a>

                <button
                  onClick={() => setExportedUrl(null)}
                  className="w-full text-xs font-semibold text-gray-500 hover:text-white py-1.5 transition cursor-pointer"
                >
                  DISMISS VIEWPORT
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Disclaimer & Compliance banner */}
      <footer className="z-10 bg-black/50 py-6 border-t border-gray-900 border-b border-gray-950 px-4">
        <DisclaimerBanner />
        <div className="text-center text-[10px] text-gray-600 font-mono tracking-wider mt-5">
          CLIPPILOT TECHNOLOGIES INC. NO USER MEMBERSHIP REQUIRED. CLOUD SANITY VERIFIED.
        </div>
      </footer>

    </div>
  );
}
