import { KanjiData, JLPTLevel } from "@/types/kanji";
import { KANJI_DATASET } from "@/lib/data/kanjiDataset";
import { JOYO_MAP } from "@/lib/data/kanjiCategories";
import { kanjiClient, Kanji } from "./kanjiClient";

const cache = new Map<string, KanjiData>();

// Helper to convert Kanji (from API) into KanjiData
export function mapKanjiToKanjiData(k: Kanji): KanjiData {
  const localMatch = KANJI_DATASET.find((item) => item.character === k.kanji);

  const jlptMap: Record<number, JLPTLevel> = {
    5: "N5",
    4: "N4",
    3: "N3",
    2: "N2",
    1: "N1"
  };

  const mappedJlpt: JLPTLevel = k.jlpt ? jlptMap[k.jlpt] || "N5" : localMatch?.jlpt || "N5";

  return {
    id: `kanji-${k.kanji}`,
    character: k.kanji,
    meaning: k.meanings && k.meanings.length > 0 ? k.meanings.join(", ") : localMatch?.meaning || "Unknown",
    meaningId: localMatch?.meaningId,
    onyomi: k.on_readings || localMatch?.onyomi || [],
    kunyomi: k.kun_readings || localMatch?.kunyomi || [],
    strokes: k.stroke_count || localMatch?.strokes || 1,
    jlpt: mappedJlpt,
    grade: k.grade || localMatch?.grade || undefined,
    frequency: k.freq_mainichi_shinbun || localMatch?.frequency || undefined,
    freq_mainichi_shinbun: k.freq_mainichi_shinbun,
    heisig_en: k.heisig_en,
    name_readings: k.name_readings,
    notes: k.notes,
    unicode: k.unicode,
    alternate_stroke_counts: k.alternate_stroke_counts,
    examples: localMatch?.examples || [],
    sentences: localMatch?.sentences || [],
    strokePaths: localMatch?.strokePaths
  };
}

// Initialize cache with local enriched dataset and joyo map
KANJI_DATASET.forEach((k) => {
  cache.set(k.character, k);
});

export async function getAllKanji(): Promise<KanjiData[]> {
  // Merge KANJI_DATASET with JOYO_MAP so all Joyo & JLPT kanji are available
  const result: KanjiData[] = [...KANJI_DATASET];
  const seenChars = new Set(result.map((k) => k.character));

  for (const [char, k] of Object.entries(JOYO_MAP)) {
    if (!seenChars.has(char)) {
      result.push(mapKanjiToKanjiData(k));
      seenChars.add(char);
    }
  }

  return result;
}

export async function getKanji(character: string): Promise<KanjiData | null> {
  const decodedChar = decodeURIComponent(character);

  if (cache.has(decodedChar)) {
    return cache.get(decodedChar)!;
  }

  // 1. Check local dataset
  const localMatch = KANJI_DATASET.find((k) => k.character === decodedChar);
  if (localMatch) {
    cache.set(decodedChar, localMatch);
    return localMatch;
  }

  // 2. Check Joyo Map
  if (JOYO_MAP[decodedChar]) {
    const mapped = mapKanjiToKanjiData(JOYO_MAP[decodedChar]);
    cache.set(decodedChar, mapped);
    return mapped;
  }

  // 3. Fetch from kanjiClient
  try {
    const apiKanji = await kanjiClient.kanji.getOne(decodedChar);
    if (apiKanji) {
      const mapped = mapKanjiToKanjiData(apiKanji);
      cache.set(decodedChar, mapped);
      return mapped;
    }
  } catch {
    // Return null if not found
  }

  return null;
}

export async function getKanjiByLevel(level: JLPTLevel): Promise<KanjiData[]> {
  const all = await getAllKanji();
  return all.filter((k) => k.jlpt === level);
}

export function searchKanji(query: string, kanjiList: KanjiData[] = KANJI_DATASET): KanjiData[] {
  if (!query || !query.trim()) return kanjiList;
  const clean = query.trim().toLowerCase();

  return kanjiList.filter((k) => {
    return (
      k.character.includes(clean) ||
      k.meaning.toLowerCase().includes(clean) ||
      (k.meaningId && k.meaningId.toLowerCase().includes(clean)) ||
      (k.heisig_en && k.heisig_en.toLowerCase().includes(clean)) ||
      k.onyomi.some((r) => r.toLowerCase().includes(clean)) ||
      k.kunyomi.some((r) => r.toLowerCase().includes(clean)) ||
      (k.name_readings && k.name_readings.some((r) => r.toLowerCase().includes(clean))) ||
      k.examples.some((ex) => ex.reading.toLowerCase().includes(clean) || ex.meaning.toLowerCase().includes(clean))
    );
  });
}
