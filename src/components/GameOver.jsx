import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function GameOver() {
  const navigate = useNavigate();
  const location = useLocation();
  const score = location.state?.score ?? 0;

  const handleTryAgain = () => {
    navigate("/game");
  };

  const handleShare = () => {
    const text = `🎮 Tetris Master'da ${score} puan yaptım! 🧱🔥`;
    const shareUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(
      text
    )}`;
    window.open(shareUrl, "_blank");
  };

  const handleMint = () => {
    alert("🪙 Mint işlemi yakında aktif olacak!");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-900 text-white px-6">
      {/* 💥 GAME OVER Başlığı */}
      <div className="relative mb-12">
        <h1 className="relative z-20 text-6xl font-extrabold tracking-widest text-red-500 drop-shadow-[0_0_30px_rgba(255,0,0,0.9)] animate-pulse">
          💥 GAME OVER 💥
        </h1>
        <div className="absolute inset-0 z-0 blur-3xl bg-gradient-to-r from-red-600 via-pink-500 to-yellow-400 opacity-50 animate-ping"></div>
      </div>

      {/* ✨ Neon Skor Kutusu */}
      <div className="relative w-full max-w-[320px] p-[2px] mb-10 rounded-3xl bg-gradient-to-r from-fuchsia-500 via-yellow-400 to-cyan-400 shadow-[0_0_30px_rgba(255,255,255,0.3)] animate-pulse">
        <div className="bg-black/70 rounded-3xl py-6 px-6 text-center backdrop-blur-xl">
          <p className="text-xl font-semibold bg-clip-text bg-gradient-to-r from-fuchsia-300 via-yellow-300 to-cyan-300 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] mb-2">
            ✨ Final Skorun ✨
          </p>
          <p className="text-6xl font-extrabold text-yellow-300 drop-shadow-[0_0_25px_rgba(255,255,0,0.9)] animate-bounce">
            {score}
          </p>
        </div>
      </div>

      {/* 🚀 Butonlar */}
      <div className="flex flex-col gap-5 w-full max-w-[300px]">
        <button
          onClick={handleTryAgain}
          className="w-full py-4 rounded-full text-lg font-semibold text-white bg-gradient-to-r from-pink-500 to-purple-600 shadow-[0_0_25px_rgba(236,72,153,0.9)] hover:shadow-[0_0_40px_rgba(236,72,153,1)] hover:scale-105 active:scale-95 transition-all duration-300"
        >
          🔁 Try Again
        </button>

        <button
          onClick={handleShare}
          className="w-full py-4 rounded-full text-lg font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 shadow-[0_0_25px_rgba(59,130,246,0.8)] hover:shadow-[0_0_40px_rgba(59,130,246,1)] hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
        >
          📤 Share Score
        </button>

        <button
          onClick={handleMint}
          className="w-full py-4 rounded-full text-lg font-semibold bg-gradient-to-r from-amber-400 to-yellow-500 shadow-[0_0_25px_rgba(255,215,0,0.8)] hover:shadow-[0_0_40px_rgba(255,220,0,1)] hover:scale-105 transition-all duration-300"
        >
          🪙 Mint Score
        </button>
      </div>
    </div>
  );
}
