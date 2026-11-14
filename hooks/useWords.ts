"use client";

import { useState, useEffect } from "react";
import { kanjiClient, Word } from "@/lib/api/kanjiClient";

export function useWords(character: string) {
  const [data, setData] = useState<Word[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!character) return;

    let mounted = true;

    kanjiClient.words
      .getByKanji(character)
      .then((res) => {
        if (mounted) {
          setData(res);
          setError(null);
        }
      })
      .catch((e: Error) => {
        if (mounted) {
          setError(e.message || "Gagal memuat kosakata kanji");
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [character]);

  return { data, loading, error };
}
