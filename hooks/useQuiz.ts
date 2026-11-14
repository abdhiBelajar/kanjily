"use client";

import { useQuizStore } from "@/store/quizStore";

export function useQuiz() {
  const store = useQuizStore();
  return store;
}

