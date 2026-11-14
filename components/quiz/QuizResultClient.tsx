"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useIsMounted } from "@/hooks/useIsMounted";
import { getLastPlayedQuiz } from "@/lib/storage/quizHistory";
import { formatDuration, getScoreEvaluation } from "@/lib/utils/scoring";

export default function QuizResultClient() {
  const isMounted = useIsMounted();

  const historyItem = useMemo(() => {
    if (!isMounted) return null;
    return getLastPlayedQuiz();
  }, [isMounted]);

  if (!isMounted) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 py-4 animate-pulse">
        <div className="h-64 rounded-2xl bg-stone-100 dark:bg-stone-850 border border-stone-200 dark:border-stone-800" />
      </div>
    );
  }

  // R-27: Empty state if no history
  if (!historyItem) {
    return (
      <div className="flex flex-col items-center justify-center p-8 sm:p-16 my-8 text-center bg-white dark:bg-stone-900 border border-dashed border-stone-300 dark:border-stone-700 rounded-2xl max-w-md mx-auto">
        <span className="font-kanji text-6xl text-stone-300 dark:text-stone-700 mb-3">試</span>
        <h1 className="text-lg font-bold text-stone-800 dark:text-stone-200 mb-1">
          Belum Ada Hasil Kuis
        </h1>
        <p className="text-xs text-stone-500 dark:text-stone-400 mb-5">
          Anda belum menyelesaikan sesi kuis apa pun. Mulai kuis pertama Anda sekarang!
        </p>
        <Link
          href="/quiz"
          className="px-4 py-2 text-xs font-semibold rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors"
        >
          Pilih Paket Kuis
        </Link>
      </div>
    );
  }

  const evaluation = getScoreEvaluation(historyItem.percentage);

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-4 animate-fadeIn">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 sm:p-8 text-center shadow-xs">
        <span className="text-xs uppercase tracking-wider font-semibold text-stone-500 dark:text-stone-400">
          Hasil Kuis Terakhir: {historyItem.set_title}
        </span>

        {/* Score Display */}
        <div className="my-5">
          <div className="inline-flex flex-col items-center justify-center w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-red-600 bg-red-50/50 dark:bg-red-950/20 text-red-600 dark:text-red-500">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {historyItem.percentage}%
            </span>
            <span className="text-xs font-semibold text-stone-600 dark:text-stone-300">
              {historyItem.score} / {historyItem.total} Benar
            </span>
          </div>
        </div>

        <div className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-2">
          <span className={`px-3 py-1 rounded-full ${evaluation.badgeColor}`}>
            {evaluation.title}
          </span>
        </div>
        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 max-w-md mx-auto leading-relaxed mt-2">
          {evaluation.advice}
        </p>

        {/* Metrics */}
        <div className="mt-4 pt-4 border-t border-stone-100 dark:border-stone-850 flex items-center justify-center gap-6 text-xs text-stone-500 dark:text-stone-400">
          <div>
            Durasi: <strong className="text-stone-800 dark:text-stone-200">{formatDuration(historyItem.duration_seconds)}</strong>
          </div>
          <div>
            Tanggal: <strong className="text-stone-800 dark:text-stone-200">{historyItem.date}</strong>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
          <Link
            href={`/quiz/${historyItem.set_id}`}
            className="px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-xs shadow-xs transition-colors"
          >
            Mainkan Kuis Ini Lagi
          </Link>
          <Link
            href="/quiz"
            className="px-5 py-2.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-850 font-semibold text-xs transition-colors"
          >
            Pilih Kuis Lain
          </Link>
          <Link
            href="/progress"
            className="px-5 py-2.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-850 font-semibold text-xs transition-colors"
          >
            Lihat Rekap Progres
          </Link>
        </div>
      </div>
    </div>
  );
}

