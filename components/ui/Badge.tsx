import { JLPTLevel } from "@/types/kanji";

interface BadgeProps {
  level?: JLPTLevel | string;
  variant?: "jlpt" | "mastered" | "learning" | "neutral" | "danger" | "stroke";
  children?: React.ReactNode;
}

export default function Badge({ level, variant = "jlpt", children }: BadgeProps) {
  if (variant === "jlpt" && level) {
    const levelStyles: Record<string, string> = {
      N5: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60",
      N4: "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800/60",
      N3: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/60",
      N2: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60",
      N1: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800/60"
    };

    const style = levelStyles[level] || "bg-stone-100 text-stone-700 border-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:border-stone-700";

    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${style}`}>
        JLPT {level}
      </span>
    );
  }

  const variantStyles: Record<string, string> = {
    jlpt: "bg-stone-100 text-stone-700 border-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:border-stone-700",
    mastered: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60",
    learning: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60",
    neutral: "bg-stone-100 text-stone-700 border-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:border-stone-700",
    danger: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800/60",
    stroke: "bg-stone-100 text-stone-600 border-stone-200 dark:bg-stone-850 dark:text-stone-300 dark:border-stone-700"
  };

  const currentStyle = variantStyles[variant] || variantStyles.neutral;

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${currentStyle}`}>
      {children}
    </span>
  );
}
