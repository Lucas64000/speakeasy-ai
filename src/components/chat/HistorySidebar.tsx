import { useState, useRef, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageSquare, 
  Plus, 
  Search, 
  MoreHorizontal,
  Check,
  Archive,
  Trash2,
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

interface Conversation {
  id: string;
  title: string;
  language: string;
  languageFlag: string;
  lastMessage: string;
  timestamp: Date;
  status: "active" | "completed" | "archived";
}

const initialConversations: Conversation[] = [
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
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [conversations, setConversations] = useState(initialConversations);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [conversationToDelete, setConversationToDelete] = useState<string | null>(null);

  const filteredConversations = conversations.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.language.toLowerCase().includes(search.toLowerCase())
  );

  const handleArchive = (conversationId: string) => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (!conversation) return;

    // Store previous state for undo
    const previousStatus = conversation.status;
    
    // Update to archived
    setConversations(prev => 
      prev.map(c => c.id === conversationId ? { ...c, status: "archived" as const } : c)
    );
    setOpenMenuId(null);

    // Show toast with undo and progress bar
    toast.success("Conversation archivée", {
      description: conversation.title,
      duration: 5000,
      action: {
        label: "Annuler",
        onClick: () => {
          setConversations(prev =>
            prev.map(c => c.id === conversationId ? { ...c, status: previousStatus } : c)
          );
          toast.success("Archivage annulé");
        },
      },
    });
  };

  const handleDeleteClick = (conversationId: string) => {
    setConversationToDelete(conversationId);
    setDeleteDialogOpen(true);
    setOpenMenuId(null);
  };

  const handleConfirmDelete = () => {
    if (conversationToDelete) {
      setConversations(prev => prev.filter(c => c.id !== conversationToDelete));
      toast.success("Conversation supprimée");
    }
    setDeleteDialogOpen(false);
    setConversationToDelete(null);
  };

  const handleComplete = (conversationId: string) => {
    setConversations(prev =>
      prev.map(c => c.id === conversationId ? { ...c, status: "completed" as const } : c)
    );
    setOpenMenuId(null);
    toast.success("Conversation terminée");
  };

  return (
    <>
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
              const isMenuOpen = openMenuId === conversation.id;

              return (
                <div
                  key={conversation.id}
                  className="relative group"
                >
                  <Link
                    to={`/chat/${conversation.id}`}
                    className={cn(
                      "flex items-center gap-2 p-2 pr-8 rounded-lg transition-colors",
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
                          className="flex-1 min-w-0"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-medium text-sm truncate">
                              {conversation.title}
                            </span>
                            <span className="text-[10px] text-muted-foreground shrink-0">
                              {formatRelativeTime(conversation.timestamp)}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            {conversation.lastMessage}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Link>

                  {/* Actions menu - always positioned, visible on hover or when open */}
                  {!collapsed && (
                    <div
                      className={cn(
                        "absolute right-1 top-1/2 -translate-y-1/2 transition-opacity",
                        isMenuOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                      )}
                    >
                      <DropdownMenu 
                        open={isMenuOpen} 
                        onOpenChange={(open) => setOpenMenuId(open ? conversation.id : null)}
                      >
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 hover:bg-sidebar-accent"
                            onClick={(e) => e.preventDefault()}
                          >
                            <MoreHorizontal className="w-3.5 h-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem 
                            className="cursor-pointer"
                            onClick={() => handleComplete(conversation.id)}
                          >
                            <Check className="w-4 h-4 mr-2" />
                            Terminer
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="cursor-pointer"
                            onClick={() => handleArchive(conversation.id)}
                          >
                            <Archive className="w-4 h-4 mr-2" />
                            Archiver
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive focus:text-destructive cursor-pointer"
                            onClick={() => handleDeleteClick(conversation.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>

        {/* Footer with collapsed indicator */}
        {collapsed && (
          <div className="p-2 border-t border-sidebar-border">
            <div className="text-center text-xs text-muted-foreground">
              {conversations.length}
            </div>
          </div>
        )}
      </motion.aside>

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette conversation ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. La conversation et tous ses messages seront définitivement supprimés.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}