"use client";

import { useEffect } from "react";
import { Question, QuestionOption } from "@/types/quiz";

interface OptionsGridProps {
  question: Question;
  selectedOptionId: string | null;
  isAnswered: boolean;
  onSelectOption: (optionId: string) => void;
  onNext: () => void;
  isLastQuestion: boolean;
}

const OPTION_LETTERS = ["A", "B", "C", "D"];

export default function OptionsGrid({
  question,
  selectedOptionId,
  isAnswered,
  onSelectOption,
  onNext,
  isLastQuestion
}: OptionsGridProps) {
  // Keyboard navigation support: 1-4 or A-D to select, Enter/Space to next
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isAnswered) {
        if (e.key === "1" || e.key.toLowerCase() === "a") {
          if (question.options[0]) onSelectOption(question.options[0].id);
        } else if (e.key === "2" || e.key.toLowerCase() === "b") {
          if (question.options[1]) onSelectOption(question.options[1].id);
        } else if (e.key === "3" || e.key.toLowerCase() === "c") {
          if (question.options[2]) onSelectOption(question.options[2].id);
        } else if (e.key === "4" || e.key.toLowerCase() === "d") {
          if (question.options[3]) onSelectOption(question.options[3].id);
        }
      } else {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onNext();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAnswered, question.options, onSelectOption, onNext]);

  return (
    <div className="space-y-4 my-6">
      {/* 4 Choices Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="radiogroup" aria-label="Pilihan jawaban">
        {question.options.map((option: QuestionOption, index: number) => {
          const letter = OPTION_LETTERS[index] || `${index + 1}`;
          const isCorrect = option.id === question.correctAnswerId;
          const isSelected = option.id === selectedOptionId;

          let btnStyle = "bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-200 hover:border-red-400 dark:hover:border-red-600 hover:bg-stone-50 dark:hover:bg-stone-850";

          if (isAnswered) {
            if (isCorrect) {
              btnStyle = "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 dark:border-emerald-500 text-emerald-900 dark:text-emerald-100 ring-2 ring-emerald-500/50";
            } else if (isSelected && !isCorrect) {
              btnStyle = "bg-rose-50 dark:bg-rose-950/60 border-rose-500 dark:border-rose-500 text-rose-900 dark:text-rose-100 ring-2 ring-rose-500/50";
            } else {
              btnStyle = "bg-stone-50 dark:bg-stone-950/40 border-stone-200 dark:border-stone-850 text-stone-400 dark:text-stone-600 opacity-60";
            }
          }

          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={isAnswered}
              onClick={() => onSelectOption(option.id)}
              className={`flex items-center gap-3.5 p-4 rounded-xl border text-left transition-all duration-150 focus-visible:outline-2 focus-visible:outline-red-500 ${btnStyle}`}
            >
              <span
                className={`flex items-center justify-center w-7 h-7 rounded-md text-xs font-bold shrink-0 ${
                  isAnswered && isCorrect
                    ? "bg-emerald-600 text-white"
                    : isAnswered && isSelected
                    ? "bg-rose-600 text-white"
                    : "bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400"
                }`}
              >
                {letter}
              </span>
              <div className="flex-1 min-w-0">
                <div className={`text-base font-semibold ${question.type === "kanji" ? "font-kanji text-2xl" : ""}`}>
                  {option.text}
                </div>
                {option.subtext && (
                  <div className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 truncate">
                    {option.subtext}
                  </div>
                )}
              </div>
              {isAnswered && (
                <span className="shrink-0 text-sm font-bold">
                  {isCorrect ? "✓" : isSelected ? "✗" : ""}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Instant Feedback & Explanation Panel when Answered */}
      {isAnswered && (
        <div className="bg-stone-50 dark:bg-stone-900/90 border border-stone-200 dark:border-stone-800 rounded-xl p-5 space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className={`text-lg font-bold ${
                  selectedOptionId === question.correctAnswerId
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-rose-600 dark:text-rose-400"
                }`}
              >
                {selectedOptionId === question.correctAnswerId ? "Jawaban Benar! (正解)" : "Kurang Tepat (不正解)"}
              </span>
            </div>

            <button
              type="button"
              onClick={onNext}
              className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-xs shadow-sm transition-colors focus-visible:outline-2 focus-visible:outline-red-500"
            >
              {isLastQuestion ? "Lihat Hasil Kuis" : "Soal Berikutnya →"}
            </button>
          </div>

          <div className="text-xs text-stone-600 dark:text-stone-400 pt-2 border-t border-stone-200 dark:border-stone-800 space-y-1">
            <p>
              <strong className="text-stone-800 dark:text-stone-200">Kanji:</strong> 「{question.kanji}」 : {question.explanation.meaning}
            </p>
            {question.explanation.kunyomi.length > 0 && (
              <p>
                <strong className="text-stone-800 dark:text-stone-200">Kun&apos;yomi:</strong> {question.explanation.kunyomi.join(", ")}
              </p>
            )}
            {question.explanation.onyomi.length > 0 && (
              <p>
                <strong className="text-stone-800 dark:text-stone-200">On&apos;yomi:</strong> {question.explanation.onyomi.join(", ")}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

