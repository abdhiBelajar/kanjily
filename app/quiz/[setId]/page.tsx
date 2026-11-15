"use client";

import { useEffect, useState, use, useRef, Suspense } from "react";
import Link from "next/link";
import { useQuiz } from "@/hooks/useQuiz";
import { useKanji } from "@/hooks/useKanji";
import { getQuizSet } from "@/lib/storage/quizSets";
import { PRESET_QUIZ_SETS } from "@/lib/data/kanjiDataset";
import { generateQuestions } from "@/lib/utils/quizGenerator";
import { QuizSet } from "@/types/quiz";
import QuizCard from "@/components/quiz/QuizCard";
import OptionsGrid from "@/components/quiz/OptionsGrid";
import WritingQuizArea from "@/components/quiz/WritingQuizArea";
import ResultSummary from "@/components/quiz/ResultSummary";
import ProgressBar from "@/components/ui/ProgressBar";

interface PageProps {
  params: Promise<{ setId: string }>;
}

function QuizRunnerContent({ params }: PageProps) {
  const resolvedParams = use(params);
  const setId = resolvedParams.setId;

  const { kanjiList, loading: kanjiLoading } = useKanji();
  const {
    questions,
    currentIndex,
    selectedOptionId,
    isAnswered,
    timerEnabled,
    questionTimer,
    isCompleted,
    answers,
    finalDuration,
    startQuiz,
    selectOption,
    nextQuestion,
    tickTimer,
    toggleTimer,
    resetQuiz
  } = useQuiz();

  const [currentSet, setCurrentSet] = useState<QuizSet | null>(null);
  const [initLoading, setInitLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load quiz set and generate questions
  useEffect(() => {
    if (kanjiLoading) return;

    const frame = requestAnimationFrame(() => {
      // First try localStorage, fallback to preset
      let set = getQuizSet(setId);
      if (!set) {
        set = PRESET_QUIZ_SETS.find((p) => p.id === setId) || null;
      }

      if (!set) {
        setNotFound(true);
        setInitLoading(false);
        return;
      }

      setCurrentSet(set);
      const generated = generateQuestions(set.kanji_list, kanjiList, set.quiz_type, 10);

      if (generated.length === 0) {
        setNotFound(true);
        setInitLoading(false);
        return;
      }

      startQuiz(set, generated, true);
      setInitLoading(false);
    });

    return () => cancelAnimationFrame(frame);
  }, [setId, kanjiLoading, kanjiList, startQuiz]);

  // Tick timer every second when not answered and not completed
  useEffect(() => {
    if (timerEnabled && !isAnswered && !isCompleted && !initLoading) {
      timerIntervalRef.current = setInterval(() => {
        tickTimer();
      }, 1000);
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [timerEnabled, isAnswered, isCompleted, initLoading, tickTimer]);

  if (initLoading || kanjiLoading) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto animate-pulse py-8">
        <div className="h-4 w-40 bg-stone-200 dark:bg-stone-800 rounded" />
        <div className="h-64 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl" />
        <div className="grid grid-cols-2 gap-3">
          <div className="h-16 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl" />
          <div className="h-16 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl" />
        </div>
      </div>
    );
  }

  // R-27: Error state
  if (notFound || !currentSet || questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 sm:p-16 my-8 text-center bg-white dark:bg-stone-900 border border-dashed border-stone-300 dark:border-stone-700 rounded-2xl max-w-md mx-auto">
        <span className="font-kanji text-6xl text-stone-300 dark:text-stone-700 mb-3">問</span>
        <h1 className="text-lg font-bold text-stone-800 dark:text-stone-200 mb-1">
          Set Kuis Tidak Ditemukan
        </h1>
        <p className="text-xs text-stone-500 dark:text-stone-400 mb-5">
          Paket kuis yang diminta tidak tersedia atau tidak memiliki kanji yang cukup.
        </p>
        <Link
          href="/quiz"
          className="px-4 py-2 text-xs font-semibold rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors"
        >
          Kembali ke Daftar Kuis
        </Link>
      </div>
    );
  }

  // Result state
  if (isCompleted) {
    return (
      <ResultSummary
        answers={answers}
        questions={questions}
        durationSeconds={finalDuration || 1}
        setTitle={currentSet.title}
        onRetry={resetQuiz}
      />
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
      {/* Top Navigation & Controls */}
      <div className="flex items-center justify-between">
        <Link
          href="/quiz"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Keluar Kuis</span>
        </Link>

        {/* Timer toggle switch */}
        <button
          type="button"
          onClick={toggleTimer}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
            timerEnabled
              ? "bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border-stone-300 dark:border-stone-700"
              : "bg-transparent text-stone-400 border-dashed border-stone-300 dark:border-stone-700"
          }`}
          aria-label={timerEnabled ? "Matikan batas waktu" : "Nyalakan batas waktu"}
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{timerEnabled ? "Timer Aktif" : "Timer Nonaktif"}</span>
        </button>
      </div>

      {/* Progress Bar of the quiz */}
      <ProgressBar
        current={currentIndex + 1}
        total={questions.length}
        label={`Soal ${currentIndex + 1} dari ${questions.length}`}
        color="red"
      />

      {/* Active Question Card */}
      {currentQ && (
        <>
          <QuizCard
            question={currentQ}
            questionNumber={currentIndex + 1}
            totalQuestions={questions.length}
            timerSeconds={questionTimer}
            timerEnabled={timerEnabled}
          />

          {/* Options Grid or Writing Quiz Area */}
          {currentQ.type === "writing" ? (
            <WritingQuizArea
              key={currentQ.id}
              question={currentQ}
              selectedOptionId={selectedOptionId}
              isAnswered={isAnswered}
              onSelectOption={selectOption}
              onNext={nextQuestion}
              isLastQuestion={currentIndex === questions.length - 1}
            />
          ) : (
            <OptionsGrid
              question={currentQ}
              selectedOptionId={selectedOptionId}
              isAnswered={isAnswered}
              onSelectOption={selectOption}
              onNext={nextQuestion}
              isLastQuestion={currentIndex === questions.length - 1}
            />
          )}
        </>
      )}

      {/* Keyboard Shortcuts Hint */}
      <div className="text-center text-[11px] text-stone-600 dark:text-stone-300 pt-2 border-t border-stone-100 dark:border-stone-850">
        {currentQ?.type === "writing" ? (
          <span>Mode Menulis: Tulis kanji pada kanvas lalu periksa dan lakukan evaluasi mandiri.</span>
        ) : (
          <span>Pintasan Keyboard: tekan tombol <strong>1, 2, 3, 4</strong> atau <strong>A, B, C, D</strong> untuk memilih | <strong>Spasi/Enter</strong> untuk soal berikutnya.</span>
        )}
      </div>
    </div>
  );
}

export default function QuizRunnerPage({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="space-y-6 max-w-2xl mx-auto animate-pulse py-8">
          <div className="h-4 w-40 bg-stone-200 dark:bg-stone-800 rounded" />
          <div className="h-64 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl" />
        </div>
      }
    >
      <QuizRunnerContent params={params} />
    </Suspense>
  );
}
