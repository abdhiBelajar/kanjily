import Link from "next/link";
import { QuizSet } from "@/types/quiz";

interface QuizSetCardProps {
  quizSet: QuizSet;
  onDelete?: (id: string) => void;
  lastScore?: number | null;
}

export default function QuizSetCard({ quizSet, onDelete, lastScore }: QuizSetCardProps) {
  const typeLabels = {
    meaning: "Tebak Arti",
    reading: "Tebak Bacaan",
    kanji: "Tebak Kanji",
    mixed: "Campuran"
  };

  return (
    <div className="flex flex-col justify-between bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-5 hover:border-red-400 dark:hover:border-red-600/60 hover:shadow-md transition-all">
      <div>
        {/* Top badges: Type and Kanji Count */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300 border border-red-200 dark:border-red-900">
            {typeLabels[quizSet.quiz_type]}
          </span>
          <span className="text-xs text-stone-500 dark:text-stone-400 font-mono">
            {quizSet.kanji_list.length} Kanji
          </span>
        </div>

        {/* Set Title & Description */}
        <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 line-clamp-1 mb-1">
          {quizSet.title}
        </h3>
        <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2 mb-4 leading-relaxed">
          {quizSet.description}
        </p>

        {/* Kanji Preview List */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {quizSet.kanji_list.slice(0, 8).map((char, idx) => (
            <span
              key={idx}
              className="w-7 h-7 flex items-center justify-center rounded-md bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-kanji text-sm font-semibold"
            >
              {char}
            </span>
          ))}
          {quizSet.kanji_list.length > 8 && (
            <span className="w-7 h-7 flex items-center justify-center rounded-md bg-stone-50 dark:bg-stone-950 text-stone-400 text-xs font-mono">
              +{quizSet.kanji_list.length - 8}
            </span>
          )}
        </div>
      </div>

      {/* Footer: Last score & Action buttons */}
      <div className="pt-3 border-t border-stone-100 dark:border-stone-850 flex items-center justify-between gap-2">
        <div>
          {lastScore !== undefined && lastScore !== null ? (
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
              Skor Terakhir: {lastScore}%
            </span>
          ) : (
            <span className="text-xs text-stone-400 dark:text-stone-600">Belum pernah dimainkan</span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {!quizSet.is_preset && onDelete && (
            <button
              type="button"
              onClick={() => onDelete(quizSet.id)}
              aria-label={`Hapus set kuis ${quizSet.title}`}
              className="p-1.5 text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors rounded"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}

          <Link
            href={`/quiz/${quizSet.id}`}
            className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-xs shadow-xs transition-colors focus-visible:outline-2 focus-visible:outline-red-500"
          >
            Mulai Kuis
          </Link>
        </div>
      </div>
    </div>
  );
}

