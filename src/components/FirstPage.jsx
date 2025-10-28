import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function FirstPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // ⏳ 3 saniye sonra otomatik yönlendirme
    const timer = setTimeout(() => {
      navigate("/game");
    }, 3000);

    // 🧹 temizlik (sayfa kapanınca timer iptal)
    return () => clearTimeout(timer);
  }, [navigate]);

  // 🖱️ Tıklayınca hemen yönlendirme
  const handleClick = () => {
    navigate("/game");
  };

  return (
    <div
      className="flex items-center justify-center h-screen bg-black"
      onClick={handleClick}
    >
      <img
        src="/First.png"
        alt="Tetris Master"
        className="w-full h-full object-contain cursor-pointer"
      />
      
    </div>
  );
}
