import { AlertTriangle, ShieldAlert } from "lucide-react";

export default function DisclaimerBanner() {
  return (
    <div className="bg-red-500/5 border border-red-500/25 rounded-2xl p-4 sm:p-5 flex gap-4 max-w-4xl mx-auto text-left backdrop-blur-sm shadow-xl mt-6 relative overflow-hidden">
      {/* Aesthetic warning gradient bar */}
      <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-gradient-to-b from-rose-500 to-red-600" />
      
      <div className="flex-none text-rose-500 self-start mt-0.5">
        <ShieldAlert className="w-6 h-6 animate-pulse" />
      </div>

      <div className="space-y-1">
        <h4 className="text-xs font-mono font-bold tracking-widest text-[#FF1493] uppercase">
          IMPORTANT LEGAL NOTICE & LICENSING COMPLIANCE
        </h4>
        <p className="text-xs text-gray-400 font-medium leading-relaxed">
          Users are responsible for ensuring they have the rights to download, edit, and repost content from third-party platforms. ClipPilot AI operates as a creative automation sandbox for educational purposes. We do not host, store, or license media files beyond temporary computational cache. Always credit the original creator when sharing viral clip reframes.
        </p>
      </div>
    </div>
  );
}
