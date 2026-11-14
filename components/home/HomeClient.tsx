"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useProgress } from "@/hooks/useProgress";
import { useIsMounted } from "@/hooks/useIsMounted";
import { KANJI_DATASET, PRESET_QUIZ_SETS } from "@/lib/data/kanjiDataset";
import { CATEGORY_META } from "@/lib/data/kanjiCategories";
import { getLastPlayedQuiz } from "@/lib/storage/quizHistory";
import { KanjiData } from "@/types/kanji";
import Badge from "@/components/ui/Badge";
import ProgressBar from "@/components/ui/ProgressBar";
import { useSpeech } from "@/hooks/useSpeech";

function getInitialKanjiOfDay(): KanjiData {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24
  );
  return KANJI_DATASET[dayOfYear % KANJI_DATASET.length] || KANJI_DATASET[0];
}

export default function HomeClient() {
  const { stats, isLoaded } = useProgress();
  const isMounted = useIsMounted();
  const [kanjiOfDay] = useState<KanjiData>(getInitialKanjiOfDay);
  const { speakKanji, isSpeaking, speakingText } = useSpeech();

  const lastQuiz = useMemo(() => {
    if (!isMounted) return null;
    return getLastPlayedQuiz();
  }, [isMounted]);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Editorial Hero Section */}
      <section className="relative overflow-hidden bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-10 shadow-xs">
        {/* Subtle decorative watermark */}
        <div className="absolute right-4 -bottom-6 select-none opacity-5 dark:opacity-10 pointer-events-none">
          <span className="font-kanji text-[180px] sm:text-[240px] font-bold text-stone-900 dark:text-stone-100 leading-none">
            道
          </span>
        </div>

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200/60 dark:border-red-900/60 text-xs font-semibold mb-4">
            <span className="font-kanji">一歩一歩</span>
            <span>Belajar Kanji Mandiri Berbasis Web</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight leading-tight">
            Kuasai Karakter Kanji Jepang Melalui Latihan Interaktif
          </h1>

          <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 mt-3 leading-relaxed">
            Pelajari goresan, cara baca On&apos;yomi dan Kun&apos;yomi, serta uji ingatan Anda lewat kuis adaptif. Seluruh data progres tersimpan aman di browser Anda tanpa perlu membuat akun.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-6">
            <Link
              href="/quiz"
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm shadow-sm transition-colors focus-visible:outline-2 focus-visible:outline-red-500"
            >
              Mulai Latihan Kuis
            </Link>
            <Link
              href="/browse"
              className="px-5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-850 font-semibold text-sm transition-colors"
            >
              Jelajahi Koleksi Kanji
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Dashboard Grid: Progress Summary & Kanji of the Day */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Progress Metrics (7 cols) */}
        <section className="lg:col-span-7 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-850 mb-5">
              <h2 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-red-600 rounded-full" />
                <span>Ringkasan Progres Belajar</span>
              </h2>
              <Link
                href="/progress"
                className="text-xs font-semibold text-red-600 dark:text-red-400 hover:underline"
              >
                Lihat Detail Lengkap →
              </Link>
            </div>

            {/* 3 Metric Cards */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="p-3.5 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-850 rounded-xl text-center">
                <div className="text-[11px] font-semibold text-stone-600 dark:text-stone-300">Dipelajari</div>
                <div className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-stone-100 mt-0.5">
                  {isLoaded ? stats.totalSeen : 0}
                </div>
                <div className="text-[10px] text-stone-600 dark:text-stone-300">dari {KANJI_DATASET.length} kanji</div>
              </div>

              <div className="p-3.5 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-850 rounded-xl text-center">
                <div className="text-[11px] font-semibold text-stone-600 dark:text-stone-300">Dikuasai</div>
                <div className="text-xl sm:text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {isLoaded ? stats.totalMastered : 0}
                </div>
                <div className="text-[10px] text-stone-600 dark:text-stone-300">benar ≥ 3x</div>
              </div>

              <div className="p-3.5 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-850 rounded-xl text-center">
                <div className="text-[11px] font-semibold text-stone-600 dark:text-stone-300">Akurasi</div>
                <div className="text-xl sm:text-2xl font-extrabold text-blue-600 dark:text-blue-400 mt-0.5">
                  {isLoaded ? stats.overallAccuracy : 0}%
                </div>
                <div className="text-[10px] text-stone-600 dark:text-stone-300">{isLoaded ? stats.totalAttempts : 0} soal dijawab</div>
              </div>
            </div>

            {/* Level N5 Progress Bar */}
            <div className="space-y-3">
              <ProgressBar
                current={isLoaded ? stats.levelBreakdown.N5.seen : 0}
                total={stats.levelBreakdown.N5.total || 40}
                label="Progres Koleksi JLPT N5"
                color="red"
              />
            </div>
          </div>

          {/* Shortcut to Last Played Quiz or Preset */}
          <div className="mt-6 pt-4 border-t border-stone-100 dark:border-stone-850 flex items-center justify-between text-xs">
            {lastQuiz ? (
              <div className="flex items-center gap-2">
                <span className="text-stone-500 dark:text-stone-400">Kuis Terakhir:</span>
                <span className="font-semibold text-stone-800 dark:text-stone-200">{lastQuiz.set_title}</span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
                  {lastQuiz.percentage}%
                </span>
              </div>
            ) : (
              <span className="text-stone-500 dark:text-stone-400">
                Rekomendasi Set: <strong>{PRESET_QUIZ_SETS[0].title}</strong>
              </span>
            )}

            <Link
              href={lastQuiz ? `/quiz/${lastQuiz.set_id}` : `/quiz/${PRESET_QUIZ_SETS[0].id}`}
              className="font-semibold text-red-600 dark:text-red-400 hover:underline"
            >
              {lastQuiz ? "Main Lagi →" : "Mulai Preset →"}
            </Link>
          </div>
        </section>

        {/* Right Column: Kanji of the Day (5 cols) */}
        <section className="lg:col-span-5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-850 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-4 bg-red-600 rounded-full" />
                <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
                  Kanji Hari Ini (今日の漢字)
                </h2>
              </div>
              {kanjiOfDay && <Badge level={kanjiOfDay.jlpt} variant="jlpt" />}
            </div>

            {kanjiOfDay && (
              <div className="flex flex-col items-center text-center my-3">
                <div className="w-24 h-24 sm:w-28 sm:h-28 flex flex-col items-center justify-center rounded-2xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-850 shadow-inner">
                  <span className="font-kanji text-5xl sm:text-6xl text-stone-900 dark:text-stone-100">
                    {kanjiOfDay.character}
                  </span>
                  <button
                    type="button"
                    onClick={() => speakKanji(kanjiOfDay.character)}
                    title={`Dengarkan pelafalan kanji 「${kanjiOfDay.character}」`}
                    aria-label={`Dengarkan pelafalan kanji ${kanjiOfDay.character}`}
                    className={`mt-0.5 inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                      isSpeaking && speakingText === kanjiOfDay.character
                        ? "bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400 animate-pulse"
                        : "text-stone-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-stone-100 dark:hover:bg-stone-800"
                    }`}
                  >
                    <span>🔊</span>
                    <span>Dengar</span>
                  </button>
                </div>

                <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100 mt-3">
                  {kanjiOfDay.meaningId || kanjiOfDay.meaning}
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  {kanjiOfDay.strokes} Goresan | Radikal: {kanjiOfDay.radical || "-"}
                </p>

                <div className="mt-3 flex flex-wrap justify-center gap-1.5 text-xs">
                  {kanjiOfDay.kunyomi[0] && (
                    <span className="px-2 py-0.5 rounded bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 font-kanji">
                      Kun: {kanjiOfDay.kunyomi[0]}
                    </span>
                  )}
                  {kanjiOfDay.onyomi[0] && (
                    <span className="px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-kanji">
                      On: {kanjiOfDay.onyomi[0]}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {kanjiOfDay && (
            <div className="pt-3 border-t border-stone-100 dark:border-stone-850">
              <Link
                href={`/browse/${encodeURIComponent(kanjiOfDay.character)}`}
                className="w-full block py-2 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-center font-semibold text-xs text-stone-800 dark:text-stone-200 transition-colors"
              >
                Pelajari Urutan Goresan 「{kanjiOfDay.character}」 →
              </Link>
            </div>
          )}
        </section>
      </div>

      {/* Category Explorer Section */}
      <section className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-stone-100 dark:border-stone-850 mb-5">
          <div>
            <h2 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-red-600 rounded-full" />
              <span>Eksplorasi Kategori Kata Kanji Resmi (kanjiapi.dev)</span>
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              Pilih dari beragam kategori JLPT, kurikulum SD/SMP, Joyo, dan Heisig
            </p>
          </div>
          <Link
            href="/browse"
            className="text-xs font-semibold text-red-600 dark:text-red-400 hover:underline"
          >
            Buka Katalog Lengkap →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {CATEGORY_META.slice(0, 12).map((cat) => (
            <Link
              key={cat.id}
              href="/browse"
              className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-850 hover:border-red-300 dark:hover:border-red-700 transition-all text-center group"
            >
              <div className="text-[10px] font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                {cat.nameJp}
              </div>
              <div className="text-sm font-bold text-stone-900 dark:text-stone-100 mt-1 group-hover:text-red-600 transition-colors">
                {cat.name}
              </div>
              <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded-full bg-stone-200/70 dark:bg-stone-800 text-[11px] font-mono font-medium text-stone-700 dark:text-stone-300">
                {cat.count} kanji
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Quick Action Navigation Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <Link
          href="/browse"
          className="group p-5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl hover:border-red-400 dark:hover:border-red-600 transition-all shadow-xs"
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="w-8 h-8 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center font-kanji font-bold text-red-600 text-lg group-hover:bg-red-50">
              索
            </span>
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
              Pencarian Koleksi
            </h3>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
            Filter kanji berdasarkan level JLPT, jumlah goresan, dan cari kosakata dalam bahasa Indonesia atau Romaji.
          </p>
        </Link>

        <Link
          href="/quiz"
          className="group p-5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl hover:border-red-400 dark:hover:border-red-600 transition-all shadow-xs"
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="w-8 h-8 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center font-kanji font-bold text-red-600 text-lg group-hover:bg-red-50">
              問
            </span>
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
              Kuis Adaptif
            </h3>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
            Mainkan set kuis preset alam, angka, atau susun set kuis khusus Anda sendiri dengan pilihan tipe soal beragam.
          </p>
        </Link>

        <Link
          href="/progress"
          className="group p-5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl hover:border-red-400 dark:hover:border-red-600 transition-all shadow-xs"
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="w-8 h-8 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center font-kanji font-bold text-red-600 text-lg group-hover:bg-red-50">
              歩
            </span>
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
              Statistik Belajar
            </h3>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
            Pantau tingkat akurasi per level JLPT, riwayat kuis yang pernah diselesaikan, dan ekspor data cadangan JSON.
          </p>
        </Link>
      </section>
    </div>
  );
}
