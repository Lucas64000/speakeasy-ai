import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Volume2, VolumeX } from "lucide-react";
import { Link } from "react-router-dom";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";

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

// Ces infos viendraient du contexte de création de conversation
const conversationInfo = {
  title: "Conversation au restaurant",
  language: "Français",
  coachTone: "Amical",
};

export default function ChatConversation() {
  const [messages, setMessages] = useState(mockMessages);
  const [audioEnabled, setAudioEnabled] = useState(true);

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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                to="/"
                className="w-9 h-9 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-muted-foreground" />
              </Link>
              <div>
                <h1 className="font-display font-semibold text-foreground">
                  {conversationInfo.title}
                </h1>
                <p className="text-xs text-muted-foreground">
                  {conversationInfo.language} • Coach {conversationInfo.coachTone.toLowerCase()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Audio toggle */}
              <button
                onClick={() => setAudioEnabled(!audioEnabled)}
                className="w-9 h-9 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
              >
                {audioEnabled ? (
                  <Volume2 className="w-5 h-5 text-primary" />
                ) : (
                  <VolumeX className="w-5 h-5 text-muted-foreground" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-6">
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

      {/* Input */}
      <ChatInput
        onSendMessage={handleSendMessage}
        onSendVoice={handleSendVoice}
        placeholder="Tapez ou envoyez un vocal..."
      />
    </div>
  );
}
