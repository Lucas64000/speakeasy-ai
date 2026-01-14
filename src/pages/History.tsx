import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Search, 
  Filter, 
  ChevronRight, 
  CheckCircle, 
  Archive, 
  MessageSquare,
  Calendar
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ConversationItem {
  id: string;
  title: string;
  lastMessage: string;
  status: "active" | "completed" | "archived";
  language: string;
  messagesCount: number;
  duration: string;
  createdAt: Date;
  updatedAt: Date;
}

const mockHistory: ConversationItem[] = [
  {
    id: "1",
    title: "Conversation au restaurant",
    lastMessage: "Très bien ! Tu as bien utilisé le conditionnel.",
    status: "active",
    language: "Français",
    messagesCount: 24,
    duration: "15 min",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    title: "Job interview practice",
    lastMessage: "Great progress on your formal English!",
    status: "completed",
    language: "Anglais",
    messagesCount: 32,
    duration: "22 min",
    createdAt: new Date(Date.now() - 86400000),
    updatedAt: new Date(Date.now() - 86400000),
  },
  {
    id: "3",
    title: "Réservation d'hôtel",
    lastMessage: "N'oublie pas l'accord du participe passé.",
    status: "archived",
    language: "Français",
    messagesCount: 18,
    duration: "12 min",
    createdAt: new Date(Date.now() - 172800000),
    updatedAt: new Date(Date.now() - 172800000),
  },
  {
    id: "4",
    title: "Ordering coffee in Spanish",
    lastMessage: "¡Muy bien! Tu pronunciación mejora.",
    status: "completed",
    language: "Espagnol",
    messagesCount: 15,
    duration: "10 min",
    createdAt: new Date(Date.now() - 259200000),
    updatedAt: new Date(Date.now() - 259200000),
  },
  {
    id: "5",
    title: "Discussion sur le cinéma",
    lastMessage: "Excellent usage des temps du passé !",
    status: "completed",
    language: "Français",
    messagesCount: 28,
    duration: "18 min",
    createdAt: new Date(Date.now() - 345600000),
    updatedAt: new Date(Date.now() - 345600000),
  },
];

export default function History() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [languageFilter, setLanguageFilter] = useState<string>("all");

  const filteredHistory = mockHistory.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    const matchesLanguage = languageFilter === "all" || item.language === languageFilter;
    return matchesSearch && matchesStatus && matchesLanguage;
  });

  const getStatusIcon = (status: ConversationItem["status"]) => {
    switch (status) {
      case "active":
        return <span className="w-2 h-2 rounded-full bg-success" />;
      case "completed":
        return <CheckCircle className="w-4 h-4 text-success" />;
      case "archived":
        return <Archive className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusLabel = (status: ConversationItem["status"]) => {
    switch (status) {
      case "active":
        return "En cours";
      case "completed":
        return "Terminée";
      case "archived":
        return "Archivée";
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "Aujourd'hui";
    if (days === 1) return "Hier";
    if (days < 7) return `Il y a ${days} jours`;
    return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">
                Lingua<span className="text-primary">Flow</span>
              </h1>
            </div>
            <nav className="flex items-center gap-2">
              <Link
                to="/"
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Dashboard
              </Link>
              <Link
                to="/history"
                className="px-3 py-2 text-sm font-medium text-foreground bg-muted rounded-lg"
              >
                Historique
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <h2 className="font-display text-3xl font-bold text-foreground mb-2">
            Historique
          </h2>
          <p className="text-muted-foreground">
            Retrouvez toutes vos conversations passées.
          </p>
        </motion.div>

        {/* Search and filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-card rounded-2xl p-4 shadow-card mb-6"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher une conversation..."
                className="w-full bg-muted rounded-xl pl-10 pr-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="active">En cours</SelectItem>
                  <SelectItem value="completed">Terminées</SelectItem>
                  <SelectItem value="archived">Archivées</SelectItem>
                </SelectContent>
              </Select>

              <Select value={languageFilter} onValueChange={setLanguageFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Langue" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  <SelectItem value="Français">Français</SelectItem>
                  <SelectItem value="Anglais">Anglais</SelectItem>
                  <SelectItem value="Espagnol">Espagnol</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </motion.div>

        {/* Results count */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="text-sm text-muted-foreground mb-4"
        >
          {filteredHistory.length} conversation{filteredHistory.length !== 1 ? "s" : ""} trouvée{filteredHistory.length !== 1 ? "s" : ""}
        </motion.p>

        {/* Conversation list */}
        <div className="space-y-3">
          {filteredHistory.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
            >
              <Link
                to={`/chat/${item.id}`}
                className={cn(
                  "block bg-card rounded-2xl p-5 shadow-card hover:shadow-card-lg transition-all group",
                  item.status === "archived" && "opacity-70"
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Title and status */}
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusIcon(item.status)}
                      <h3 className="font-display font-semibold text-foreground truncate">
                        {item.title}
                      </h3>
                      <span
                        className={cn(
                          "text-xs px-2 py-0.5 rounded-full",
                          item.status === "active" && "bg-success/10 text-success",
                          item.status === "completed" && "bg-muted text-muted-foreground",
                          item.status === "archived" && "bg-muted text-muted-foreground"
                        )}
                      >
                        {getStatusLabel(item.status)}
                      </span>
                    </div>

                    {/* Last message */}
                    <p className="text-sm text-muted-foreground truncate mb-3">
                      {item.lastMessage}
                    </p>

                    {/* Meta info */}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="px-2 py-0.5 bg-secondary text-secondary-foreground rounded-full">
                        {item.language}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5" />
                        {item.messagesCount} messages
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(item.updatedAt)}
                      </span>
                    </div>
                  </div>

                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Empty state */}
        {filteredHistory.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <MessageSquare className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-display font-semibold text-foreground mb-2">
              Aucune conversation trouvée
            </h3>
            <p className="text-sm text-muted-foreground">
              Essayez de modifier vos filtres ou lancez une nouvelle conversation.
            </p>
          </motion.div>
        )}
      </main>
    </div>
  );
}
