export type QuizType = "meaning" | "reading" | "kanji" | "writing" | "mixed";

export interface QuizSet {
  id: string;
  title: string;
  description: string;
  kanji_list: string[];
  quiz_type: QuizType;
  created_at: string;
  is_preset?: boolean;
}

export interface QuestionOption {
  id: string;
  text: string;
  subtext?: string;
}

export interface Question {
  id: string;
  kanji: string;
  prompt: string;
  type: "meaning" | "reading" | "kanji" | "writing";
  options: QuestionOption[];
  correctAnswerId: string;
  explanation: {
    meaning: string;
    onyomi: string[];
    kunyomi: string[];
  };
}

export interface QuizAnswerRecord {
  questionId: string;
  kanji: string;
  selectedOptionId: string;
  correctOptionId: string;
  isCorrect: boolean;
  timeSpentSeconds: number;
}

export interface QuizHistoryItem {
  id: string;
  set_id: string;
  set_title: string;
  score: number;
  total: number;
  percentage: number;
  duration_seconds: number;
  date: string;
  answers?: QuizAnswerRecord[];
}
