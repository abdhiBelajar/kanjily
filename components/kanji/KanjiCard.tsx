import Link from "next/link";
import { KanjiData } from "@/types/kanji";
import { KanjiProgressItem } from "@/types/progress";
import Badge from "@/components/ui/Badge";

interface KanjiCardProps {
  kanji: KanjiData;
  progress?: KanjiProgressItem | null;
}

export default function KanjiCard({ kanji, progress }: KanjiCardProps) {
  const isMastered = progress?.mastered;
  const isSeen = progress && progress.seen > 0;

  return (
    <Link
      href={`/browse/${encodeURIComponent(kanji.character)}`}
      className="group relative flex flex-col justify-between p-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl hover:border-red-400 dark:hover:border-red-600/60 hover:shadow-md transition-all duration-200 focus-visible:outline-2 focus-visible:outline-red-500"
    >
      {/* Top badges: JLPT + Mastery indicator */}
      <div className="flex items-center justify-between gap-1 mb-2">
        <Badge level={kanji.jlpt} variant="jlpt" />
        <div className="flex items-center gap-1.5">
          {isMastered ? (
            <span
              className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
              title="Sudah dikuasai"
            >
              ✓ Dikuasai
            </span>
          ) : isSeen ? (
            <span
              className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
              title={`Sudah dilihat ${progress.seen}x`}
            >
              {progress.seen}x latihan
            </span>
          ) : null}
          <span className="text-[11px] text-stone-600 dark:text-stone-300 font-mono">
            {kanji.strokes}g
          </span>
        </div>
      </div>

      {/* Main Kanji Character */}
      <div className="my-2 text-center py-2">
        <span className="font-kanji text-5xl sm:text-6xl text-stone-900 dark:text-stone-100 group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors select-none">
          {kanji.character}
        </span>
      </div>

      {/* Bottom Info: Meanings and Readings */}
      <div className="border-t border-stone-100 dark:border-stone-850 pt-2.5 mt-1 space-y-1">
        <div className="text-xs font-bold text-stone-800 dark:text-stone-200 truncate" title={kanji.meaningId || kanji.meaning}>
          {kanji.meaningId || kanji.meaning}
        </div>
        <div className="flex items-center justify-between text-[11px] text-stone-600 dark:text-stone-300 truncate">
          <span className="truncate" title={kanji.kunyomi[0] ? `Kun: ${kanji.kunyomi[0]}` : ""}>
            {kanji.kunyomi[0] || kanji.onyomi[0] || "-"}
          </span>
          {kanji.onyomi[0] && (
            <span className="text-stone-600 dark:text-stone-300 font-kanji text-[10px] shrink-0 ml-1">
              {kanji.onyomi[0]}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

