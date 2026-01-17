import { motion } from "framer-motion";
import { Brain, Mic, Volume2, Settings2, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ModelConfig } from "@/components/conversation/ModelSelector";

interface ModelConfigPopoverProps {
  config: ModelConfig;
  onChange: (config: ModelConfig) => void;
  className?: string;
}

const textModels = [
  { value: "gemini-flash", label: "Gemini Flash", speed: "Rapide", icon: "⚡" },
  { value: "gemini-pro", label: "Gemini Pro", speed: "Pro", icon: "🔮" },
  { value: "gpt-5-mini", label: "GPT-5 Mini", speed: "Rapide", icon: "⚡" },
  { value: "gpt-5", label: "GPT-5", speed: "Pro", icon: "🔮" },
];

const sttModels = [
  { value: "whisper-v3", label: "Whisper v3", speed: "Standard" },
  { value: "scribe-realtime", label: "Scribe Realtime", speed: "Temps réel" },
];

const ttsModels = [
  { value: "elevenlabs-turbo", label: "ElevenLabs Turbo", speed: "Rapide" },
  { value: "elevenlabs-v2", label: "ElevenLabs v2", speed: "HD" },
  { value: "openai-tts", label: "OpenAI TTS", speed: "Standard" },
];

export function ModelConfigPopover({ config, onChange, className }: ModelConfigPopoverProps) {
  const currentTextModel = textModels.find((m) => m.value === config.textModel);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "gap-2 h-8 px-3 bg-background/50 border-border/50 hover:bg-muted",
            className
          )}
        >
          <Settings2 className="w-3.5 h-3.5" />
          <span className="text-xs font-medium">{currentTextModel?.label || "Modèles"}</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">
            {currentTextModel?.speed}
          </span>
        </Button>
      </PopoverTrigger>
      
      <PopoverContent 
        align="end" 
        className="w-80 p-0 overflow-hidden"
        sideOffset={8}
      >
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
        >
          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-primary/5 to-accent/5 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Zap className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Configuration IA</h3>
                <p className="text-xs text-muted-foreground">Ajustez les modèles pour cette session</p>
              </div>
            </div>
          </div>

          {/* Models */}
          <div className="p-4 space-y-4">
            {/* Text model */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <Brain className="w-3.5 h-3.5" />
                Modèle texte
              </label>
              <Select 
                value={config.textModel} 
                onValueChange={(v) => onChange({ ...config, textModel: v })}
              >
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {textModels.map((model) => (
                    <SelectItem key={model.value} value={model.value}>
                      <div className="flex items-center justify-between w-full gap-4">
                        <span className="flex items-center gap-2">
                          <span>{model.icon}</span>
                          <span>{model.label}</span>
                        </span>
                        <span className="text-[10px] text-muted-foreground px-1.5 py-0.5 rounded bg-muted">
                          {model.speed}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* STT model */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <Mic className="w-3.5 h-3.5" />
                Reconnaissance vocale
              </label>
              <Select 
                value={config.sttModel} 
                onValueChange={(v) => onChange({ ...config, sttModel: v })}
              >
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sttModels.map((model) => (
                    <SelectItem key={model.value} value={model.value}>
                      <div className="flex items-center justify-between w-full gap-4">
                        <span>{model.label}</span>
                        <span className="text-[10px] text-muted-foreground px-1.5 py-0.5 rounded bg-muted">
                          {model.speed}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* TTS model */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <Volume2 className="w-3.5 h-3.5" />
                Synthèse vocale
              </label>
              <Select 
                value={config.ttsModel} 
                onValueChange={(v) => onChange({ ...config, ttsModel: v })}
              >
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ttsModels.map((model) => (
                    <SelectItem key={model.value} value={model.value}>
                      <div className="flex items-center justify-between w-full gap-4">
                        <span>{model.label}</span>
                        <span className="text-[10px] text-muted-foreground px-1.5 py-0.5 rounded bg-muted">
                          {model.speed}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Footer tip */}
          <div className="px-4 py-2.5 bg-muted/30 border-t border-border">
            <p className="text-[11px] text-muted-foreground">
              💡 Les modèles "Pro" offrent de meilleures corrections mais sont plus lents
            </p>
          </div>
        </motion.div>
      </PopoverContent>
    </Popover>
  );
}
