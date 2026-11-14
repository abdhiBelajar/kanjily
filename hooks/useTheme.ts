"use client";

import { useState, useEffect, useCallback } from "react";
import { useIsMounted } from "./useIsMounted";

export type ThemeMode = "light" | "dark" | "system";

function getInitialTheme(): ThemeMode {
  if (typeof window === "undefined") return "system";
  try {
    const saved = localStorage.getItem("kanji_theme") as ThemeMode | null;
    if (saved === "light" || saved === "dark" || saved === "system") {
      return saved;
    }
  } catch {
    // Abaikan jika localStorage tidak dapat diakses
  }
  return "system";
}

function calculateIsDark(mode: ThemeMode): boolean {
  if (typeof window === "undefined") return false;
  try {
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return mode === "dark" || (mode === "system" && systemDark);
  } catch {
    return false;
  }
}

function applyDomTheme(mode: ThemeMode) {
  if (typeof window === "undefined") return;
  const dark = calculateIsDark(mode);
  if (dark) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

export function useTheme() {
  const mounted = useIsMounted();
  const [themeMode, setThemeModeState] = useState<ThemeMode>(getInitialTheme);
  const [isDark, setIsDark] = useState<boolean>(() =>
    calculateIsDark(getInitialTheme())
  );

  useEffect(() => {
    // Terapkan class pada DOM tanpa memanggil setState sinkron
    applyDomTheme(getInitialTheme());

    // Mendengarkan perubahan preferensi warna di sistem operasi
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemChange = () => {
      const saved = localStorage.getItem("kanji_theme") as ThemeMode | null;
      if (!saved || saved === "system") {
        applyDomTheme("system");
        setIsDark(calculateIsDark("system"));
      }
    };

    mediaQuery.addEventListener("change", handleSystemChange);

    // Mendengarkan perubahan antar tab / instance
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "kanji_theme") {
        const nextMode = (e.newValue as ThemeMode) || "system";
        setThemeModeState(nextMode);
        applyDomTheme(nextMode);
        setIsDark(calculateIsDark(nextMode));
      }
    };
    window.addEventListener("storage", handleStorageChange);

    // Sinkronisasi dalam tab yang sama via CustomEvent
    const handleCustomChange = (e: Event) => {
      const customEvent = e as CustomEvent<ThemeMode>;
      if (customEvent.detail) {
        setThemeModeState(customEvent.detail);
        applyDomTheme(customEvent.detail);
        setIsDark(calculateIsDark(customEvent.detail));
      }
    };
    window.addEventListener("kanji_theme_change", handleCustomChange);

    return () => {
      mediaQuery.removeEventListener("change", handleSystemChange);
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("kanji_theme_change", handleCustomChange);
    };
  }, []);

  const setTheme = useCallback((mode: ThemeMode) => {
    setThemeModeState(mode);
    setIsDark(calculateIsDark(mode));
    applyDomTheme(mode);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("kanji_theme", mode);
      } catch {
        // Abaikan kesalahan storage quota
      }
      window.dispatchEvent(
        new CustomEvent<ThemeMode>("kanji_theme_change", { detail: mode })
      );
    }
  }, []);

  return { themeMode, setTheme, isDark, mounted };
}
