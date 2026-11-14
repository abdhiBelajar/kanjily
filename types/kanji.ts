export type JLPTLevel = "N5" | "N4" | "N3" | "N2" | "N1";

export interface ExampleWord {
  word: string;
  reading: string;
  meaning: string;
}

export interface ExampleSentence {
  japanese: string;
  reading: string;
  meaning: string;
}

export interface KanjiData {
  id: string;
  character: string;
  meaning: string;
  meaningId?: string; // Arti bahasa Indonesia
  onyomi: string[];
  kunyomi: string[];
  strokes: number;
  jlpt: JLPTLevel;
  grade?: number;
  radical?: string;
  radicalMeaning?: string;
  frequency?: number;
  freq_mainichi_shinbun?: number | null;
  heisig_en?: string | null;
  name_readings?: string[];
  notes?: string[];
  unicode?: string;
  alternate_stroke_counts?: number[];
  examples: ExampleWord[];
  sentences?: ExampleSentence[];
  strokePaths?: string[]; // SVG path data for stroke animation
}

