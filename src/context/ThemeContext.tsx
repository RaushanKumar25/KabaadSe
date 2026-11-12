"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme | ((prev: Theme) => Theme)) => void;
  mounted: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = "kabaadse_theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  // Apply theme to document element and body
  const applyTheme = useCallback((newTheme: Theme) => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    const body = document.body;

    if (newTheme === "dark") {
      root.classList.remove("light");
      root.classList.add("dark");
      root.setAttribute("data-theme", "dark");
      root.style.colorScheme = "dark";
      if (body) {
        body.classList.remove("light");
        body.classList.add("dark");
        body.setAttribute("data-theme", "dark");
      }
    } else {
      root.classList.remove("dark");
      root.classList.add("light");
      root.setAttribute("data-theme", "light");
      root.style.colorScheme = "light";
      if (body) {
        body.classList.remove("dark");
        body.classList.add("light");
        body.setAttribute("data-theme", "light");
      }
    }
  }, []);

  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem(STORAGE_KEY) as Theme | null;
      if (storedTheme === "light" || storedTheme === "dark") {
        setThemeState(storedTheme);
        applyTheme(storedTheme);
      } else {
        const prefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        const initialTheme: Theme = prefersDark ? "dark" : "dark";
        setThemeState(initialTheme);
        applyTheme(initialTheme);
      }
    } catch {
      applyTheme("dark");
    }
    setMounted(true);
  }, [applyTheme]);

  const setTheme = useCallback(
    (newTheme: Theme | ((prev: Theme) => Theme)) => {
      setThemeState((prev) => {
        const nextTheme =
          typeof newTheme === "function" ? newTheme(prev) : newTheme;
        applyTheme(nextTheme);
        try {
          localStorage.setItem(STORAGE_KEY, nextTheme);
        } catch (err) {
          console.warn("Unable to save theme to localStorage:", err);
        }
        return nextTheme;
      });
    },
    [applyTheme]
  );

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, [setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
