"use client";

import { useState, useEffect } from "react";
import { kanjiClient, Reading } from "@/lib/api/kanjiClient";

export function useReading(kana: string) {
  const [data, setData] = useState<Reading | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!kana) return;

    let mounted = true;

    kanjiClient.reading
      .getByReading(kana)
      .then((res) => {
        if (mounted) {
          setData(res);
          setError(null);
        }
      })
      .catch((e: Error) => {
        if (mounted) {
          setError(e.message || "Gagal memuat kanji berdasarkan cara baca");
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
  }, [kana]);

  return { data, loading, error };
}
