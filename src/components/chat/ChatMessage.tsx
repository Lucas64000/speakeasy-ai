import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, Pause } from "lucide-react";
import { cn } from "@/lib/utils";
import { VoiceMessage } from "./VoiceMessage";
import { FeedbackButton } from "./FeedbackButton";
import { FeedbackPanel } from "./FeedbackPanel";

export type MessageType = "text" | "voice";

interface FeedbackItem {
  type: "error" | "correction" | "suggestion";
  original?: string;
  correction?: string;
  explanation: string;
}

interface ChatMessageProps {
  id: string;
  type: MessageType;
  content: string;
  isUser: boolean;
  timestamp: Date;
  // Voice message specific
  audioUrl?: string;
  audioDuration?: number;
  transcript?: string;
  // Feedback
  hasFeedback?: boolean;
  feedbackItems?: FeedbackItem[];
  hasErrors?: boolean;
  // Audio playback for assistant text messages
  hasAudioPlayback?: boolean;
  audioPlaybackUrl?: string;
}

export function ChatMessage({
  type,
  content,
  isUser,
  timestamp,
  audioUrl,
  audioDuration = 0,
  transcript,
  hasFeedback = false,
  feedbackItems = [],
  hasErrors = false,
  hasAudioPlayback = false,
  audioPlaybackUrl,
}: ChatMessageProps) {
  const [showFeedback, setShowFeedback] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioDurationState, setAudioDurationState] = useState(0);
  const [currentAudioTime, setCurrentAudioTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      setCurrentAudioTime(audio.currentTime);
      setAudioProgress((audio.currentTime / audio.duration) * 100);
    };
    const handleEnded = () => {
      setIsPlayingAudio(false);
      setAudioProgress(0);
      setCurrentAudioTime(0);
    };
    const handleLoadedMetadata = () => {
      setAudioDurationState(audio.duration);
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, []);

  const toggleAudioPlayback = () => {
    const audio = audioRef.current;

    // If no actual audio URL, simulate playback
    if (!audioPlaybackUrl) {
      const simulatedDuration = 5; // 5 seconds simulation
      if (isPlayingAudio) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        setIsPlayingAudio(false);
      } else {
        setIsPlayingAudio(true);
        setAudioDurationState(simulatedDuration);
        intervalRef.current = setInterval(() => {
          setCurrentAudioTime((prev) => {
            const newTime = prev + 0.1;
            if (newTime >= simulatedDuration) {
              if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
              }
              setIsPlayingAudio(false);
              setAudioProgress(0);
              return 0;
            }
            setAudioProgress((newTime / simulatedDuration) * 100);
            return newTime;
          });
        }, 100);
      }
      return;
    }

    if (!audio) return;

    if (isPlayingAudio) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlayingAudio(!isPlayingAudio);
  };

  const formatAudioTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatMessageTime = (date: Date) => {
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex flex-col gap-1",
        isUser ? "items-end" : "items-start"
      )}
    >
      {/* Message content */}
      {type === "voice" && transcript ? (
        <VoiceMessage
          audioUrl={audioUrl}
          duration={audioDuration}
          transcript={transcript}
          isUser={isUser}
        />
      ) : (
        <div
          className={cn(
            "max-w-[320px] px-4 py-3 rounded-2xl",
            isUser
              ? "bg-user-bubble text-user-bubble-foreground rounded-br-md"
              : "bg-assistant-bubble text-assistant-bubble-foreground rounded-bl-md shadow-card"
          )}
        >
          <p className="text-sm leading-relaxed">{content}</p>

          {/* Audio playback for assistant messages */}
          {!isUser && hasAudioPlayback && (
            <div className="mt-3 pt-2 border-t border-border/30">
              {/* Hidden audio element */}
              {audioPlaybackUrl && (
                <audio ref={audioRef} src={audioPlaybackUrl} preload="metadata" />
              )}
              
              <div className="flex items-center gap-2">
                {/* Play/Pause button */}
                <button
                  onClick={toggleAudioPlayback}
                  className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
                >
                  {isPlayingAudio ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>

                {/* Progress bar */}
                <div className="flex-1 flex flex-col gap-1">
                  <div className="relative h-1 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      className="absolute left-0 top-0 h-full rounded-full bg-primary"
                      style={{ width: `${audioProgress}%` }}
                      transition={{ duration: 0.1 }}
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    {formatAudioTime(currentAudioTime)} / {formatAudioTime(audioDurationState || 5)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Timestamp and feedback */}
      <div
        className={cn(
          "flex items-center gap-2 px-1",
          isUser ? "flex-row-reverse" : "flex-row"
        )}
      >
        <span className="text-xs text-muted-foreground">
          {formatMessageTime(timestamp)}
        </span>

        {/* Feedback button - only for user messages */}
        {isUser && hasFeedback && (
          <FeedbackButton
            onClick={() => setShowFeedback(!showFeedback)}
            hasErrors={hasErrors}
          />
        )}
      </div>

      {/* Feedback panel */}
      <AnimatePresence>
        {showFeedback && (
          <FeedbackPanel
            isOpen={showFeedback}
            onClose={() => setShowFeedback(false)}
            feedback={feedbackItems}
            originalMessage={type === "voice" && transcript ? transcript : content}
            className={cn("mt-2", isUser ? "mr-2" : "ml-2")}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
