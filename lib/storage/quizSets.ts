import { QuizSet } from "@/types/quiz";
import { PRESET_QUIZ_SETS } from "@/lib/data/kanjiDataset";

const STORAGE_KEY = "quiz_sets";

export function getQuizSets(): QuizSet[] {
  if (typeof window === "undefined") return PRESET_QUIZ_SETS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Initialize with presets
      localStorage.setItem(STORAGE_KEY, JSON.stringify(PRESET_QUIZ_SETS));
      return PRESET_QUIZ_SETS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : PRESET_QUIZ_SETS;
  } catch (error) {
    console.error("Gagal membaca quiz sets dari localStorage:", error);
    return PRESET_QUIZ_SETS;
  }
}

export function getQuizSet(id: string): QuizSet | null {
  const sets = getQuizSets();
  return sets.find((s) => s.id === id) || null;
}

export function saveQuizSet(set: Omit<QuizSet, "id" | "created_at"> & { id?: string }): QuizSet {
  const sets = getQuizSets();
  const now = new Date().toISOString().split("T")[0];

  if (set.id) {
    const index = sets.findIndex((s) => s.id === set.id);
    if (index !== -1) {
      const updated: QuizSet = {
        ...sets[index],
        ...set,
        id: set.id,
        created_at: sets[index].created_at || now
      };
      sets[index] = updated;
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sets));
      }
      return updated;
    }
  }

  const newSet: QuizSet = {
    ...set,
    id: `set-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    created_at: now
  };

  sets.unshift(newSet);
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sets));
  }
  return newSet;
}

export function deleteQuizSet(id: string): boolean {
  const sets = getQuizSets();
  const filtered = sets.filter((s) => s.id !== id);
  if (filtered.length !== sets.length) {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    }
    return true;
  }
  return false;
}

export function addKanjiToQuizSet(setId: string, kanji: string): boolean {
  const sets = getQuizSets();
  const target = sets.find((s) => s.id === setId);
  if (!target) return false;

  if (!target.kanji_list.includes(kanji)) {
    target.kanji_list.push(kanji);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sets));
    }
    return true;
  }
  return false;
}

