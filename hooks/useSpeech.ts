"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  toSpeakKanji,
  toSpeakWord,
  cleanSpeechReading,
} from "@/lib/utils/speechText";

export interface SpeechOptions {
  lang?: string; // default: 'ja-JP'
  rate?: number; // 0.1 - 10, default: 0.8 (sedikit lambat agar artikulasi jelas)
  pitch?: number; // 0 - 2, default: 1
  volume?: number; // 0 - 1, default: 1
}

export function useSpeech() {
  const [isSupported] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return "speechSynthesis" in window;
  });

  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return [];
    try {
      return window.speechSynthesis.getVoices();
    } catch {
      return [];
    }
  });

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingText, setSpeakingText] = useState<string | null>(null);

  // Load voices saat tersedia (Chrome memuat voices secara async)
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const loadVoices = () => {
      try {
        const available = window.speechSynthesis.getVoices();
        if (available.length > 0) {
          setVoices(available);
        }
      } catch {
        // Abaikan jika getVoices() gagal
      }
    };

    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
    };
  }, []);

  // Pilih suara Jepang terbaik yang tersedia di perangkat
  const japaneseVoice = useMemo((): SpeechSynthesisVoice | null => {
    if (voices.length === 0) return null;
    // 1. Prioritas: Suara native lokal Jepang
    const localJa = voices.find((v) => v.lang === "ja-JP" && v.localService);
    if (localJa) return localJa;

    // 2. Suara ja-JP umum
    const anyJaJp = voices.find((v) => v.lang === "ja-JP");
    if (anyJaJp) return anyJaJp;

    // 3. Suara bahasa Jepang lainnya (ja-*)
    const anyJa = voices.find((v) => v.lang.toLowerCase().startsWith("ja"));
    if (anyJa) return anyJa;

    return null;
  }, [voices]);

  // Fungsi utama pemanggilan TTS
  const speak = useCallback(
    (text: string, options: SpeechOptions = {}) => {
      if (!isSupported || typeof window === "undefined") return;

      try {
        window.speechSynthesis.cancel(); // Hentikan suara yang sedang berjalan

        const cleanText = text.trim();
        if (!cleanText) return;

        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = options.lang ?? "ja-JP";
        utterance.rate = options.rate ?? 0.8;
        utterance.pitch = options.pitch ?? 1;
        utterance.volume = options.volume ?? 1;

        if (japaneseVoice) {
          utterance.voice = japaneseVoice;
        }

        utterance.onstart = () => {
          setIsSpeaking(true);
          setSpeakingText(cleanText);
        };

        utterance.onend = () => {
          setIsSpeaking(false);
          setSpeakingText(null);
        };

        utterance.onerror = () => {
          setIsSpeaking(false);
          setSpeakingText(null);
        };

        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.error("Gagal menjalankan Text-to-Speech:", err);
        setIsSpeaking(false);
        setSpeakingText(null);
      }
    },
    [isSupported, japaneseVoice]
  );

  // Shortcut pelafalan karakter kanji
  const speakKanji = useCallback(
    (kanji: string) => {
      speak(toSpeakKanji(kanji), { lang: "ja-JP", rate: 0.7 });
    },
    [speak]
  );

  // Shortcut pelafalan bacaan (kun'yomi / on'yomi / nanori)
  const speakReading = useCallback(
    (reading: string) => {
      speak(cleanSpeechReading(reading), { lang: "ja-JP", rate: 0.8 });
    },
    [speak]
  );

  // Shortcut pelafalan kosakata
  const speakWord = useCallback(
    (word: string) => {
      speak(toSpeakWord(word), { lang: "ja-JP", rate: 0.8 });
    },
    [speak]
  );

  // Hentikan suara
  const stop = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setSpeakingText(null);
  }, []);

  return {
    speak,
    speakKanji,
    speakReading,
    speakWord,
    stop,
    isSpeaking,
    speakingText,
    isSupported,
    voices,
    japaneseVoice,
  };
}
