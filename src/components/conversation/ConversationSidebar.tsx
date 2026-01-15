import { motion } from "framer-motion";
import { 
  MessageSquare, 
  Mic, 
  Clock, 
  CheckCircle2, 
  Lightbulb,
  Brain,
  Volume2,
  Zap,
  TrendingUp
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
  duration: number;
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
  { value: "gemini-flash", label: "Gemini Flash", speed: "Rapide" },
  { value: "gemini-pro", label: "Gemini Pro", speed: "Pro" },
  { value: "gpt-5-mini", label: "GPT-5 Mini", speed: "Rapide" },
  { value: "gpt-5", label: "GPT-5", speed: "Pro" },
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

export function ConversationSidebar({
  conversationInfo,
  stats,
  modelConfig,
  onModelChange,
  className,
}: ConversationSidebarProps) {
  const progressPercent = Math.min((stats.messagesCount / 10) * 100, 100);
  
  return (
    <motion.aside
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className={cn(
        "w-80 bg-gradient-to-b from-card to-background border-l border-border h-full overflow-y-auto",
        className
      )}
    >
      <div className="p-5 space-y-6">
        {/* Context header - Compact and elegant */}
        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl border border-primary/10">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-2xl shadow-sm">
            {conversationInfo.languageFlag}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-foreground truncate">{conversationInfo.language}</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <span>{conversationInfo.coachToneIcon}</span>
              Coach {conversationInfo.coachTone}
            </p>
          </div>
        </div>

        {/* Session Progress */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              Progression
            </h3>
            <span className="text-xs font-medium text-primary">{stats.duration}min</span>
          </div>
          
          {/* Progress bar */}
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
            />
          </div>
          
          {/* Stats grid - More compact */}
          <div className="grid grid-cols-4 gap-2">
            <StatPill
              icon={<MessageSquare className="w-3.5 h-3.5" />}
              value={stats.messagesCount}
              color="primary"
            />
            <StatPill
              icon={<Mic className="w-3.5 h-3.5" />}
              value={stats.voiceMessagesCount}
              color="accent"
            />
            <StatPill
              icon={<CheckCircle2 className="w-3.5 h-3.5" />}
              value={stats.correctionsCount}
              color={stats.correctionsCount > 0 ? "warning" : "success"}
            />
            <StatPill
              icon={<Lightbulb className="w-3.5 h-3.5" />}
              value={stats.suggestionsCount}
              color="muted"
            />
          </div>
        </div>

        {/* Model Selection - Sleek cards */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" />
            Configuration IA
          </h3>
          
          <div className="space-y-2">
            <ModelCard
              icon={<Brain className="w-4 h-4" />}
              label="Modèle texte"
              value={modelConfig.textModel}
              options={textModels}
              onChange={(v) => onModelChange({ ...modelConfig, textModel: v })}
            />
            <ModelCard
              icon={<Mic className="w-4 h-4" />}
              label="Reconnaissance vocale"
              value={modelConfig.sttModel}
              options={sttModels}
              onChange={(v) => onModelChange({ ...modelConfig, sttModel: v })}
            />
            <ModelCard
              icon={<Volume2 className="w-4 h-4" />}
              label="Synthèse vocale"
              value={modelConfig.ttsModel}
              options={ttsModels}
              onChange={(v) => onModelChange({ ...modelConfig, ttsModel: v })}
            />
          </div>
        </div>

        {/* Tips - Inline and subtle */}
        <div className="p-3 bg-muted/30 rounded-xl border border-border/50">
          <p className="text-xs text-muted-foreground leading-relaxed">
            💡 <span className="font-medium text-foreground/80">Astuce :</span> Clique sur "Feedback" sous tes messages pour voir les corrections détaillées.
          </p>
        </div>
      </div>
    </motion.aside>
  );
}

function StatPill({
  icon,
  value,
  color,
}: {
  icon: React.ReactNode;
  value: number | string;
  color: "primary" | "accent" | "muted" | "warning" | "success";
}) {
  const colorClasses = {
    primary: "bg-primary/10 text-primary border-primary/20",
    accent: "bg-accent/10 text-accent border-accent/20",
    muted: "bg-muted text-muted-foreground border-border",
    warning: "bg-warning/10 text-warning border-warning/20",
    success: "bg-success/10 text-success border-success/20",
  };

  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-2 rounded-xl border",
      colorClasses[color]
    )}>
      {icon}
      <span className="text-sm font-bold mt-1">{value}</span>
    </div>
  );
}

function ModelCard({
  icon,
  label,
  value,
  options,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  options: { value: string; label: string; speed: string }[];
  onChange: (value: string) => void;
}) {
  const selectedOption = options.find(o => o.value === value);
  
  return (
    <div className="group p-3 bg-muted/30 hover:bg-muted/50 rounded-xl border border-border/50 hover:border-border transition-all">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-6 rounded-lg bg-background flex items-center justify-center text-muted-foreground group-hover:text-foreground transition-colors">
          {icon}
        </div>
        <span className="text-xs text-muted-foreground">{label}</span>
        {selectedOption && (
          <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
            {selectedOption.speed}
          </span>
        )}
      </div>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-8 text-xs bg-background border-border/50">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value} className="text-xs">
              <div className="flex items-center justify-between w-full gap-3">
                <span>{opt.label}</span>
                <span className="text-[10px] text-muted-foreground">{opt.speed}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
