"use client";

import { useState, useEffect } from "react";
import { kanjiClient, Kanji } from "@/lib/api/kanjiClient";
import { KanjiData, JLPTLevel } from "@/types/kanji";
import { getAllKanji, getKanji, searchKanji } from "@/lib/api/kanjiApi";

export interface UseKanjiDetailResult {
  data: Kanji | null;
  loading: boolean;
  error: string | null;
}

export interface UseKanjiListResult {
  kanjiList: KanjiData[];
  loading: boolean;
  error: string | null;
  filterKanji: (params: {
    query?: string;
    level?: JLPTLevel | "ALL";
    minStrokes?: number;
    maxStrokes?: number;
    sortBy?: "strokes-asc" | "strokes-desc" | "character";
  }) => KanjiData[];
  getKanjiDetail: (character: string) => Promise<KanjiData | null>;
  data: null;
}

export function useKanji(character: string): UseKanjiDetailResult;
export function useKanji(): UseKanjiListResult;
export function useKanji(character?: string): UseKanjiDetailResult | UseKanjiListResult {
  const [singleData, setSingleData] = useState<Kanji | null>(null);
  const [kanjiList, setKanjiList] = useState<KanjiData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    if (character) {
      kanjiClient.kanji
        .getOne(character)
        .then((res) => {
          if (mounted) {
            setSingleData(res);
            setError(null);
          }
        })
        .catch((e: Error) => {
          if (mounted) {
            setError(e.message || "Gagal memuat detail kanji");
          }
        })
        .finally(() => {
          if (mounted) {
            setLoading(false);
          }
        });
    } else {
      getAllKanji()
        .then((res) => {
          if (mounted) {
            setKanjiList(res);
            setError(null);
          }
        })
        .catch((e: Error) => {
          if (mounted) {
            setError(e.message || "Gagal memuat data kanji");
          }
        })
        .finally(() => {
          if (mounted) {
            setLoading(false);
          }
        });
    }

    return () => {
      mounted = false;
    };
  }, [character]);

  const filterKanji = (params: {
    query?: string;
    level?: JLPTLevel | "ALL";
    minStrokes?: number;
    maxStrokes?: number;
    sortBy?: "strokes-asc" | "strokes-desc" | "character";
  }) => {
    let result = kanjiList;

    if (params.level && params.level !== "ALL") {
      result = result.filter((k) => k.jlpt === params.level);
    }

    if (params.query) {
      result = searchKanji(params.query, result);
    }

    if (params.minStrokes !== undefined) {
      result = result.filter((k) => k.strokes >= (params.minStrokes || 1));
    }

    if (params.maxStrokes !== undefined) {
      result = result.filter((k) => k.strokes <= (params.maxStrokes || 50));
    }

    if (params.sortBy === "strokes-asc") {
      result = [...result].sort((a, b) => a.strokes - b.strokes);
    } else if (params.sortBy === "strokes-desc") {
      result = [...result].sort((a, b) => b.strokes - a.strokes);
    } else if (params.sortBy === "character") {
      result = [...result].sort((a, b) => a.character.localeCompare(b.character));
    }

    return result;
  };

  if (character) {
    return {
      data: singleData,
      loading,
      error
    };
  }

  return {
    kanjiList,
    loading,
    error,
    filterKanji,
    getKanjiDetail: getKanji,
    data: null
  };
}
