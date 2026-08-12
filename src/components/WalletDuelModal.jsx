import React, { useState, useRef, useEffect } from 'react';
import { toPng, toBlob } from 'html-to-image';
import { X, Swords, Trophy, Skull, Share2, Loader2, Sparkles, Crown, Download, Copy, Check, Shuffle } from 'lucide-react';
import { compareWalletsForDuel } from '../../server/services/duelEngine';
import { getWalletRawData } from '../../server/services/tonProvider';
import { analyzeWallet } from '../../server/services/walletAnalyzer';
import { calculatePersonalityAndScores } from '../../server/services/personalityEngine';

const PEDRO_KEYS = ['rockstar', 'rekt', 'copium', 'wizard', 'clown', 'diamond', 'rocket'];

const PEDRO_CHARACTER_ARTS = {
  rekt: '/assets/pedro/nobg/pedro_rekt.png',
  copium: '/assets/pedro/nobg/pedro_copium.png',
  wizard: '/assets/pedro/nobg/pedro_wizard.png',
  clown: '/assets/pedro/nobg/pedro_clown.png',
  diamond: '/assets/pedro/nobg/pedro_diamond.png',
  rockstar: '/assets/pedro/nobg/pedro_rockstar.png',
  rocket: '/assets/pedro/nobg/pedro_rocket.png'
};

export default function WalletDuelModal({ initialWalletA = '', onClose }) {
  // Empty default inputs - no hardcoded demo accounts
  const [addressA, setAddressA] = useState(initialWalletA || '');
  const [addressB, setAddressB] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingImg, setIsGeneratingImg] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [duelResult, setDuelResult] = useState(null);
  const [error, setError] = useState(null);

  const [pedroKeyIndex, setPedroKeyIndex] = useState(0);
  const [isShuffling, setIsShuffling] = useState(false);

  const duelCardRef = useRef(null);

  const handleRandomizePedro = () => {
    setIsShuffling(true);
    const randomIndex = Math.floor(Math.random() * PEDRO_KEYS.length);
    setPedroKeyIndex(randomIndex);
    setTimeout(() => setIsShuffling(false), 400);
  };

  const currentPedroKey = PEDRO_KEYS[pedroKeyIndex] || 'rockstar';
  const currentPedroImg = PEDRO_CHARACTER_ARTS[currentPedroKey] || PEDRO_CHARACTER_ARTS.rockstar;

  const fetchWalletRoastData = async (addr) => {
    try {
      const res = await fetch(`/api/roast/${encodeURIComponent(addr.trim())}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      // Fallback to client-side pipeline
    }

    // Client-side fallback pipeline
    const rawData = await getWalletRawData(addr.trim());
    const analysis = analyzeWallet(rawData);
    const scoreData = calculatePersonalityAndScores(analysis);
    return {
      walletAddress: addr.trim(),
      totalCurrentValueUsd: analysis.totalCurrentValueUsd,
      estimatedPnlUsd: analysis.estimatedPnlUsd,
      estimatedPnlPercent: analysis.estimatedPnlPercent,
      downBadScore: scoreData.downBadScore,
      isProfitable: scoreData.isProfitable,
      personality: scoreData.personality
    };
  };

  const handleRunDuel = async () => {
    if (!addressA.trim() || !addressB.trim()) {
      setError("Please enter two valid TON wallet addresses to duel!");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      handleRandomizePedro();

      const [dataA, dataB] = await Promise.all([
        fetchWalletRoastData(addressA.trim()),
        fetchWalletRoastData(addressB.trim())
      ]);

      const comparison = compareWalletsForDuel(dataA, dataB);
      setDuelResult(comparison);
    } catch (err) {
      console.error("Duel error:", err);
      setError("Failed to fetch wallet comparison. Make sure both addresses are valid.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadDuelImg = async () => {
    if (!duelCardRef.current || isGeneratingImg) return;

    try {
      setIsGeneratingImg(true);
      const dataUrl = await toPng(duelCardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#090a0f'
      });

      const link = document.createElement('a');
      link.download = `wallet-duel-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to export duel image:', err);
    } finally {
      setIsGeneratingImg(false);
    }
  };

  const handleCopyDuelImg = async () => {
    if (!duelCardRef.current || isGeneratingImg) return;

    try {
      setIsGeneratingImg(true);
      const blob = await toBlob(duelCardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#090a0f'
      });

      if (blob && navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 3000);
      } else {
        handleDownloadDuelImg();
      }
    } catch (err) {
      console.error('Failed to copy duel image:', err);
      handleDownloadDuelImg();
    } finally {
      setIsGeneratingImg(false);
    }
  };

  const handleShareDuelOnX = () => {
    if (!duelResult) return;
    const tweetText = encodeURIComponent(duelResult.tweetText);
    const intentUrl = `https://x.com/intent/tweet?text=${tweetText}`;
    window.open(intentUrl, '_blank', 'noopener,noreferrer');
  };

  const formatUsd = (num) => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(num || 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg overflow-y-auto">
      
      <div className="max-w-3xl w-full bg-slate-950/95 border border-purple-500/30 rounded-3xl p-5 sm:p-7 space-y-6 relative shadow-2xl my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-600 via-purple-600 to-cyan-500 p-0.5 shadow-lg shadow-purple-500/30">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Swords className="w-5 h-5 text-pink-400 animate-pulse" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                WALLET DUEL BATTLE ⚔️
              </h3>
              <p className="text-xs font-bold text-slate-400">
                Compare 2 TON wallets side-by-side to crown the DOWN BAD CHAMPION 👑💀!
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* INPUT FORM FOR WALLET A & B */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
          
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-wider text-pink-400 flex items-center gap-1">
              <span>PLAYER 1 (WALLET A):</span>
            </label>
            <input 
              type="text" 
              value={addressA} 
              onChange={(e) => setAddressA(e.target.value)} 
              placeholder="Paste TON wallet A or DNS..." 
              className="w-full bg-slate-950 border border-slate-800 focus:border-pink-500 text-white rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1">
              <span>PLAYER 2 (WALLET B):</span>
            </label>
            <input 
              type="text" 
              value={addressB} 
              onChange={(e) => setAddressB(e.target.value)} 
              placeholder="Paste TON wallet B or DNS..." 
              className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 text-white rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold focus:outline-none"
            />
          </div>

        </div>

        {error && (
          <div className="p-3 bg-red-950/60 border border-red-500/40 rounded-xl text-xs font-bold text-red-300">
            {error}
          </div>
        )}

        {/* BATTLE BUTTON */}
        <button
          onClick={handleRunDuel}
          disabled={isLoading}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-500 hover:from-pink-500 hover:to-cyan-400 text-white font-black text-sm tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-purple-600/30 transition-all cursor-pointer disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>SCANNING BATTLE DATA...</span>
            </>
          ) : (
            <>
              <Swords className="w-5 h-5" />
              <span>START WALLET DUEL BATTLE ⚔️</span>
            </>
          )}
        </button>

        {/* DUEL BATTLE RESULT CONTAINER */}
        {duelResult && (
          <div className="space-y-6 pt-2 animate-fade-in">

            {/* Randomize Pedro Pose Button */}
            <div className="flex justify-end">
              <button
                onClick={handleRandomizePedro}
                disabled={isShuffling}
                className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-extrabold text-xs flex items-center gap-1.5 hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <Shuffle className={`w-3.5 h-3.5 ${isShuffling ? 'animate-spin' : ''}`} />
                <span>RANDOMIZE PEDRO POSE 🎲</span>
              </button>
            </div>
            
            {/* ---------------- EXPORTABLE BATTLE CARD CANVAS ---------------- */}
            <div 
              ref={duelCardRef} 
              className="bg-[#090a0f] p-5 sm:p-7 rounded-3xl border-2 border-purple-500/30 space-y-6 relative overflow-hidden shadow-2xl"
            >
              {/* Header Watermark */}
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 font-sans">
                <div className="flex items-center gap-2 text-xs font-black text-white">
                  <Swords className="w-4 h-4 text-pink-400" />
                  <span>WALLET DUEL BATTLE RESULT ⚔️</span>
                </div>
                <div className="text-right font-mono">
                  <span className="text-[10px] font-extrabold text-pink-400 uppercase tracking-widest block">
                    T.ME/HOWDOWNBADAREYOUBOT
                  </span>
                  <span className="text-[8px] font-bold text-slate-500 uppercase tracking-wider block">
                    MADE BY GBEMICHARLES
                  </span>
                </div>
              </div>

              {/* SIDE-BY-SIDE CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* WALLET A CARD */}
                <div className={`p-5 rounded-2xl border space-y-3 relative overflow-hidden ${
                  duelResult.winner === 'A' 
                    ? 'bg-gradient-to-b from-pink-950/50 via-slate-950 to-slate-950 border-pink-500/60 shadow-lg shadow-pink-500/20' 
                    : 'bg-slate-900/60 border-slate-800'
                }`}>
                  {duelResult.winner === 'A' && (
                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/40 font-black text-[10px] uppercase flex items-center gap-1 shadow-md">
                      <Crown className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
                      DOWN BAD CHAMPION 👑💀
                    </span>
                  )}

                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">PLAYER 1</span>
                    <div className="font-mono text-xs font-bold text-white truncate">{duelResult.winnerData.walletAddress}</div>
                  </div>

                  <div className="text-center py-2">
                    <div className={`text-3xl font-black font-mono ${
                      duelResult.winnerData.isProfitable ? 'text-emerald-400' : 'text-pink-500'
                    }`}>
                      {duelResult.winnerData.isProfitable 
                        ? `+${Math.round(duelResult.winnerData.estimatedPnlPercent || 0)}% UP BAD` 
                        : (duelResult.winnerData.downBadScore === 0 ? '0% DOWN BAD' : `${duelResult.winnerData.downBadScore}% DOWN BAD`)}
                    </div>
                    <div className="text-xs font-bold text-purple-300 mt-1">
                      {duelResult.winnerData.personality?.title}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono border-t border-slate-800/80 pt-3">
                    <div>
                      <span className="text-[9px] text-slate-400 block uppercase">Holdings</span>
                      <span className="font-bold text-white">{formatUsd(duelResult.winnerData.totalCurrentValueUsd)}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block uppercase">Est. P&L</span>
                      <span className={`font-bold ${duelResult.winnerData.estimatedPnlUsd >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {formatUsd(duelResult.winnerData.estimatedPnlUsd)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* WALLET B CARD */}
                <div className={`p-5 rounded-2xl border space-y-3 relative overflow-hidden ${
                  duelResult.loser === 'B' 
                    ? 'bg-gradient-to-b from-pink-950/50 via-slate-950 to-slate-950 border-pink-500/60 shadow-lg shadow-pink-500/20' 
                    : 'bg-slate-900/60 border-slate-800'
                }`}>
                  {duelResult.winner === 'B' && (
                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/40 font-black text-[10px] uppercase flex items-center gap-1 shadow-md">
                      <Crown className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
                      DOWN BAD CHAMPION 👑💀
                    </span>
                  )}

                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">PLAYER 2</span>
                    <div className="font-mono text-xs font-bold text-white truncate">{duelResult.loserData.walletAddress}</div>
                  </div>

                  <div className="text-center py-2">
                    <div className={`text-3xl font-black font-mono ${
                      duelResult.loserData.isProfitable ? 'text-emerald-400' : 'text-pink-500'
                    }`}>
                      {duelResult.loserData.isProfitable 
                        ? `+${Math.round(duelResult.loserData.estimatedPnlPercent || 0)}% UP BAD` 
                        : (duelResult.loserData.downBadScore === 0 ? '0% DOWN BAD' : `${duelResult.loserData.downBadScore}% DOWN BAD`)}
                    </div>
                    <div className="text-xs font-bold text-purple-300 mt-1">
                      {duelResult.loserData.personality?.title}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono border-t border-slate-800/80 pt-3">
                    <div>
                      <span className="text-[9px] text-slate-400 block uppercase">Holdings</span>
                      <span className="font-bold text-white">{formatUsd(duelResult.loserData.totalCurrentValueUsd)}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block uppercase">Est. P&L</span>
                      <span className={`font-bold ${duelResult.loserData.estimatedPnlUsd >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {formatUsd(duelResult.loserData.estimatedPnlUsd)}
                      </span>
                    </div>
                  </div>
                </div>

              </div>

              {/* BATTLE DIAGNOSIS & NATIVE PEDRO RACCOON CHARACTER */}
              <div className="grid grid-cols-12 gap-4 items-center bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-cyan-500/10 border-l-4 border-l-pink-500 p-4 rounded-2xl">
                
                {/* Commentary text */}
                <div className="col-span-8 sm:col-span-9 space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-pink-300 block">
                    DUEL BATTLE DIAGNOSIS ⚔️
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-white italic leading-relaxed">
                    "{duelResult.battleCommentary}"
                  </p>
                </div>

                {/* 100% Transparent Pedro Raccoon Standing Natively inside Duel Card */}
                <div className="col-span-4 sm:col-span-3 flex justify-end items-center relative">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 relative flex items-center justify-center">
                    <img 
                      src={currentPedroImg} 
                      alt="Pedro Raccoon Battle Referee" 
                      className={`w-full h-full object-contain drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)] scale-110 transition-all duration-300 ${
                        isShuffling ? 'scale-90 opacity-40 rotate-6' : 'scale-110 opacity-100 rotate-0'
                      }`}
                    />
                  </div>
                </div>

              </div>

            </div>
            {/* ---------------- END EXPORTABLE BATTLE CARD CANVAS ---------------- */}

            {/* ACTION BUTTONS ROW (DOWNLOAD IMAGE, COPY IMAGE, SHARE ON X) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              
              <button
                onClick={handleDownloadDuelImg}
                disabled={isGeneratingImg}
                className="px-4 py-3 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-pink-600/30 transition-all cursor-pointer disabled:opacity-50"
              >
                {isGeneratingImg ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Exporting...</span>
                  </>
                ) : downloadSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>DUEL IMAGE SAVED!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>DOWNLOAD DUEL IMAGE 🖼️</span>
                  </>
                )}
              </button>

              <button
                onClick={handleCopyDuelImg}
                disabled={isGeneratingImg}
                className="px-4 py-3 rounded-2xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {copySuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>COPIED TO CLIPBOARD!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-cyan-400" />
                    <span>COPY DUEL IMAGE 📋</span>
                  </>
                )}
              </button>

              <button
                onClick={handleShareDuelOnX}
                className="px-4 py-3 rounded-2xl bg-black hover:bg-slate-900 border border-slate-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
              >
                <Share2 className="w-4 h-4 text-pink-400" />
                <span>SHARE ON X 🐦</span>
              </button>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
