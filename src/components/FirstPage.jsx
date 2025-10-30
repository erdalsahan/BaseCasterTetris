import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { base } from "viem/chains";
import { useAccount, useConnect, useWriteContract } from "wagmi";
import { injected } from "wagmi/connectors";
import { sdk } from "@farcaster/miniapp-sdk"; // Farcaster Mini App SDK

export default function FirstPage() {
  const navigate = useNavigate();
  
   const { address, isConnected } = useAccount();
    const { connect } = useConnect({ connector: injected() });
    const { writeContractAsync } = useWriteContract();

  const [minting, setMinting] = useState(false);
  const [error, setError] = useState("");
  const [txHash, setTxHash] = useState("");

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

  const score = 100; // test değeri, gerçek skor değerini game sayfasından alabilirsin

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
        value: BigInt(10000000000000), // 0.00001 ETH
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

  const handleClick = () => {
    navigate("/game");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
      <img
        src="/First.png"
        alt="Tetris Master"
        className="w-full h-full object-contain cursor-pointer"
        onClick={handleClick}
      />

      {/* 🪙 Mint butonu */}
      <button
        onClick={handleMint}
        disabled={minting}
        className={`absolute bottom-10 px-6 py-3 text-lg font-bold rounded-xl transition-all ${
          minting ? "bg-gray-500" : "bg-purple-600 hover:bg-purple-700"
        }`}
      >
        {minting ? "Mintleniyor..." : "Mint Et 🎮"}
      </button>

      {/* 🧾 Hata veya işlem sonucu */}
      {error && <p className="text-red-400 mt-2">{error}</p>}
      {txHash && (
        <p className="text-green-400 mt-2">
          ✅ İşlem gönderildi: {txHash.slice(0, 8)}...
        </p>
      )}
    </div>
  );
}
