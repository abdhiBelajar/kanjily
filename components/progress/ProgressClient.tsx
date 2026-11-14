"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useProgress } from "@/hooks/useProgress";
import { useIsMounted } from "@/hooks/useIsMounted";
import { getQuizHistory, clearQuizHistory } from "@/lib/storage/quizHistory";
import { formatDuration } from "@/lib/utils/scoring";
import { JLPTLevel } from "@/types/kanji";
import ProgressBar from "@/components/ui/ProgressBar";

export default function ProgressClient() {
  const { stats, isLoaded, resetAll } = useProgress();
  const isMounted = useIsMounted();
  const [dataVersion, setDataVersion] = useState(0);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const history = useMemo(() => {
    if (!isMounted) return [];
    void dataVersion;
    return getQuizHistory();
  }, [isMounted, dataVersion]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleReset = () => {
    resetAll();
    clearQuizHistory();
    setDataVersion((v) => v + 1);
    setShowResetConfirm(false);
    showToast("Seluruh riwayat dan progres belajar berhasil direset.");
  };

  const levels: JLPTLevel[] = ["N5", "N4", "N3", "N2", "N1"];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Toast Feedback */}
      {toastMessage && (
        <div
          role="status"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 text-xs font-semibold rounded-lg shadow-lg border border-stone-700 animate-fadeIn"
        >
          <span>✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header section with Backup & Reset actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 text-xs font-semibold mb-2">
            <span className="font-kanji">学習進捗</span>
            <span>Statistik Belajar</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
            Progres & Rekapitulasi Belajar
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1 max-w-2xl">
            Semua catatan belajar dan riwayat nilai kuis tersimpan di localStorage browser perangkat Anda.
          </p>
        </div>

        {/* Data Tools: Reset Data */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="px-3 py-1.5 rounded-lg border border-rose-200 dark:border-rose-900 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
          >
            Reset Data
          </button>
        </div>
      </div>

      {/* Main Highlights Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-xs">
          <div className="text-xs font-semibold text-stone-500 dark:text-stone-400">Total Kanji Dilihat</div>
          <div className="text-3xl font-extrabold text-stone-900 dark:text-stone-100 mt-1">
            {isLoaded ? stats.totalSeen : 0}
          </div>
          <div className="text-[11px] text-stone-400 dark:text-stone-500 mt-1">Karakter unik dipelajari</div>
        </div>

        <div className="p-5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-xs">
          <div className="text-xs font-semibold text-stone-500 dark:text-stone-400">Kanji Dikuasai</div>
          <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
            {isLoaded ? stats.totalMastered : 0}
          </div>
          <div className="text-[11px] text-stone-400 dark:text-stone-500 mt-1">Benar ≥ 3x berturut-turut</div>
        </div>

        <div className="p-5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-xs">
          <div className="text-xs font-semibold text-stone-500 dark:text-stone-400">Akurasi Rata-rata</div>
          <div className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">
            {isLoaded ? stats.overallAccuracy : 0}%
          </div>
          <div className="text-[11px] text-stone-400 dark:text-stone-500 mt-1">
            {isLoaded ? stats.totalCorrect : 0} dari {isLoaded ? stats.totalAttempts : 0} jawaban benar
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-xs">
          <div className="text-xs font-semibold text-stone-500 dark:text-stone-400">Hari Belajar Aktif</div>
          <div className="text-3xl font-extrabold text-red-600 dark:text-red-500 mt-1">
            {isLoaded ? stats.streakDays : 0}
          </div>
          <div className="text-[11px] text-stone-400 dark:text-stone-500 mt-1">Sesi tercatat di peramban</div>
        </div>
      </div>

      {/* Accuracy per JLPT Level */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 sm:p-8 shadow-xs">
        <h2 className="text-base font-bold text-stone-900 dark:text-stone-100 mb-6 flex items-center gap-2">
          <span className="w-1.5 h-4 bg-red-600 rounded-full" />
          <span>Penguasaan Karakter Per Tingkat JLPT</span>
        </h2>

        <div className="space-y-5">
          {levels.map((lvl) => {
            const data = stats.levelBreakdown[lvl];
            const hasData = data && data.total > 0;
            return (
              <div key={lvl} className="p-4 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-850 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded font-bold bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200">
                      JLPT {lvl}
                    </span>
                    <span className="text-stone-500 dark:text-stone-400">
                      {hasData ? `${data.seen} dari ${data.total} kanji dipelajari` : "Belum ada dataset kanji"}
                    </span>
                  </div>
                  {hasData && (
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {data.mastered} dikuasai ({data.accuracy}% akurasi)
                    </span>
                  )}
                </div>

                <ProgressBar
                  current={hasData ? data.seen : 0}
                  total={hasData ? data.total : 1}
                  showPercent={false}
                  color={lvl === "N5" ? "red" : lvl === "N4" ? "emerald" : "blue"}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Quiz History Timeline / Table */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-850 mb-5">
          <h2 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <span className="w-1.5 h-4 bg-red-600 rounded-full" />
            <span>Riwayat Skor Kuis ({isMounted ? history.length : "..."})</span>
          </h2>
        </div>

        {!isMounted ? (
          <div className="py-6 space-y-3 animate-pulse">
            <div className="h-4 bg-stone-100 dark:bg-stone-850 rounded w-1/4" />
            <div className="h-10 bg-stone-100 dark:bg-stone-850 rounded w-full" />
            <div className="h-10 bg-stone-100 dark:bg-stone-850 rounded w-full" />
          </div>
        ) : history.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Belum ada riwayat kuis tersimpan. Selesaikan set kuis untuk melihat riwayat skor di sini.
            </p>
            <Link
              href="/quiz"
              className="inline-block mt-3 px-4 py-2 text-xs font-semibold rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
            >
              Mulai Kuis Pertama
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-stone-200 dark:border-stone-800 text-stone-500 dark:text-stone-400 uppercase font-semibold">
                <tr>
                  <th scope="col" className="pb-3 pr-4">Paket Kuis</th>
                  <th scope="col" className="pb-3 px-4">Nilai</th>
                  <th scope="col" className="pb-3 px-4">Durasi</th>
                  <th scope="col" className="pb-3 px-4">Tanggal</th>
                  <th scope="col" className="pb-3 pl-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-850">
                {history.map((item) => (
                  <tr key={item.id} className="hover:bg-stone-50 dark:hover:bg-stone-850/50">
                    <td className="py-3.5 pr-4 font-semibold text-stone-900 dark:text-stone-100">
                      {item.set_title}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${
                          item.percentage >= 80
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                            : item.percentage >= 60
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                            : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                        }`}
                      >
                        {item.percentage}% ({item.score}/{item.total})
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-stone-600 dark:text-stone-300">
                      {formatDuration(item.duration_seconds)}
                    </td>
                    <td className="py-3.5 px-4 text-stone-500 dark:text-stone-400">
                      {item.date}
                    </td>
                    <td className="py-3.5 pl-4 text-right">
                      <Link
                        href={`/quiz/${item.set_id}`}
                        className="text-red-600 dark:text-red-400 hover:underline font-semibold"
                      >
                        Main Lagi
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirmation Modal: Reset Data (R-26, R-32) */}
      {showResetConfirm && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="reset-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn"
          onKeyDown={(e) => {
            if (e.key === "Escape") setShowResetConfirm(false);
          }}
        >
          <div className="w-full max-w-sm bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-2xl">
            <h3 id="reset-modal-title" className="text-base font-bold text-stone-900 dark:text-stone-100 mb-2">
              Atur Ulang Seluruh Progres?
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed mb-6">
              Tindakan ini akan menghapus semua status kanji yang sudah dipelajari dan seluruh riwayat nilai kuis di peramban ini. Tindakan ini tidak dapat dibatalkan kecuali Anda memiliki file cadangan JSON.
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 text-xs font-semibold rounded-lg text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-rose-600 hover:bg-rose-700 text-white transition-colors"
              >
                Ya, Hapus Semua Progres
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

