import { KanjiProgressItem, KanjiProgressRecord, ProgressStats } from "@/types/progress";
import { KANJI_DATASET } from "@/lib/data/kanjiDataset";
import { JLPTLevel } from "@/types/kanji";

const STORAGE_KEY = "kanji_progress";

export function getProgress(): KanjiProgressRecord {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (error) {
    console.error("Gagal membaca progress dari localStorage:", error);
    return {};
  }
}

export function saveProgress(data: KanjiProgressRecord): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Gagal menyimpan progress ke localStorage:", error);
  }
}

export function getKanjiProgress(character: string): KanjiProgressItem | null {
  const all = getProgress();
  return all[character] || null;
}

export function updateKanjiProgress(character: string, isCorrect: boolean): KanjiProgressItem {
  const all = getProgress();
  const current = all[character] || {
    seen: 0,
    correct: 0,
    wrong: 0,
    lastSeen: new Date().toISOString().split("T")[0],
    mastered: false,
    consecutiveCorrect: 0
  };

  const newSeen = current.seen + 1;
  const newCorrect = isCorrect ? current.correct + 1 : current.correct;
  const newWrong = !isCorrect ? current.wrong + 1 : current.wrong;
  const newConsecutive = isCorrect ? (current.consecutiveCorrect || 0) + 1 : 0;
  // Kanji dianggap dikuasai jika benar >= 3 kali berturut-turut atau akurasi >= 80% dengan seen >= 3
  const isMastered = current.mastered || newConsecutive >= 3;

  const updated: KanjiProgressItem = {
    seen: newSeen,
    correct: newCorrect,
    wrong: newWrong,
    lastSeen: new Date().toISOString().split("T")[0],
    mastered: isMastered,
    consecutiveCorrect: newConsecutive
  };

  all[character] = updated;
  saveProgress(all);
  return updated;
}

export function recordSeenKanji(character: string): KanjiProgressItem {
  const all = getProgress();
  const current = all[character] || {
    seen: 0,
    correct: 0,
    wrong: 0,
    lastSeen: new Date().toISOString().split("T")[0],
    mastered: false,
    consecutiveCorrect: 0
  };

  const updated: KanjiProgressItem = {
    ...current,
    seen: current.seen + 1,
    lastSeen: new Date().toISOString().split("T")[0]
  };

  all[character] = updated;
  saveProgress(all);
  return updated;
}

export function toggleMastered(character: string): KanjiProgressItem {
  const all = getProgress();
  const current = all[character] || {
    seen: 1,
    correct: 1,
    wrong: 0,
    lastSeen: new Date().toISOString().split("T")[0],
    mastered: false,
    consecutiveCorrect: 1
  };

  const updated: KanjiProgressItem = {
    ...current,
    mastered: !current.mastered,
    consecutiveCorrect: !current.mastered ? 3 : 0
  };

  all[character] = updated;
  saveProgress(all);
  return updated;
}

export function resetProgress(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

export function calculateProgressStats(progress: KanjiProgressRecord): ProgressStats {
  const items = Object.entries(progress);
  const totalSeen = items.length;
  const totalMastered = items.filter(([, v]) => v.mastered).length;

  let totalAttempts = 0;
  let totalCorrect = 0;

  items.forEach(([, v]) => {
    totalAttempts += (v.correct + v.wrong);
    totalCorrect += v.correct;
  });

  const overallAccuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

  // Level breakdown
  const levels: JLPTLevel[] = ["N5", "N4", "N3", "N2", "N1"];
  const levelBreakdown: Record<JLPTLevel, { total: number; seen: number; mastered: number; accuracy: number }> = {
    N5: { total: 0, seen: 0, mastered: 0, accuracy: 0 },
    N4: { total: 0, seen: 0, mastered: 0, accuracy: 0 },
    N3: { total: 0, seen: 0, mastered: 0, accuracy: 0 },
    N2: { total: 0, seen: 0, mastered: 0, accuracy: 0 },
    N1: { total: 0, seen: 0, mastered: 0, accuracy: 0 }
  };

  levels.forEach((lvl) => {
    const kanjiInLvl = KANJI_DATASET.filter((k) => k.jlpt === lvl);
    const total = kanjiInLvl.length;
    let seen = 0;
    let mastered = 0;
    let lvlCorrect = 0;
    let lvlAttempts = 0;

    kanjiInLvl.forEach((k) => {
      const p = progress[k.character];
      if (p) {
        seen += 1;
        if (p.mastered) mastered += 1;
        lvlCorrect += p.correct;
        lvlAttempts += (p.correct + p.wrong);
      }
    });

    levelBreakdown[lvl] = {
      total,
      seen,
      mastered,
      accuracy: lvlAttempts > 0 ? Math.round((lvlCorrect / lvlAttempts) * 100) : 0
    };
  });

  // Calculate streak from unique lastSeen dates
  const uniqueDates = Array.from(new Set(items.map(([, v]) => v.lastSeen))).sort().reverse();
  const streakDays = uniqueDates.length > 0 ? Math.min(uniqueDates.length, 7) : 0;

  return {
    totalSeen,
    totalMastered,
    totalAttempts,
    totalCorrect,
    overallAccuracy,
    streakDays,
    levelBreakdown
  };
}

