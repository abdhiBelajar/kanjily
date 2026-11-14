import { Suspense } from "react";
import Link from "next/link";
import { getKanji } from "@/lib/api/kanjiApi";
import { KANJI_DATASET } from "@/lib/data/kanjiDataset";
import { KanjiData } from "@/types/kanji";
import KanjiDetail from "@/components/kanji/KanjiDetail";

interface PageProps {
  params: Promise<{ kanji: string }>;
}

export async function generateStaticParams() {
  return KANJI_DATASET.map((k) => ({
    kanji: encodeURIComponent(k.character),
  }));
}

async function KanjiDetailAsync({ params }: PageProps) {
  const resolved = await params;
  const character = decodeURIComponent(resolved.kanji);
  const kanji: KanjiData | null = await getKanji(character);

  if (!kanji) {
    return (
      <div className="flex flex-col items-center justify-center p-8 sm:p-16 my-8 text-center bg-white dark:bg-stone-900 border border-dashed border-stone-300 dark:border-stone-700 rounded-2xl">
        <span className="font-kanji text-6xl text-stone-300 dark:text-stone-700 mb-3">否</span>
        <h1 className="text-lg font-bold text-stone-800 dark:text-stone-200 mb-1">
          Karakter Kanji 「{character}」 Tidak Ditemukan
        </h1>
        <p className="text-xs text-stone-500 dark:text-stone-400 max-w-sm mb-5">
          Karakter yang Anda cari belum tersedia dalam basis data atau terjadi kesalahan penulisan alamat URL.
        </p>
        <Link
          href="/browse"
          className="px-4 py-2 text-xs font-semibold rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors"
        >
          Kembali ke Koleksi Kanji
        </Link>
      </div>
    );
  }

  return <KanjiDetail kanji={kanji} />;
}

export default function KanjiDetailPage({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="space-y-6 animate-pulse">
          <div className="h-6 w-36 bg-stone-200 dark:bg-stone-800 rounded" />
          <div className="h-72 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6" />
        </div>
      }
    >
      <KanjiDetailAsync params={params} />
    </Suspense>
  );
}
