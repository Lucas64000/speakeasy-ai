import { motion } from "framer-motion";
import { 
  Globe, 
  Sparkles, 
  MessageSquare, 
  Mic, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ChevronRight,
  Brain,
  Speaker
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ModelConfig } from "./ModelSelector";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SessionStats {
  messagesCount: number;
  voiceMessagesCount: number;
  duration: number; // in minutes
  correctionsCount: number;
  suggestionsCount: number;
}

interface ConversationInfo {
  title: string;
  language: string;
  languageFlag: string;
  coachTone: string;
  coachToneIcon: string;
}

interface ConversationSidebarProps {
  conversationInfo: ConversationInfo;
  stats: SessionStats;
  modelConfig: ModelConfig;
  onModelChange: (config: ModelConfig) => void;
  className?: string;
}

const textModels = [
  { value: "gemini-flash", label: "Gemini Flash" },
  { value: "gemini-pro", label: "Gemini Pro" },
  { value: "gpt-5-mini", label: "GPT-5 Mini" },
  { value: "gpt-5", label: "GPT-5" },
];

const sttModels = [
  { value: "whisper-v3", label: "Whisper v3" },
  { value: "scribe-realtime", label: "Scribe Realtime" },
];

const ttsModels = [
  { value: "elevenlabs-turbo", label: "ElevenLabs Turbo" },
  { value: "elevenlabs-v2", label: "ElevenLabs v2" },
  { value: "openai-tts", label: "OpenAI TTS" },
];

export function ConversationSidebar({
  conversationInfo,
  stats,
  modelConfig,
  onModelChange,
  className,
}: ConversationSidebarProps) {
  return (
    <motion.aside
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className={cn(
        "w-72 bg-card border-l border-border h-full overflow-y-auto",
        className
      )}
    >
      <div className="p-4 space-y-6">
        {/* Context Info */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Contexte
          </h3>
          
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-lg">
                {conversationInfo.languageFlag}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{conversationInfo.language}</p>
                <p className="text-xs text-muted-foreground">Langue pratiquée</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-lg">
                {conversationInfo.coachToneIcon}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Coach {conversationInfo.coachTone}</p>
                <p className="text-xs text-muted-foreground">Style d'accompagnement</p>
              </div>
            </div>
          </div>
        </div>

        {/* Session Stats */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Cette session
          </h3>
          
          <div className="grid grid-cols-2 gap-2">
            <StatCard
              icon={<MessageSquare className="w-4 h-4" />}
              value={stats.messagesCount}
              label="Messages"
              color="primary"
            />
            <StatCard
              icon={<Mic className="w-4 h-4" />}
              value={stats.voiceMessagesCount}
              label="Vocaux"
              color="accent"
            />
            <StatCard
              icon={<Clock className="w-4 h-4" />}
              value={`${stats.duration}m`}
              label="Durée"
              color="muted"
            />
            <StatCard
              icon={<CheckCircle2 className="w-4 h-4" />}
              value={stats.correctionsCount}
              label="Corrections"
              color={stats.correctionsCount > 0 ? "warning" : "success"}
            />
          </div>

          {stats.suggestionsCount > 0 && (
            <div className="flex items-center gap-2 p-2 bg-accent/10 rounded-lg text-xs text-accent-foreground">
              <AlertCircle className="w-3.5 h-3.5 text-accent" />
              <span>{stats.suggestionsCount} suggestions d'amélioration</span>
            </div>
          )}
        </div>

        {/* Model Selection */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Modèles IA
          </h3>
          
          <div className="space-y-3">
            <ModelSelect
              icon={<Brain className="w-3.5 h-3.5" />}
              label="Texte"
              value={modelConfig.textModel}
              options={textModels}
              onChange={(v) => onModelChange({ ...modelConfig, textModel: v })}
            />
            <ModelSelect
              icon={<Mic className="w-3.5 h-3.5" />}
              label="STT"
              value={modelConfig.sttModel}
              options={sttModels}
              onChange={(v) => onModelChange({ ...modelConfig, sttModel: v })}
            />
            <ModelSelect
              icon={<Speaker className="w-3.5 h-3.5" />}
              label="TTS"
              value={modelConfig.ttsModel}
              options={ttsModels}
              onChange={(v) => onModelChange({ ...modelConfig, ttsModel: v })}
            />
          </div>
        </div>

        {/* Quick tips */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Astuces
          </h3>
          <div className="space-y-2 text-xs text-muted-foreground">
            <p className="flex items-start gap-2">
              <ChevronRight className="w-3 h-3 mt-0.5 text-primary flex-shrink-0" />
              Clique sur un message pour voir le feedback détaillé
            </p>
            <p className="flex items-start gap-2">
              <ChevronRight className="w-3 h-3 mt-0.5 text-primary flex-shrink-0" />
              Maintiens le micro pour enregistrer un message vocal
            </p>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}

function StatCard({
  icon,
  value,
  label,
  color,
}: {
  icon: React.ReactNode;
  value: number | string;
  label: string;
  color: "primary" | "accent" | "muted" | "warning" | "success";
}) {
  const colorClasses = {
    primary: "bg-primary/10 text-primary",
    accent: "bg-accent/10 text-accent",
    muted: "bg-muted text-muted-foreground",
    warning: "bg-warning/10 text-warning",
    success: "bg-success/10 text-success",
  };

  return (
    <div className="p-3 bg-muted/30 rounded-xl">
      <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center mb-2", colorClasses[color])}>
        {icon}
      </div>
      <p className="text-lg font-semibold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function ModelSelect({
  icon,
  label,
  value,
  options,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1.5 text-muted-foreground w-12 flex-shrink-0">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-8 text-xs flex-1">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value} className="text-xs">
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
