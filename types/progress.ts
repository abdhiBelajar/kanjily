import { JLPTLevel } from "./kanji";

export interface KanjiProgressItem {
  seen: number;
  correct: number;
  wrong: number;
  lastSeen: string;
  mastered: boolean;
  consecutiveCorrect?: number;
}

export type KanjiProgressRecord = Record<string, KanjiProgressItem>;

export interface ProgressStats {
  totalSeen: number;
  totalMastered: number;
  totalAttempts: number;
  totalCorrect: number;
  overallAccuracy: number;
  streakDays: number;
  levelBreakdown: Record<JLPTLevel, { total: number; seen: number; mastered: number; accuracy: number }>;
}

