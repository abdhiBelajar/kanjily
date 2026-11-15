import { KanjiData } from "@/types/kanji";
import { Question, QuestionOption, QuizType } from "@/types/quiz";

function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function generateQuestions(
  kanjiList: string[],
  allKanji: KanjiData[],
  quizType: QuizType,
  count: number = 10
): Question[] {
  // Filter kanji yang ada di database
  const targetKanji = kanjiList
    .map((char) => allKanji.find((k) => k.character === char))
    .filter((k): k is KanjiData => !!k);

  if (targetKanji.length === 0) return [];

  const shuffledTargets = shuffle(targetKanji).slice(0, Math.min(count, targetKanji.length));

  return shuffledTargets.map((correctKanji, index) => {
    // Tentukan jenis soal untuk item ini
    let currentType: "meaning" | "reading" | "kanji" | "writing" = "meaning";
    if (quizType === "mixed") {
      const types: ("meaning" | "reading" | "kanji" | "writing")[] = [
        "meaning",
        "reading",
        "kanji",
        "writing",
      ];
      currentType = types[index % types.length];
    } else {
      currentType = quizType;
    }

    // Ambil 3 distraktor berbeda
    const otherKanji = allKanji.filter((k) => k.character !== correctKanji.character);
    const distractors = shuffle(otherKanji).slice(0, 3);

    let prompt = "";
    let correctOption: QuestionOption;
    let distractorOptions: QuestionOption[] = [];

    if (currentType === "meaning") {
      prompt = `Apa arti dari kanji 「${correctKanji.character}」?`;
      correctOption = {
        id: `opt-correct-${correctKanji.character}`,
        text: correctKanji.meaningId || correctKanji.meaning,
        subtext: correctKanji.meaning,
      };
      distractorOptions = distractors.map((d) => ({
        id: `opt-dist-${d.character}`,
        text: d.meaningId || d.meaning,
        subtext: d.meaning,
      }));
    } else if (currentType === "reading") {
      prompt = `Bagaimana cara baca (On'yomi / Kun'yomi) untuk kanji 「${correctKanji.character}」?`;
      const primaryReading = correctKanji.kunyomi[0] || correctKanji.onyomi[0] || "-";
      const secondaryReading = correctKanji.onyomi[0] || "";
      correctOption = {
        id: `opt-correct-${correctKanji.character}`,
        text: primaryReading,
        subtext:
          secondaryReading && secondaryReading !== primaryReading
            ? `On: ${secondaryReading}`
            : undefined,
      };
      distractorOptions = distractors.map((d) => {
        const dRead = d.kunyomi[0] || d.onyomi[0] || "-";
        const dOn = d.onyomi[0] || "";
        return {
          id: `opt-dist-${d.character}`,
          text: dRead,
          subtext: dOn && dOn !== dRead ? `On: ${dOn}` : undefined,
        };
      });
    } else if (currentType === "writing") {
      const label = correctKanji.meaningId || correctKanji.meaning;
      prompt = `Tuliskan karakter kanji untuk makna: "${label}"`;
      correctOption = {
        id: `opt-correct-${correctKanji.character}`,
        text: `Tepat & Benar (${correctKanji.character})`,
        subtext: correctKanji.meaningId || correctKanji.meaning,
      };
      distractorOptions = [
        {
          id: `opt-dist-${correctKanji.character}-wrong`,
          text: "Belum Tepat (Perlu Latihan)",
          subtext: "Perlu Latihan",
        },
      ];
    } else {
      // type === 'kanji'
      const label = correctKanji.meaningId || correctKanji.meaning;
      prompt = `Manakah karakter kanji untuk makna "${label}"?`;
      correctOption = {
        id: `opt-correct-${correctKanji.character}`,
        text: correctKanji.character,
        subtext: correctKanji.kunyomi[0] || correctKanji.onyomi[0],
      };
      distractorOptions = distractors.map((d) => ({
        id: `opt-dist-${d.character}`,
        text: d.character,
        subtext: d.kunyomi[0] || d.onyomi[0],
      }));
    }

    const options =
      currentType === "writing"
        ? [correctOption, ...distractorOptions]
        : shuffle([correctOption, ...distractorOptions]);

    return {
      id: `q-${index + 1}-${correctKanji.character}-${Date.now()}`,
      kanji: correctKanji.character,
      prompt,
      type: currentType,
      options,
      correctAnswerId: correctOption.id,
      explanation: {
        meaning: correctKanji.meaningId
          ? `${correctKanji.meaningId} (${correctKanji.meaning})`
          : correctKanji.meaning,
        onyomi: correctKanji.onyomi,
        kunyomi: correctKanji.kunyomi,
      },
    };
  });
}
