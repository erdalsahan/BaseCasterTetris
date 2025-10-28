import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FirstPage from "./components/FirstPage";
import Game from "./components/Game";
import GameOver from "./components/GameOver";
import "./App.css";

export default function App() {
  return (
    <Router>
   

      <div className="w-full h-screen bg-black text-white">
        <Routes>
          {/* 🏁 Açılış sayfası */}
          <Route path="/" element={<FirstPage />} />

          {/* 🎮 Oyun sayfası */}
          <Route path="/game" element={<Game />} />

          {/* 💥 Oyun bitti sayfası */}
          <Route path="/gameover" element={<GameOver />} />
        </Routes>
      </div>
    </Router>
  );
}
