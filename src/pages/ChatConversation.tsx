import { useState, useMemo } from "react";
import { ArrowLeft, Volume2, VolumeX, PanelRightClose, PanelRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { ConversationStatusMenu } from "@/components/conversation/ConversationStatusMenu";
import { ConversationSidebar } from "@/components/conversation/ConversationSidebar";
import { ModelConfig, defaultModelConfig } from "@/components/conversation/ModelSelector";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type ConversationStatus = "active" | "completed" | "archived";

const mockMessages = [
  {
    id: "1",
    type: "text" as const,
    content: "Bonjour ! Je suis ravi de t'aider à pratiquer le français aujourd'hui. Quel sujet aimerais-tu aborder ?",
    isUser: false,
    timestamp: new Date(Date.now() - 300000),
    hasAudioPlayback: true,
  },
  {
    id: "2",
    type: "text" as const,
    content: "Je voudrais pratiquer une conversation au restaurant, s'il te plaît.",
    isUser: true,
    timestamp: new Date(Date.now() - 240000),
    hasFeedback: true,
    hasErrors: false,
    feedbackItems: [],
  },
  {
    id: "3",
    type: "text" as const,
    content: "Excellent choix ! Imaginons que tu es dans un restaurant parisien. Je serai le serveur. Bonsoir, bienvenue au Café de Flore ! Une table pour combien de personnes ?",
    isUser: false,
    timestamp: new Date(Date.now() - 180000),
    hasAudioPlayback: true,
  },
  {
    id: "4",
    type: "voice" as const,
    content: "",
    isUser: true,
    timestamp: new Date(Date.now() - 120000),
    audioUrl: "",
    audioDuration: 8,
    transcript: "Bonsoir, une table pour deux personnes, s'il vous plaît. Est-ce que vous avez une table près de la fenêtre ?",
    hasFeedback: true,
    hasErrors: true,
    feedbackItems: [
      {
        type: "correction" as const,
        original: "Est-ce que vous avez",
        correction: "Auriez-vous",
        explanation: "Dans un contexte formel comme un restaurant, utilise le conditionnel pour être plus poli.",
      },
      {
        type: "suggestion" as const,
        explanation: "Tu peux aussi dire 'Serait-il possible d'avoir une table côté fenêtre ?' pour varier.",
      },
    ],
  },
  {
    id: "5",
    type: "text" as const,
    content: "Très bien ! J'ai une jolie table près de la fenêtre avec vue sur le boulevard. Suivez-moi, je vous prie. Voici le menu. Souhaitez-vous commencer par un apéritif ?",
    isUser: false,
    timestamp: new Date(Date.now() - 60000),
    hasAudioPlayback: true,
  },
];

const conversationInfo = {
  title: "Conversation au restaurant",
  language: "Français",
  languageFlag: "🇫🇷",
  coachTone: "Amical",
  coachToneIcon: "😊",
};

export default function ChatConversation() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState(mockMessages);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [status, setStatus] = useState<ConversationStatus>("active");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [modelConfig, setModelConfig] = useState<ModelConfig>(defaultModelConfig);

  // Compute session stats from messages
  const sessionStats = useMemo(() => {
    const voiceMessages = messages.filter(m => m.type === "voice" && m.isUser);
    const userMessages = messages.filter(m => m.isUser);
    const corrections = messages.reduce((acc, m) => {
      if ('feedbackItems' in m && m.feedbackItems) {
        return acc + m.feedbackItems.filter(f => f.type === "correction").length;
      }
      return acc;
    }, 0);
    const suggestions = messages.reduce((acc, m) => {
      if ('feedbackItems' in m && m.feedbackItems) {
        return acc + m.feedbackItems.filter(f => f.type === "suggestion").length;
      }
      return acc;
    }, 0);

    return {
      messagesCount: userMessages.length,
      voiceMessagesCount: voiceMessages.length,
      duration: 5, // Mock duration
      correctionsCount: corrections,
      suggestionsCount: suggestions,
    };
  }, [messages]);

  const handleSendMessage = (content: string) => {
    const newMessage = {
      id: Date.now().toString(),
      type: "text" as const,
      content,
      isUser: true,
      timestamp: new Date(),
      hasFeedback: true,
      hasErrors: false,
      feedbackItems: [],
    };
    setMessages([...messages, newMessage]);
  };

  const handleSendVoice = () => {
    const newMessage = {
      id: Date.now().toString(),
      type: "voice" as const,
      content: "",
      isUser: true,
      timestamp: new Date(),
      audioUrl: "",
      audioDuration: 5,
      transcript: "Message vocal transcrit ici...",
      hasFeedback: true,
      hasErrors: false,
      feedbackItems: [],
    };
    setMessages([...messages, newMessage]);
  };

  const handleStatusChange = (newStatus: ConversationStatus) => {
    setStatus(newStatus);
    const labels = {
      active: "en cours",
      completed: "terminée",
      archived: "archivée",
    };
    toast.success(`Conversation marquée comme ${labels[newStatus]}`);
  };

  const handleDelete = () => {
    toast.success("Conversation supprimée");
    navigate("/");
  };

  const getStatusBadge = () => {
    switch (status) {
      case "active":
        return null;
      case "completed":
        return (
          <span className="text-xs px-2 py-0.5 bg-success/10 text-success rounded-full">
            Terminée
          </span>
        );
      case "archived":
        return (
          <span className="text-xs px-2 py-0.5 bg-muted text-muted-foreground rounded-full">
            Archivée
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-card border-b border-border sticky top-0 z-10">
          <div className={cn(
            "px-4 py-3 transition-all",
            sidebarOpen ? "max-w-3xl" : "max-w-4xl mx-auto"
          )}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Link
                  to="/"
                  className="w-9 h-9 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-muted-foreground" />
                </Link>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="font-display font-semibold text-foreground">
                      {conversationInfo.title}
                    </h1>
                    {getStatusBadge()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {conversationInfo.language} • Coach {conversationInfo.coachTone.toLowerCase()} • {modelConfig.textModel}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Audio toggle */}
                <button
                  onClick={() => setAudioEnabled(!audioEnabled)}
                  className="w-9 h-9 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
                  title={audioEnabled ? "Désactiver l'audio" : "Activer l'audio"}
                >
                  {audioEnabled ? (
                    <Volume2 className="w-5 h-5 text-primary" />
                  ) : (
                    <VolumeX className="w-5 h-5 text-muted-foreground" />
                  )}
                </button>

                {/* Sidebar toggle */}
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="w-9 h-9 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
                  title={sidebarOpen ? "Masquer le panneau" : "Afficher le panneau"}
                >
                  {sidebarOpen ? (
                    <PanelRightClose className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <PanelRight className="w-5 h-5 text-muted-foreground" />
                  )}
                </button>

                {/* Status menu */}
                <ConversationStatusMenu
                  currentStatus={status}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDelete}
                />
              </div>
            </div>
          </div>
        </header>

        {/* Messages */}
        <main className="flex-1 overflow-y-auto">
          <div className={cn(
            "px-4 py-6 transition-all",
            sidebarOpen ? "max-w-3xl" : "max-w-4xl mx-auto"
          )}>
            <div className="space-y-4">
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  {...message}
                />
              ))}
            </div>
          </div>
        </main>

        {/* Input - disabled if archived */}
        {status !== "archived" ? (
          <ChatInput
            onSendMessage={handleSendMessage}
            onSendVoice={handleSendVoice}
            placeholder="Tapez ou envoyez un vocal..."
          />
        ) : (
          <div className="bg-card border-t border-border p-4">
            <div className={cn(
              "text-center text-sm text-muted-foreground transition-all",
              sidebarOpen ? "max-w-3xl" : "max-w-4xl mx-auto"
            )}>
              Cette conversation est archivée. Changez le statut pour continuer.
            </div>
          </div>
        )}
      </div>

      {/* Sidebar */}
      {sidebarOpen && (
        <ConversationSidebar
          conversationInfo={conversationInfo}
          stats={sessionStats}
          modelConfig={modelConfig}
          onModelChange={setModelConfig}
        />
      )}
    </div>
  );
}
