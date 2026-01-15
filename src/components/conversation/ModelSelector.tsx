import { Brain, Mic, Speaker } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface ModelConfig {
  textModel: string;
  sttModel: string;
  ttsModel: string;
}

interface ModelSelectorProps {
  config: ModelConfig;
  onChange: (config: ModelConfig) => void;
  compact?: boolean;
  className?: string;
}

const textModels = [
  { value: "gemini-flash", label: "Gemini Flash", description: "Rapide et équilibré" },
  { value: "gemini-pro", label: "Gemini Pro", description: "Plus précis, contexte long" },
  { value: "gpt-5-mini", label: "GPT-5 Mini", description: "Polyvalent, raisonnement" },
  { value: "gpt-5", label: "GPT-5", description: "Haute qualité, plus lent" },
];

const sttModels = [
  { value: "whisper-v3", label: "Whisper v3", description: "Standard OpenAI" },
  { value: "scribe-realtime", label: "Scribe Realtime", description: "ElevenLabs, ultra-rapide" },
];

const ttsModels = [
  { value: "elevenlabs-turbo", label: "ElevenLabs Turbo", description: "Voix naturelle, faible latence" },
  { value: "elevenlabs-v2", label: "ElevenLabs v2", description: "Qualité maximale" },
  { value: "openai-tts", label: "OpenAI TTS", description: "Standard, fiable" },
];

export function ModelSelector({ config, onChange, compact = false, className }: ModelSelectorProps) {
  if (compact) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Select value={config.textModel} onValueChange={(v) => onChange({ ...config, textModel: v })}>
          <SelectTrigger className="h-8 w-[130px] text-xs">
            <Brain className="w-3 h-3 mr-1 text-muted-foreground" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {textModels.map((m) => (
              <SelectItem key={m.value} value={m.value} className="text-xs">
                {m.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Text Model */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
          <Brain className="w-3.5 h-3.5" />
          Modèle de texte
        </label>
        <Select value={config.textModel} onValueChange={(v) => onChange({ ...config, textModel: v })}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {textModels.map((m) => (
              <SelectItem key={m.value} value={m.value}>
                <div className="flex flex-col">
                  <span className="font-medium">{m.label}</span>
                  <span className="text-xs text-muted-foreground">{m.description}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* STT Model */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
          <Mic className="w-3.5 h-3.5" />
          Speech-to-Text (ta voix)
        </label>
        <Select value={config.sttModel} onValueChange={(v) => onChange({ ...config, sttModel: v })}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sttModels.map((m) => (
              <SelectItem key={m.value} value={m.value}>
                <div className="flex flex-col">
                  <span className="font-medium">{m.label}</span>
                  <span className="text-xs text-muted-foreground">{m.description}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* TTS Model */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
          <Speaker className="w-3.5 h-3.5" />
          Text-to-Speech (voix IA)
        </label>
        <Select value={config.ttsModel} onValueChange={(v) => onChange({ ...config, ttsModel: v })}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ttsModels.map((m) => (
              <SelectItem key={m.value} value={m.value}>
                <div className="flex flex-col">
                  <span className="font-medium">{m.label}</span>
                  <span className="text-xs text-muted-foreground">{m.description}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export const defaultModelConfig: ModelConfig = {
  textModel: "gemini-flash",
  sttModel: "whisper-v3",
  ttsModel: "elevenlabs-turbo",
};
