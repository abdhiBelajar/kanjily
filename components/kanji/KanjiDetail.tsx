"use client";

import { useState } from "react";
import Link from "next/link";
import { KanjiData } from "@/types/kanji";
import { useProgress } from "@/hooks/useProgress";
import { useWords } from "@/hooks/useWords";
import { useSpeech } from "@/hooks/useSpeech";
import { getQuizSets, addKanjiToQuizSet, saveQuizSet } from "@/lib/storage/quizSets";
import StrokeOrder from "./StrokeOrder";
import Badge from "@/components/ui/Badge";

interface KanjiDetailProps {
  kanji: KanjiData;
}

export default function KanjiDetail({ kanji }: KanjiDetailProps) {
  const { progress, toggleMastery } = useProgress();
  const { data: apiWords } = useWords(kanji.character);
  const {
    speak,
    speakKanji,
    speakReading,
    speakWord,
    isSpeaking,
    speakingText,
    isSupported,
  } = useSpeech();
  const currentProgress = progress[kanji.character];
  const isMastered = currentProgress?.mastered || false;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quizSets, setQuizSets] = useState(() => getQuizSets());
  const [selectedSetId, setSelectedSetId] = useState("");
  const [newSetTitle, setNewSetTitle] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggleMastery = () => {
    toggleMastery(kanji.character);
    showToast(isMastered ? "Status dikuasai dilepas." : "Kanji ditandai sudah dikuasai!");
  };

  const handleOpenAddModal = () => {
    const sets = getQuizSets();
    setQuizSets(sets);
    if (sets.length > 0) {
      setSelectedSetId(sets[0].id);
    }
    setIsModalOpen(true);
  };

  const handleAddToExistingSet = () => {
    if (!selectedSetId) return;
    const success = addKanjiToQuizSet(selectedSetId, kanji.character);
    setIsModalOpen(false);
    if (success) {
      showToast(`Kanji 「${kanji.character}」 berhasil ditambahkan ke set kuis.`);
    } else {
      showToast(`Kanji 「${kanji.character}」 sudah ada di set kuis ini.`);
    }
  };

  const handleCreateAndAdd = () => {
    if (!newSetTitle.trim()) return;
    const created = saveQuizSet({
      title: newSetTitle.trim(),
      description: `Kumpulan kanji khusus dibuat dari detail ${kanji.character}`,
      kanji_list: [kanji.character],
      quiz_type: "meaning"
    });
    setIsModalOpen(false);
    setNewSetTitle("");
    showToast(`Set kuis baru "${created.title}" berhasil dibuat dengan kanji ini.`);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 text-xs font-semibold rounded-lg shadow-lg border border-stone-700 animate-fadeIn"
        >
          <span>✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/browse"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-600 dark:text-stone-400 hover:text-red-600 dark:hover:text-red-500 transition-colors focus-visible:outline-2 focus-visible:outline-red-500 rounded p-1"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Kembali ke Koleksi</span>
        </Link>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleToggleMastery}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors focus-visible:outline-2 focus-visible:outline-red-500 ${
              isMastered
                ? "bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800"
                : "bg-white text-stone-700 border-stone-300 dark:bg-stone-900 dark:text-stone-300 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-850"
            }`}
          >
            {isMastered ? "✓ Sudah Dikuasai" : "Tandai Sudah Dipelajari"}
          </button>

          <button
            type="button"
            onClick={handleOpenAddModal}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-600 hover:bg-red-700 text-white shadow-xs transition-colors focus-visible:outline-2 focus-visible:outline-red-500"
          >
            + Tambah ke Quiz Set
          </button>
        </div>
      </div>

      {/* Hero Header Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 sm:p-8 shadow-xs">
        {/* Left Column: Big Character & Metadata */}
        <div className="lg:col-span-5 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-stone-100 dark:border-stone-850 pb-6 lg:pb-0 lg:pr-8">
          <div>
            <div className="flex flex-wrap items-center gap-1.5 mb-3">
              <Badge level={kanji.jlpt} variant="jlpt" />
              {kanji.grade && (
                <span className="text-xs px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 font-medium">
                  {kanji.grade <= 6 ? `Grade ${kanji.grade} SD` : kanji.grade === 8 ? "SMP (Joyo)" : "Jinmeiyo"}
                </span>
              )}
              {kanji.heisig_en && (
                <span className="text-xs px-2 py-0.5 rounded bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 font-medium border border-amber-200/60 dark:border-amber-900/40" title="Kata Kunci Heisig RTK">
                  RTK: {kanji.heisig_en}
                </span>
              )}
              {kanji.freq_mainichi_shinbun && (
                <span className="text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300 font-medium" title="Frekuensi Penggunaan di Surat Kabar">
                  Koran #{kanji.freq_mainichi_shinbun}
                </span>
              )}
              {kanji.unicode && (
                <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-500">
                  U+{kanji.unicode}
                </span>
              )}
              {isMastered && (
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 font-bold">
                  ✓ Dikuasai
                </span>
              )}
            </div>

            <div className="my-3 text-center py-4 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-850 rounded-xl relative group">
              <span className="font-kanji text-8xl sm:text-9xl text-stone-900 dark:text-stone-100 select-none block">
                {kanji.character}
              </span>
              <div className="mt-2 flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => speakKanji(kanji.character)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-200/70 hover:bg-stone-300 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-red-500"
                  title={`Dengarkan pelafalan kanji 「${kanji.character}」`}
                  aria-label={`Dengarkan pelafalan kanji ${kanji.character}`}
                >
                  <span className={isSpeaking && speakingText === kanji.character ? "animate-bounce text-red-600" : ""}>🔊</span>
                  <span>{isSpeaking && speakingText === kanji.character ? "Berbicara..." : "Dengar Kanji"}</span>
                </button>
              </div>
            </div>

            <div className="text-center mt-3">
              <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
                {kanji.meaningId || kanji.meaning}
              </h1>
              {kanji.meaningId && kanji.meaning !== kanji.meaningId && (
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                  Arti Inggris: {kanji.meaning}
                </p>
              )}
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-2 mt-6 pt-4 border-t border-stone-100 dark:border-stone-850 text-center">
            <div className="p-2 rounded-lg bg-stone-50 dark:bg-stone-950">
              <div className="text-[10px] uppercase font-semibold text-stone-500 dark:text-stone-400">Goresan</div>
              <div className="text-base font-bold text-stone-800 dark:text-stone-200">{kanji.strokes}</div>
            </div>
            <div className="p-2 rounded-lg bg-stone-50 dark:bg-stone-950">
              <div className="text-[10px] uppercase font-semibold text-stone-500 dark:text-stone-400">Radikal</div>
              <div className="text-base font-kanji font-bold text-red-600 dark:text-red-500">{kanji.radical || "-"}</div>
            </div>
            <div className="p-2 rounded-lg bg-stone-50 dark:bg-stone-950">
              <div className="text-[10px] uppercase font-semibold text-stone-500 dark:text-stone-400">Latihan</div>
              <div className="text-base font-bold text-stone-800 dark:text-stone-200">
                {currentProgress?.seen || 0}x
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Stroke Order Animation */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center">
          <StrokeOrder
            character={kanji.character}
            strokes={kanji.strokes}
            strokePaths={kanji.strokePaths}
          />
        </div>
      </div>

      {/* Readings Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Kun'yomi (Japanese Reading) */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-500">
              Kun&apos;yomi (訓読み)
            </span>
            <span className="text-xs text-stone-600 dark:text-stone-300">Cara baca asli Jepang (Hiragana)</span>
          </div>
          {kanji.kunyomi && kanji.kunyomi.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {kanji.kunyomi.map((read, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => speakReading(read)}
                  title={`Dengarkan bacaan Kun'yomi: ${read}`}
                  aria-label={`Dengarkan bacaan Kun'yomi ${read}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-800 dark:bg-red-950/40 dark:text-red-300 font-kanji text-base border border-red-200/60 dark:border-red-900/60 hover:bg-red-100 dark:hover:bg-red-900/60 transition-colors focus-visible:outline-2 focus-visible:outline-red-500"
                >
                  <span>{read}</span>
                  <span className="text-xs text-red-600 dark:text-red-400">🔊</span>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-xs text-stone-600 dark:text-stone-300 italic">Tidak ada bacaan Kun&apos;yomi umum.</p>
          )}
        </div>

        {/* On'yomi (Sino-Japanese Reading) */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
              On&apos;yomi (音読み)
            </span>
            <span className="text-xs text-stone-600 dark:text-stone-300">Cara baca serapan Tiongkok (Katakana)</span>
          </div>
          {kanji.onyomi && kanji.onyomi.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {kanji.onyomi.map((read, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => speakReading(read)}
                  title={`Dengarkan bacaan On'yomi: ${read}`}
                  aria-label={`Dengarkan bacaan On'yomi ${read}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 text-stone-800 dark:bg-stone-800 dark:text-stone-200 font-kanji text-base border border-stone-200 dark:border-stone-700 hover:bg-stone-200 dark:hover:bg-stone-750 transition-colors focus-visible:outline-2 focus-visible:outline-red-500"
                >
                  <span>{read}</span>
                  <span className="text-xs text-stone-600 dark:text-stone-400">🔊</span>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-xs text-stone-600 dark:text-stone-300 italic">Tidak ada bacaan On&apos;yomi umum.</p>
          )}
        </div>

        {/* Nanori (Name Readings) */}
        {kanji.name_readings && kanji.name_readings.length > 0 && (
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-5 shadow-xs md:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-500">
                Nanori (名乗り)
              </span>
              <span className="text-xs text-stone-600 dark:text-stone-300">Cara baca khusus nama orang dan tempat</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {kanji.name_readings.map((read, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => speakReading(read)}
                  title={`Dengarkan bacaan Nanori: ${read}`}
                  aria-label={`Dengarkan bacaan Nanori ${read}`}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-amber-900 dark:bg-amber-950/30 dark:text-amber-200 font-kanji text-sm border border-amber-200/50 dark:border-amber-900/40 hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors focus-visible:outline-2 focus-visible:outline-red-500"
                >
                  <span>{read}</span>
                  <span className="text-[11px] text-amber-700 dark:text-amber-400">🔊</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Vocabulary Examples Section */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-6 shadow-xs">
        <h2 className="text-base font-bold text-stone-900 dark:text-stone-100 mb-4 flex items-center gap-2">
          <span className="w-1.5 h-4 bg-red-600 rounded-full" />
          <span>Contoh Kosakata (単語例 : Tango Rei)</span>
        </h2>

        {kanji.examples && kanji.examples.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {kanji.examples.map((ex, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-lg hover:border-stone-300 dark:hover:border-stone-700 transition-colors"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-kanji text-lg font-bold text-stone-900 dark:text-stone-100">
                      {ex.word}
                    </span>
                    <button
                      type="button"
                      onClick={() => speakWord(ex.reading || ex.word)}
                      title={`Dengarkan kosakata ${ex.word}`}
                      aria-label={`Dengarkan kosakata ${ex.word}`}
                      className="p-1 rounded text-stone-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    >
                      🔊
                    </button>
                  </div>
                  <span className="text-xs text-red-600 dark:text-red-400 font-mono">
                    {ex.reading}
                  </span>
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
                  {ex.meaning}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-stone-600 dark:text-stone-300">Belum ada contoh kosakata tercatat.</p>
        )}

        {/* Extended Dictionary Vocabulary from KanjiAPI */}
        {apiWords && apiWords.length > 0 && (
          <div className="mt-5 pt-4 border-t border-stone-100 dark:border-stone-850">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-3 flex items-center gap-2">
              <span className="font-kanji text-red-600 dark:text-red-500 font-bold">語</span>
              <span>Kosakata Lengkap API ({apiWords.length})</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {apiWords.slice(0, 9).map((w, idx) => {
                const primaryVariant = w.variants[0];
                const gloss = w.meanings.map((m) => m.glosses.join("; ")).join(", ");
                const wordToPronounce =
                  primaryVariant?.pronounced ||
                  primaryVariant?.written ||
                  kanji.character;
                return (
                  <div
                    key={idx}
                    className="p-3 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-lg text-xs"
                  >
                    <div className="flex items-baseline justify-between gap-1 mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-kanji text-base font-bold text-stone-900 dark:text-stone-100">
                          {primaryVariant ? primaryVariant.written : kanji.character}
                        </span>
                        <button
                          type="button"
                          onClick={() => speakWord(wordToPronounce)}
                          title={`Dengarkan kosakata ${primaryVariant?.written || kanji.character}`}
                          aria-label={`Dengarkan kosakata ${primaryVariant?.written || kanji.character}`}
                          className="p-0.5 rounded text-stone-400 hover:text-red-600 dark:hover:text-red-400 transition-colors text-xs"
                        >
                          🔊
                        </button>
                      </div>
                      {primaryVariant?.pronounced && (
                        <span className="text-[11px] text-red-600 dark:text-red-400 font-mono">
                          {primaryVariant.pronounced}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-stone-600 dark:text-stone-400 line-clamp-2">
                      {gloss || "Definisi kata"}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Example Sentences Section */}
      {kanji.sentences && kanji.sentences.length > 0 && (
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-6 shadow-xs">
          <h2 className="text-base font-bold text-stone-900 dark:text-stone-100 mb-4 flex items-center gap-2">
            <span className="w-1.5 h-4 bg-red-600 rounded-full" />
            <span>Contoh Kalimat (例文 : Reibun)</span>
          </h2>

          <div className="space-y-3">
            {kanji.sentences.map((st, idx) => (
              <div
                key={idx}
                className="p-4 bg-stone-50 dark:bg-stone-950 border-l-4 border-red-600 rounded-r-lg"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="font-kanji text-base font-semibold text-stone-900 dark:text-stone-100">
                    {st.japanese}
                  </div>
                  <button
                    type="button"
                    onClick={() => speak(st.japanese, { lang: "ja-JP", rate: 0.85 })}
                    title="Dengarkan pelafalan kalimat lengkap"
                    aria-label={`Dengarkan pelafalan kalimat ${st.japanese}`}
                    className="p-1 rounded text-stone-400 hover:text-red-600 dark:hover:text-red-400 transition-colors text-sm"
                  >
                    🔊
                  </button>
                </div>
                <div className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                  {st.reading}
                </div>
                <p className="text-xs text-stone-700 dark:text-stone-300 mt-2 font-medium">
                  &ldquo;{st.meaning}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fallback info jika TTS tidak didukung browser */}
      {!isSupported && (
        <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/40 text-amber-800 dark:text-amber-300 text-xs">
          Peramban Anda belum mendukung Web Speech API Text-to-Speech untuk suara Jepang.
        </div>
      )}

      {/* Modal: Tambah ke Quiz Set (R-26: real modal, closable with Escape) */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-add-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn"
          onKeyDown={(e) => {
            if (e.key === "Escape") setIsModalOpen(false);
          }}
        >
          <div className="w-full max-w-md bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
              <h3 id="modal-add-title" className="text-base font-bold text-stone-900 dark:text-stone-100">
                Tambah Kanji 「{kanji.character}」 ke Quiz Set
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                aria-label="Tutup jendela"
                className="p-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-md"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {/* Option 1: Existing Sets */}
              {quizSets.length > 0 && (
                <div>
                  <label htmlFor="select-quiz-set" className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                    Pilih Set Kuis Yang Sudah Ada:
                  </label>
                  <select
                    id="select-quiz-set"
                    value={selectedSetId}
                    onChange={(e) => setSelectedSetId(e.target.value)}
                    className="w-full text-xs p-2.5 bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    {quizSets.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.title} ({s.kanji_list.length} kanji)
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={handleAddToExistingSet}
                    className="w-full mt-2 py-2 px-3 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-colors"
                  >
                    Masukkan ke Set Ini
                  </button>
                </div>
              )}

              {/* Divider */}
              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-stone-200 dark:border-stone-800" />
                <span className="flex-shrink mx-3 text-[11px] text-stone-400 uppercase font-semibold">Atau</span>
                <div className="flex-grow border-t border-stone-200 dark:border-stone-800" />
              </div>

              {/* Option 2: Create new set */}
              <div>
                <label htmlFor="new-set-name" className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                  Buat Set Kuis Baru:
                </label>
                <input
                  id="new-set-name"
                  type="text"
                  value={newSetTitle}
                  onChange={(e) => setNewSetTitle(e.target.value)}
                  placeholder="Contoh: Kanji Favorit Saya"
                  className="w-full text-xs p-2.5 bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-red-500 mb-2"
                />
                <button
                  type="button"
                  onClick={handleCreateAndAdd}
                  disabled={!newSetTitle.trim()}
                  className="w-full py-2 px-3 bg-stone-800 hover:bg-stone-900 dark:bg-stone-700 dark:hover:bg-stone-600 text-white text-xs font-semibold rounded-lg disabled:opacity-40 transition-colors"
                >
                  Buat Set Baru & Tambahkan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
