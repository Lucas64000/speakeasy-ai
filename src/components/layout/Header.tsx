import { Link, useLocation } from "react-router-dom";
import { Moon, Sun, Activity } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";

export function Header() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-card border-b border-border sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="group">
            <h1 className="font-display text-2xl font-bold text-foreground transition-colors group-hover:text-primary">
              Lingua<span className="text-primary">Flow</span>
            </h1>
          </Link>
          <div className="flex items-center gap-2">
            <nav className="flex items-center gap-2">
              <Link
                to="/"
                className={cn(
                  "px-3 py-2 text-sm font-medium transition-colors rounded-lg",
                  isActive("/")
                    ? "text-foreground bg-muted"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Dashboard
              </Link>
              <Link
                to="/history"
                className={cn(
                  "px-3 py-2 text-sm font-medium transition-colors rounded-lg",
                  isActive("/history")
                    ? "text-foreground bg-muted"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Historique
              </Link>
              <Link
                to="/metrics"
                className={cn(
                  "px-3 py-2 text-sm font-medium transition-colors rounded-lg flex items-center gap-1.5",
                  isActive("/metrics")
                    ? "text-foreground bg-muted"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Activity className="w-4 h-4" />
                Metrics
              </Link>
            </nav>
            
            {/* Dark mode toggle */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors ml-2"
              aria-label="Toggle dark mode"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-accent" />
              ) : (
                <Moon className="w-5 h-5 text-muted-foreground" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
