"use client";

import { useState, useMemo } from "react";
import { QuizSet } from "@/types/quiz";
import { getQuizSets, deleteQuizSet } from "@/lib/storage/quizSets";
import { getQuizHistory } from "@/lib/storage/quizHistory";
import { useKanji } from "@/hooks/useKanji";
import { useIsMounted } from "@/hooks/useIsMounted";
import QuizSetCard from "@/components/quiz/QuizSetCard";
import QuizBuilder from "@/components/quiz/QuizBuilder";

export default function QuizListClient() {
  const { kanjiList } = useKanji();
  const isMounted = useIsMounted();
  const [dataVersion, setDataVersion] = useState(0);
  const [isBuilding, setIsBuilding] = useState(false);
  const [autoGenerateImmediate, setAutoGenerateImmediate] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const sets = useMemo(() => {
    if (!isMounted) return [];
    void dataVersion;
    return getQuizSets();
  }, [isMounted, dataVersion]);

  const historyScores = useMemo(() => {
    if (!isMounted) return {};
    void dataVersion;
    const history = getQuizHistory();
    const scoreMap: Record<string, number> = {};
    history.forEach((h) => {
      if (scoreMap[h.set_id] === undefined) {
        scoreMap[h.set_id] = h.percentage;
      }
    });
    return scoreMap;
  }, [isMounted, dataVersion]);

  const refreshData = () => {
    setDataVersion((v) => v + 1);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDeleteSet = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus set kuis ini?")) {
      deleteQuizSet(id);
      refreshData();
      showToast("Set kuis berhasil dihapus.");
    }
  };

  const handleSetCreated = (newSet: QuizSet) => {
    setIsBuilding(false);
    refreshData();
    showToast(`Set kuis "${newSet.title}" berhasil dibuat!`);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Toast feedback */}
      {toastMessage && (
        <div
          role="status"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 text-xs font-semibold rounded-lg shadow-lg border border-stone-700 animate-fadeIn"
        >
          <span>✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header with Title and Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 text-xs font-semibold mb-2">
            <span className="font-kanji">腕試し</span>
            <span>Uji Pemahaman</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
            Latihan Kuis Kanji
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1 max-w-2xl">
            Pilih paket latihan yang tersedia atau susun paket kuis baru untuk menguji hafalan arti dan bacaan kanji secara adaptif.
          </p>
        </div>

        {!isBuilding && (
          <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
            <button
              type="button"
              onClick={() => {
                setAutoGenerateImmediate(true);
                setIsBuilding(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5 focus-visible:outline-2 focus-visible:outline-red-500"
            >
              <span>⚡</span>
              <span>Generate Kuis Otomatis</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setAutoGenerateImmediate(false);
                setIsBuilding(true);
              }}
              className="px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 focus-visible:outline-2 focus-visible:outline-stone-500"
            >
              <span>+</span>
              <span>Buat Manual</span>
            </button>
          </div>
        )}
      </div>

      {/* Quiz Builder form toggle */}
      {isBuilding && (
        <QuizBuilder
          allKanji={kanjiList}
          autoGenerateOnMount={autoGenerateImmediate}
          onSetCreated={handleSetCreated}
          onCancel={() => {
            setIsBuilding(false);
            setAutoGenerateImmediate(false);
          }}
        />
      )}

      {/* Preset & Custom Sets Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 border-b border-stone-200 dark:border-stone-800 pb-2">
          <span className="font-semibold text-stone-700 dark:text-stone-300">
            Daftar Set Kuis Tersedia ({isMounted ? sets.length : "..."})
          </span>
          <span>Pilih untuk memulai</span>
        </div>

        {!isMounted ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-44 rounded-2xl bg-stone-100 dark:bg-stone-850 animate-pulse border border-stone-200 dark:border-stone-800"
              />
            ))}
          </div>
        ) : sets.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl">
            <p className="text-xs text-stone-500">Belum ada set kuis. Klik tombol di atas untuk membuat.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sets.map((set) => (
              <QuizSetCard
                key={set.id}
                quizSet={set}
                onDelete={handleDeleteSet}
                lastScore={historyScores[set.id]}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

