import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { CATEGORY_LISTS, CATEGORY_META, JOYO_MAP } from "@/lib/data/kanjiCategories";
import { Kanji, Reading, Word } from "@/lib/api/kanjiClient";

interface FullDumpData {
  kanjis: Record<string, Kanji>;
  readings: Record<string, Reading>;
  words: Record<string, Word[]>;
}

let cachedFullData: FullDumpData | null = null;

function getFullDatabase(): FullDumpData | null {
  if (cachedFullData) return cachedFullData;

  // Try relative paths from current working directory or parent directory
  const candidatePaths = [
    path.resolve(process.cwd(), "kanjiapi_full.json"),
    path.resolve(process.cwd(), "..", "kanjiapi_full.json"),
    "C:\\Users\\ASUS\\OneDrive\\Documents\\Project Client\\Projet Bulit\\kanjiapi_full.json"
  ];

  for (const p of candidatePaths) {
    if (fs.existsSync(p)) {
      try {
        const raw = fs.readFileSync(p, "utf8");
        cachedFullData = JSON.parse(raw);
        return cachedFullData;
      } catch (err) {
        console.warn("Gagal membaca kanjiapi_full.json:", err);
      }
    }
  }

  return null;
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await context.params;
  if (!slug || slug.length === 0) {
    return NextResponse.json({ error: "Endpoint tidak ditemukan" }, { status: 404 });
  }

  const endpoint = slug[0];
  const target = slug[1] ? decodeURIComponent(slug[1]) : "";

  // 1. Categories meta: GET /api/kanji/categories
  if (endpoint === "categories") {
    return NextResponse.json(CATEGORY_META);
  }

  // 2. Kanji endpoints: GET /api/kanji/kanji/...
  if (endpoint === "kanji") {
    if (!target) {
      return NextResponse.json({ error: "Parameter target kanji kosong" }, { status: 400 });
    }

    // A. Enriched list: /api/kanji/kanji/{list}-enriched
    if (target.endsWith("-enriched")) {
      const listKey = target.replace("-enriched", "");
      const chars = CATEGORY_LISTS[listKey];
      if (chars) {
        const fullDb = getFullDatabase();
        const enrichedList = chars.map((c) => {
          if (JOYO_MAP[c]) return JOYO_MAP[c];
          if (fullDb?.kanjis[c]) return fullDb.kanjis[c];
          return null;
        }).filter(Boolean);
        return NextResponse.json(enrichedList);
      }
    }

    // B. Simple list: /api/kanji/kanji/{list}
    if (CATEGORY_LISTS[target]) {
      return NextResponse.json(CATEGORY_LISTS[target]);
    }

    // C. Single character: /api/kanji/kanji/{character}
    if (JOYO_MAP[target]) {
      return NextResponse.json(JOYO_MAP[target]);
    }

    const fullDb = getFullDatabase();
    if (fullDb?.kanjis[target]) {
      return NextResponse.json(fullDb.kanjis[target]);
    }

    return NextResponse.json({ error: `Kanji ${target} tidak ditemukan` }, { status: 404 });
  }

  // 3. Words endpoint: GET /api/kanji/words/{character}
  if (endpoint === "words") {
    if (!target) {
      return NextResponse.json([]);
    }
    const fullDb = getFullDatabase();
    const words = fullDb?.words[target] || [];
    return NextResponse.json(words);
  }

  // 4. Reading endpoint: GET /api/kanji/reading/{reading}
  if (endpoint === "reading") {
    if (!target) {
      return NextResponse.json({ reading: "", main_kanji: [], name_kanji: [] });
    }
    const fullDb = getFullDatabase();
    if (fullDb?.readings[target]) {
      return NextResponse.json(fullDb.readings[target]);
    }
    return NextResponse.json({ reading: target, main_kanji: [], name_kanji: [] });
  }

  return NextResponse.json({ error: "Endpoint tidak dikenal" }, { status: 404 });
}

