import { useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

function getSystemTheme(): "dark" | "light" {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    // Try to get theme from localStorage, default to light if not found
    if (typeof window !== "undefined") {
      return (localStorage.getItem("theme") as Theme) || "light";
    }
    return "light";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    function applyTheme(newTheme: Theme) {
      root.classList.remove("light", "dark");

      if (newTheme === "system") {
        root.classList.add(getSystemTheme());
      } else {
        root.classList.add(newTheme);
      }

      localStorage.setItem("theme", newTheme);
    }

    // Handle system theme changes
    function handleSystemThemeChange(e: MediaQueryListEvent) {
      if (theme === "system") {
        root.classList.remove("light", "dark");
        root.classList.add(e.matches ? "dark" : "light");
      }
    }

    mediaQuery.addEventListener("change", handleSystemThemeChange);
    applyTheme(theme);

    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
    };
  }, [theme]);

  return { theme, setTheme };
}