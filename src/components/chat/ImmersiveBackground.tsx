import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface ImmersiveBackgroundProps {
  enabled: boolean;
  imageUrl: string | null;
  isGenerating: boolean;
  className?: string;
}

export function ImmersiveBackground({ 
  enabled, 
  imageUrl, 
  isGenerating,
  className 
}: ImmersiveBackgroundProps) {
  if (!enabled) return null;

  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      {/* Background image with fade transition */}
      <AnimatePresence mode="wait">
        {imageUrl && (
          <motion.div
            key={imageUrl}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <img
              src={imageUrl}
              alt=""
              className="w-full h-full object-cover"
            />
            {/* Overlay gradient for readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background/80" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading state */}
      <AnimatePresence>
        {isGenerating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm"
          >
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <p className="text-sm text-muted-foreground">Génération de l'ambiance...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Default gradient when no image */}
      {!imageUrl && !isGenerating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5"
        />
      )}
    </div>
  );
}