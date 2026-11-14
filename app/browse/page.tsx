"use client";

import { useState, useMemo } from "react";
import { useKanji } from "@/hooks/useKanji";
import { useProgress } from "@/hooks/useProgress";
import SearchInput from "@/components/ui/SearchInput";
import FilterBar, { CategoryGroup } from "@/components/ui/FilterBar";
import KanjiGrid from "@/components/kanji/KanjiGrid";
import { CATEGORY_LISTS, getCategoryMeta } from "@/lib/data/kanjiCategories";
import { searchKanji } from "@/lib/api/kanjiApi";

export default function BrowsePage() {
  const { kanjiList: allKanji, loading } = useKanji();
  const { progress } = useProgress();

  const [categoryGroup, setCategoryGroup] = useState<CategoryGroup>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"default" | "strokes-asc" | "strokes-desc" | "character">("default");

  // Filter kanji by selected category, search query, and sort
  const filteredKanji = useMemo(() => {
    let result = allKanji;

    // Category filter
    if (selectedCategory !== "all" && CATEGORY_LISTS[selectedCategory]) {
      const allowedChars = new Set(CATEGORY_LISTS[selectedCategory]);
      result = result.filter((k) => allowedChars.has(k.character));
    }

    // Search query
    if (searchQuery.trim()) {
      result = searchKanji(searchQuery, result);
    }

    // Sorting
    if (sortBy === "strokes-asc") {
      result = [...result].sort((a, b) => a.strokes - b.strokes);
    } else if (sortBy === "strokes-desc") {
      result = [...result].sort((a, b) => b.strokes - a.strokes);
    } else if (sortBy === "character") {
      result = [...result].sort((a, b) => a.character.localeCompare(b.character));
    }

    return result;
  }, [allKanji, selectedCategory, searchQuery, sortBy]);

  const activeCategoryMeta = selectedCategory !== "all" ? getCategoryMeta(selectedCategory) : null;

  const handleResetFilters = () => {
    setSearchQuery("");
    setCategoryGroup("all");
    setSelectedCategory("all");
    setSortBy("default");
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header section */}
      <div>
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 text-xs font-semibold mb-2">
          <span className="font-kanji">漢字目録</span>
          <span>Katalog Kanji Lengkap API</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
          Koleksi Karakter Kanji Berdasarkan Kategori Resmi
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1 max-w-2xl">
          Eksplorasi ribuan karakter kanji sesuai kategori resmi kanjiapi.dev: Level JLPT (N5-N1), Grade Sekolah Jepang (1-8), Kyōiku Kanji, Jōyō Kanji, Jinmeiyō, dan Indeks Heisig RTK.
        </p>
      </div>

      {/* Active Category Header Card (if selected) */}
      {activeCategoryMeta && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-red-50 to-stone-50 dark:from-red-950/20 dark:to-stone-900 border border-red-200/60 dark:border-red-900/40 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-red-600 text-white font-kanji font-bold text-lg shadow-xs">
              {activeCategoryMeta.nameJp.slice(0, 1)}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  {activeCategoryMeta.name}
                </h2>
                <span className="text-xs font-mono font-medium text-stone-500 dark:text-stone-400">
                  ({activeCategoryMeta.nameJp})
                </span>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5">
                {activeCategoryMeta.desc}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className="text-xs font-medium text-red-600 dark:text-red-400 hover:underline shrink-0"
          >
            Tampilkan Semua
          </button>
        </div>
      )}

      {/* Search Input Bar */}
      <SearchInput
        value={searchQuery}
        onChange={setSearchQuery}
        onClear={() => setSearchQuery("")}
        placeholder="Cari kanji (日, 月), arti (air, sun), romaji (nichiyoubi), atau keyword Heisig..."
      />

      {/* Filter and Sort Toolbar */}
      <FilterBar
        categoryGroup={categoryGroup}
        onCategoryGroupChange={setCategoryGroup}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        sortBy={sortBy}
        onSortChange={setSortBy}
        totalCount={filteredKanji.length}
      />

      {/* Kanji Grid display */}
      <KanjiGrid
        kanjiList={filteredKanji}
        progressRecord={progress}
        loading={loading}
        onResetFilters={handleResetFilters}
      />
    </div>
  );
}
