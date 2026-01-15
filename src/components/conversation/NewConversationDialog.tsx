import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MessageSquare, Globe, Mic2, Sparkles, Brain, ChevronDown, ChevronUp } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ModelSelector, ModelConfig, defaultModelConfig } from "./ModelSelector";

interface NewConversationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const languages = [
  { value: "french", label: "Français", flag: "🇫🇷" },
  { value: "english", label: "Anglais", flag: "🇬🇧" },
  { value: "spanish", label: "Espagnol", flag: "🇪🇸" },
  { value: "german", label: "Allemand", flag: "🇩🇪" },
  { value: "italian", label: "Italien", flag: "🇮🇹" },
  { value: "portuguese", label: "Portugais", flag: "🇵🇹" },
];

const coachTones = [
  { 
    value: "friendly", 
    label: "Amical", 
    description: "Détendu et encourageant",
    icon: "😊"
  },
  { 
    value: "formal", 
    label: "Formel", 
    description: "Professionnel et structuré",
    icon: "👔"
  },
  { 
    value: "encouraging", 
    label: "Encourageant", 
    description: "Motivant et positif",
    icon: "🌟"
  },
  { 
    value: "strict", 
    label: "Strict", 
    description: "Exigeant et précis",
    icon: "📏"
  },
];

const contextSuggestions = [
  "Conversation au restaurant",
  "Entretien d'embauche",
  "Réservation d'hôtel",
  "Demander son chemin",
  "Shopping et achats",
  "Rendez-vous médical",
];

export function NewConversationDialog({ open, onOpenChange }: NewConversationDialogProps) {
  const navigate = useNavigate();
  const [language, setLanguage] = useState("french");
  const [coachTone, setCoachTone] = useState("friendly");
  const [context, setContext] = useState("");
  const [enableAudio, setEnableAudio] = useState(true);
  const [modelConfig, setModelConfig] = useState<ModelConfig>(defaultModelConfig);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleStart = () => {
    // Dans une vraie app, on enverrait ces données au backend
    console.log({ language, coachTone, context, enableAudio, modelConfig });
    onOpenChange(false);
    navigate("/chat/new");
  };

  const handleSuggestionClick = (suggestion: string) => {
    setContext(suggestion);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 gap-0 overflow-hidden bg-card max-h-[90vh] overflow-y-auto">
        <DialogHeader className="p-6 pb-4 bg-gradient-to-br from-primary/10 to-primary/5">
          <DialogTitle className="font-display text-xl flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-primary" />
            </div>
            Nouvelle conversation
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {/* Language selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Globe className="w-4 h-4 text-muted-foreground" />
              Langue à pratiquer
            </label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    <span className="flex items-center gap-2">
                      <span>{lang.flag}</span>
                      <span>{lang.label}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Coach tone selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-muted-foreground" />
              Ton du coach
            </label>
            <div className="grid grid-cols-2 gap-2">
              {coachTones.map((tone) => (
                <button
                  key={tone.value}
                  onClick={() => setCoachTone(tone.value)}
                  className={cn(
                    "p-3 rounded-xl border-2 text-left transition-all",
                    coachTone === tone.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                  )}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{tone.icon}</span>
                    <span className="font-medium text-sm text-foreground">{tone.label}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{tone.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Context */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Contexte de la conversation
            </label>
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Décrivez la situation que vous souhaitez pratiquer..."
              className="w-full bg-muted rounded-xl px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none h-20"
            />
            
            {/* Suggestions */}
            <div className="flex flex-wrap gap-2">
              {contextSuggestions.slice(0, 4).map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={cn(
                    "text-xs px-3 py-1.5 rounded-full transition-colors",
                    context === suggestion
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* Audio toggle */}
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Mic2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Réponses audio</p>
                <p className="text-xs text-muted-foreground">Le coach répondra à l'oral</p>
              </div>
            </div>
            <button
              onClick={() => setEnableAudio(!enableAudio)}
              className={cn(
                "w-12 h-7 rounded-full transition-colors relative",
                enableAudio ? "bg-primary" : "bg-muted"
              )}
            >
              <motion.div
                className="w-5 h-5 bg-white rounded-full absolute top-1"
                animate={{ left: enableAudio ? 26 : 4 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
          </div>

          {/* Advanced settings - Model selection */}
          <div className="space-y-3">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors w-full"
            >
              <Brain className="w-4 h-4" />
              <span>Paramètres avancés</span>
              {showAdvanced ? (
                <ChevronUp className="w-4 h-4 ml-auto" />
              ) : (
                <ChevronDown className="w-4 h-4 ml-auto" />
              )}
            </button>
            
            {showAdvanced && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="pt-2"
              >
                <ModelSelector
                  config={modelConfig}
                  onChange={setModelConfig}
                />
              </motion.div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-0">
          <button
            onClick={handleStart}
            disabled={!context.trim()}
            className={cn(
              "w-full py-3 rounded-xl font-semibold transition-all",
              context.trim()
                ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            )}
          >
            Commencer la conversation
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
