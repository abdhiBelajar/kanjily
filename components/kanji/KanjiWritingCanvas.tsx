"use client";

import {
  useRef,
  useState,
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  evaluateKanjiWriting,
  KanjiEvaluationResult,
} from "@/lib/utils/kanjiEvaluator";

interface Point {
  x: number;
  y: number;
}

interface Stroke {
  points: Point[];
  color: string;
  width: number;
}

export interface KanjiWritingCanvasRef {
  getCanvas: () => HTMLCanvasElement | null;
  clear: () => void;
  undo: () => void;
  getStrokesCount: () => number;
  evaluate: () => KanjiEvaluationResult | null;
}

export interface KanjiWritingCanvasProps {
  character?: string;
  targetStrokes?: number;
  showGuideTemplate?: boolean;
  onStrokeChange?: (strokeCount: number) => void;
  onEvaluationComplete?: (result: KanjiEvaluationResult) => void;
  width?: number;
  height?: number;
  className?: string;
  allowColorChange?: boolean;
  compact?: boolean;
  showEvaluationButton?: boolean;
}

const KanjiWritingCanvas = forwardRef<
  KanjiWritingCanvasRef,
  KanjiWritingCanvasProps
>(function KanjiWritingCanvas(
  {
    character,
    targetStrokes,
    showGuideTemplate = true,
    onStrokeChange,
    onEvaluationComplete,
    width = 280,
    height = 280,
    className = "",
    allowColorChange = true,
    compact = false,
    showEvaluationButton,
  },
  ref
) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [prevCharacter, setPrevCharacter] = useState(character);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [showTemplate, setShowTemplate] = useState(showGuideTemplate);
  const [brushWidth, setBrushWidth] = useState<number>(8);
  const [brushColor, setBrushColor] = useState<string>("default");
  const [evaluation, setEvaluation] = useState<KanjiEvaluationResult | null>(null);

  // Reset goresan & evaluasi saat karakter berganti
  if (prevCharacter !== character) {
    setPrevCharacter(character);
    setStrokes([]);
    setEvaluation(null);
  }

  // Notifikasi perubahan jumlah goresan ke pemanggil
  useEffect(() => {
    onStrokeChange?.(strokes.length);
  }, [strokes.length, onStrokeChange]);

  // Koordinat relatif di canvas
  const getCoordinates = (e: React.MouseEvent | React.TouchEvent): Point | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();

    if ("touches" in e) {
      if (e.touches.length === 0) return null;
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }

    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  // Redraw semua goresan pada canvas
  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    // Gambar setiap goresan
    strokes.forEach((stroke) => {
      if (stroke.points.length === 0) return;

      ctx.beginPath();
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.width;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      if (stroke.points.length === 1) {
        // Titik tunggal (dot stroke)
        ctx.arc(stroke.points[0].x, stroke.points[0].y, stroke.width / 2, 0, Math.PI * 2);
        ctx.fillStyle = stroke.color;
        ctx.fill();
      } else {
        ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
        for (let i = 1; i < stroke.points.length; i++) {
          ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
        }
        ctx.stroke();
      }
    });
  }, [strokes, width, height]);

  useEffect(() => {
    redrawCanvas();
  }, [redrawCanvas]);

  const getEffectiveColor = () => {
    if (brushColor === "red") return "#dc2626";
    if (brushColor === "blue") return "#2563eb";
    // Default menyesuaikan tema sistem/CSS
    if (typeof document !== "undefined") {
      const isDark = document.documentElement.classList.contains("dark");
      return isDark ? "#f5f5f4" : "#1c1917";
    }
    return "#1c1917";
  };

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    const pt = getCoordinates(e);
    if (!pt) return;

    // Reset evaluasi saat pengguna mulai mencoret lagi
    if (evaluation) {
      setEvaluation(null);
    }

    setIsDrawing(true);
    const newStroke: Stroke = {
      points: [pt],
      color: getEffectiveColor(),
      width: brushWidth,
    };

    setStrokes((prev) => [...prev, newStroke]);
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const pt = getCoordinates(e);
    if (!pt) return;

    setStrokes((prev) => {
      if (prev.length === 0) return prev;
      const lastIndex = prev.length - 1;
      const lastStroke = prev[lastIndex];
      const updatedStroke = {
        ...lastStroke,
        points: [...lastStroke.points, pt],
      };
      const updated = [...prev];
      updated[lastIndex] = updatedStroke;
      return updated;
    });
  };

  const handleEnd = () => {
    setIsDrawing(false);
  };

  const handleUndo = () => {
    setEvaluation(null);
    setStrokes((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setEvaluation(null);
    setStrokes([]);
  };

  // Fungsi evaluasi otomatis
  const runEvaluation = useCallback((): KanjiEvaluationResult | null => {
    if (!canvasRef.current || !character) return null;

    const result = evaluateKanjiWriting({
      userCanvas: canvasRef.current,
      targetCharacter: character,
      targetStrokes,
      userStrokeCount: strokes.length,
    });

    setEvaluation(result);
    onEvaluationComplete?.(result);
    return result;
  }, [character, targetStrokes, strokes.length, onEvaluationComplete]);

  // Imperative Handle untuk ref
  useImperativeHandle(
    ref,
    () => ({
      getCanvas: () => canvasRef.current,
      clear: handleClear,
      undo: handleUndo,
      getStrokesCount: () => strokes.length,
      evaluate: runEvaluation,
    }),
    [runEvaluation, strokes.length]
  );

  const shouldShowEvalButton =
    showEvaluationButton !== undefined
      ? showEvaluationButton
      : Boolean(character && !compact);

  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      {/* Canvas Box dengan Grid Kaligrafi & Bayangan */}
      <div
        className="relative bg-stone-50 dark:bg-stone-950 border-2 border-stone-300 dark:border-stone-700 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center"
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        {/* Garis Bantu Genkouyoushi (Garis horizontal & vertikal putus-putus) */}
        {showGrid && (
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <div className="w-full h-1/2 border-b border-dashed border-red-300/40 dark:border-red-900/30" />
            <div className="h-full w-1/2 border-r border-dashed border-red-300/40 dark:border-red-900/30 absolute top-0 left-0" />
            {/* Garis diagonal bantu */}
            <svg className="absolute inset-0 w-full h-full opacity-15 dark:opacity-10 stroke-current text-red-500">
              <line x1="0" y1="0" x2={width} y2={height} strokeDasharray="4 4" strokeWidth="1" />
              <line x1={width} y1="0" x2="0" y2={height} strokeDasharray="4 4" strokeWidth="1" />
            </svg>
          </div>
        )}

        {/* Bayangan Karakter Faint (Template Penjiplakan) */}
        {showTemplate && character && (
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none select-none text-stone-300/60 dark:text-stone-700/60 font-kanji font-normal"
            style={{ fontSize: `${Math.round(width * 0.72)}px` }}
            aria-hidden="true"
          >
            {character}
          </div>
        )}

        {/* HTML5 Drawing Canvas */}
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
          className="relative z-10 cursor-crosshair touch-none"
          style={{ width: `${width}px`, height: `${height}px` }}
          aria-label="Kanvas menulis kanji mandiri"
        />
      </div>

      {/* Bar Status Goresan & Kontrol Kanvas */}
      <div
        className="w-full flex items-center justify-between text-xs mt-3 px-1"
        style={{ maxWidth: `${width}px` }}
      >
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-stone-700 dark:text-stone-300">
            {strokes.length} goresan
          </span>
          {targetStrokes && (
            <span
              className={`text-[11px] px-1.5 py-0.2 rounded font-medium ${
                strokes.length === targetStrokes
                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300"
                  : "text-stone-500 dark:text-stone-400"
              }`}
            >
              (target: {targetStrokes})
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleUndo}
            disabled={strokes.length === 0}
            title="Urungkan goresan terakhir"
            aria-label="Urungkan goresan"
            className="px-2 py-1 text-xs rounded border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-850 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Urungkan
          </button>
          <button
            type="button"
            onClick={handleClear}
            disabled={strokes.length === 0}
            title="Hapus seluruh tulisan di kanvas"
            aria-label="Hapus kanvas"
            className="px-2 py-1 text-xs rounded border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-850 hover:bg-stone-100 dark:hover:bg-stone-800 text-rose-600 dark:text-rose-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Hapus
          </button>
        </div>
      </div>

      {/* Opsi Tambahan (Template Bayangan & Tebal Kuas) */}
      {!compact && (
        <div
          className="w-full mt-3 pt-3 border-t border-stone-200/70 dark:border-stone-800 flex flex-wrap items-center justify-between gap-2 text-xs"
          style={{ maxWidth: `${width}px` }}
        >
          {/* Pilihan Bayangan & Garis Grid */}
          <div className="flex items-center gap-1.5">
            {character && (
              <button
                type="button"
                onClick={() => setShowTemplate(!showTemplate)}
                className={`px-2 py-0.5 rounded text-[11px] font-medium border transition-colors ${
                  showTemplate
                    ? "bg-red-50 text-red-700 border-red-300 dark:bg-red-950/50 dark:text-red-300 dark:border-red-900"
                    : "bg-white dark:bg-stone-850 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-700"
                }`}
              >
                {showTemplate ? "Bayangan: Nyala" : "Bayangan: Mati"}
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowGrid(!showGrid)}
              className={`px-2 py-0.5 rounded text-[11px] font-medium border transition-colors ${
                showGrid
                  ? "bg-stone-200 text-stone-800 border-stone-300 dark:bg-stone-800 dark:text-stone-200 dark:border-stone-700"
                  : "bg-white dark:bg-stone-850 text-stone-400 border-stone-200 dark:border-stone-700"
              }`}
            >
              {showGrid ? "Grid: Aktif" : "Grid: Polos"}
            </button>
          </div>

          {/* Ketebalan Kuas Kaligrafi */}
          <div className="flex items-center gap-1">
            {[
              { label: "S", size: 4, title: "Kuas Tipis" },
              { label: "M", size: 8, title: "Kuas Sedang" },
              { label: "L", size: 14, title: "Kuas Tebal" },
            ].map((b) => (
              <button
                key={b.size}
                type="button"
                onClick={() => setBrushWidth(b.size)}
                title={b.title}
                className={`w-5 h-5 flex items-center justify-center rounded text-[10px] font-bold border transition-colors ${
                  brushWidth === b.size
                    ? "bg-red-600 text-white border-red-700 shadow-xs"
                    : "bg-white dark:bg-stone-850 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-700"
                }`}
              >
                {b.label}
              </button>
            ))}

            {allowColorChange && (
              <div className="flex items-center gap-1 ml-1 pl-1 border-l border-stone-200 dark:border-stone-700">
                <button
                  type="button"
                  onClick={() => setBrushColor("default")}
                  title="Tinta Hitam Tradisional"
                  className={`w-3.5 h-3.5 rounded-full border ${
                    brushColor === "default"
                      ? "ring-2 ring-red-500 bg-stone-900 dark:bg-stone-100"
                      : "bg-stone-800 dark:bg-stone-200 opacity-60"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setBrushColor("red")}
                  title="Tinta Merah Kaligrafi"
                  className={`w-3.5 h-3.5 rounded-full border ${
                    brushColor === "red"
                      ? "ring-2 ring-red-500 bg-red-600"
                      : "bg-red-600 opacity-60"
                  }`}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tombol Evaluasi Otomatis (Saat berlatih mandiri di detail/koleksi kanji) */}
      {shouldShowEvalButton && character && (
        <div className="w-full mt-4 flex flex-col items-center gap-2.5" style={{ maxWidth: `${width}px` }}>
          <button
            type="button"
            onClick={runEvaluation}
            disabled={strokes.length === 0}
            className="w-full py-2 px-3 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-2 focus-visible:outline-2 focus-visible:outline-red-500"
          >
            <span>🔍</span>
            <span>Periksa Tulisan Otomatis</span>
          </button>

          {/* Panel Hasil Evaluasi Mandiri */}
          {evaluation && (
            <div
              className={`w-full p-3.5 rounded-xl border text-xs space-y-2 animate-fadeIn ${
                evaluation.isCorrect
                  ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200"
                  : "bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold flex items-center gap-1.5">
                  <span>{evaluation.isCorrect ? "✓" : "✗"}</span>
                  <span>{evaluation.isCorrect ? "Penulisan Tepat" : "Belum Tepat"}</span>
                </span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white/70 dark:bg-stone-900/80 shadow-2xs">
                  Skor: {evaluation.score}%
                </span>
              </div>

              <p className="text-[11px] leading-relaxed opacity-90">
                {evaluation.feedback}
              </p>

              <div className="pt-2 border-t border-black/10 dark:border-white/10 grid grid-cols-2 gap-2 text-[10px]">
                <div>
                  <span className="opacity-75">Bentuk: </span>
                  <strong>{evaluation.shapeScore}%</strong>
                </div>
                <div>
                  <span className="opacity-75">Goresan: </span>
                  <strong>
                    {evaluation.userStrokeCount} / {targetStrokes || "?"}{" "}
                    {evaluation.details.strokeMatch ? "(Sesuai)" : "(Beda)"}
                  </strong>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

export default KanjiWritingCanvas;
