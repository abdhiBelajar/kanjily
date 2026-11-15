"use client";

import { useState, useRef } from "react";
import { Question } from "@/types/quiz";
import KanjiWritingCanvas, {
  KanjiWritingCanvasRef,
} from "@/components/kanji/KanjiWritingCanvas";
import { KanjiEvaluationResult } from "@/lib/utils/kanjiEvaluator";
import { useSpeech } from "@/hooks/useSpeech";
import { useKanji } from "@/hooks/useKanji";

interface WritingQuizAreaProps {
  question: Question;
  selectedOptionId: string | null;
  isAnswered: boolean;
  onSelectOption: (optionId: string) => void;
  onNext: () => void;
  isLastQuestion: boolean;
}

export default function WritingQuizArea({
  question,
  selectedOptionId,
  isAnswered,
  onSelectOption,
  onNext,
  isLastQuestion,
}: WritingQuizAreaProps) {
  const canvasRef = useRef<KanjiWritingCanvasRef | null>(null);
  const [evaluation, setEvaluation] = useState<KanjiEvaluationResult | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [strokeCount, setStrokeCount] = useState(0);
  const { speakKanji } = useSpeech();
  const { kanjiList } = useKanji();

  const targetKanjiData = kanjiList.find((k) => k.character === question.kanji);
  const targetStrokes = targetKanjiData?.strokes;
  const isCorrect = selectedOptionId === question.correctAnswerId;

  // Evaluasi dan koreksi otomatis
  const handleAutoCheck = () => {
    if (!canvasRef.current) return;
    const result = canvasRef.current.evaluate();
    if (!result) return;

    setEvaluation(result);
    setRevealed(true);

    // Otomatis tentukan nilai benar/salah
    if (result.isCorrect) {
      onSelectOption(question.correctAnswerId);
    } else {
      const wrongOpt = question.options.find((o) => o.id !== question.correctAnswerId);
      onSelectOption(wrongOpt ? wrongOpt.id : "opt-dist-wrong");
    }
  };

  // Opsi koreksi manual jika pengguna ingin menganulir penilaian otomatis
  const handleManualOverride = (overrideCorrect: boolean) => {
    if (overrideCorrect) {
      onSelectOption(question.correctAnswerId);
    } else {
      const wrongOpt = question.options.find((o) => o.id !== question.correctAnswerId);
      onSelectOption(wrongOpt ? wrongOpt.id : "opt-dist-wrong");
    }
  };

  return (
    <div className="space-y-5 my-6 animate-fadeIn">
      {/* Canvas Area Menulis */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col items-center">
        <div className="flex items-center justify-between w-full max-w-sm mb-3 text-xs text-stone-500 dark:text-stone-400">
          <span className="font-semibold text-stone-700 dark:text-stone-300">
            Kanvas Menulis Kanji
          </span>
          <div className="flex items-center gap-2 text-[11px] font-mono">
            {targetStrokes && <span>Target: {targetStrokes} goresan</span>}
            {question.explanation && (
              <span>
                | Petunjuk: {question.explanation.kunyomi[0] || question.explanation.onyomi[0] || "-"}
              </span>
            )}
          </div>
        </div>

        {/* Canvas Komponen */}
        <div className="relative">
          <KanjiWritingCanvas
            ref={canvasRef}
            character={question.kanji}
            targetStrokes={targetStrokes}
            showGuideTemplate={showOverlay}
            onStrokeChange={setStrokeCount}
            width={260}
            height={260}
            compact={true}
            showEvaluationButton={false}
          />
        </div>

        {/* Tombol Periksa Otomatis (Sebelum Dinilai) */}
        {!revealed && !isAnswered && (
          <div className="w-full max-w-sm mt-4 flex flex-col items-center gap-2">
            <p className="text-[11px] text-stone-500 dark:text-stone-400 text-center">
              Tuliskan karakter kanji di atas menggunakan tetikus atau sentuhan jari Anda.
            </p>
            <button
              type="button"
              onClick={handleAutoCheck}
              disabled={strokeCount === 0}
              className="w-full py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-2 focus-visible:outline-2 focus-visible:outline-red-500"
            >
              <span>⚡</span>
              <span>Periksa & Koreksi Otomatis</span>
            </button>
          </div>
        )}

        {/* Opsi Tampilkan Overlay Perbandingan Setelah Menjawab */}
        {(revealed || isAnswered) && (
          <div className="w-full max-w-sm mt-3 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
            <span className="text-[11px] text-stone-500 dark:text-stone-400">
              Bandingkan goresan di kanvas:
            </span>
            <button
              type="button"
              onClick={() => setShowOverlay(!showOverlay)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-colors ${
                showOverlay
                  ? "bg-red-50 text-red-700 border-red-300 dark:bg-red-950/60 dark:text-red-300 dark:border-red-900"
                  : "bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700"
              }`}
            >
              {showOverlay ? "Sembunyikan Pola Asli" : "Tumpangkan Pola Asli"}
            </button>
          </div>
        )}
      </div>

      {/* Panel Evaluasi Otomatis & Informasi Kanji */}
      {(revealed || isAnswered) && (
        <div className="bg-stone-50 dark:bg-stone-900/90 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 sm:p-6 space-y-4 animate-fadeIn">
          {/* Header & Karakter Sebenarnya */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 flex items-center justify-center rounded-xl bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 shadow-inner">
                <span className="font-kanji text-4xl text-stone-900 dark:text-stone-100">
                  {question.kanji}
                </span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
                    Karakter Kanji Sebenarnya:
                  </span>
                  <button
                    type="button"
                    onClick={() => speakKanji(question.kanji)}
                    title="Dengarkan pelafalan"
                    className="text-xs text-red-600 hover:text-red-700 p-0.5"
                  >
                    🔊
                  </button>
                </div>
                <div className="text-xs text-stone-600 dark:text-stone-300 mt-0.5">
                  Arti: <strong>{question.explanation.meaning}</strong>
                </div>
                <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                  {question.explanation.kunyomi.length > 0 && `Kun: ${question.explanation.kunyomi.join(", ")} `}
                  {question.explanation.onyomi.length > 0 && `| On: ${question.explanation.onyomi.join(", ")}`}
                </div>
              </div>
            </div>

            {/* Tombol Lanjut ke Soal Berikutnya */}
            <button
              type="button"
              onClick={onNext}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs shadow-xs transition-colors focus-visible:outline-2 focus-visible:outline-red-500"
            >
              {isLastQuestion ? "Lihat Hasil Kuis" : "Soal Berikutnya →"}
            </button>
          </div>

          {/* Banner Hasil Evaluasi Otomatis AI */}
          <div
            className={`p-4 rounded-xl border text-xs space-y-2.5 ${
              isCorrect
                ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200"
                : "bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-md font-bold text-sm bg-white/80 dark:bg-stone-900/80 shadow-2xs">
                  {isCorrect ? "✓" : "✗"}
                </span>
                <span className="font-bold text-sm">
                  {isCorrect ? "Jawaban Tepat & Lulus (+1 Poin)" : "Jawaban Belum Tepat (+0 Poin)"}
                </span>
              </div>
              {evaluation && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white/80 dark:bg-stone-900/80 shadow-2xs">
                  Skor: {evaluation.score}%
                </span>
              )}
            </div>

            {/* Catatan Feedback Diagnostik */}
            {evaluation && (
              <p className="text-xs leading-relaxed opacity-95">
                {evaluation.feedback}
              </p>
            )}

            {/* Rincian Parameter Penilaian */}
            {evaluation && (
              <div className="pt-2 border-t border-black/10 dark:border-white/10 grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
                <div>
                  <span className="opacity-75">Kemiripan Bentuk: </span>
                  <strong>{evaluation.shapeScore}%</strong>
                </div>
                <div>
                  <span className="opacity-75">Target Goresan: </span>
                  <strong>
                    {evaluation.userStrokeCount} / {targetStrokes || "?"}{" "}
                    {evaluation.details.strokeMatch ? "(Sesuai)" : "(Tidak Sesuai)"}
                  </strong>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <span className="opacity-75">Presisi Posisi: </span>
                  <strong>{evaluation.details.accuracy}%</strong>
                </div>
              </div>
            )}
          </div>

          {/* Opsi Koreksi Manual (Fallback jika pengguna ingin menyesuaikan hasil) */}
          <div className="pt-1 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] text-stone-500 dark:text-stone-400">
            <span>
              Koreksi otomatis tidak sesuai dengan tulisan Anda?
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleManualOverride(true)}
                disabled={isCorrect}
                className="px-2.5 py-1 rounded-md border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 disabled:opacity-40 transition-colors font-medium"
              >
                Ubah jadi Benar (✓)
              </button>
              <button
                type="button"
                onClick={() => handleManualOverride(false)}
                disabled={!isCorrect}
                className="px-2.5 py-1 rounded-md border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/50 disabled:opacity-40 transition-colors font-medium"
              >
                Ubah jadi Belum Tepat (✗)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
