import { KanjiData } from "@/types/kanji";
import { KanjiProgressRecord } from "@/types/progress";
import KanjiCard from "./KanjiCard";

interface KanjiGridProps {
  kanjiList: KanjiData[];
  progressRecord: KanjiProgressRecord;
  loading?: boolean;
  onResetFilters?: () => void;
}

export default function KanjiGrid({
  kanjiList,
  progressRecord,
  loading = false,
  onResetFilters
}: KanjiGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 my-6">
        {Array.from({ length: 10 }).map((_, idx) => (
          <div
            key={idx}
            className="animate-pulse bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-4 h-44 flex flex-col justify-between"
          >
            <div className="flex justify-between items-center">
              <div className="h-4 w-12 bg-stone-200 dark:bg-stone-800 rounded" />
              <div className="h-3 w-8 bg-stone-200 dark:bg-stone-800 rounded" />
            </div>
            <div className="h-16 w-16 mx-auto bg-stone-200 dark:bg-stone-800 rounded my-2" />
            <div className="space-y-1.5 pt-2 border-t border-stone-100 dark:border-stone-850">
              <div className="h-3.5 w-3/4 bg-stone-200 dark:bg-stone-800 rounded" />
              <div className="h-3 w-1/2 bg-stone-200 dark:bg-stone-800 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // R-27: Empty state
  if (kanjiList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 sm:p-12 my-8 text-center bg-white dark:bg-stone-900 border border-dashed border-stone-300 dark:border-stone-700 rounded-xl">
        <span className="font-kanji text-5xl text-stone-300 dark:text-stone-700 mb-3">無</span>
        <h2 className="text-base font-bold text-stone-800 dark:text-stone-200 mb-1">
          Tidak Ada Kanji Ditemukan
        </h2>
        <p className="text-xs text-stone-500 dark:text-stone-400 max-w-sm mb-4">
          Tidak ada karakter kanji yang cocok dengan kriteria pencarian atau filter yang dipilih saat ini.
        </p>
        {onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors focus-visible:outline-2 focus-visible:outline-red-500"
          >
            Atur Ulang Filter
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 my-6">
      {kanjiList.map((k) => (
        <KanjiCard
          key={k.character}
          kanji={k}
          progress={progressRecord[k.character]}
        />
      ))}
    </div>
  );
}

