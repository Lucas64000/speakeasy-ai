import { motion } from "framer-motion";
import { X, AlertCircle, CheckCircle, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeedbackItem {
  type: "error" | "correction" | "suggestion";
  original?: string;
  correction?: string;
  explanation: string;
}

interface FeedbackPanelProps {
  isOpen: boolean;
  onClose: () => void;
  feedback: FeedbackItem[];
  originalMessage: string;
  className?: string;
}

export function FeedbackPanel({
  isOpen,
  onClose,
  feedback,
  originalMessage,
  className,
}: FeedbackPanelProps) {
  if (!isOpen) return null;

  const getIcon = (type: FeedbackItem["type"]) => {
    switch (type) {
      case "error":
        return <AlertCircle className="w-4 h-4 text-destructive" />;
      case "correction":
        return <CheckCircle className="w-4 h-4 text-success" />;
      case "suggestion":
        return <Lightbulb className="w-4 h-4 text-accent" />;
    }
  };

  const getLabel = (type: FeedbackItem["type"]) => {
    switch (type) {
      case "error":
        return "Erreur";
      case "correction":
        return "Correction";
      case "suggestion":
        return "Suggestion";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "bg-feedback-bg border border-feedback-border rounded-2xl p-4 max-w-md shadow-card-lg",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-display font-semibold text-foreground">
          Analyse de votre message
        </h4>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Original message */}
      <div className="mb-4 p-3 bg-background rounded-xl">
        <p className="text-sm text-muted-foreground mb-1">Votre message :</p>
        <p className="text-sm font-medium text-foreground">{originalMessage}</p>
      </div>

      {/* Feedback items */}
      <div className="space-y-3">
        {feedback.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-background rounded-xl p-3"
          >
            <div className="flex items-center gap-2 mb-2">
              {getIcon(item.type)}
              <span
                className={cn(
                  "text-xs font-semibold uppercase tracking-wide",
                  item.type === "error" && "text-destructive",
                  item.type === "correction" && "text-success",
                  item.type === "suggestion" && "text-accent"
                )}
              >
                {getLabel(item.type)}
              </span>
            </div>

            {item.original && item.correction && (
              <div className="flex items-center gap-2 mb-2 text-sm">
                <span className="line-through text-muted-foreground">
                  {item.original}
                </span>
                <span className="text-muted-foreground">→</span>
                <span className="font-medium text-success">{item.correction}</span>
              </div>
            )}

            <p className="text-sm text-muted-foreground leading-relaxed">
              {item.explanation}
            </p>
          </motion.div>
        ))}
      </div>

      {feedback.length === 0 && (
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <CheckCircle className="w-10 h-10 text-success mb-2" />
          <p className="font-medium text-foreground">Excellent travail !</p>
          <p className="text-sm text-muted-foreground">
            Aucune erreur détectée dans ce message.
          </p>
        </div>
      )}
    </motion.div>
  );
}
