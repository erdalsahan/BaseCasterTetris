import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FirstPage from "./components/FirstPage";
import Game from "./components/Game";
import GameOver from "./components/GameOver";
import "./App.css";

import { sdk } from "@farcaster/miniapp-sdk";

// 🧩 wagmi importları
import { WagmiProvider, createConfig, http } from "wagmi";
import { base } from "wagmi/chains";
import { injected } from "wagmi/connectors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

// ⚙️ wagmi config
const config = createConfig({
  chains: [base],
  connectors: [injected()],
  transports: {
    [base.id]: http("https://mainnet.base.org"),
  },
});

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
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config}>
        <Router>
          <div className="w-full h-screen bg-black text-white">
            <Routes>
              <Route path="/" element={<FirstPage />} />
              <Route path="/game" element={<Game />} />
              <Route path="/gameover" element={<GameOver />} />
            </Routes>
          </div>
        </Router>
      </WagmiProvider>
    </QueryClientProvider>
  );
}
