import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

const BIONIC_READING_STORAGE_KEY = "project-portal-bionic-reading-enabled";

type ReadingPreferencesContextValue = {
  isBionicEnabled: boolean;
  toggleBionic: () => void;
};

const ReadingPreferencesContext = createContext<ReadingPreferencesContextValue | null>(null);

function getStoredBionicPreference(): boolean {
  if (typeof window === "undefined") return false;

  try {
    return window.localStorage.getItem(BIONIC_READING_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

export function ReadingPreferencesProvider({ children }: { children: ReactNode }) {
  const [isBionicEnabled, setIsBionicEnabled] = useState(getStoredBionicPreference);

  useEffect(() => {
    try {
      window.localStorage.setItem(BIONIC_READING_STORAGE_KEY, String(isBionicEnabled));
    } catch {
      // Ignore persistence failures so article pages remain usable in restricted environments.
    }
  }, [isBionicEnabled]);

  const toggleBionic = (): void => {
    setIsBionicEnabled((current) => !current);
  };

  return (
    <ReadingPreferencesContext.Provider value={{ isBionicEnabled, toggleBionic }}>
      {children}
    </ReadingPreferencesContext.Provider>
  );
}

export function useReadingPreferences(): ReadingPreferencesContextValue {
  const context = useContext(ReadingPreferencesContext);

  if (!context) {
    throw new Error("useReadingPreferences must be used within ReadingPreferencesProvider");
  }

  return context;
}
