import React, {useEffect} from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FirstPage from "./components/FirstPage";
import Game from "./components/Game";
import GameOver from "./components/GameOver";
import "./App.css";
import { sdk } from "@farcaster/miniapp-sdk";
export default function App() {
  const [ready, setReady] = useState(false);
    useEffect(() => {
    const init = async () => {
      try {
        await sdk.actions.ready();
        console.log("✅ Farcaster MiniApp SDK hazır!");
        setReady(true);
      } catch (err) {
        console.warn("⚠️ SDK yüklenemedi:", err);
        setReady(true);
      }
    };
    init();
  }, []);
   if (!ready) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white text-xl">
        Yükleniyor...
      </div>
    );
  }
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
