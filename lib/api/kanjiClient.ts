import { KANJI_DATASET } from "@/lib/data/kanjiDataset";
import { CATEGORY_LISTS, JOYO_MAP } from "@/lib/data/kanjiCategories";

const BASE = "https://kanjiapi.dev/v1";

// ─── Types matching kanjiapi.dev documentation ─────────────────────────

export type JLPTLevel = "jlpt-5" | "jlpt-4" | "jlpt-3" | "jlpt-2" | "jlpt-1";
export type GradeLevel =
  | "grade-1"
  | "grade-2"
  | "grade-3"
  | "grade-4"
  | "grade-5"
  | "grade-6"
  | "grade-8";
export type KanjiSet =
  | "joyo"
  | "jouyou"
  | "jinmeiyo"
  | "jinmeiyou"
  | "heisig"
  | "kyouiku"
  | "kyoiku"
  | "all";

export type KanjiList = JLPTLevel | GradeLevel | KanjiSet;
export type KanjiListEnriched = `${KanjiList}-enriched`;

export interface Kanji {
  kanji: string;
  kun_readings: string[];
  on_readings: string[];
  name_readings: string[];
  meanings: string[];
  stroke_count: number;
  alternate_stroke_counts: number[];
  unicode: string;
  grade: number | null; // 1..6 | 8 | 9 | null
  jlpt: number | null; // 1..5 | null (5 = N5 easiest, 1 = N1 hardest)
  heisig_en: string | null;
  freq_mainichi_shinbun: number | null;
  unihan_cjk_compatibility_variant?: string;
  notes: string[];
}

export interface Reading {
  reading: string;
  main_kanji: string[];
  name_kanji: string[];
}

export interface WordVariant {
  written: string;
  pronounced: string;
  priorities: string[];
}

export interface WordMeaning {
  glosses: string[];
}

export interface Word {
  variants: WordVariant[];
  meanings: WordMeaning[];
}

// ─── In-Memory Cache ───────────────────────────────────────────────────

const cache = new Map<string, unknown>();

// ─── Static Fallback Resolver ──────────────────────────────────────────

function getStaticFallback<T>(path: string): T | null {
  const decoded = decodeURIComponent(path);

  // 1. Enriched list: /kanji/{list}-enriched
  if (decoded.endsWith("-enriched")) {
    const listKey = decoded.replace("/kanji/", "").replace("-enriched", "");
    const chars = CATEGORY_LISTS[listKey];
    if (chars) {
      const enriched = chars.map((c) => JOYO_MAP[c]).filter(Boolean);
      return enriched as unknown as T;
    }
  }

  // 2. Simple list of strings: /kanji/{list}
  const listKey = decoded.replace("/kanji/", "");
  if (CATEGORY_LISTS[listKey]) {
    return CATEGORY_LISTS[listKey] as unknown as T;
  }

  // 3. Single character: /kanji/{char}
  if (decoded.startsWith("/kanji/")) {
    const char = decoded.replace("/kanji/", "");
    if (JOYO_MAP[char]) {
      return JOYO_MAP[char] as unknown as T;
    }
    const local = KANJI_DATASET.find((k) => k.character === char);
    if (local) {
      const fallbackKanji: Kanji = {
        kanji: local.character,
        kun_readings: local.kunyomi || [],
        on_readings: local.onyomi || [],
        name_readings: [],
        meanings: local.meaning.split(",").map((s) => s.trim()),
        stroke_count: local.strokes,
        alternate_stroke_counts: [],
        unicode: local.character.charCodeAt(0).toString(16).toUpperCase(),
        grade: local.grade || 1,
        jlpt: local.jlpt === "N5" ? 5 : local.jlpt === "N4" ? 4 : 3,
        heisig_en: null,
        freq_mainichi_shinbun: null,
        notes: []
      };
      return fallbackKanji as unknown as T;
    }
  }

  // 4. Words: /words/{char}
  if (decoded.startsWith("/words/")) {
    const char = decoded.replace("/words/", "");
    const local = KANJI_DATASET.find((k) => k.character === char);
    if (local && local.examples && local.examples.length > 0) {
      const fallbackWords: Word[] = local.examples.map((ex) => ({
        variants: [
          {
            written: ex.word,
            pronounced: ex.reading,
            priorities: ["local"]
          }
        ],
        meanings: [
          {
            glosses: [ex.meaning]
          }
        ]
      }));
      return fallbackWords as unknown as T;
    }
  }

  // 5. Reading: /reading/{kana}
  if (decoded.startsWith("/reading/")) {
    const kana = decoded.replace("/reading/", "").toLowerCase();
    const matching = KANJI_DATASET.filter((k) =>
      k.kunyomi.some((r) => r.toLowerCase().includes(kana)) ||
      k.onyomi.some((r) => r.toLowerCase().includes(kana))
    );
    const fallbackReading: Reading = {
      reading: kana,
      main_kanji: matching.map((k) => k.character),
      name_kanji: []
    };
    return fallbackReading as unknown as T;
  }

  return null;
}

// ─── Fetcher with Live API, Internal Next.js Route, and Offline Safety ─

async function cachedFetch<T>(path: string): Promise<T> {
  if (cache.has(path)) {
    return cache.get(path) as T;
  }

  // 1. Live API fetch (official base URL)
  try {
    const res = await fetch(`${BASE}${path}`);
    if (res.ok) {
      const data = (await res.json()) as T;
      cache.set(path, data);
      return data;
    }
  } catch {
    // Network unavailable or offline, continue to local fallback
  }

  // 2. Next.js internal API route fallback (serves full database from kanjiapi_full.json)
  if (typeof window !== "undefined") {
    try {
      const internalRes = await fetch(`/api/kanji${path}`);
      if (internalRes.ok) {
        const data = (await internalRes.json()) as T;
        cache.set(path, data);
        return data;
      }
    } catch {
      // Internal route fetch failed
    }
  }

  // 3. Static indexed dataset fallback
  const fallback = getStaticFallback<T>(path);
  if (fallback !== null) {
    cache.set(path, fallback);
    return fallback;
  }

  throw new Error(`KanjiAPI error: tidak dapat memuat data untuk ${path}`);
}

// ─── Single Client Covering Every Endpoint in the Official Documentation ─

export const kanjiClient = {
  kanji: {
    // GET /v1/kanji/{character}
    getOne: (char: string) =>
      cachedFetch<Kanji>(`/kanji/${encodeURIComponent(char)}`),

    // GET /v1/kanji/{list} : string[] lists
    getList: (list: KanjiList) =>
      cachedFetch<string[]>(`/kanji/${list}`),
    getJoyo: () =>
      cachedFetch<string[]>("/kanji/joyo"),
    getJouyou: () =>
      cachedFetch<string[]>("/kanji/jouyou"),
    getJinmeiyo: () =>
      cachedFetch<string[]>("/kanji/jinmeiyo"),
    getJinmeiyou: () =>
      cachedFetch<string[]>("/kanji/jinmeiyou"),
    getHeisig: () =>
      cachedFetch<string[]>("/kanji/heisig"),
    getKyouiku: () =>
      cachedFetch<string[]>("/kanji/kyouiku"),
    getKyoiku: () =>
      cachedFetch<string[]>("/kanji/kyoiku"),
    getGrade: (grade: 1 | 2 | 3 | 4 | 5 | 6 | 8) =>
      cachedFetch<string[]>(`/kanji/grade-${grade}`),
    getJLPT: (level: 1 | 2 | 3 | 4 | 5) =>
      cachedFetch<string[]>(`/kanji/jlpt-${level}`),
    getAll: () =>
      cachedFetch<string[]>("/kanji/all"),

    // GET /v1/kanji/{list}-enriched : Kanji[] enriched lists
    getListEnriched: (list: KanjiList) =>
      cachedFetch<Kanji[]>(`/kanji/${list}-enriched`),
    getJoyoEnriched: () =>
      cachedFetch<Kanji[]>("/kanji/joyo-enriched"),
    getJouyouEnriched: () =>
      cachedFetch<Kanji[]>("/kanji/jouyou-enriched"),
    getJinmeiyoEnriched: () =>
      cachedFetch<Kanji[]>("/kanji/jinmeiyo-enriched"),
    getJinmeiyouEnriched: () =>
      cachedFetch<Kanji[]>("/kanji/jinmeiyou-enriched"),
    getHeisigEnriched: () =>
      cachedFetch<Kanji[]>("/kanji/heisig-enriched"),
    getKyouikuEnriched: () =>
      cachedFetch<Kanji[]>("/kanji/kyouiku-enriched"),
    getKyoikuEnriched: () =>
      cachedFetch<Kanji[]>("/kanji/kyoiku-enriched"),
    getGradeEnriched: (grade: 1 | 2 | 3 | 4 | 5 | 6 | 8) =>
      cachedFetch<Kanji[]>(`/kanji/grade-${grade}-enriched`),
    getJLPTEnriched: (level: 1 | 2 | 3 | 4 | 5) =>
      cachedFetch<Kanji[]>(`/kanji/jlpt-${level}-enriched`),
    getAllEnriched: () =>
      cachedFetch<Kanji[]>("/kanji/all-enriched")
  },

  reading: {
    // GET /v1/reading/{reading}
    getByReading: (reading: string) =>
      cachedFetch<Reading>(`/reading/${encodeURIComponent(reading)}`)
  },

  words: {
    // GET /v1/words/{character}
    getByKanji: (character: string) =>
      cachedFetch<Word[]>(`/words/${encodeURIComponent(character)}`)
  }
};
