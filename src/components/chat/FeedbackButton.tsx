import { useState } from "react";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FeedbackButtonProps {
  onClick?: () => void;
  hasErrors?: boolean;
  className?: string;
}

export function FeedbackButton({
  onClick,
  hasErrors = false,
  className,
}: FeedbackButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      onClick={onClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors duration-200",
        hasErrors
          ? "bg-warning/15 text-warning hover:bg-warning/25"
          : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground",
        className
      )}
    >
      <Sparkles
        className={cn(
          "w-3.5 h-3.5 transition-all duration-200",
          isHovered && "rotate-12"
        )}
      />
      <span>Feedback</span>
      {hasErrors && (
        <span className="w-1.5 h-1.5 rounded-full bg-warning animate-pulse-soft" />
      )}
    </motion.button>
  );
}
