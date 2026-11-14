"use client";

import { useTheme, type ThemeMode } from "@/hooks/useTheme";

export default function ThemeToggle() {
  const { themeMode, setTheme, mounted } = useTheme();

  if (!mounted) {
    return (
      <div
        className="h-8 w-24 sm:w-28 rounded-lg bg-stone-200/60 dark:bg-stone-800/60 animate-pulse border border-stone-200/80 dark:border-stone-800/80"
        aria-hidden="true"
      />
    );
  }

  const options: {
    mode: ThemeMode;
    label: string;
    title: string;
    icon: React.ReactNode;
  }[] = [
    {
      mode: "light",
      label: "Terang",
      title: "Mode Terang (Siang)",
      icon: (
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
    },
    {
      mode: "dark",
      label: "Malam",
      title: "Mode Gelap / Malam",
      icon: (
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      ),
    },
    {
      mode: "system",
      label: "Sistem",
      title: "Mode Sistem (Mengikuti Pengaturan Perangkat)",
      icon: (
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div
      role="radiogroup"
      aria-label="Pilih tema tampilan"
      className="inline-flex items-center p-0.5 rounded-lg bg-stone-200/70 dark:bg-stone-900 border border-stone-300/80 dark:border-stone-800 text-xs shadow-xs"
    >
      {options.map((opt) => {
        const active = themeMode === opt.mode;
        return (
          <button
            key={opt.mode}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setTheme(opt.mode)}
            title={opt.title}
            className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all focus-visible:outline-2 focus-visible:outline-red-500 ${
              active
                ? "bg-white dark:bg-stone-800 text-red-600 dark:text-red-400 shadow-xs font-semibold"
                : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-100/50 dark:hover:bg-stone-800/50"
            }`}
          >
            {opt.icon}
            <span className="hidden sm:inline text-[11px]">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
