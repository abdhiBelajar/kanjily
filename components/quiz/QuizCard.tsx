"use client";

import { Question } from "@/types/quiz";
import { useSpeech } from "@/hooks/useSpeech";

interface QuizCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  timerSeconds?: number;
  timerEnabled?: boolean;
}

export default function QuizCard({
  question,
  questionNumber,
  totalQuestions,
  timerSeconds = 20,
  timerEnabled = true,
}: QuizCardProps) {
  const { speakKanji, isSpeaking, speakingText } = useSpeech();
  const isThisSpeaking = isSpeaking && speakingText === question.kanji;

  const typeLabels = {
    meaning: "Tebak Arti",
    reading: "Tebak Cara Baca",
    kanji: "Tebak Karakter Kanji",
    writing: "Menulis Manual",
  };

  const timerColor =
    timerSeconds <= 5
      ? "text-red-600 dark:text-red-400 font-bold animate-pulse"
      : "text-stone-700 dark:text-stone-300";

  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 sm:p-8 shadow-xs">
      {/* Top Header: Question counter & Type badge & Optional timer */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-850 mb-6">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
            Soal {questionNumber} / {totalQuestions}
          </span>
          <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300 border border-red-200 dark:border-red-900">
            {typeLabels[question.type]}
          </span>
        </div>

        {timerEnabled && (
          <div className="flex items-center gap-1.5 text-xs font-mono" aria-live="polite">
            <svg
              className="w-4 h-4 text-stone-600 dark:text-stone-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className={timerColor}>{timerSeconds}d</span>
          </div>
        )}
      </div>

      {/* Main Prompt area */}
      <div className="text-center py-4">
        {question.type !== "kanji" && question.type !== "writing" && (
          <div className="my-2 select-none flex flex-col items-center">
            <span className="font-kanji text-7xl sm:text-8xl text-stone-900 dark:text-stone-100 inline-block p-4 rounded-2xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-850 shadow-inner">
              {question.kanji}
            </span>
            <button
              type="button"
              onClick={() => speakKanji(question.kanji)}
              title={`Dengarkan pelafalan kanji 「${question.kanji}」`}
              aria-label={`Dengarkan pelafalan kanji ${question.kanji}`}
              className={`inline-flex items-center gap-1.5 px-3 py-1 mt-2.5 rounded-lg border text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-red-500 ${
                isThisSpeaking
                  ? "bg-red-50 border-red-300 text-red-600 dark:bg-red-950/60 dark:border-red-800 dark:text-red-400 animate-pulse"
                  : "bg-white dark:bg-stone-850 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800"
              }`}
            >
              <span>🔊</span>
              <span>{isThisSpeaking ? "Mendengarkan..." : "Dengar Kanji"}</span>
            </button>
          </div>
        )}

        {question.type === "writing" && (
          <div className="my-2 select-none flex flex-col items-center animate-fadeIn">
            <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 shadow-inner">
              <span className="text-3xl sm:text-4xl">✍️</span>
            </div>
            <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 mt-2">
              Tuliskan kanji pada kanvas di bawah
            </span>
          </div>
        )}

        <h2 className="text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100 mt-3 max-w-lg mx-auto">
          {question.prompt}
        </h2>
      </div>
    </div>
  );
}
