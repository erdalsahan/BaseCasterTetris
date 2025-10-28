import React, { useState, useEffect } from "react";

export default function GameStats({ clearedRows, onLevelChange, variant = "panel" }) {
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lines, setLines] = useState(0);

  // 🔥 Animasyon state'leri
  const [scoreFlash, setScoreFlash] = useState(null);
  const [levelFlash, setLevelFlash] = useState(false);

  // 🧱 Satır temizlenince skor ve line artışı
  useEffect(() => {
    if (clearedRows > 0) {
      const gained = clearedRows * 100 * level;
      setLines((p) => p + clearedRows);
      setScore((p) => p + gained);

      // Skor artışı efekti
      setScoreFlash(`+${gained}`);
      setTimeout(() => setScoreFlash(null), 1000);
    }
  }, [clearedRows, level]);

  // 🔼 Seviye hesaplama (her 10 satırda bir artar)
  useEffect(() => {
    const nextLevel = Math.floor(lines / 10) + 1;
    if (nextLevel !== level) {
      setLevel(nextLevel);
      onLevelChange?.(nextLevel);

      // Level up efekti
      setLevelFlash(true);
      setTimeout(() => setLevelFlash(false), 1200);
    }
  }, [lines, level, onLevelChange]);

  // 🔹 Overlay görünüm
  if (variant === "overlay") {
    return (
      <div className="text-xs font-semibold text-cyan-200 space-y-1 leading-tight relative">
        <div className="flex items-center gap-1">
          🏆 <span className="text-yellow-300">Score:</span> {score}
        </div>
        <div className="flex items-center gap-1">
          🔥 <span className="text-pink-400">Level:</span> {level}
        </div>
        <div className="flex items-center gap-1">
          🧱 <span className="text-orange-400">Lines:</span> {lines}
        </div>

        {/* Efektler */}
        {scoreFlash && (
          <div className="absolute right-[-30px] top-0 text-green-400 text-sm font-bold animate-float-up">
            {scoreFlash}
          </div>
        )}
        {levelFlash && (
          <div className="absolute left-1/2 -translate-x-1/2 -top-6 text-pink-500 text-xs font-bold animate-pop">
            🔥 LEVEL UP!
          </div>
        )}
      </div>
    );
  }

  // 🔸 Geniş panel görünümü
  return (
    <div className="relative flex items-center justify-center gap-8 text-base font-semibold text-cyan-200 mt-5">
      <div className="flex items-center gap-2">
        🏆 <span className="text-yellow-300">Score:</span> {score}
      </div>
      <div className="flex items-center gap-2">
        🔥 <span className="text-pink-400">Level:</span> {level}
      </div>
      <div className="flex items-center gap-2">
        🧱 <span className="text-orange-400">Lines:</span> {lines}
      </div>

      {/* Efektler */}
      {scoreFlash && (
        <div className="absolute right-[-20px] text-green-400 text-lg font-bold animate-float-up">
          {scoreFlash}
        </div>
      )}
      {levelFlash && (
        <div className="absolute left-1/2 -translate-x-1/2 -top-10 text-pink-500 text-sm font-bold animate-pop">
          🔥 LEVEL UP!
        </div>
      )}
    </div>
  );
}
