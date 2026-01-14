import { useState, useRef } from "react";
import { Send, Mic, MicOff, Square } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onSendVoice?: (blob: Blob) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function ChatInput({
  onSendMessage,
  onSendVoice,
  placeholder = "Tapez votre message...",
  disabled = false,
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    timerRef.current = setInterval(() => {
      setRecordingTime((prev) => prev + 1);
    }, 1000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    // In a real app, you'd process the recording here
    if (onSendVoice) {
      // Placeholder for voice data
      onSendVoice(new Blob());
    }
    setRecordingTime(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="bg-card border-t border-border px-4 py-3">
      <div className="max-w-3xl mx-auto">
        <AnimatePresence mode="wait">
          {isRecording ? (
            <motion.div
              key="recording"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex items-center gap-4 bg-destructive/10 rounded-2xl px-4 py-3"
            >
              {/* Recording indicator */}
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-destructive animate-pulse" />
                <span className="text-sm font-medium text-destructive">
                  Enregistrement
                </span>
              </div>

              {/* Timer */}
              <span className="text-sm font-mono text-foreground flex-1">
                {formatTime(recordingTime)}
              </span>

              {/* Cancel button */}
              <button
                onClick={() => {
                  setIsRecording(false);
                  if (timerRef.current) {
                    clearInterval(timerRef.current);
                  }
                  setRecordingTime(0);
                }}
                className="w-10 h-10 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
              >
                <MicOff className="w-5 h-5 text-muted-foreground" />
              </button>

              {/* Stop and send button */}
              <button
                onClick={stopRecording}
                className="w-10 h-10 rounded-full bg-destructive hover:bg-destructive/90 flex items-center justify-center transition-colors"
              >
                <Square className="w-4 h-4 text-destructive-foreground fill-current" />
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="input"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex items-center gap-2"
            >
              {/* Text input */}
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={placeholder}
                  disabled={disabled}
                  className={cn(
                    "w-full bg-muted rounded-2xl px-4 py-3 text-sm",
                    "placeholder:text-muted-foreground",
                    "focus:outline-none focus:ring-2 focus:ring-primary/20",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    "transition-all duration-200"
                  )}
                />
              </div>

              {/* Voice record button */}
              <motion.button
                onClick={startRecording}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={disabled}
                className={cn(
                  "w-11 h-11 rounded-full flex items-center justify-center transition-colors",
                  "bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                <Mic className="w-5 h-5" />
              </motion.button>

              {/* Send button */}
              <motion.button
                onClick={handleSend}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={disabled || !message.trim()}
                className={cn(
                  "w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200",
                  message.trim()
                    ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                    : "bg-muted text-muted-foreground",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                <Send className="w-5 h-5" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
