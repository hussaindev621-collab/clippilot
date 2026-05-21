export interface TranscriptSegment {
  text: string;
  start: number; // in seconds
  duration: number; // in seconds
  words?: Array<{ word: string; start: number; end: number }>;
}

export interface Clip {
  id: string;
  title: string;
  start: number;
  end: number;
  duration: number;
  score: number; // 0-100 viral score
  explanation: string;
  hookDescription: string;
  speakerPosition: { x: number; y: number; width: number; height: number }; // Bounding box coordinates for reframing
  transcript: TranscriptSegment[];
}

export interface VideoJob {
  id: string;
  url: string;
  title: string;
  thumbnail: string;
  durationString: string;
  status: 'processing' | 'completed' | 'failed';
  progress: number;
  progressStage: 'fetching' | 'transcribing' | 'detecting' | 'rendering' | 'completed';
  clips: Clip[];
  createdAt: string;
}

export interface DownloadOption {
  resolution: string; // 480p, 720p, 1080p, audio
  size: string;
  format: string;
  available: boolean;
}

export interface DownloadJob {
  id: string;
  url: string;
  title: string;
  thumbnail: string;
  resolution: string;
  format: string;
  size: string;
  status: 'pending' | 'downloading' | 'completed' | 'failed';
  progress: number;
  downloadUrl?: string;
  createdAt: string;
}

export interface CaptionStyle {
  font: 'Space Grotesk' | 'Inter' | 'JetBrains Mono' | 'Montserrat' | 'Impact';
  color: string; // Hex code or tailwind color
  size: number; // base size identifier (e.g., 24, 28, 32, 36)
  uppercase: boolean;
  neonGlow: boolean;
  backgroundType: 'none' | 'outline' | 'semi-black';
  positionY: number; // 0 (top) to 100 (bottom) percentage
}
