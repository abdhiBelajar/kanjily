"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "@/hooks/useTheme";

interface NavItem {
  name: string;
  href: string;
  kanjiSub: string;
}

const NAV_ITEMS: NavItem[] = [
  { name: "Beranda", href: "/", kanjiSub: "ホーム" },
  { name: "Koleksi Kanji", href: "/browse", kanjiSub: "漢字一覧" },
  { name: "Kuis", href: "/quiz", kanjiSub: "クイズ" },
  { name: "Progres", href: "/progress", kanjiSub: "進捗" }
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { themeMode, setTheme } = useTheme();

  // Close mobile menu on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-200 dark:border-stone-800 bg-stone-50/90 dark:bg-stone-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo brand */}
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 group text-stone-900 dark:text-stone-100 focus-visible:outline-2 focus-visible:outline-red-500 rounded-md p-1"
          >
            <span className="flex items-center justify-center w-9 h-9 rounded-md bg-red-600 text-white font-kanji text-xl font-bold shadow-sm group-hover:bg-red-700 transition-colors">
              漢
            </span>
            <div className="flex flex-col leading-tight">
              <span className="font-extrabold tracking-tight text-base sm:text-lg">
                KANJI<span className="text-red-600 dark:text-red-500">LY</span>
              </span>
              <span className="text-[10px] text-stone-600 dark:text-stone-300 font-medium">漢字インタラクティブ</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2" aria-label="Navigasi Utama">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 focus-visible:outline-2 focus-visible:outline-red-500 ${
                    active
                      ? "bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300 font-semibold"
                      : "text-stone-600 hover:text-stone-900 hover:bg-stone-100 dark:text-stone-300 dark:hover:text-stone-100 dark:hover:bg-stone-900"
                  }`}
                >
                  <span>{item.name}</span>
                  <span className="text-[11px] opacity-70 font-kanji">{item.kanjiSub}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right actions: ThemeToggle & Mobile hamburger */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-900 focus-visible:outline-2 focus-visible:outline-red-500"
              aria-label={mobileMenuOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 px-4 pt-2 pb-4 space-y-1 animate-fadeIn">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-md text-base font-medium ${
                  active
                    ? "bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300 font-semibold"
                    : "text-stone-700 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-900"
                }`}
              >
                <span>{item.name}</span>
                <span className="text-xs text-stone-600 dark:text-stone-300 font-kanji">{item.kanjiSub}</span>
              </Link>
            );
          })}

          {/* Pengaturan Tema Mobile */}
          <div className="pt-3 mt-3 border-t border-stone-200 dark:border-stone-800 px-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-stone-600 dark:text-stone-400">
                Tema Tampilan
              </span>
              <span className="text-[11px] text-stone-500 dark:text-stone-400 capitalize">
                {themeMode === "light"
                  ? "Terang (Siang)"
                  : themeMode === "dark"
                  ? "Malam (Gelap)"
                  : "Sistem (Otomatis)"}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 p-1 rounded-lg bg-stone-200/70 dark:bg-stone-900 border border-stone-300/80 dark:border-stone-800">
              <button
                type="button"
                onClick={() => setTheme("light")}
                className={`flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  themeMode === "light"
                    ? "bg-white dark:bg-stone-800 text-red-600 dark:text-red-400 font-semibold shadow-xs"
                    : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200"
                }`}
              >
                <span>☀️</span>
                <span>Terang</span>
              </button>
              <button
                type="button"
                onClick={() => setTheme("dark")}
                className={`flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  themeMode === "dark"
                    ? "bg-white dark:bg-stone-800 text-red-600 dark:text-red-400 font-semibold shadow-xs"
                    : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200"
                }`}
              >
                <span>🌙</span>
                <span>Malam</span>
              </button>
              <button
                type="button"
                onClick={() => setTheme("system")}
                className={`flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  themeMode === "system"
                    ? "bg-white dark:bg-stone-800 text-red-600 dark:text-red-400 font-semibold shadow-xs"
                    : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200"
                }`}
              >
                <span>💻</span>
                <span>Sistem</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
