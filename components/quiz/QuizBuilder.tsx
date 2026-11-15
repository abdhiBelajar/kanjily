"use client";

import { useState } from "react";
import { QuizSet, QuizType } from "@/types/quiz";
import { KanjiData } from "@/types/kanji";
import { saveQuizSet } from "@/lib/storage/quizSets";
import { getProgress } from "@/lib/storage/progress";
import SearchInput from "@/components/ui/SearchInput";

interface QuizBuilderProps {
  allKanji: KanjiData[];
  onSetCreated: (newSet: QuizSet) => void;
  onCancel: () => void;
  autoGenerateOnMount?: boolean;
}

type GeneratorCategory = "n5" | "n4" | "n3" | "grade1-2" | "unmastered" | "all";

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function buildInitialState(allKanji: KanjiData[], autoGenerate: boolean) {
  if (!autoGenerate || allKanji.length === 0) {
    return {
      title: "",
      description: "",
      quizType: "mixed" as QuizType,
      selectedKanji: [] as string[],
      notice: null as string | null,
    };
  }

  const n5Pool = allKanji.filter((k) => k.jlpt === "N5");
  const pool = n5Pool.length >= 10 ? n5Pool : allKanji;
  const picked = shuffleArray(pool).slice(0, Math.min(10, pool.length)).map((k) => k.character);

  return {
    title: `Kuis Otomatis JLPT N5 (${picked.length} Soal)`,
    description: `Paket kuis campuran berisi ${picked.length} soal kanji yang dibuat secara otomatis.`,
    quizType: "mixed" as QuizType,
    selectedKanji: picked,
    notice: `Berhasil menghasilkan ${picked.length} soal kanji otomatis (JLPT N5 : Campuran)!`,
  };
}

export default function QuizBuilder({
  allKanji,
  onSetCreated,
  onCancel,
  autoGenerateOnMount = false,
}: QuizBuilderProps) {
  const [initialConfig] = useState(() => buildInitialState(allKanji, autoGenerateOnMount));

  const [title, setTitle] = useState(initialConfig.title);
  const [description, setDescription] = useState(initialConfig.description);
  const [quizType, setQuizType] = useState<QuizType>(initialConfig.quizType);
  const [selectedKanji, setSelectedKanji] = useState<string[]>(initialConfig.selectedKanji);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Status Generator Soal Otomatis
  const [genCategory, setGenCategory] = useState<GeneratorCategory>("n5");
  const [genCount, setGenCount] = useState<number>(10);
  const [genQuizType, setGenQuizType] = useState<QuizType>("mixed");
  const [genNotice, setGenNotice] = useState<string | null>(initialConfig.notice);

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
    setGenNotice(null);
  };

  // Fungsi Inti Generator Soal Otomatis
  const handleAutoGenerate = (
    overrideCategory?: GeneratorCategory,
    overrideCount?: number,
    overrideQuizType?: QuizType
  ) => {
    const targetCategory = overrideCategory || genCategory;
    const count = overrideCount || genCount;
    const targetQuizType = overrideQuizType || genQuizType;

    let candidatePool: KanjiData[] = [];

    if (targetCategory === "n5") {
      candidatePool = allKanji.filter((k) => k.jlpt === "N5");
    } else if (targetCategory === "n4") {
      candidatePool = allKanji.filter((k) => k.jlpt === "N4");
    } else if (targetCategory === "n3") {
      candidatePool = allKanji.filter((k) => k.jlpt === "N3");
    } else if (targetCategory === "grade1-2") {
      candidatePool = allKanji.filter((k) => k.grade === 1 || k.grade === 2);
    } else if (targetCategory === "unmastered") {
      const progress = getProgress();
      // Prioritaskan kanji yang belum dikuasai (mastered === false)
      candidatePool = allKanji.filter((k) => {
        const item = progress[k.character];
        return !item || !item.mastered;
      });
    } else {
      candidatePool = allKanji;
    }

    // Jika kategori terpilih memiliki kanji lebih sedikit dari jumlah target, gunakan seluruh koleksi
    if (candidatePool.length < count) {
      candidatePool = allKanji;
    }

    if (candidatePool.length === 0) {
      setError("Data kanji tidak ditemukan untuk membuat soal.");
      return;
    }

    const pickedKanji = shuffleArray(candidatePool)
      .slice(0, Math.min(count, candidatePool.length))
      .map((k) => k.character);

    setSelectedKanji(pickedKanji);
    setQuizType(targetQuizType);
    setError(null);

    const categoryLabels: Record<GeneratorCategory, string> = {
      n5: "JLPT N5",
      n4: "JLPT N4",
      n3: "JLPT N3",
      "grade1-2": "SD Kelas 1-2",
      unmastered: "Penguatan Target",
      all: "Acak Campuran",
    };

    const typeLabels: Record<QuizType, string> = {
      meaning: "Tebak Arti",
      reading: "Tebak Bacaan",
      kanji: "Tebak Karakter",
      writing: "Menulis Manual",
      mixed: "Campuran",
    };

    const autoTitle = `Kuis Otomatis ${categoryLabels[targetCategory]} (${pickedKanji.length} Soal)`;
    const autoDesc = `Paket kuis ${typeLabels[targetQuizType].toLowerCase()} berisi ${pickedKanji.length} soal kanji yang dibuat secara otomatis.`;

    setTitle(autoTitle);
    setDescription(autoDesc);
    setGenNotice(
      `Berhasil menghasilkan ${pickedKanji.length} soal kanji otomatis (${categoryLabels[targetCategory]} : ${typeLabels[targetQuizType]})!`
    );
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
      quiz_type: quizType,
    });

    onSetCreated(newSet);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 animate-fadeIn"
    >
      {/* Header Modal Builder */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 text-[11px] font-semibold mb-1">
            <span>新規セット作成</span>
            <span>Pembuat Kuis</span>
          </div>
          <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
            Buat Set Kuis Baru
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Gunakan tombol otomatis untuk menghasilkan paket latihan secara instan atau sesuaikan pilihan kanji sendiri.
          </p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          aria-label="Batalkan pembuatan kuis"
          className="text-xs px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
        >
          Batal
        </button>
      </div>

      {/* Panel Utama Generator Soal Otomatis */}
      <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-red-500/10 via-amber-500/10 to-transparent border border-red-200 dark:border-red-900/60 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-red-600 text-white text-sm font-bold shadow-xs">
              ⚡
            </span>
            <div>
              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                Generator Soal Otomatis (自動問題生成)
              </h3>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                Buat dan acak kanji secara instan tanpa perlu memilih satu per satu.
              </p>
            </div>
          </div>

          {/* Preset Cepat 1-Klik */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => handleAutoGenerate("n5", 10, "mixed")}
              className="px-2.5 py-1 text-xs font-semibold rounded-md bg-red-600 hover:bg-red-700 text-white shadow-xs transition-colors"
            >
              ⚡ Kuis Cepat N5 (10 Soal)
            </button>
            <button
              type="button"
              onClick={() => handleAutoGenerate("n4", 10, "mixed")}
              className="px-2.5 py-1 text-xs font-medium rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
            >
              N4 (10 Soal)
            </button>
            <button
              type="button"
              onClick={() => handleAutoGenerate("n5", 10, "writing")}
              className="px-2.5 py-1 text-xs font-medium rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
            >
              ✍️ Menulis N5 (10 Soal)
            </button>
            <button
              type="button"
              onClick={() => handleAutoGenerate("unmastered", 10, "meaning")}
              className="px-2.5 py-1 text-xs font-medium rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
            >
              Kanji Belum Dikuasai
            </button>
          </div>
        </div>

        {/* Kontrol Generator Kustom */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-stone-200/60 dark:border-stone-800">
          <div>
            <label
              htmlFor="gen-category"
              className="block text-[11px] font-semibold text-stone-600 dark:text-stone-400 mb-1"
            >
              Target Level / Kategori
            </label>
            <select
              id="gen-category"
              value={genCategory}
              onChange={(e) => setGenCategory(e.target.value as GeneratorCategory)}
              className="w-full text-xs p-2 bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="n5">JLPT N5 (Kanji Dasar)</option>
              <option value="n4">JLPT N4 (Menengah Bawah)</option>
              <option value="n3">JLPT N3 (Menengah)</option>
              <option value="grade1-2">SD Kelas 1-2 (Kyōiku Kanji)</option>
              <option value="unmastered">Butuh Latihan (Belum Dikuasai)</option>
              <option value="all">Semua Koleksi (Acak Bebas)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-400 mb-1">
              Jumlah Soal
            </label>
            <div className="flex items-center gap-1.5">
              {[5, 10, 15, 20].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setGenCount(num)}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                    genCount === num
                      ? "bg-red-600 border-red-700 text-white shadow-xs"
                      : "bg-white dark:bg-stone-950 border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-red-400"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label
              htmlFor="gen-quiz-type"
              className="block text-[11px] font-semibold text-stone-600 dark:text-stone-400 mb-1"
            >
              Format Pertanyaan
            </label>
            <select
              id="gen-quiz-type"
              value={genQuizType}
              onChange={(e) => setGenQuizType(e.target.value as QuizType)}
              className="w-full text-xs p-2 bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="mixed">Campuran Semua Tipe</option>
              <option value="writing">Menulis Manual (Tulis Kanji di Kanvas)</option>
              <option value="meaning">Tebak Arti (Kanji ke Makna)</option>
              <option value="reading">Tebak Bacaan (Kanji ke Kana)</option>
              <option value="kanji">Tebak Karakter (Makna ke Kanji)</option>
            </select>
          </div>
        </div>

        {/* Tombol Eksekusi Generator */}
        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => handleAutoGenerate()}
            className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-2 focus-visible:outline-2 focus-visible:outline-red-500"
          >
            <span>⚡</span>
            <span>Generate Soal Otomatis Sekarang</span>
          </button>

          {selectedKanji.length > 0 && (
            <button
              type="button"
              onClick={() => handleAutoGenerate()}
              title="Acak ulang dengan variasi kanji berbeda"
              className="px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 text-xs font-medium hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors flex items-center gap-1.5"
            >
              <span>🔄</span>
              <span className="hidden sm:inline">Acak Ulang</span>
            </button>
          )}
        </div>

        {/* Notifikasi Hasil Generator */}
        {genNotice && (
          <div
            role="status"
            className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-medium flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <span className="font-bold">✓</span>
              <span>{genNotice}</span>
            </div>
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              Siap disimpan
            </span>
          </div>
        )}
      </div>

      {error && (
        <div
          role="alert"
          className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-semibold"
        >
          {error}
        </div>
      )}

      {/* Metadata Kuis (Judul & Deskripsi) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="quiz-title"
            className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5"
          >
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
          <label
            htmlFor="quiz-type"
            className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5"
          >
            Tipe Pertanyaan
          </label>
          <select
            id="quiz-type"
            value={quizType}
            onChange={(e) => setQuizType(e.target.value as QuizType)}
            className="w-full text-xs p-2.5 bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="mixed">Campuran Semua Tipe</option>
            <option value="writing">Menulis Manual (Tulis Kanji di Kanvas)</option>
            <option value="meaning">Tebak Arti (Kanji ke Makna)</option>
            <option value="reading">Tebak Bacaan (Kanji ke Hiragana/Katakana)</option>
            <option value="kanji">Tebak Karakter (Makna ke Kanji)</option>
          </select>
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="quiz-desc"
            className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5"
          >
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
      <div className="space-y-3 pt-2 border-t border-stone-100 dark:border-stone-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-stone-800 dark:text-stone-200">
                Pilih Kanji Manual ({selectedKanji.length} dipilih)
              </span>
              {selectedKanji.length >= 3 && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                  Memenuhi syarat kuis
                </span>
              )}
            </div>
            <span className="text-[11px] text-stone-500 dark:text-stone-400 block">
              Klik kanji di bawah untuk menambah atau mengurangi dari set kuis.
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
          placeholder="Cari kanji untuk dimasukkan..."
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
                <div
                  className={`text-[10px] truncate ${
                    isSelected ? "text-red-100" : "text-stone-500 dark:text-stone-400"
                  }`}
                >
                  {k.meaningId || k.meaning}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Form Submission Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-stone-100 dark:border-stone-800">
        <span className="text-xs text-stone-500 dark:text-stone-400">
          {selectedKanji.length} kanji terpilih {selectedKanji.length < 3 && "(minimal butuh 3 kanji)"}
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-xs font-semibold rounded-lg text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={selectedKanji.length < 3}
            className="px-5 py-2 text-xs font-semibold rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white shadow-xs transition-colors focus-visible:outline-2 focus-visible:outline-red-500"
          >
            Simpan Set Kuis
          </button>
        </div>
      </div>
    </form>
  );
}
