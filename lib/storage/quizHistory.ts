import { QuizHistoryItem } from "@/types/quiz";

const STORAGE_KEY = "quiz_history";

export function getQuizHistory(): QuizHistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error("Gagal membaca riwayat kuis dari localStorage:", error);
    return [];
  }
}

export function saveQuizHistory(item: Omit<QuizHistoryItem, "id" | "date"> & { date?: string }): QuizHistoryItem {
  const history = getQuizHistory();
  const newItem: QuizHistoryItem = {
    ...item,
    id: `history-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    date: item.date || new Date().toISOString().split("T")[0]
  };

  history.unshift(newItem);
  if (typeof window !== "undefined") {
    // Batasi riwayat maksimal 50 item terbaru
    const sliced = history.slice(0, 50);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sliced));
  }
  return newItem;
}

export function getLastPlayedQuiz(): QuizHistoryItem | null {
  const history = getQuizHistory();
  return history.length > 0 ? history[0] : null;
}

export function clearQuizHistory(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

