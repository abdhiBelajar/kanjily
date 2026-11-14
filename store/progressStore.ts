import { create } from "zustand";
import { KanjiProgressRecord, ProgressStats } from "@/types/progress";
import {
  calculateProgressStats,
  getProgress,
  recordSeenKanji,
  resetProgress,
  saveProgress,
  toggleMastered,
  updateKanjiProgress
} from "@/lib/storage/progress";

interface ProgressState {
  progress: KanjiProgressRecord;
  stats: ProgressStats;
  isLoaded: boolean;

  loadProgress: () => void;
  toggleMastery: (character: string) => void;
  resetAll: () => void;
  importProgressData: (imported: KanjiProgressRecord) => void;
  recordSeen: (character: string) => void;
  recordAnswer: (character: string, isCorrect: boolean) => void;
  getStats: () => { total: number; mastered: number; accuracy: number };
}

const initialStats: ProgressStats = {
  totalSeen: 0,
  totalMastered: 0,
  totalAttempts: 0,
  totalCorrect: 0,
  overallAccuracy: 0,
  streakDays: 0,
  levelBreakdown: {
    N5: { total: 0, seen: 0, mastered: 0, accuracy: 0 },
    N4: { total: 0, seen: 0, mastered: 0, accuracy: 0 },
    N3: { total: 0, seen: 0, mastered: 0, accuracy: 0 },
    N2: { total: 0, seen: 0, mastered: 0, accuracy: 0 },
    N1: { total: 0, seen: 0, mastered: 0, accuracy: 0 }
  }
};

export const useProgressStore = create<ProgressState>((set) => ({
  progress: {},
  stats: initialStats,
  isLoaded: false,

  loadProgress: () => {
    const raw = getProgress();
    const stats = calculateProgressStats(raw);
    set({ progress: raw, stats, isLoaded: true });
  },

  toggleMastery: (character: string) => {
    toggleMastered(character);
    const updated = getProgress();
    const stats = calculateProgressStats(updated);
    set({ progress: updated, stats });
  },

  resetAll: () => {
    resetProgress();
    const stats = calculateProgressStats({});
    set({ progress: {}, stats });
  },

  importProgressData: (imported: KanjiProgressRecord) => {
    saveProgress(imported);
    const stats = calculateProgressStats(imported);
    set({ progress: imported, stats });
  },

  recordSeen: (character: string) => {
    recordSeenKanji(character);
    const updated = getProgress();
    const stats = calculateProgressStats(updated);
    set({ progress: updated, stats });
  },

  recordAnswer: (character: string, isCorrect: boolean) => {
    updateKanjiProgress(character, isCorrect);
    const updated = getProgress();
    const stats = calculateProgressStats(updated);
    set({ progress: updated, stats });
  },

  getStats: () => {
    const raw = getProgress();
    const all = Object.values(raw);
    const total = all.length;
    const mastered = all.filter((p) => p.mastered).length;
    const accuracy =
      total === 0
        ? 0
        : Math.round(all.reduce((sum, p) => sum + p.correct / (p.seen || 1), 0) / total * 100);
    return { total, mastered, accuracy };
  }
}));
