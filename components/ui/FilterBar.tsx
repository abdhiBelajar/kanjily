"use client";

import { CATEGORY_META } from "@/lib/data/kanjiCategories";

export type CategoryGroup = "all" | "jlpt" | "grade" | "curriculum";

interface FilterBarProps {
  categoryGroup: CategoryGroup;
  onCategoryGroupChange: (group: CategoryGroup) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  sortBy: "default" | "strokes-asc" | "strokes-desc" | "character";
  onSortChange: (sort: "default" | "strokes-asc" | "strokes-desc" | "character") => void;
  totalCount: number;
}

const GROUP_OPTIONS: { id: CategoryGroup; label: string; icon: string }[] = [
  { id: "all", label: "Semua Kategori", icon: "全" },
  { id: "jlpt", label: "Level JLPT (N5-N1)", icon: "試" },
  { id: "grade", label: "Grade Sekolah (1-8)", icon: "学" },
  { id: "curriculum", label: "Standar & Kurikulum", icon: "常" }
];

export default function FilterBar({
  categoryGroup,
  onCategoryGroupChange,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  totalCount
}: FilterBarProps) {
  // Filter subcategories according to active category group
  const activeSubcategories = CATEGORY_META.filter((cat) => {
    if (categoryGroup === "all") return true;
    return cat.type === categoryGroup;
  });

  return (
    <div className="space-y-3 py-3 border-y border-stone-200 dark:border-stone-800 text-sm">
      {/* Group Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none" role="tablist" aria-label="Kelompok Kategori">
        <span className="text-xs font-semibold text-stone-500 dark:text-stone-400 mr-1 shrink-0">
          Kategori:
        </span>
        {GROUP_OPTIONS.map((grp) => {
          const isSelected = categoryGroup === grp.id;
          return (
            <button
              key={grp.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => {
                onCategoryGroupChange(grp.id);
                if (grp.id === "all") {
                  onCategoryChange("all");
                } else if (grp.id === "jlpt") {
                  onCategoryChange("jlpt-5");
                } else if (grp.id === "grade") {
                  onCategoryChange("grade-1");
                } else if (grp.id === "curriculum") {
                  onCategoryChange("joyo");
                }
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-red-500 ${
                isSelected
                  ? "bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-xs"
                  : "bg-stone-100 text-stone-600 dark:bg-stone-850 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-800"
              }`}
            >
              <span className="font-kanji text-xs opacity-75">{grp.icon}</span>
              <span>{grp.label}</span>
            </button>
          );
        })}
      </div>

      {/* Subcategory Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none" role="tablist" aria-label="Kategori Spesifik">
        <button
          type="button"
          onClick={() => onCategoryChange("all")}
          className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-red-500 ${
            selectedCategory === "all"
              ? "bg-red-600 text-white font-semibold shadow-xs"
              : "bg-stone-100 text-stone-700 dark:bg-stone-850 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800"
          }`}
        >
          Semua ({CATEGORY_META.reduce((acc, c) => (c.type === "jlpt" ? acc + c.count : acc), 0)})
        </button>

        {activeSubcategories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onCategoryChange(cat.id)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-red-500 ${
                isSelected
                  ? "bg-red-600 text-white font-semibold shadow-xs"
                  : "bg-stone-100 text-stone-700 dark:bg-stone-850 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800"
              }`}
            >
              <span>{cat.name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isSelected
                    ? "bg-red-700 text-white"
                    : "bg-stone-200 text-stone-600 dark:bg-stone-750 dark:text-stone-400"
                }`}
              >
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Bottom bar: Sort selection & total result indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-stone-100 dark:border-stone-850 text-xs">
        <div className="flex items-center gap-2">
          <label htmlFor="sort-select" className="text-stone-500 dark:text-stone-400 font-medium shrink-0">
            Urutkan:
          </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as "default" | "strokes-asc" | "strokes-desc" | "character")}
            className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-200 rounded-md px-2.5 py-1 text-xs focus:ring-1 focus:ring-red-500 focus:outline-none"
          >
            <option value="default">Urutan Standar KANJIDIC</option>
            <option value="strokes-asc">Jumlah Goresan: Sedikit ke Banyak</option>
            <option value="strokes-desc">Jumlah Goresan: Banyak ke Sedikit</option>
            <option value="character">Abjad Karakter (A-Z)</option>
          </select>
        </div>

        <div className="flex items-center gap-2 text-stone-500 dark:text-stone-400">
          <span>Menampilkan</span>
          <span className="font-mono font-semibold text-stone-900 dark:text-stone-100 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded">
            {totalCount} kanji
          </span>
        </div>
      </div>
    </div>
  );
}
