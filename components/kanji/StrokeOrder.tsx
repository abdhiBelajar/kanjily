"use client";

import { useState, useEffect, useRef } from "react";

interface StrokeOrderProps {
  character: string;
  strokes: number;
  strokePaths?: string[];
}

export default function StrokeOrder({ character, strokes, strokePaths }: StrokeOrderProps) {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [showNumbers, setShowNumbers] = useState<boolean>(true);
  const animationTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Generate fallback visual paths if not provided
  const paths = strokePaths && strokePaths.length > 0 ? strokePaths : [];
  const maxSteps = paths.length > 0 ? paths.length : strokes;

  // Auto-play animation loop
  useEffect(() => {
    if (isPlaying) {
      animationTimerRef.current = setTimeout(() => {
        if (currentStep < maxSteps) {
          setCurrentStep((prev) => prev + 1);
        } else {
          setIsPlaying(false);
        }
      }, 700);
    }

    return () => {
      if (animationTimerRef.current) {
        clearTimeout(animationTimerRef.current);
      }
    };
  }, [isPlaying, currentStep, maxSteps]);

  const handlePlayToggle = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      if (currentStep >= maxSteps) {
        setCurrentStep(1);
      } else if (currentStep === 0) {
        setCurrentStep(1);
      }
      setIsPlaying(true);
    }
  };

  const handleNext = () => {
    setIsPlaying(false);
    setCurrentStep((prev) => Math.min(prev + 1, maxSteps));
  };

  const handlePrev = () => {
    setIsPlaying(false);
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
  };

  return (
    <div className="flex flex-col items-center bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-4 sm:p-6 shadow-xs">
      <div className="flex items-center justify-between w-full mb-3 text-xs text-stone-500 dark:text-stone-400">
        <span className="font-semibold text-stone-700 dark:text-stone-300">
          Urutan Goresan (筆順 : Hitsujun)
        </span>
        <span>
          Langkah {currentStep} dari {maxSteps}
        </span>
      </div>

      {/* Calligraphy Guide Grid (Genkouyoushi square) */}
      <div className="relative w-48 h-48 sm:w-56 sm:h-56 bg-stone-50 dark:bg-stone-950 border-2 border-stone-300 dark:border-stone-700 rounded-lg overflow-hidden flex items-center justify-center shadow-inner">
        {/* Dashed center guidelines */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="w-full h-1/2 border-b border-dashed border-red-300/40 dark:border-red-900/30" />
          <div className="h-full w-1/2 border-r border-dashed border-red-300/40 dark:border-red-900/30 absolute top-0 left-0" />
        </div>

        {paths.length > 0 ? (
          <svg viewBox="0 0 100 100" className="w-full h-full p-4">
            {/* Background complete faint guide */}
            {paths.map((p, idx) => (
              <path
                key={`bg-${idx}`}
                d={p}
                fill="none"
                stroke="currentColor"
                className="text-stone-200 dark:text-stone-800"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}

            {/* Active strokes up to current step */}
            {paths.slice(0, currentStep).map((p, idx) => {
              const isCurrent = idx === currentStep - 1;
              return (
                <path
                  key={`active-${idx}`}
                  d={p}
                  fill="none"
                  stroke={isCurrent ? "#dc2626" : "currentColor"}
                  className={isCurrent ? "" : "text-stone-850 dark:text-stone-100"}
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              );
            })}

            {/* Stroke Numbers */}
            {showNumbers &&
              paths.slice(0, currentStep).map((p, idx) => {
                // Extract approx start point from M x,y
                const match = p.match(/M\s*(\d+)[,\s]+(\d+)/);
                const x = match ? parseInt(match[1], 10) : 20;
                const y = match ? parseInt(match[2], 10) : 20;
                return (
                  <g key={`num-${idx}`}>
                    <circle cx={x} cy={y} r="4" fill="#dc2626" />
                    <text
                      x={x}
                      y={y + 1.5}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="#ffffff"
                      fontSize="5"
                      fontWeight="bold"
                    >
                      {idx + 1}
                    </text>
                  </g>
                );
              })}
          </svg>
        ) : (
          // Visual Character with dynamic opacity based on step
          <div className="relative text-center select-none">
            <span
              className={`font-kanji text-7xl sm:text-8xl transition-all duration-300 ${
                currentStep === 0
                  ? "text-stone-300 dark:text-stone-700"
                  : "text-stone-900 dark:text-stone-100"
              }`}
            >
              {character}
            </span>
          </div>
        )}
      </div>

      {/* Control Buttons */}
      <div className="flex items-center gap-2 mt-4">
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentStep === 0}
          aria-label="Langkah sebelumnya"
          className="p-2 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-40 transition-colors focus-visible:outline-2 focus-visible:outline-red-500"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          type="button"
          onClick={handlePlayToggle}
          aria-label={isPlaying ? "Jeda animasi" : "Mulai animasi urutan goresan"}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium text-xs shadow-xs transition-colors focus-visible:outline-2 focus-visible:outline-red-500"
        >
          {isPlaying ? (
            <>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
              </svg>
              <span>Jeda</span>
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              </svg>
              <span>{currentStep === 0 ? "Mulai Animasi" : "Lanjutkan"}</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleNext}
          disabled={currentStep >= maxSteps}
          aria-label="Langkah berikutnya"
          className="p-2 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-40 transition-colors focus-visible:outline-2 focus-visible:outline-red-500"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <button
          type="button"
          onClick={handleReset}
          aria-label="Ulangi dari awal"
          className="p-2 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors focus-visible:outline-2 focus-visible:outline-red-500"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {paths.length > 0 && (
        <div className="mt-3">
          <label className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 select-none cursor-pointer">
            <input
              type="checkbox"
              checked={showNumbers}
              onChange={(e) => setShowNumbers(e.target.checked)}
              className="rounded text-red-600 focus:ring-red-500 h-3.5 w-3.5"
            />
            <span>Tampilkan nomor urutan goresan</span>
          </label>
        </div>
      )}
    </div>
  );
}

