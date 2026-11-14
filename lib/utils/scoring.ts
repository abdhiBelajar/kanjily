import { QuizAnswerRecord } from "@/types/quiz";

export function calculateScore(answers: QuizAnswerRecord[]): {
  total: number;
  correct: number;
  wrong: number;
  percentage: number;
} {
  const total = answers.length;
  const correct = answers.filter((a) => a.isCorrect).length;
  const wrong = total - correct;
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

  return { total, correct, wrong, percentage };
}

export function getScoreEvaluation(percentage: number): {
  title: string;
  badgeColor: string;
  advice: string;
} {
  if (percentage >= 90) {
    return {
      title: "Luar Biasa! (大変優秀)",
      badgeColor: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300",
      advice: "Pemahaman Anda terhadap kanji ini sudah sangat kokoh. Lanjutkan ke tingkat berikutnya!"
    };
  }
  if (percentage >= 75) {
    return {
      title: "Bagus Sekali! (よくできました)",
      badgeColor: "bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300",
      advice: "Hasil yang solid. Tinjau kembali beberapa kanji yang terlewat untuk hasil sempurna."
    };
  }
  if (percentage >= 60) {
    return {
      title: "Cukup Baik! (頑張りました)",
      badgeColor: "bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300",
      advice: "Anda sudah mengenali sebagian besar kanji. Latih lagi kanji yang masih salah."
    };
  }
  return {
    title: "Perlu Latihan Lagi (もう一度挑戦)",
    badgeColor: "bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300",
    advice: "Jangan menyerah! Buka halaman detail kanji untuk mempelajari goresan dan contoh kalimatnya."
  };
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) {
    return `${secs} detik`;
  }
  return `${mins}m ${secs}d`;
}

export function getWeakKanji(answers: QuizAnswerRecord[]): string[] {
  return Array.from(new Set(answers.filter((a) => !a.isCorrect).map((a) => a.kanji)));
}

