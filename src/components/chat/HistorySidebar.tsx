import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageSquare, 
  Plus, 
  Search, 
  MoreHorizontal,
  Check,
  Archive,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Conversation {
  id: string;
  title: string;
  language: string;
  languageFlag: string;
  lastMessage: string;
  timestamp: Date;
  status: "active" | "completed" | "archived";
}

const mockConversations: Conversation[] = [
  {
    id: "1",
    title: "Conversation au restaurant",
    language: "Français",
    languageFlag: "🇫🇷",
    lastMessage: "Très bien ! J'ai une jolie table...",
    timestamp: new Date(Date.now() - 60000),
    status: "active",
  },
  {
    id: "2",
    title: "Shopping à Paris",
    language: "Français",
    languageFlag: "🇫🇷",
    lastMessage: "Avez-vous cette robe en taille M ?",
    timestamp: new Date(Date.now() - 3600000),
    status: "active",
  },
  {
    id: "3",
    title: "Réservation d'hôtel",
    language: "Français",
    languageFlag: "🇫🇷",
    lastMessage: "Je voudrais réserver une chambre...",
    timestamp: new Date(Date.now() - 86400000),
    status: "completed",
  },
  {
    id: "4",
    title: "At the train station",
    language: "English",
    languageFlag: "🇬🇧",
    lastMessage: "Which platform for London?",
    timestamp: new Date(Date.now() - 172800000),
    status: "completed",
  },
  {
    id: "5",
    title: "En el mercado",
    language: "Español",
    languageFlag: "🇪🇸",
    lastMessage: "¿Cuánto cuesta esto?",
    timestamp: new Date(Date.now() - 259200000),
    status: "archived",
  },
];

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "À l'instant";
  if (diffMins < 60) return `${diffMins}min`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}j`;
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

interface HistorySidebarProps {
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
  className?: string;
}

export function HistorySidebar({ collapsed, onCollapsedChange, className }: HistorySidebarProps) {
  const { id: currentId } = useParams();
  const [search, setSearch] = useState("");
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const filteredConversations = mockConversations.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.language.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusIcon = (status: Conversation["status"]) => {
    switch (status) {
      case "completed":
        return <Check className="w-3 h-3 text-success" />;
      case "archived":
        return <Archive className="w-3 h-3 text-muted-foreground" />;
      default:
        return null;
    }
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 56 : 280 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className={cn(
        "h-screen bg-sidebar border-r border-sidebar-border flex flex-col shrink-0",
        className
      )}
    >
      {/* Header */}
      <div className="p-3 flex items-center justify-between border-b border-sidebar-border">
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-display font-semibold text-sidebar-foreground">
                Conversations
              </span>
            </motion.div>
          )}
        </AnimatePresence>
        
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={() => onCollapsedChange(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* New conversation button */}
      <div className="p-2">
        <Button
          asChild
          variant="outline"
          className={cn(
            "w-full justify-start gap-2 border-dashed border-sidebar-border hover:bg-sidebar-accent",
            collapsed && "justify-center px-0"
          )}
        >
          <Link to="/">
            <Plus className="w-4 h-4" />
            {!collapsed && <span>Nouvelle conversation</span>}
          </Link>
        </Button>
      </div>

      {/* Search */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="px-2 pb-2"
          >
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 h-8 text-sm bg-sidebar-accent border-sidebar-border"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Conversations list */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {filteredConversations.map((conversation) => {
            const isActive = conversation.id === currentId;
            const isHovered = hoveredId === conversation.id;

            return (
              <div
                key={conversation.id}
                onMouseEnter={() => setHoveredId(conversation.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="relative"
              >
                <Link
                  to={`/chat/${conversation.id}`}
                  className={cn(
                    "flex items-center gap-2 p-2 rounded-lg transition-colors group",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "hover:bg-sidebar-accent/50 text-sidebar-foreground"
                  )}
                >
                  {/* Status indicator */}
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full shrink-0",
                      conversation.status === "active" && "bg-primary",
                      conversation.status === "completed" && "bg-success",
                      conversation.status === "archived" && "bg-muted-foreground"
                    )}
                  />

                  {/* Content */}
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex-1 min-w-0 overflow-hidden"
                      >
                        <span className="font-medium text-sm truncate block">
                          {conversation.title}
                        </span>
                        <p className="text-xs text-muted-foreground truncate">
                          {conversation.lastMessage}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Time */}
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-[10px] text-muted-foreground shrink-0 ml-auto"
                      >
                        {formatRelativeTime(conversation.timestamp)}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>

                {/* Actions menu */}
                <AnimatePresence>
                  {!collapsed && isHovered && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                    >
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={(e) => e.preventDefault()}
                          >
                            <MoreHorizontal className="w-3.5 h-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem>
                            <Check className="w-4 h-4 mr-2" />
                            Terminer
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Archive className="w-4 h-4 mr-2" />
                            Archiver
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* Footer with collapsed indicator */}
      {collapsed && (
        <div className="p-2 border-t border-sidebar-border">
          <div className="text-center text-xs text-muted-foreground">
            {mockConversations.length}
          </div>
        </div>
      )}
    </motion.aside>
  );
}
