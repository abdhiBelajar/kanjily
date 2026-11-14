"use client";

import { useState } from "react";
import { QuizSet, QuizType } from "@/types/quiz";
import { KanjiData } from "@/types/kanji";
import { saveQuizSet } from "@/lib/storage/quizSets";
import SearchInput from "@/components/ui/SearchInput";

interface QuizBuilderProps {
  allKanji: KanjiData[];
  onSetCreated: (newSet: QuizSet) => void;
  onCancel: () => void;
}

export default function QuizBuilder({ allKanji, onSetCreated, onCancel }: QuizBuilderProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [quizType, setQuizType] = useState<QuizType>("meaning");
  const [selectedKanji, setSelectedKanji] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  const filteredKanji = allKanji.filter(
    (k) =>
      k.character.includes(searchQuery) ||
      k.meaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (k.meaningId && k.meaningId.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const toggleSelectKanji = (char: string) => {
    setSelectedKanji((prev) =>
      prev.includes(char) ? prev.filter((c) => c !== char) : [...prev, char]
    );
  };

  const handleSelectAllN5 = () => {
    const n5Chars = allKanji.filter((k) => k.jlpt === "N5").map((k) => k.character);
    const combined = Array.from(new Set([...selectedKanji, ...n5Chars]));
    setSelectedKanji(combined);
  };

  const handleClearSelection = () => {
    setSelectedKanji([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Silakan masukkan judul set kuis.");
      return;
    }
    if (selectedKanji.length < 3) {
      setError("Pilih minimal 3 kanji untuk membuat set kuis.");
      return;
    }

    const newSet = saveQuizSet({
      title: title.trim(),
      description: description.trim() || "Set kuis khusus buatan Anda",
      kanji_list: selectedKanji,
      quiz_type: quizType
    });

    onSetCreated(newSet);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-850">
        <div>
          <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
            Buat Set Kuis Baru (新規セット作成)
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Pilih kanji dan jenis kuis sesuai target latihan belajar Anda.
          </p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          aria-label="Batalkan"
          className="text-xs text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200"
        >
          Batal
        </button>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-semibold">
          {error}
        </div>
      )}

      {/* Title & Description */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="quiz-title" className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
            Judul Set Kuis *
          </label>
          <input
            id="quiz-title"
            type="text"
            required
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setError(null);
            }}
            placeholder="Contoh: Kanji Arah dan Lokasi"
            className="w-full text-xs p-2.5 bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div>
          <label htmlFor="quiz-type" className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
            Tipe Pertanyaan
          </label>
          <select
            id="quiz-type"
            value={quizType}
            onChange={(e) => setQuizType(e.target.value as QuizType)}
            className="w-full text-xs p-2.5 bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="meaning">Tebak Arti (Kanji → Makna)</option>
            <option value="reading">Tebak Bacaan (Kanji → Hiragana/Katakana)</option>
            <option value="kanji">Tebak Karakter (Makna → Kanji)</option>
            <option value="mixed">Campuran Semua Tipe</option>
          </select>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="quiz-desc" className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
            Deskripsi Singkat (Opsional)
          </label>
          <input
            id="quiz-desc"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Contoh: Fokus pada kanji yang sering keluar pada bagian kosakata JLPT N5"
            className="w-full text-xs p-2.5 bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
      </div>

      {/* Kanji Selection Section */}
      <div className="space-y-3 pt-2 border-t border-stone-100 dark:border-stone-850">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-semibold text-stone-800 dark:text-stone-200">
              Pilih Kanji ({selectedKanji.length} dipilih)
            </span>
            <span className="text-[11px] text-stone-500 dark:text-stone-400 block">
              Klik kanji di bawah untuk menambah atau menghapus dari set.
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSelectAllN5}
              className="text-xs px-2.5 py-1 rounded bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
            >
              + Pilih Semua N5
            </button>
            {selectedKanji.length > 0 && (
              <button
                type="button"
                onClick={handleClearSelection}
                className="text-xs px-2.5 py-1 rounded text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
              >
                Hapus Pilihan
              </button>
            )}
          </div>
        </div>

        {/* Search filter for kanji selection */}
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Filter kanji untuk dimasukkan..."
        />

        {/* Kanji clickable chips grid */}
        <div className="max-h-56 overflow-y-auto p-2 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
          {filteredKanji.map((k) => {
            const isSelected = selectedKanji.includes(k.character);
            return (
              <button
                key={k.character}
                type="button"
                onClick={() => toggleSelectKanji(k.character)}
                className={`p-2 rounded-lg border text-center transition-all focus-visible:outline-2 focus-visible:outline-red-500 ${
                  isSelected
                    ? "bg-red-600 border-red-700 text-white shadow-xs"
                    : "bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-200 hover:border-red-300"
                }`}
              >
                <div className="font-kanji text-xl font-bold">{k.character}</div>
                <div className={`text-[10px] truncate ${isSelected ? "text-red-100" : "text-stone-500 dark:text-stone-400"}`}>
                  {k.meaningId || k.meaning}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Form Submission Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100 dark:border-stone-850">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-xs font-semibold rounded-lg text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
        >
          Batal
        </button>
        <button
          type="submit"
          className="px-5 py-2 text-xs font-semibold rounded-lg bg-red-600 hover:bg-red-700 text-white shadow-xs transition-colors focus-visible:outline-2 focus-visible:outline-red-500"
        >
          Simpan Set Kuis
        </button>
      </div>
    </form>
  );
}

