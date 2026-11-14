import Link from "next/link";
import { Question, QuizAnswerRecord } from "@/types/quiz";
import { calculateScore, formatDuration, getScoreEvaluation, getWeakKanji } from "@/lib/utils/scoring";

interface ResultSummaryProps {
  answers: QuizAnswerRecord[];
  questions: Question[];
  durationSeconds: number;
  setTitle: string;
  onRetry: () => void;
}

export default function ResultSummary({
  answers,
  questions,
  durationSeconds,
  setTitle,
  onRetry
}: ResultSummaryProps) {
  const { total, correct, percentage } = calculateScore(answers);
  const evaluation = getScoreEvaluation(percentage);
  const weakKanji = getWeakKanji(answers);

  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-fadeIn">
      {/* Top Banner Card: Score & Evaluation */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 sm:p-8 text-center shadow-xs">
        <span className="text-xs uppercase tracking-wider font-semibold text-stone-500 dark:text-stone-400">
          Hasil Kuis: {setTitle}
        </span>

        {/* Score Circle / Badge */}
        <div className="my-4">
          <div className="inline-flex flex-col items-center justify-center w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-red-600 bg-red-50/50 dark:bg-red-950/20 text-red-600 dark:text-red-500">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight">{percentage}%</span>
            <span className="text-xs font-semibold text-stone-600 dark:text-stone-300">
              {correct} / {total} Benar
            </span>
          </div>
        </div>

        {/* Evaluation Title & Advice */}
        <div className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-2">
          <span className={`px-3 py-1 rounded-full ${evaluation.badgeColor}`}>
            {evaluation.title}
          </span>
        </div>
        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 max-w-md mx-auto leading-relaxed mt-2">
          {evaluation.advice}
        </p>

        {/* Time duration stat */}
        <div className="mt-4 pt-4 border-t border-stone-100 dark:border-stone-850 flex items-center justify-center gap-6 text-xs text-stone-500 dark:text-stone-400">
          <div>
            Waktu Pengerjaan: <strong className="text-stone-800 dark:text-stone-200">{formatDuration(durationSeconds)}</strong>
          </div>
          <div>
            Rata-rata: <strong className="text-stone-800 dark:text-stone-200">{total > 0 ? Math.round(durationSeconds / total) : 0} detik/soal</strong>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
          <button
            type="button"
            onClick={onRetry}
            className="px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-xs shadow-xs transition-colors focus-visible:outline-2 focus-visible:outline-red-500"
          >
            Ulangi Kuis Ini
          </button>
          <Link
            href="/quiz"
            className="px-5 py-2.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 font-semibold text-xs transition-colors"
          >
            Pilih Kuis Lain
          </Link>
          <Link
            href="/progress"
            className="px-5 py-2.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 font-semibold text-xs transition-colors"
          >
            Lihat Progres Belajar
          </Link>
        </div>
      </div>

      {/* Recommended Kanji to Review if any were answered incorrectly */}
      {weakKanji.length > 0 && (
        <div className="bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60 rounded-xl p-5 shadow-xs">
          <h2 className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 mb-2 flex items-center gap-1.5">
            <span>Rekomendasi Kanji Untuk Diulang ({weakKanji.length})</span>
          </h2>
          <p className="text-xs text-amber-900/80 dark:text-amber-300/80 mb-3">
            Berikut kanji yang belum tepat dijawab pada kuis ini. Buka detail untuk melatih urutan goresan:
          </p>
          <div className="flex flex-wrap gap-2">
            {weakKanji.map((char) => (
              <Link
                key={char}
                href={`/browse/${encodeURIComponent(char)}`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-stone-900 border border-amber-300 dark:border-amber-800 text-stone-800 dark:text-stone-200 hover:border-red-500 transition-colors text-xs"
              >
                <span className="font-kanji font-bold text-base text-red-600 dark:text-red-500">{char}</span>
                <span>Detail</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Detailed Question Review List */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-xs">
        <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100 mb-4 flex items-center gap-2">
          <span className="w-1.5 h-4 bg-red-600 rounded-full" />
          <span>Tinjauan Soal Per Soal</span>
        </h2>

        <div className="space-y-3">
          {questions.map((q, idx) => {
            const answerRecord = answers.find((a) => a.questionId === q.id);
            const isCorrect = answerRecord?.isCorrect || false;
            const chosenOption = q.options.find((o) => o.id === answerRecord?.selectedOptionId);
            const correctOption = q.options.find((o) => o.id === q.correctAnswerId);

            return (
              <div
                key={q.id}
                className={`p-4 rounded-xl border ${
                  isCorrect
                    ? "bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40"
                    : "bg-rose-50/40 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/40"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`flex items-center justify-center w-6 h-6 rounded-md text-xs font-bold text-white ${
                        isCorrect ? "bg-emerald-600" : "bg-rose-600"
                      }`}
                    >
                      {isCorrect ? "✓" : "✗"}
                    </span>
                    <span className="font-kanji text-2xl font-bold text-stone-900 dark:text-stone-100">
                      {q.kanji}
                    </span>
                    <span className="text-xs font-semibold text-stone-800 dark:text-stone-200">
                      {q.prompt}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-stone-600 dark:text-stone-300 shrink-0">
                    Soal {idx + 1}
                  </span>
                </div>

                <div className="mt-3 pt-2.5 border-t border-stone-200/60 dark:border-stone-800 text-xs space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-stone-600 dark:text-stone-300">Jawaban Anda:</span>
                    <strong className={isCorrect ? "text-emerald-700 dark:text-emerald-400" : "text-rose-700 dark:text-rose-400"}>
                      {chosenOption ? chosenOption.text : "Waktu Habis"}
                    </strong>
                  </div>
                  {!isCorrect && (
                    <div className="flex items-center gap-2">
                      <span className="text-stone-600 dark:text-stone-300">Jawaban Benar:</span>
                      <strong className="text-emerald-700 dark:text-emerald-400">
                        {correctOption ? correctOption.text : "-"}
                      </strong>
                    </div>
                  )}
                  <div className="text-[11px] text-stone-600 dark:text-stone-300">
                    Makna: {q.explanation.meaning}
                    {q.explanation.kunyomi.length > 0 && ` | Kun: ${q.explanation.kunyomi.join(", ")}`}
                    {q.explanation.onyomi.length > 0 && ` | On: ${q.explanation.onyomi.join(", ")}`}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

