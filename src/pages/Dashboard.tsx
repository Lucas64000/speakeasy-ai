import { useState } from "react";
import { motion } from "framer-motion";
import { 
  MessageSquare, 
  Clock, 
  TrendingUp, 
  BookOpen, 
  ChevronRight,
  Plus,
  CheckCircle,
  Archive
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Header } from "@/components/layout/Header";
import { NewConversationDialog } from "@/components/conversation/NewConversationDialog";

interface ConversationPreview {
  id: string;
  title: string;
  lastMessage: string;
  status: "active" | "completed" | "archived";
  language: string;
  updatedAt: Date;
}

const mockConversations: ConversationPreview[] = [
  {
    id: "1",
    title: "Conversation au restaurant",
    lastMessage: "Très bien ! Tu as bien utilisé le conditionnel.",
    status: "active",
    language: "Français",
    updatedAt: new Date(),
  },
  {
    id: "2",
    title: "Job interview practice",
    lastMessage: "Great progress on your formal English!",
    status: "completed",
    language: "Anglais",
    updatedAt: new Date(Date.now() - 86400000),
  },
  {
    id: "3",
    title: "Réservation d'hôtel",
    lastMessage: "N'oublie pas l'accord du participe passé.",
    status: "archived",
    language: "Français",
    updatedAt: new Date(Date.now() - 172800000),
  },
];

const stats = [
  { label: "Conversations", value: "12", icon: MessageSquare, color: "text-primary" },
  { label: "Heures pratiquées", value: "8.5", icon: Clock, color: "text-accent" },
  { label: "Progression", value: "+15%", icon: TrendingUp, color: "text-success" },
  { label: "Mots appris", value: "234", icon: BookOpen, color: "text-primary" },
];

export default function Dashboard() {
  const [selectedLanguage] = useState("Français");
  const [showNewConversation, setShowNewConversation] = useState(false);

  const getStatusIcon = (status: ConversationPreview["status"]) => {
    switch (status) {
      case "active":
        return <span className="w-2 h-2 rounded-full bg-success" />;
      case "completed":
        return <CheckCircle className="w-4 h-4 text-muted-foreground" />;
      case "archived":
        return <Archive className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Welcome section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <h2 className="font-display text-3xl font-bold text-foreground mb-2">
            Bonjour ! 👋
          </h2>
          <p className="text-muted-foreground">
            Continuez votre apprentissage du {selectedLanguage}.
          </p>
        </motion.div>

        {/* Stats grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-card rounded-2xl p-4 shadow-card"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={cn("p-2 rounded-xl bg-muted", stat.color)}>
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
              <p className="text-2xl font-display font-bold text-foreground">
                {stat.value}
              </p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* New conversation CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-8"
        >
          <button
            onClick={() => setShowNewConversation(true)}
            className="w-full block bg-primary text-primary-foreground rounded-2xl p-6 shadow-card-lg hover:shadow-card-xl transition-shadow group text-left"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <Plus className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold">
                    Nouvelle conversation
                  </h3>
                  <p className="text-sm text-primary-foreground/80">
                    Pratiquez avec votre coach IA
                  </p>
                </div>
              </div>
              <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </motion.div>

        {/* Recent conversations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-semibold text-foreground">
              Conversations récentes
            </h3>
            <Link
              to="/history"
              className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Voir tout
            </Link>
          </div>

          <div className="space-y-3">
            {mockConversations.map((conversation, index) => (
              <motion.div
                key={conversation.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
              >
                <Link
                  to={`/chat/${conversation.id}`}
                  className="block bg-card rounded-2xl p-4 shadow-card hover:shadow-card-lg transition-all group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {getStatusIcon(conversation.status)}
                        <h4 className="font-medium text-foreground truncate">
                          {conversation.title}
                        </h4>
                      </div>
                      <p className="text-sm text-muted-foreground truncate mb-2">
                        {conversation.lastMessage}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-0.5 bg-secondary text-secondary-foreground rounded-full">
                          {conversation.language}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {conversation.updatedAt.toLocaleDateString("fr-FR")}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all flex-shrink-0" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>

      <NewConversationDialog 
        open={showNewConversation} 
        onOpenChange={setShowNewConversation} 
      />
    </div>
  );
}
