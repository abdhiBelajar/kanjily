/**
 * Mesin Evaluasi Otomatis Tulisan Tangan Kanji (Kanji Handwriting Evaluator)
 * 
 * Menggunakan pendekatan Multi-Criteria Verification:
 * 1. Pengecekan Akurasi Jumlah Goresan (Stroke Count Check)
 * 2. Pencocokan Morfologi Bentuk Visual (Silhouette Dilation & Overlap Matrix)
 * 3. Analisis Presisi (Penalti Coretan di Luar Batas) & Kelengkapan (Recall)
 * 4. Analisis Titik Pusat (Centroid & Bounding Proportion)
 */

export interface KanjiEvaluationResult {
  isCorrect: boolean;
  score: number; // 0 - 100
  shapeScore: number; // 0 - 100
  strokeScore: number; // 0 - 100
  userStrokeCount: number;
  targetStrokeCount?: number;
  feedback: string;
  details: {
    strokeMatch: boolean;
    shapeMatch: boolean;
    accuracy: number; // Presisi goresan (0 - 100)
    completeness: number; // Kelengkapan bentuk (0 - 100)
    centroidDistance: number; // Jarak deviasi pusat gravitasi
  };
}

export interface EvaluateOptions {
  userCanvas: HTMLCanvasElement;
  targetCharacter: string;
  targetStrokes?: number;
  userStrokeCount: number;
  toleranceRadius?: number; // Radius toleransi piksel (default 2 pada grid 64x64)
}

const GRID_SIZE = 64;

/**
 * Membuat binary occupancy grid 64x64 dari canvas
 */
function createGridFromCanvas(
  canvas: HTMLCanvasElement,
  width: number,
  height: number
): boolean[][] {
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  const grid: boolean[][] = Array.from({ length: GRID_SIZE }, () =>
    new Array(GRID_SIZE).fill(false)
  );

  if (!ctx) return grid;

  try {
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;

    const cellW = width / GRID_SIZE;
    const cellH = height / GRID_SIZE;

    // Periksa setiap sel pada grid
    for (let gy = 0; gy < GRID_SIZE; gy++) {
      const startY = Math.floor(gy * cellH);
      const endY = Math.min(height, Math.floor((gy + 1) * cellH));

      for (let gx = 0; gx < GRID_SIZE; gx++) {
        const startX = Math.floor(gx * cellW);
        const endX = Math.min(width, Math.floor((gx + 1) * cellW));

        let hasPixel = false;
        // Sample piksel di dalam sel
        for (let py = startY; py < endY && !hasPixel; py += 2) {
          for (let px = startX; px < endX; px += 2) {
            const index = (py * width + px) * 4;
            const alpha = data[index + 3];
            if (alpha > 40) {
              hasPixel = true;
              break;
            }
          }
        }
        grid[gy][gx] = hasPixel;
      }
    }
  } catch (err) {
    console.error("Gagal membaca piksel kanvas:", err);
  }

  return grid;
}

/**
 * Menghasilkan target silhouette kanji pada canvas virtual
 */
function createTargetGrid(
  character: string,
  width: number,
  height: number
): boolean[][] {
  if (typeof document === "undefined") {
    return Array.from({ length: GRID_SIZE }, () => new Array(GRID_SIZE).fill(false));
  }

  const offscreen = document.createElement("canvas");
  offscreen.width = width;
  offscreen.height = height;
  const ctx = offscreen.getContext("2d");

  if (!ctx) {
    return Array.from({ length: GRID_SIZE }, () => new Array(GRID_SIZE).fill(false));
  }

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#000000";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Ukuran font proporsional ~70% dari tinggi kanvas
  const fontSize = Math.round(Math.min(width, height) * 0.72);
  ctx.font = `bold ${fontSize}px "Noto Serif JP", "Source Han Serif", "Yu Mincho", "Hiragino Mincho ProN", serif`;
  ctx.fillText(character, width / 2, height / 2);

  return createGridFromCanvas(offscreen, width, height);
}

/**
 * Melakukan dilatasi morfologis (morfologi citra) untuk memberikan toleransi kelengkungan tangan manusia
 */
function dilateGrid(grid: boolean[][], radius: number): boolean[][] {
  const dilated: boolean[][] = Array.from({ length: GRID_SIZE }, () =>
    new Array(GRID_SIZE).fill(false)
  );

  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      if (!grid[y][x]) continue;

      for (let dy = -radius; dy <= radius; dy++) {
        const ny = y + dy;
        if (ny < 0 || ny >= GRID_SIZE) continue;

        for (let dx = -radius; dx <= radius; dx++) {
          const nx = x + dx;
          if (nx < 0 || nx >= GRID_SIZE) continue;

          // Euclidean mask sederhana
          if (dx * dx + dy * dy <= radius * radius + 0.5) {
            dilated[ny][nx] = true;
          }
        }
      }
    }
  }

  return dilated;
}

/**
 * Menghitung titik centroid (pusat massa) grid
 */
function calculateCentroid(grid: boolean[][]): { cx: number; cy: number; count: number } {
  let totalX = 0;
  let totalY = 0;
  let count = 0;

  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      if (grid[y][x]) {
        totalX += x;
        totalY += y;
        count++;
      }
    }
  }

  if (count === 0) return { cx: GRID_SIZE / 2, cy: GRID_SIZE / 2, count: 0 };
  return { cx: totalX / count, cy: totalY / count, count };
}

/**
 * Fungsi utama untuk mengevaluasi tulisan kanji pengguna
 */
export function evaluateKanjiWriting({
  userCanvas,
  targetCharacter,
  targetStrokes,
  userStrokeCount,
  toleranceRadius = 3,
}: EvaluateOptions): KanjiEvaluationResult {
  const width = userCanvas.width || 260;
  const height = userCanvas.height || 260;

  // 1. Ekstraksi grid dari tulisan pengguna & target kanji
  const userGrid = createGridFromCanvas(userCanvas, width, height);
  const targetGrid = createTargetGrid(targetCharacter, width, height);

  const userStats = calculateCentroid(userGrid);
  const targetStats = calculateCentroid(targetGrid);

  // Jika kanvas pengguna kosong
  if (userStats.count === 0 || userStrokeCount === 0) {
    return {
      isCorrect: false,
      score: 0,
      shapeScore: 0,
      strokeScore: 0,
      userStrokeCount,
      targetStrokeCount: targetStrokes,
      feedback: "Kanvas masih kosong. Tuliskan karakter kanji sebelum melakukan evaluasi.",
      details: {
        strokeMatch: false,
        shapeMatch: false,
        accuracy: 0,
        completeness: 0,
        centroidDistance: 100,
      },
    };
  }

  // 2. Dilatasi target grid untuk menciptakan zona toleransi ketebalan/kemiringan goresan
  const targetZone = dilateGrid(targetGrid, toleranceRadius);
  const userZone = dilateGrid(userGrid, toleranceRadius);

  // 3. Hitung Presisi (Akurasi: berapa persen goresan user yang berada dalam zona target)
  let userInTargetZone = 0;
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      if (userGrid[y][x] && targetZone[y][x]) {
        userInTargetZone++;
      }
    }
  }
  const accuracy = Math.min(1, userInTargetZone / Math.max(1, userStats.count));

  // 4. Hitung Kelengkapan (Recall: berapa persen target kanji yang tercakup oleh goresan user)
  let targetCoveredByUser = 0;
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      if (targetGrid[y][x] && userZone[y][x]) {
        targetCoveredByUser++;
      }
    }
  }
  const completeness = Math.min(1, targetCoveredByUser / Math.max(1, targetStats.count));

  // 5. Hitung Harmonic Mean F1 untuk bentuk visual
  const shapeF1 =
    accuracy + completeness > 0
      ? (2 * accuracy * completeness) / (accuracy + completeness)
      : 0;

  // 6. Hitung deviasi jarak centroid (agar tidak menggambar di pojok kanvas)
  const dx = (userStats.cx - targetStats.cx) / GRID_SIZE;
  const dy = (userStats.cy - targetStats.cy) / GRID_SIZE;
  const centroidDist = Math.sqrt(dx * dx + dy * dy);
  const centerPenalty = Math.max(0, 1 - centroidDist * 2);

  const finalShapeScore = Math.round(shapeF1 * centerPenalty * 100);

  // 7. Evaluasi Kesesuaian Goresan (Stroke Count Score)
  let strokeScore = 100;
  let strokeDiff = 0;
  let strokeMatch = true;

  if (targetStrokes && targetStrokes > 0) {
    strokeDiff = Math.abs(userStrokeCount - targetStrokes);
    if (strokeDiff === 0) {
      strokeScore = 100;
      strokeMatch = true;
    } else if (strokeDiff === 1) {
      // Masih diberikan toleransi sedikit untuk goresan sambung alami
      strokeScore = 70;
      strokeMatch = true;
    } else if (strokeDiff === 2) {
      strokeScore = 30;
      strokeMatch = false;
    } else {
      strokeScore = 0;
      strokeMatch = false;
    }
  }

  // 8. Pembobotan Skor Akhir (70% Kemiripan Bentuk, 30% Kesesuaian Goresan)
  const compositeScore = Math.round(0.7 * finalShapeScore + 0.3 * strokeScore);

  // 9. Kriteria Kelulusan (Decision Rules)
  // Syarat Lulus:
  // - Composite score >= 55%
  // - Accuracy >= 42% (tidak banyak coretan liar di luar bentuk)
  // - Completeness >= 45% (tidak hanya menggambar 1 garis pada kanji rumit)
  // - Selisih goresan maksimal 1 jika target diketahui
  const shapeMatch = finalShapeScore >= 50 && accuracy >= 0.42 && completeness >= 0.45;
  const isCorrect =
    compositeScore >= 55 &&
    shapeMatch &&
    (targetStrokes ? strokeDiff <= 1 : true);

  // 10. Perumusan Umpan Balik Diagnostik
  let feedback = "";
  if (isCorrect) {
    if (compositeScore >= 82) {
      feedback = "Luar biasa! Bentuk, proporsi, dan jumlah goresan sangat presisi.";
    } else if (compositeScore >= 70) {
      feedback = "Sangat bagus! Bentuk kanji sesuai dengan kaidah penulisan.";
    } else {
      feedback = "Bagus! Kanji berhasil dikenali dengan benar.";
    }
  } else {
    if (targetStrokes && strokeDiff >= 2) {
      feedback = `Jumlah goresan tidak sesuai (ditulis: ${userStrokeCount}, target: ${targetStrokes} goresan).`;
    } else if (completeness < 0.45) {
      feedback = "Goresan kanji belum lengkap. Masih ada bagian karakter yang terlewat.";
    } else if (accuracy < 0.42) {
      feedback = "Bentuk berbeda dari target kanji. Goresan berada di luar posisi kanji yang seharusnya.";
    } else if (finalShapeScore < 50) {
      feedback = "Bentuk kanji belum tepat. Perhatikan proporsi garis horizontal, vertikal, dan sudutnya.";
    } else {
      feedback = "Penulisan belum memenuhi standar ketepatan. Coba perhatikan kembali urutan dan bentuk kanji.";
    }
  }

  return {
    isCorrect,
    score: compositeScore,
    shapeScore: finalShapeScore,
    strokeScore,
    userStrokeCount,
    targetStrokeCount: targetStrokes,
    feedback,
    details: {
      strokeMatch,
      shapeMatch,
      accuracy: Math.round(accuracy * 100),
      completeness: Math.round(completeness * 100),
      centroidDistance: Math.round(centroidDist * 100),
    },
  };
}
