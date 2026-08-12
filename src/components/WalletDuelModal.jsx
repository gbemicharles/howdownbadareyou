import React, { useState, useRef, useEffect } from 'react';
import { toBlob } from 'html-to-image';
import { saveImageBlob } from '../utils/mobileDownload.js';
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

  const handleInputFocus = (e) => {
    const el = e.target;
    setTimeout(() => {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 300);
  };

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
        const data = await res.json();
        // Ensure downBadScore fallback
        if (data.downBadScore === undefined || data.downBadScore === null) {
          data.downBadScore = 0;
        }
        return data;
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
      totalCurrentValueUsd: analysis.totalCurrentValueUsd || 0,
      estimatedPnlUsd: analysis.estimatedPnlUsd || 0,
      estimatedPnlPercent: analysis.estimatedPnlPercent || 0,
      downBadScore: scoreData.downBadScore ?? 0,
      isProfitable: scoreData.isProfitable ?? false,
      levelText: scoreData.levelText || "THE BREAKEVEN SURVIVOR",
      personality: scoreData.personality || { title: "THE BREAKEVEN SURVIVOR ⚖️" }
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
      const blob = await toBlob(duelCardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#090a0f'
      });

      await saveImageBlob(blob, `wallet-duel-${Date.now()}.png`);
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

  const handleShareDuelOnX = async () => {
    if (!duelResult) return;
    await handleCopyDuelImg();
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-lg overflow-y-auto">
      
      <div className="max-w-3xl w-full bg-slate-950/95 border border-purple-500/30 rounded-3xl p-4 sm:p-7 space-y-4 relative shadow-2xl my-6 pb-20 sm:pb-7">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-600 via-purple-600 to-cyan-500 p-0.5 shadow-lg shadow-purple-500/30">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Swords className="w-5 h-5 text-pink-400 animate-pulse" />
              </div>
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-2">
                WALLET DUEL BATTLE ⚔️
              </h3>
              <p className="text-[11px] sm:text-xs font-bold text-slate-400">
                16:9 Side-by-Side Landscape Battle Card!
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

        {/* INPUT FORM FOR WALLET A & B WITH ENHANCED AUTO-SCROLL */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-900/60 p-3 sm:p-4 rounded-2xl border border-slate-800">
          
          <div className="space-y-1">
            <label className="text-[11px] font-black uppercase tracking-wider text-pink-400 flex items-center gap-1">
              <span>PLAYER 1 (WALLET A):</span>
            </label>
            <input 
              type="text" 
              value={addressA} 
              onFocus={handleInputFocus}
              onClick={handleInputFocus}
              onChange={(e) => setAddressA(e.target.value)} 
              placeholder="Paste TON wallet A or DNS..." 
              className="w-full bg-slate-950 border border-slate-800 focus:border-pink-500 text-white rounded-xl px-3 py-2.5 text-xs font-mono font-bold focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1">
              <span>PLAYER 2 (WALLET B):</span>
            </label>
            <input 
              type="text" 
              value={addressB} 
              onFocus={handleInputFocus}
              onClick={handleInputFocus}
              onChange={(e) => setAddressB(e.target.value)} 
              placeholder="Paste TON wallet B or DNS..." 
              className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 text-white rounded-xl px-3 py-2.5 text-xs font-mono font-bold focus:outline-none"
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
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-500 hover:from-pink-500 hover:to-cyan-400 text-white font-black text-xs sm:text-sm tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-purple-600/30 transition-all cursor-pointer disabled:opacity-50"
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
          <div className="space-y-4 pt-1 animate-fade-in">

            {/* Randomize Pedro Pose Button */}
            <div className="flex justify-end">
              <button
                onClick={handleRandomizePedro}
                disabled={isShuffling}
                className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-extrabold text-[11px] flex items-center gap-1.5 hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <Shuffle className={`w-3.5 h-3.5 ${isShuffling ? 'animate-spin' : ''}`} />
                <span>RANDOMIZE PEDRO POSE 🎲</span>
              </button>
            </div>
            
            {/* ---------------- 16:9 SIDE-BY-SIDE EXPORTABLE BATTLE CARD CANVAS ---------------- */}
            <div className="overflow-hidden rounded-3xl border-2 border-purple-500/30 shadow-2xl relative">
              <div 
                ref={duelCardRef} 
                className="w-full bg-[#090a0f] p-4 sm:p-6 space-y-3 relative text-slate-100 font-sans min-h-[320px] flex flex-col justify-between"
              >
                {/* Header Watermark */}
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 font-sans">
                  <div className="flex items-center gap-2 text-[11px] sm:text-xs font-black text-white">
                    <Swords className="w-4 h-4 text-pink-400" />
                    <span>WALLET DUEL BATTLE RESULT ⚔️</span>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-[9px] font-extrabold text-pink-400 uppercase tracking-widest block">
                      T.ME/HOWDOWNBADAREYOUBOT
                    </span>
                    <span className="text-[7px] font-bold text-slate-500 uppercase tracking-wider block">
                      MADE BY GBEMICHARLES
                    </span>
                  </div>
                </div>

                {/* STRICT SIDE-BY-SIDE CARDS (grid-cols-2 ON ALL SCREENS) */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3 my-auto">
                  
                  {/* WALLET A CARD (PLAYER 1) */}
                  <div className={`p-2.5 sm:p-4 rounded-2xl border space-y-1.5 relative overflow-hidden ${
                    duelResult.winner === 'A' 
                      ? 'bg-gradient-to-b from-pink-950/50 via-slate-950 to-slate-950 border-pink-500/60 shadow-lg shadow-pink-500/20' 
                      : 'bg-slate-900/60 border-slate-800'
                  }`}>
                    {duelResult.winner === 'A' && (
                      <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/40 font-black text-[7px] sm:text-[9px] uppercase flex items-center gap-0.5 shadow-md">
                        <Crown className="w-2.5 h-2.5 text-amber-400 animate-bounce" />
                        CHAMPION 👑
                      </span>
                    )}

                    <div className="space-y-0.5">
                      <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider text-slate-400">PLAYER 1</span>
                      <div className="font-mono text-[10px] sm:text-xs font-bold text-white truncate max-w-full">{duelResult.walletAData.walletAddress}</div>
                    </div>

                    <div className="text-center py-1">
                      <div className={`text-sm sm:text-2xl font-black font-mono leading-tight ${
                        duelResult.walletAData.isProfitable ? 'text-emerald-400' : 'text-pink-500'
                      }`}>
                        {duelResult.walletAData.isProfitable 
                          ? `+${Math.round(duelResult.walletAData.estimatedPnlPercent || 0)}% UP BAD` 
                          : `${duelResult.walletAData.downBadScore ?? 0}% DOWN BAD`}
                      </div>
                      <div className="text-[9px] sm:text-[11px] font-bold text-purple-300 truncate">
                        {duelResult.walletAData.personality?.title || duelResult.walletAData.levelText || "SURVIVOR"}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-1 text-center text-[9px] sm:text-[11px] font-mono border-t border-slate-800/80 pt-1.5">
                      <div>
                        <span className="text-[7px] sm:text-[8px] text-slate-400 block uppercase">Holdings</span>
                        <span className="font-bold text-white">{formatUsd(duelResult.walletAData.totalCurrentValueUsd)}</span>
                      </div>
                      <div>
                        <span className="text-[7px] sm:text-[8px] text-slate-400 block uppercase">Est. P&L</span>
                        <span className={`font-bold ${duelResult.walletAData.estimatedPnlUsd >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {formatUsd(duelResult.walletAData.estimatedPnlUsd)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* WALLET B CARD (PLAYER 2) */}
                  <div className={`p-2.5 sm:p-4 rounded-2xl border space-y-1.5 relative overflow-hidden ${
                    duelResult.winner === 'B' 
                      ? 'bg-gradient-to-b from-pink-950/50 via-slate-950 to-slate-950 border-pink-500/60 shadow-lg shadow-pink-500/20' 
                      : 'bg-slate-900/60 border-slate-800'
                  }`}>
                    {duelResult.winner === 'B' && (
                      <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/40 font-black text-[7px] sm:text-[9px] uppercase flex items-center gap-0.5 shadow-md">
                        <Crown className="w-2.5 h-2.5 text-amber-400 animate-bounce" />
                        CHAMPION 👑
                      </span>
                    )}

                    <div className="space-y-0.5">
                      <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider text-slate-400">PLAYER 2</span>
                      <div className="font-mono text-[10px] sm:text-xs font-bold text-white truncate max-w-full">{duelResult.walletBData.walletAddress}</div>
                    </div>

                    <div className="text-center py-1">
                      <div className={`text-sm sm:text-2xl font-black font-mono leading-tight ${
                        duelResult.walletBData.isProfitable ? 'text-emerald-400' : 'text-pink-500'
                      }`}>
                        {duelResult.walletBData.isProfitable 
                          ? `+${Math.round(duelResult.walletBData.estimatedPnlPercent || 0)}% UP BAD` 
                          : `${duelResult.walletBData.downBadScore ?? 0}% DOWN BAD`}
                      </div>
                      <div className="text-[9px] sm:text-[11px] font-bold text-purple-300 truncate">
                        {duelResult.walletBData.personality?.title || duelResult.walletBData.levelText || "SURVIVOR"}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-1 text-center text-[9px] sm:text-[11px] font-mono border-t border-slate-800/80 pt-1.5">
                      <div>
                        <span className="text-[7px] sm:text-[8px] text-slate-400 block uppercase">Holdings</span>
                        <span className="font-bold text-white">{formatUsd(duelResult.walletBData.totalCurrentValueUsd)}</span>
                      </div>
                      <div>
                        <span className="text-[7px] sm:text-[8px] text-slate-400 block uppercase">Est. P&L</span>
                        <span className={`font-bold ${duelResult.walletBData.estimatedPnlUsd >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {formatUsd(duelResult.walletBData.estimatedPnlUsd)}
                        </span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* BATTLE DIAGNOSIS & NATIVE PEDRO RACCOON CHARACTER */}
                <div className="grid grid-cols-12 gap-2 sm:gap-3 items-center bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-cyan-500/10 border-l-4 border-l-pink-500 p-2.5 sm:p-3 rounded-2xl">
                  
                  {/* Commentary text */}
                  <div className="col-span-8 sm:col-span-9 space-y-0.5">
                    <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-pink-300 block">
                      DUEL BATTLE DIAGNOSIS ⚔️
                    </span>
                    <p className="text-[10px] sm:text-xs font-bold text-white italic leading-snug">
                      "{duelResult.battleCommentary}"
                    </p>
                  </div>

                  {/* 100% Transparent Pedro Raccoon Standing Natively inside Duel Card */}
                  <div className="col-span-4 sm:col-span-3 flex justify-end items-center relative">
                    <div className="w-16 h-16 sm:w-24 sm:h-24 relative flex items-center justify-center">
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
            </div>
            {/* ---------------- END 16:9 SIDE-BY-SIDE CANVAS ---------------- */}

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
                    <span>DOWNLOAD DUEL CARD 🖼️</span>
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
                    <span>COPY DUEL CARD 📋</span>
                  </>
                )}
              </button>

              <button
                onClick={handleShareDuelOnX}
                className="px-4 py-3 rounded-2xl bg-black hover:bg-slate-900 border border-slate-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
              >
                <Share2 className="w-4 h-4 text-pink-400" />
                <span>POST DUEL ON X 🐦</span>
              </button>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
