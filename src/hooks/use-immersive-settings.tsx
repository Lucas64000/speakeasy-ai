import { useState, useEffect, createContext, useContext, ReactNode } from "react";

interface ImmersiveSettings {
  enabled: boolean;
  currentScene: string | null;
  isGenerating: boolean;
}

interface ImmersiveSettingsContextType {
  settings: ImmersiveSettings;
  setEnabled: (enabled: boolean) => void;
  setCurrentScene: (scene: string | null) => void;
  setIsGenerating: (generating: boolean) => void;
}

const ImmersiveSettingsContext = createContext<ImmersiveSettingsContextType | undefined>(undefined);

export function ImmersiveSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<ImmersiveSettings>(() => {
    const stored = localStorage.getItem("immersive-settings");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return { ...parsed, currentScene: null, isGenerating: false };
      } catch {
        return { enabled: false, currentScene: null, isGenerating: false };
      }
    }
    return { enabled: false, currentScene: null, isGenerating: false };
  });

  useEffect(() => {
    localStorage.setItem("immersive-settings", JSON.stringify({ enabled: settings.enabled }));
  }, [settings.enabled]);

  const setEnabled = (enabled: boolean) => {
    setSettings(prev => ({ ...prev, enabled }));
  };

  const setCurrentScene = (scene: string | null) => {
    setSettings(prev => ({ ...prev, currentScene: scene }));
  };

  const setIsGenerating = (generating: boolean) => {
    setSettings(prev => ({ ...prev, isGenerating: generating }));
  };

  return (
    <ImmersiveSettingsContext.Provider value={{ settings, setEnabled, setCurrentScene, setIsGenerating }}>
      {children}
    </ImmersiveSettingsContext.Provider>
  );
}

export function useImmersiveSettings() {
  const context = useContext(ImmersiveSettingsContext);
  if (context === undefined) {
    throw new Error("useImmersiveSettings must be used within an ImmersiveSettingsProvider");
  }
  return context;
}