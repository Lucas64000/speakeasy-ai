import { useState, useRef, useEffect } from "react";
import { Play, Pause, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface VoiceMessageProps {
  audioUrl?: string;
  duration: number; // in seconds
  transcript: string;
  isUser?: boolean;
  className?: string;
}

export function VoiceMessage({
  audioUrl,
  duration,
  transcript,
  isUser = false,
  className,
}: VoiceMessageProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    const progressBar = progressRef.current;
    if (!audio || !progressBar) return;

    const rect = progressBar.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    const newTime = clickPosition * duration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className={cn("flex flex-col gap-2 max-w-[280px]", className)}>
      {/* Audio element (hidden) */}
      {audioUrl && <audio ref={audioRef} src={audioUrl} preload="metadata" />}

      {/* Voice message bubble */}
      <div
        className={cn(
          "relative px-4 py-3 rounded-2xl",
          isUser
            ? "bg-user-bubble text-user-bubble-foreground rounded-br-md"
            : "bg-assistant-bubble text-assistant-bubble-foreground rounded-bl-md shadow-card"
        )}
      >
        <div className="flex items-center gap-3">
          {/* Play/Pause button */}
          <button
            onClick={togglePlay}
            className={cn(
              "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200",
              isUser
                ? "bg-white/20 hover:bg-white/30 text-white"
                : "bg-primary/10 hover:bg-primary/20 text-primary"
            )}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 ml-0.5" />
            )}
          </button>

          {/* Progress bar and timer */}
          <div className="flex-1 flex flex-col gap-1.5">
            {/* Progress bar */}
            <div
              ref={progressRef}
              onClick={handleProgressClick}
              className={cn(
                "relative h-1 rounded-full cursor-pointer overflow-hidden",
                isUser ? "bg-white/30" : "bg-audio-track"
              )}
            >
              <motion.div
                className={cn(
                  "absolute left-0 top-0 h-full rounded-full",
                  isUser ? "bg-white" : "bg-primary"
                )}
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>

            {/* Timer */}
            <div
              className={cn(
                "text-xs font-medium",
                isUser ? "text-white/70" : "text-muted-foreground"
              )}
            >
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          {/* Transcript toggle */}
          <button
            onClick={() => setShowTranscript(!showTranscript)}
            className={cn(
              "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200",
              isUser
                ? "hover:bg-white/20 text-white/80"
                : "hover:bg-primary/10 text-muted-foreground",
              showTranscript && (isUser ? "bg-white/20" : "bg-primary/10")
            )}
            title="Afficher la transcription"
          >
            <FileText className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Transcript panel */}
      <AnimatePresence>
        {showTranscript && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "overflow-hidden rounded-xl px-4 py-3 text-sm",
              isUser
                ? "bg-user-bubble/10 text-foreground ml-4"
                : "bg-muted text-foreground mr-4"
            )}
          >
            <p className="leading-relaxed">{transcript}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
