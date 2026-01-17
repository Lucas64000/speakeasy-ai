import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  ArrowRight, 
  Lightbulb, 
  Copy, 
  Check, 
  ThumbsUp, 
  ThumbsDown,
  MessageSquare,
  Send 
} from "lucide-react";
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
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [rating, setRating] = useState<"up" | "down" | null>(null);
  const [showThanks, setShowThanks] = useState(false);
  const [showCommentField, setShowCommentField] = useState(false);
  const [comment, setComment] = useState("");
  const [commentSubmitted, setCommentSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleCopy = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleRating = (value: "up" | "down") => {
    // Si on clique sur le même bouton, on annule
    if (rating === value) {
      setRating(null);
      setShowCommentField(false);
      setShowThanks(false);
      return;
    }
    
    setRating(value);
    if (value === "down") {
      setShowCommentField(true);
    } else {
      setShowCommentField(false);
      setShowThanks(true);
      setTimeout(() => setShowThanks(false), 2000);
    }
  };

  const handleSubmitComment = () => {
    if (comment.trim()) {
      // Ici on enverrait le feedback au backend
      console.log("Feedback submitted:", { rating, comment });
      setCommentSubmitted(true);
      setTimeout(() => {
        setShowCommentField(false);
        setCommentSubmitted(false);
        setComment("");
      }, 2000);
    }
  };

  const corrections = feedback.filter(f => f.type === "correction" || f.type === "error");
  const suggestions = feedback.filter(f => f.type === "suggestion");

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn(
        "w-[340px] bg-card border border-border rounded-xl shadow-lg overflow-hidden",
        className
      )}
    >
      {/* Header compact */}
      <div className="flex items-center justify-between px-4 py-3 bg-muted/50 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center">
            <Lightbulb className="w-3.5 h-3.5 text-primary" />
          </div>
          <span className="text-sm font-semibold text-foreground">
            Analyse linguistique
          </span>
        </div>
        <button
          onClick={onClose}
          className="w-6 h-6 rounded-md hover:bg-muted flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Corrections section */}
        {corrections.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Corrections
            </p>
            {corrections.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group bg-muted/50 rounded-lg p-3 hover:bg-muted transition-colors"
              >
                {item.original && item.correction && (
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm text-destructive/80 line-through font-mono bg-destructive/10 px-1.5 py-0.5 rounded">
                      {item.original}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm text-success font-mono font-medium bg-success/10 px-1.5 py-0.5 rounded">
                        {item.correction}
                      </span>
                      <button
                        onClick={() => handleCopy(item.correction!, index)}
                        className="opacity-0 group-hover:opacity-100 w-5 h-5 rounded flex items-center justify-center hover:bg-background transition-all"
                        title="Copier"
                      >
                        {copiedIndex === index ? (
                          <Check className="w-3 h-3 text-success" />
                        ) : (
                          <Copy className="w-3 h-3 text-muted-foreground" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.explanation}
                </p>
              </motion.div>
            ))}
          </div>
        )}

        {/* Suggestions section */}
        {suggestions.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Suggestions
            </p>
            {suggestions.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (corrections.length + index) * 0.05 }}
                className="flex items-start gap-2 bg-accent/5 border border-accent/10 rounded-lg p-3"
              >
                <Lightbulb className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                <p className="text-xs text-foreground/80 leading-relaxed">
                  {item.explanation}
                </p>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {feedback.length === 0 && (
          <motion.div 
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="flex flex-col items-center justify-center py-6 text-center"
          >
            <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mb-3">
              <Check className="w-6 h-6 text-success" />
            </div>
            <p className="font-medium text-foreground text-sm">Parfait !</p>
            <p className="text-xs text-muted-foreground mt-1">
              Aucune erreur détectée
            </p>
          </motion.div>
        )}

        {/* Rating section with comment - always show */}
        <div className="pt-3 border-t border-border space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Ce feedback est-il utile ?
            </span>
            <div className="flex items-center gap-1">
              <AnimatePresence mode="wait">
                {showThanks ? (
                  <motion.span
                    key="thanks"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="text-xs text-success font-medium"
                  >
                    Merci !
                  </motion.span>
                ) : (
                  <motion.div key="buttons" className="flex items-center gap-1">
                    <button
                      onClick={() => handleRating("up")}
                      className={cn(
                        "w-7 h-7 rounded-md flex items-center justify-center transition-all",
                        rating === "up" 
                          ? "bg-success/20 text-success" 
                          : "hover:bg-muted text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleRating("down")}
                      className={cn(
                        "w-7 h-7 rounded-md flex items-center justify-center transition-all",
                        rating === "down" 
                          ? "bg-destructive/20 text-destructive" 
                          : "hover:bg-muted text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <ThumbsDown className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Comment field */}
          <AnimatePresence>
            {showCommentField && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                {commentSubmitted ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2 text-xs text-success py-2"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Merci pour ton retour !</span>
                  </motion.div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <MessageSquare className="w-3.5 h-3.5 text-muted-foreground mt-2 flex-shrink-0" />
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Qu'est-ce qui pourrait être amélioré ?"
                        className="flex-1 bg-muted rounded-lg px-3 py-2 text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none h-16"
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={handleSubmitComment}
                        disabled={!comment.trim()}
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                          comment.trim()
                            ? "bg-primary text-primary-foreground hover:bg-primary/90"
                            : "bg-muted text-muted-foreground cursor-not-allowed"
                        )}
                      >
                        <Send className="w-3 h-3" />
                        Envoyer
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
