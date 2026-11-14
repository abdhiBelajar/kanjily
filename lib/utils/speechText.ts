// lib/utils/speechText.ts
// Format teks untuk Text-to-Speech kanji via Web Speech API

// Ucapkan karakter kanji itu sendiri (browser akan membaca dengan on'yomi / default)
export const toSpeakKanji = (kanji: string): string => kanji.trim();

// Ucapkan kun'yomi (cara baca Jepang asli)
// Menghilangkan tanda "-" dan "." yang sering ada pada data kamus / kanjiapi
// Contoh: "-び" -> "び", "あ.たる" -> "あたる"
export const toSpeakKun = (kun: string): string =>
  kun.replace(/[-\.]/g, "").trim();

// Ucapkan on'yomi (cara baca Sino-Jepang, Katakana)
export const toSpeakOn = (on: string): string => on.trim();

// Ucapkan contoh kata / kosakata
export const toSpeakWord = (written: string): string => written.trim();

// Bersihkan teks bacaan umum
export const cleanSpeechReading = (reading: string): string =>
  reading.replace(/[-\.]/g, "").trim();
