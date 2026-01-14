import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MoreVertical, 
  CheckCircle, 
  Archive, 
  Play,
  Trash2,
  X
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
import { cn } from "@/lib/utils";

type ConversationStatus = "active" | "completed" | "archived";

interface ConversationStatusMenuProps {
  currentStatus: ConversationStatus;
  onStatusChange: (status: ConversationStatus) => void;
  onDelete?: () => void;
  className?: string;
}

export function ConversationStatusMenu({
  currentStatus,
  onStatusChange,
  onDelete,
  className,
}: ConversationStatusMenuProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const statusOptions = [
    {
      value: "active" as const,
      label: "En cours",
      icon: Play,
      description: "Reprendre la conversation",
      color: "text-success",
    },
    {
      value: "completed" as const,
      label: "Terminée",
      icon: CheckCircle,
      description: "Marquer comme terminée",
      color: "text-primary",
    },
    {
      value: "archived" as const,
      label: "Archivée",
      icon: Archive,
      description: "Archiver la conversation",
      color: "text-muted-foreground",
    },
  ];

  const handleDelete = () => {
    setShowDeleteDialog(false);
    onDelete?.();
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              "w-9 h-9 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors",
              className
            )}
          >
            <MoreVertical className="w-5 h-5 text-muted-foreground" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
            Changer le statut
          </div>
          {statusOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => onStatusChange(option.value)}
              className={cn(
                "flex items-center gap-3 cursor-pointer",
                currentStatus === option.value && "bg-muted"
              )}
            >
              <option.icon className={cn("w-4 h-4", option.color)} />
              <div className="flex-1">
                <p className="text-sm font-medium">{option.label}</p>
                <p className="text-xs text-muted-foreground">{option.description}</p>
              </div>
              {currentStatus === option.value && (
                <div className="w-2 h-2 rounded-full bg-primary" />
              )}
            </DropdownMenuItem>
          ))}
          
          {onDelete && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setShowDeleteDialog(true)}
                className="flex items-center gap-3 cursor-pointer text-destructive focus:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
                <span>Supprimer</span>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer la conversation ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. La conversation et tous ses messages seront définitivement supprimés.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
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
