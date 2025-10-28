import React, { useEffect, useState, useCallback } from "react";
import { randomShape } from "../logic/shape";
import { useNavigate } from "react-router-dom";
import GameStats from "./GameStats";

const ROWS = 20;
const COLS = 10;
const CELL_SIZE = 24;

export default function Game() {
  const [board, setBoard] = useState([]);
  const [frozen, setFrozen] = useState([]);     // sabit taşlar
  const [current, setCurrent] = useState(null); // aktif parça
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [clearedRows, setClearedRows] = useState(0);
const [level, setLevel] = useState(1);


  const navigate = useNavigate();

  // 🧱 Boş grid
  const emptyGrid = () => Array.from({ length: ROWS }, () => Array(COLS).fill(null));

  // 🧩 Çakışma kontrolü
  const collides = (shape, posX, posY, grid) => {
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (!shape[r][c]) continue;
        const y = posY + r;
        const x = posX + c;
        if (x < 0 || x >= COLS || y >= ROWS) return true;
        if (y >= 0 && grid[y]?.[x]) return true;
      }
    }
    return false;
  };

  // 🧹 Satır temizleme
const clearFullRows = (grid) => {
  const kept = grid.filter((row) => row.some((cell) => !cell));
  const cleared = ROWS - kept.length;
  if (cleared > 0) setClearedRows(cleared);
  const heads = Array.from({ length: cleared }, () => Array(COLS).fill(null));
  return [...heads, ...kept];
};
const handleLevelChange = (newLevel) => {
  setLevel(newLevel);
};



  // 🧱 Yeni parça oluştur
  const spawn = useCallback(() => {
    const p = randomShape();
    const x = Math.floor(COLS / 2) - Math.ceil(p.shape[0].length / 2);
    const y = -1;
    const next = { shape: p.shape, color: p.color, x, y };

    // Tahta tıkalıysa -> Game Over
    if (collides(next.shape, next.x, next.y + 1, frozen)) {
      setGameOver(true);
      navigate("/gameover", { state: { score } });
      return;
    }

    setCurrent(next);
  }, [frozen, navigate, score]);

  // ⬇️ Aşağı düşürme
  const stepDown = useCallback(() => {
    if (gameOver || !current) return;
    const newY = current.y + 1;

    if (!collides(current.shape, current.x, newY, frozen)) {
      setCurrent((p) => ({ ...p, y: newY }));
      return;
    }

    // Sabitle
    const grid = frozen.map((r) => [...r]);
    current.shape.forEach((row, r) =>
      row.forEach((val, c) => {
        if (val) {
          const y = current.y + r;
          const x = current.x + c;
          if (y >= 0 && y < ROWS && x >= 0 && x < COLS) grid[y][x] = { color: current.color };
          else if (y < 0) setGameOver(true);
        }
      })
    );

    setFrozen(clearFullRows(grid));
    setCurrent(null);
    setTimeout(() => spawn(), 0);
  }, [current, frozen, spawn, gameOver]);

  // 🔄 Döndürme
  const handleRotate = () => {
    if (!current) return;
    const rot = current.shape[0].map((_, i) => current.shape.map((r) => r[i])).reverse();
    const kicks = [
      { x: 0, y: 0 },
      { x: -1, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: -1 },
      { x: -2, y: 0 },
      { x: 2, y: 0 },
    ];
    for (let k of kicks) {
      const newX = current.x + k.x;
      const newY = current.y + k.y;
      if (!collides(rot, newX, newY, frozen)) {
        setCurrent((p) => ({ ...p, shape: rot, x: newX, y: newY }));
        return;
      }
    }
  };

  // ⬅️➡️ Hareket
  const handleMove = (dir) => {
    if (!current) return;
    const newX = current.x + dir;
    if (!collides(current.shape, newX, current.y, frozen))
      setCurrent((p) => ({ ...p, x: newX }));
  };

  // ⬇️ Hızlı düşürme
  const handleDrop = () => {
    if (!current) return;
    let dropY = current.y;
    while (!collides(current.shape, current.x, dropY + 1, frozen)) dropY++;
    const landed = { ...current, y: dropY };

    const grid = frozen.map((r) => [...r]);
    landed.shape.forEach((row, r) =>
      row.forEach((val, c) => {
        if (val) {
          const y = landed.y + r;
          const x = landed.x + c;
          if (y >= 0 && y < ROWS && x >= 0 && x < COLS) grid[y][x] = { color: landed.color };
        }
      })
    );

    setFrozen(clearFullRows(grid));
    setCurrent(null);
    setTimeout(() => spawn(), 0);
  };

  // 🎮 Klavye kontrolleri
  useEffect(() => {
    const onKey = (e) => {
      if (gameOver || !current) return;
      if (e.key === "ArrowLeft") handleMove(-1);
      if (e.key === "ArrowRight") handleMove(1);
      if (e.key === "ArrowUp") handleRotate();
      if (e.key === " ") handleDrop();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current, frozen, gameOver]);

  // ⏱️ Oto düşürme
  useEffect(() => {
  if (gameOver) return;
  const speed = Math.max(700 - (level - 1) * 70, 150); // her seviye daha hızlı
  const id = setInterval(stepDown, speed);
  return () => clearInterval(id);
}, [stepDown, gameOver, level]);


  // 🧩 Tahta çizimi
  useEffect(() => {
    const grid = emptyGrid();
    frozen.forEach((row, r) =>
      row.forEach((cell, c) => {
        if (cell) grid[r][c] = { color: cell.color };
      })
    );
    if (current) {
      const { shape, x, y, color } = current;
      shape.forEach((row, r) =>
        row.forEach((val, c) => {
          if (val) {
            const yy = y + r, xx = x + c;
            if (yy >= 0 && yy < ROWS && xx >= 0 && xx < COLS) grid[yy][xx] = { color };
          }
        })
      );
    }
    setBoard(grid);
  }, [frozen, current]);

  // 🏁 Başlangıç
  useEffect(() => {
    setFrozen(emptyGrid());
  }, []);
  useEffect(() => {
    if (frozen.length) spawn();
  }, [frozen, spawn]);

  // 🎨 UI
return (
  <div className="min-h-screen bg-gradient-to-b from-gray-950 to-black text-white flex flex-col items-center py-6">
    {/* === Başlık === */}
    <h1 className="text-4xl font-extrabold mb-6 text-cyan-400 drop-shadow-[0_0_12px_#22d3ee] flex items-center gap-2">
      🎮 <span>Tetris Master</span>
    </h1>

    {/* === Tahta === */}
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${COLS}, ${CELL_SIZE}px)`,
        gridTemplateRows: `repeat(${ROWS}, ${CELL_SIZE}px)`,
        gap: "2px",
        background: "#1f2937",
        padding: "8px",
        borderRadius: "12px",
        boxShadow: "0 0 25px rgba(255,255,255,0.15)",
      }}
    >
      {board.map((row, y) =>
        row.map((cell, x) => (
          <div
            key={`${y}-${x}`}
            style={{
              width: CELL_SIZE,
              height: CELL_SIZE,
              backgroundColor: cell ? cell.color : "#111827",
              borderRadius: 3,
            }}
          />
        ))
      )}
    </div>

    {/* === Skor Paneli (tahtanın hemen altı) === */}
    <GameStats clearedRows={clearedRows} onLevelChange={handleLevelChange} variant="panel" />

    {/* === Butonlar === */}
    {!gameOver && (
      <div className="mt-6 flex gap-3">
        <button
          onClick={() => handleMove(-1)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-3 rounded-xl shadow-lg active:scale-95 transition-all"
        >
          ⬅️
        </button>
        <button
          onClick={handleRotate}
          className="bg-purple-500 hover:bg-purple-600 text-white px-5 py-3 rounded-xl shadow-lg active:scale-95 transition-all"
        >
          🔄
        </button>
        <button
          onClick={() => handleMove(1)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-3 rounded-xl shadow-lg active:scale-95 transition-all"
        >
          ➡️
        </button>
        <button
          onClick={handleDrop}
          className="bg-green-500 hover:bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg active:scale-95 transition-all"
        >
          ⬇️
        </button>
      </div>
    )}
  </div>
);








}
