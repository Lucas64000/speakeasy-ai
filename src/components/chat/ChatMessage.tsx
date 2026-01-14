import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2 } from "lucide-react";
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
}: ChatMessageProps) {
  const [showFeedback, setShowFeedback] = useState(false);

  const formatTime = (date: Date) => {
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

          {/* Audio playback button for assistant messages */}
          {!isUser && hasAudioPlayback && (
            <button className="mt-2 flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors">
              <Volume2 className="w-3.5 h-3.5" />
              <span>Écouter</span>
            </button>
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
          {formatTime(timestamp)}
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
