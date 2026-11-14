interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
  showPercent?: boolean;
  color?: "red" | "emerald" | "blue";
}

export default function ProgressBar({
  current,
  total,
  label,
  showPercent = true,
  color = "red"
}: ProgressBarProps) {
  const safeTotal = total > 0 ? total : 1;
  const percentage = Math.min(100, Math.max(0, Math.round((current / safeTotal) * 100)));

  const colorClasses = {
    red: "bg-red-600 dark:bg-red-500",
    emerald: "bg-emerald-600 dark:bg-emerald-500",
    blue: "bg-blue-600 dark:bg-blue-500"
  };

  return (
    <div className="w-full">
      {(label || showPercent) && (
        <div className="flex items-center justify-between text-xs font-medium text-stone-600 dark:text-stone-300 mb-1.5">
          <span>{label || "Kemajuan"}</span>
          {showPercent && (
            <span>
              {current}/{total} ({percentage}%)
            </span>
          )}
        </div>
      )}
      <div
        className="w-full bg-stone-200 dark:bg-stone-800 rounded-full h-2.5 overflow-hidden"
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label={label || "Progres pembelajaran"}
      >
        <div
          className={`h-full rounded-full transition-all duration-300 ease-out ${colorClasses[color]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

