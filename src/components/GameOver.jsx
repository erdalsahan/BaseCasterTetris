import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { base } from "viem/chains";
import { useAccount, useConnect, useWriteContract } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { MiniAppSDK } from "@farcaster/miniapp-sdk";

const CONTRACT_ADDRESS = "0x68CB691bA8A2fcebAa88E5Be4Cd231c05CF7ACb2";
const ABI = [
  {
    inputs: [{ internalType: "uint256", name: "_score", type: "uint256" }],
    name: "mint",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
];

export default function GameOver() {
  const navigate = useNavigate();
  const location = useLocation();
  const score = location.state?.score ?? 0;

  const { address, isConnected } = useAccount();
  const { connect } = useConnect({ connector: new InjectedConnector() });
  const { writeContractAsync } = useWriteContract();

  const [sdk, setSdk] = useState(null);
  const [minting, setMinting] = useState(false);
  const [txHash, setTxHash] = useState(null);
  const [error, setError] = useState("");

  // 🧠 SDK ready kontrolü
  useEffect(() => {
    const init = async () => {
      try {
        const s = new MiniAppSDK();
        await s.ready();
        setSdk(s);
        console.log("✅ Farcaster MiniApp SDK ready");
      } catch {
        console.log("⚠️ Farcaster SDK yüklenmedi, MetaMask fallback devrede");
      }
    };
    init();
  }, []);

  const handleTryAgain = () => navigate("/game");

  const handleShare = () => {
    const text = `🎮 Tetris Master'da ${score} puan yaptım! 🧱🔥`;
    const shareUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(text)}`;
    window.open(shareUrl, "_blank");
  };

  const handleMint = async () => {
    try {
      setError("");
      setMinting(true);

      // 🪙 1️⃣ Eğer Farcaster Wallet varsa, otomatik bağlan
      if (sdk && sdk.wallet?.address) {
        console.log("🔗 Farcaster Wallet:", sdk.wallet.address);
      } else if (!isConnected) {
        // 🪙 2️⃣ Farcaster yoksa MetaMask ile bağlan
        await connect();
      }

      // 🧾 Mint işlemi
      const tx = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: ABI,
        functionName: "mint",
        args: [score],
        value: BigInt(10000000000000), // 0.00001 ETH = 10^13 wei
        chainId: base.id,
      });

      console.log("✅ Mint gönderildi:", tx);
      setTxHash(tx);
    } catch (err) {
      console.error("Mint hatası:", err);
      setError("Mint işlemi başarısız oldu 😅");
    } finally {
      setMinting(false);
    }
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
          className="w-full py-4 rounded-full text-lg font-semibold text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:scale-105 transition-all"
        >
          🔁 Try Again
        </button>

        <button
          onClick={handleShare}
          className="w-full py-4 rounded-full text-lg font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 hover:scale-105 transition-all"
        >
          📤 Share Score
        </button>

        <button
          onClick={handleMint}
          disabled={minting}
          className={`w-full py-4 rounded-full text-lg font-semibold bg-gradient-to-r from-amber-400 to-yellow-500 hover:scale-105 transition-all ${
            minting ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {minting ? "⏳ Mintleniyor..." : "🪙 Mint Score"}
        </button>

        {txHash && (
          <p className="text-green-400 text-center text-sm mt-3">
            ✅ Mint başarılı! <br />
            <a
              href={`https://basescan.org/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-cyan-300"
            >
              İşlemi Görüntüle
            </a>
          </p>
        )}
        {error && <p className="text-red-400 text-center text-sm mt-3">{error}</p>}
      </div>
    </div>
  );
}
