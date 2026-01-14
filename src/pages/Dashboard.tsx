import { useState } from "react";
import { motion } from "framer-motion";
import { 
  MessageSquare, 
  Clock, 
  ChevronRight,
  Plus,
  CheckCircle,
  Archive,
  Filter
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Header } from "@/components/layout/Header";
import { NewConversationDialog } from "@/components/conversation/NewConversationDialog";

type StatusFilter = "all" | "active" | "completed" | "archived";

interface ConversationPreview {
  id: string;
  title: string;
  lastMessage: string;
  status: "active" | "completed" | "archived";
  language: string;
  updatedAt: Date;
  messagesCount: number;
}

const mockConversations: ConversationPreview[] = [
  {
    id: "1",
    title: "Conversation au restaurant",
    lastMessage: "Très bien ! Tu as bien utilisé le conditionnel.",
    status: "active",
    language: "Français",
    updatedAt: new Date(),
    messagesCount: 24,
  },
  {
    id: "2",
    title: "Job interview practice",
    lastMessage: "Great progress on your formal English!",
    status: "completed",
    language: "Anglais",
    updatedAt: new Date(Date.now() - 86400000),
    messagesCount: 32,
  },
  {
    id: "3",
    title: "Réservation d'hôtel",
    lastMessage: "N'oublie pas l'accord du participe passé.",
    status: "archived",
    language: "Français",
    updatedAt: new Date(Date.now() - 172800000),
    messagesCount: 18,
  },
  {
    id: "4",
    title: "Shopping vocabulary",
    lastMessage: "Excellent use of comparatives!",
    status: "completed",
    language: "Anglais",
    updatedAt: new Date(Date.now() - 259200000),
    messagesCount: 15,
  },
];

const filterOptions: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "Toutes" },
  { value: "active", label: "En cours" },
  { value: "completed", label: "Terminées" },
  { value: "archived", label: "Archivées" },
];

export default function Dashboard() {
  const [showNewConversation, setShowNewConversation] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  // Filtrer les conversations
  const filteredConversations = statusFilter === "all" 
    ? mockConversations 
    : mockConversations.filter(c => c.status === statusFilter);

  // Stats basées sur toutes les conversations
  const totalConversations = mockConversations.length;
  const activeConversations = mockConversations.filter(c => c.status === "active").length;
  const totalMessages = mockConversations.reduce((acc, c) => acc + c.messagesCount, 0);

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
            Pratiquez vos langues avec votre coach IA.
          </p>
        </motion.div>

        {/* Simple stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="grid grid-cols-3 gap-4 mb-8"
        >
          <div className="bg-card rounded-2xl p-4 shadow-card">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-muted text-primary">
                <MessageSquare className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-display font-bold text-foreground">
              {totalConversations}
            </p>
            <p className="text-sm text-muted-foreground">Conversations</p>
          </div>

          <div className="bg-card rounded-2xl p-4 shadow-card">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-muted text-success">
                <CheckCircle className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-display font-bold text-foreground">
              {activeConversations}
            </p>
            <p className="text-sm text-muted-foreground">En cours</p>
          </div>

          <div className="bg-card rounded-2xl p-4 shadow-card">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-muted text-accent">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-display font-bold text-foreground">
              {totalMessages}
            </p>
            <p className="text-sm text-muted-foreground">Messages</p>
          </div>
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

          {/* Status filter */}
          <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setStatusFilter(option.value)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap",
                  statusFilter === option.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filteredConversations.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Aucune conversation {statusFilter !== "all" ? `${filterOptions.find(f => f.value === statusFilter)?.label.toLowerCase()}` : ""}
              </div>
            ) : filteredConversations.map((conversation, index) => (
              <motion.div
                key={conversation.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
              >
                <Link
                  to={`/chat/${conversation.id}`}
                  className={cn(
                    "block bg-card rounded-2xl p-4 shadow-card hover:shadow-card-lg transition-all group",
                    conversation.status === "archived" && "opacity-60"
                  )}
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
                          {conversation.messagesCount} messages
                        </span>
                        <span className="text-xs text-muted-foreground">
                          •
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
