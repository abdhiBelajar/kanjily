"use client";

import { useState, useEffect } from "react";
import { kanjiClient, KanjiList, Kanji } from "@/lib/api/kanjiClient";

export function useKanjiList(list: KanjiList) {
  const [data, setData] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    kanjiClient.kanji
      .getList(list)
      .then((res) => {
        if (mounted) {
          setData(res);
          setError(null);
        }
      })
      .catch((e: Error) => {
        if (mounted) {
          setError(e.message || "Gagal memuat daftar kanji");
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
  }, [list]);

  return { data, loading, error };
}

export function useKanjiListEnriched(list: KanjiList) {
  const [data, setData] = useState<Kanji[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    kanjiClient.kanji
      .getListEnriched(list)
      .then((res) => {
        if (mounted) {
          setData(res);
          setError(null);
        }
      })
      .catch((e: Error) => {
        if (mounted) {
          setError(e.message || "Gagal memuat daftar kanji lengkap");
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
  }, [list]);

  return { data, loading, error };
}
