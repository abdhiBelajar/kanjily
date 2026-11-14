import { create } from "zustand";
import { Question, QuizAnswerRecord, QuizSet } from "@/types/quiz";
import { updateKanjiProgress } from "@/lib/storage/progress";
import { saveQuizHistory } from "@/lib/storage/quizHistory";

interface QuizState {
  activeSet: QuizSet | null;
  questions: Question[];
  currentIndex: number;
  answers: QuizAnswerRecord[];
  selectedOptionId: string | null;
  isAnswered: boolean;
  timerEnabled: boolean;
  questionTimer: number; // sisa detik soal ini
  startTime: number;
  finalDuration: number;
  isCompleted: boolean;

  // Actions
  startQuiz: (set: QuizSet, questions: Question[], timerEnabled?: boolean) => void;
  selectOption: (optionId: string) => void;
  nextQuestion: () => void;
  tickTimer: () => void;
  toggleTimer: () => void;
  resetQuiz: () => void;
}

const QUESTION_TIME_LIMIT = 20; // 20 detik per soal jika timer aktif

export const useQuizStore = create<QuizState>((set, get) => ({
  activeSet: null,
  questions: [],
  currentIndex: 0,
  answers: [],
  selectedOptionId: null,
  isAnswered: false,
  timerEnabled: true,
  questionTimer: QUESTION_TIME_LIMIT,
  startTime: 0,
  finalDuration: 0,
  isCompleted: false,

  startQuiz: (quizSet, questions, timerEnabled = true) => {
    set({
      activeSet: quizSet,
      questions,
      currentIndex: 0,
      answers: [],
      selectedOptionId: null,
      isAnswered: false,
      timerEnabled,
      questionTimer: QUESTION_TIME_LIMIT,
      startTime: Date.now(),
      finalDuration: 0,
      isCompleted: false
    });
  },

  selectOption: (optionId: string) => {
    const { isAnswered, questions, currentIndex, answers, activeSet, startTime, questionTimer } = get();
    if (isAnswered || questions.length === 0) return;

    const currentQ = questions[currentIndex];
    const isCorrect = optionId === currentQ.correctAnswerId;
    const timeSpent = QUESTION_TIME_LIMIT - questionTimer;

    const record: QuizAnswerRecord = {
      questionId: currentQ.id,
      kanji: currentQ.kanji,
      selectedOptionId: optionId,
      correctOptionId: currentQ.correctAnswerId,
      isCorrect,
      timeSpentSeconds: Math.max(1, timeSpent)
    };

    // Update real-time progress di localStorage
    updateKanjiProgress(currentQ.kanji, isCorrect);

    const updatedAnswers = [...answers, record];
    const isLast = currentIndex === questions.length - 1;
    const totalSeconds = Math.max(1, Math.round((Date.now() - startTime) / 1000));

    set({
      selectedOptionId: optionId,
      isAnswered: true,
      answers: updatedAnswers,
      finalDuration: isLast ? totalSeconds : 0
    });

    if (isLast && activeSet) {
      // Simpan riwayat kuis ke localStorage
      const score = updatedAnswers.filter((a) => a.isCorrect).length;
      const percentage = Math.round((score / questions.length) * 100);

      saveQuizHistory({
        set_id: activeSet.id,
        set_title: activeSet.title,
        score,
        total: questions.length,
        percentage,
        duration_seconds: totalSeconds,
        answers: updatedAnswers
      });
    }
  },

  nextQuestion: () => {
    const { currentIndex, questions, startTime } = get();
    if (currentIndex < questions.length - 1) {
      set({
        currentIndex: currentIndex + 1,
        selectedOptionId: null,
        isAnswered: false,
        questionTimer: QUESTION_TIME_LIMIT
      });
    } else {
      set({
        isCompleted: true,
        finalDuration: Math.max(1, Math.round((Date.now() - startTime) / 1000))
      });
    }
  },

  tickTimer: () => {
    const { isAnswered, timerEnabled, questionTimer, selectOption } = get();
    if (isAnswered || !timerEnabled) return;

    if (questionTimer > 1) {
      set({ questionTimer: questionTimer - 1 });
    } else {
      // Waktu habis, otomatis anggap salah dengan option timeout
      selectOption("__TIMEOUT__");
    }
  },

  toggleTimer: () => {
    set((state) => ({ timerEnabled: !state.timerEnabled }));
  },

  resetQuiz: () => {
    const { activeSet, questions, timerEnabled } = get();
    if (activeSet && questions.length > 0) {
      get().startQuiz(activeSet, questions, timerEnabled);
    }
  }
}));
