import { Trash2, Film, Download, CheckCircle, ExternalLink, Calendar, ServerCrash } from "lucide-react";
import { VideoJob, DownloadJob } from "../types";

interface HistoryListViewProps {
  jobs: VideoJob[];
  downloads: DownloadJob[];
  onSelectJob: (job: VideoJob) => void;
  onRefresh: () => void;
  onClearAll: () => void;
}

export default function HistoryListView({ 
  jobs, 
  downloads, 
  onSelectJob, 
  onRefresh,
  onClearAll 
}: HistoryListViewProps) {

  const activeJobs = jobs.filter(j => j.status === 'completed');
  const activeDownloads = downloads.filter(d => d.status === 'completed');

  return (
    <div className="space-y-8 text-white">
      
      {/* Upper header action board */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white/5 border border-gray-800 rounded-2xl p-5 mb-2">
        <div>
          <h3 className="text-lg font-bold">Storage & Creation Archives</h3>
          <p className="text-xs text-gray-400 mt-1">
            Access previous transcripts, cropped highlights, and direct downloaded media saved in the cloud.
          </p>
        </div>
        
        {/* Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={onRefresh}
            className="px-4 py-2 bg-black/40 border border-gray-800 rounded-xl hover:border-gray-700 hover:bg-black/80 transition text-xs font-semibold font-mono cursor-pointer"
          >
            REFRESH FILES
          </button>
          
          {(jobs.length > 0 || downloads.length > 0) && (
            <button
              onClick={onClearAll}
              className="px-4 py-2 bg-red-950/20 border border-red-900/40 text-red-400 rounded-xl hover:bg-red-900/30 transition text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" /> CLEAR STORAGE
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* 1. SECT I: AI VIRAL CLIPS HISTORY */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
            <Film className="w-5 h-5 text-[#7B61FF]" />
            <h4 className="font-bold text-sm uppercase tracking-wider text-gray-300">Previous AI Clipping Jobs ({activeJobs.length})</h4>
          </div>

          {activeJobs.length === 0 ? (
            <div className="bg-black/20 border border-dashed border-gray-800 rounded-xl p-8 text-center text-sm text-gray-500">
              <ServerCrash className="w-8 h-8 text-gray-600 mx-auto mb-2" />
              <span>No finished video clips found. Your works appear here once processed.</span>
            </div>
          ) : (
            <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
              {activeJobs.map((job) => (
                <div
                  key={job.id}
                  onClick={() => onSelectJob(job)}
                  className="bg-[#0F0F14] border border-gray-800/80 rounded-xl p-4 flex gap-4 hover:border-gray-700/80 transition cursor-pointer group"
                >
                  <div className="relative w-20 h-24 rounded-lg overflow-hidden bg-black/50 border border-gray-800 flex-none self-center">
                    <img
                      src={job.thumbnail}
                      alt={job.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-black/20" />
                    <span className="absolute bottom-1 right-1 bg-black/80 text-[9px] font-mono px-1 rounded-sm text-gray-300">
                      {job.durationString}
                    </span>
                  </div>

                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <h5 className="font-bold text-xs text-white truncate group-hover:text-[#7B61FF] transition">
                        {job.title}
                      </h5>
                      <span className="text-[10px] text-gray-500 block break-all font-mono mt-1 w-full truncate">
                        {job.url}
                      </span>
                    </div>

                    <div className="flex items-end justify-between mt-2 pt-2 border-t border-gray-800/50">
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Ready • {job.clips.length} Clips
                      </span>
                      
                      <span className="text-[10px] text-gray-500 font-mono flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {new Date(job.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 2. SECT II: DIRECT RESOLUTION DOWNLOADS HISTORY */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
            <Download className="w-5 h-5 text-[#00C2FF]" />
            <h4 className="font-bold text-sm uppercase tracking-wider text-gray-300">Previous Direct Downloads ({activeDownloads.length})</h4>
          </div>

          {activeDownloads.length === 0 ? (
            <div className="bg-black/20 border border-dashed border-gray-800 rounded-xl p-8 text-center text-sm text-gray-500">
              <ServerCrash className="w-8 h-8 text-gray-600 mx-auto mb-2" />
              <span>No completed raw video downloads. Submit links to download HD media.</span>
            </div>
          ) : (
            <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
              {activeDownloads.map((dl) => (
                <div
                  key={dl.id}
                  className="bg-[#0F0F14] border border-gray-800/80 rounded-xl p-4 flex gap-4 hover:border-gray-700/80 transition group"
                >
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-black/50 border border-gray-800 flex-none self-center">
                    <img
                      src={dl.thumbnail}
                      alt={dl.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-black/20" />
                  </div>

                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <h5 className="font-bold text-xs text-white truncate">
                        {dl.title}
                      </h5>
                      <span className="text-[10px] text-gray-400 block font-mono mt-1">
                        Format: <strong className="text-white">{dl.format} ({dl.resolution})</strong>
                      </span>
                      <span className="text-[10px] text-gray-500 block font-mono mt-0.5">
                        File Size: <strong className="text-white">{dl.size}</strong>
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-800/50">
                      <span className="text-[10px] text-gray-500 font-mono">
                        {new Date(dl.createdAt).toLocaleDateString()}
                      </span>

                      {dl.downloadUrl && (
                        <a
                          href={dl.downloadUrl}
                          download
                          className="px-2.5 py-1 bg-[#00C2FF]/10 text-[#00C2FF] border border-[#00C2FF]/20 rounded-lg text-[10px] font-bold flex items-center gap-1 hover:bg-[#00C2FF]/20 transition"
                        >
                          DOWNLOAD TO DISK <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
