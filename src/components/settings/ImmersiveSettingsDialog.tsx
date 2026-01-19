import { useState } from "react";
import { Settings, Sparkles, Image } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useImmersiveSettings } from "@/hooks/use-immersive-settings";
import { cn } from "@/lib/utils";

interface ImmersiveSettingsDialogProps {
  className?: string;
}

export function ImmersiveSettingsDialog({ className }: ImmersiveSettingsDialogProps) {
  const [open, setOpen] = useState(false);
  const { settings, setEnabled } = useImmersiveSettings();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn("h-9 w-9 rounded-full bg-muted hover:bg-muted/80", className)}
          title="Paramètres"
        >
          <Settings className="w-5 h-5 text-muted-foreground" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Paramètres de conversation
          </DialogTitle>
          <DialogDescription>
            Personnalise ton expérience d'apprentissage
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Immersive mode toggle */}
          <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/50 border border-border">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <Label htmlFor="immersive-mode" className="font-semibold cursor-pointer">
                  Mode immersif
                </Label>
                <Switch
                  id="immersive-mode"
                  checked={settings.enabled}
                  onCheckedChange={setEnabled}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Active un fond visuel généré par IA qui évolue selon le contexte de ta conversation
              </p>
            </div>
          </div>

          {/* Preview of immersive mode */}
          {settings.enabled && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Image className="w-4 h-4" />
                <span>Aperçu du mode immersif</span>
              </div>
              <div className="relative h-32 rounded-xl overflow-hidden bg-gradient-to-br from-primary/20 via-primary/10 to-background border border-border">
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-xs text-muted-foreground text-center px-4">
                    Le fond sera généré automatiquement<br />selon le contexte de la conversation
                  </p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                💡 Exemple : Une conversation au restaurant générera une ambiance de café parisien
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}