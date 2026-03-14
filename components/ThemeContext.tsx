"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode
} from "react";

type Theme = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  toggle: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = "ssa-portal-theme";

// Function to get theme from localStorage or system preference
const getInitialTheme = (): Theme => {
  if (typeof window !== "undefined") {
    const stored = window.localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (stored === "light" || stored === "dark") {
      return stored;
    }
    // Check system preference if no stored theme
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return "dark";
    }
  }
  return "light"; // Default to light theme
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    if (typeof window === "undefined") return;
    
    const stored = window.localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (stored === "light" || stored === "dark") {
      setTheme(stored);
    }
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, theme);
    
    // Apply theme to document
    const root = document.documentElement;
    if (theme === "light") {
      root.classList.remove("dark");
      document.body.classList.add("bg-white", "text-slate-900");
      document.body.classList.remove("bg-slate-950", "text-slate-50");
    } else {
      root.classList.add("dark");
      document.body.classList.add("bg-slate-950", "text-slate-50");
      document.body.classList.remove("bg-white", "text-slate-900");
    }
  }, [theme, mounted]);

  const value = useMemo(
    () => ({
      theme,
      toggle: () => setTheme((prev) => (prev === "dark" ? "light" : "dark"))
    }),
    [theme]
  );

  // Prevent flash of incorrect theme
  if (!mounted) {
    return (
      <div style={{ visibility: "hidden" }}>
        {children}
      </div>
    );
  }

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
