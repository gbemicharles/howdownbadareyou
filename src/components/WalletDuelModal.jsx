import React, { useState, useRef } from 'react';
import { toBlob } from 'html-to-image';
import { saveImageBlob } from '../utils/mobileDownload.js';
import { inlineContainerImages } from '../utils/imagePreloader.js';
import { PEDRO_DATA_URIS } from '../assets/pedroDataURIs.js';
import { triggerHaptic } from '../utils/haptics.js';
import { X, Swords, Trophy, Skull, Share2, Loader2, Sparkles, Crown, Download, Copy, Check, Shuffle, ArrowLeft } from 'lucide-react';
import { compareWalletsForDuel } from '../../server/services/duelEngine';
import { getWalletRawData } from '../../server/services/tonProvider';
import { analyzeWallet } from '../../server/services/walletAnalyzer';
import { calculatePersonalityAndScores } from '../../server/services/personalityEngine';

const PEDRO_KEYS = ['rockstar', 'rekt', 'copium', 'wizard', 'clown', 'diamond', 'rocket'];

export default function WalletDuelModal({ initialWalletA = '', onClose }) {
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
    triggerHaptic('selection');
    setIsShuffling(true);
    const randomIndex = Math.floor(Math.random() * PEDRO_KEYS.length);
    setPedroKeyIndex(randomIndex);
    setTimeout(() => setIsShuffling(false), 400);
  };

  const currentPedroKey = PEDRO_KEYS[pedroKeyIndex] || 'rockstar';
  const currentPedroImg = PEDRO_DATA_URIS[currentPedroKey] || PEDRO_DATA_URIS.rockstar;

  const fetchWalletRoastData = async (addr) => {
    try {
      const res = await fetch(`/api/roast/${encodeURIComponent(addr.trim())}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {}

    const rawData = await getWalletRawData(addr);
    const analysis = analyzeWallet(rawData);
    const scoreData = calculatePersonalityAndScores(analysis);
    return {
      walletAddress: rawData.address,
      totalCurrentValueUsd: analysis.totalCurrentValueUsd,
      estimatedPnlUsd: analysis.estimatedPnlUsd,
      estimatedPnlPercent: analysis.estimatedPnlPercent,
      downBadScore: scoreData.downBadScore,
      isProfitable: scoreData.isProfitable,
      levelText: scoreData.levelText,
      personality: scoreData.personality
    };
  };

  const handleStartDuel = async (e) => {
    if (e) e.preventDefault();
    if (!addressA.trim() || !addressB.trim()) {
      setError('Please enter two TON wallet addresses to duel!');
      return;
    }

    triggerHaptic('impact', 'medium');
    setIsLoading(true);
    setError(null);
    setDuelResult(null);

    try {
      const [walletAData, walletBData] = await Promise.all([
        fetchWalletRoastData(addressA),
        fetchWalletRoastData(addressB)
      ]);

      const battle = compareWalletsForDuel(walletAData, walletBData);
      setDuelResult(battle);
      handleRandomizePedro();
    } catch (err) {
      console.error('Duel battle failed:', err);
      setError('Failed to fetch wallet data for battle. Check addresses and retry.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadDuelCard = async () => {
    if (!duelCardRef.current || isGeneratingImg) return;
    triggerHaptic('impact', 'medium');

    try {
      setIsGeneratingImg(true);
      await inlineContainerImages(duelCardRef.current);

      const blob = await toBlob(duelCardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#090a0f'
      });

      await saveImageBlob(blob, `wallet-duel-${Date.now()}.png`);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to generate duel card image:', err);
    } finally {
      setIsGeneratingImg(false);
    }
  };

  const handleCopyDuelImage = async () => {
    if (!duelCardRef.current || isGeneratingImg) return;
    triggerHaptic('impact', 'medium');

    try {
      setIsGeneratingImg(true);
      await inlineContainerImages(duelCardRef.current);

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
        handleDownloadDuelCard();
      }
    } catch (err) {
      console.error('Failed to copy duel card image:', err);
      handleDownloadDuelCard();
    } finally {
      setIsGeneratingImg(false);
    }
  };

  const handleShareOnX = () => {
    if (!duelResult) return;
    triggerHaptic('impact', 'light');
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
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-start pt-20 sm:pt-14 pb-24 px-3 sm:px-4 bg-black/90 backdrop-blur-lg overflow-y-auto min-h-screen">
      
      <div className="max-w-3xl w-full bg-slate-950/95 border border-purple-500/30 rounded-3xl p-4 sm:p-7 space-y-4 relative shadow-2xl mt-8 sm:mt-10 mb-24 pb-20 sm:pb-7">
        
        {/* Modal Header with 80px+ Top Margin & Prominent Pink Close Button */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 pt-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-600 via-purple-600 to-cyan-500 p-0.5 shadow-lg shadow-purple-500/30 shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Swords className="w-5 h-5 text-pink-400 animate-pulse" />
              </div>
            </div>
            <div>
              <h3 className="text-base sm:text-xl font-black text-white tracking-tight flex items-center gap-2">
                WALLET DUEL BATTLE ⚔️
              </h3>
              <p className="text-[11px] sm:text-xs font-bold text-slate-400">
                16:9 Side-by-Side Landscape Battle Card!
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              triggerHaptic('selection');
              onClose();
            }}
            className="px-4 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-extrabold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-pink-600/30 transition-all active:scale-95 shrink-0"
          >
            <ArrowLeft className="w-4 h-4 text-white" />
            <span>CLOSE ✕</span>
          </button>
        </div>

        {/* INPUT FORM FOR WALLET A & B WITH ENHANCED AUTO-SCROLL */}
        <form onSubmit={handleStartDuel} className="space-y-3 bg-slate-900/60 p-3 sm:p-4 rounded-2xl border border-slate-800">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* Wallet A Input */}
            <div className="space-y-1">
              <label className="text-[10px] sm:text-xs font-bold text-pink-400 uppercase tracking-wider block">
                PLAYER 1 (YOUR WALLET)
              </label>
              <input
                type="text"
                value={addressA}
                onFocus={handleInputFocus}
                onChange={(e) => setAddressA(e.target.value)}
                placeholder="Enter address or .ton domain..."
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-pink-500/40 text-white placeholder-slate-500 text-xs font-mono focus:outline-none focus:border-pink-500 transition-colors"
              />
            </div>

            {/* Wallet B Input */}
            <div className="space-y-1">
              <label className="text-[10px] sm:text-xs font-bold text-cyan-400 uppercase tracking-wider block">
                PLAYER 2 (OPPONENT / FRIEND)
              </label>
              <input
                type="text"
                value={addressB}
                onFocus={handleInputFocus}
                onChange={(e) => setAddressB(e.target.value)}
                placeholder="Enter friend's address or .ton domain..."
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-cyan-500/40 text-white placeholder-slate-500 text-xs font-mono focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

          </div>

          {error && (
            <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-500 hover:from-pink-500 hover:to-cyan-400 text-white font-extrabold text-xs tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition-all cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>ANALYZING BOTH WALLETS...</span>
              </>
            ) : (
              <>
                <Swords className="w-4 h-4 text-white" />
                <span>START WALLET DUEL ⚔️</span>
              </>
            )}
          </button>

        </form>

        {/* ---------------- PERFECT 16:9 SIDE-BY-SIDE BATTLE CARD CANVAS ---------------- */}
        {duelResult && (
          <div className="space-y-4">
            
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
                OFFICIAL BATTLE CARD PREVIEW
              </span>
              
              <button
                onClick={handleRandomizePedro}
                disabled={isShuffling}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-extrabold text-[11px] flex items-center gap-1.5 hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <Shuffle className={`w-3.5 h-3.5 ${isShuffling ? 'animate-spin' : ''}`} />
                <span>RANDOMIZE PEDRO 🎲</span>
              </button>
            </div>

            {/* PRISTINE UNSCALED 16:9 LANDSCAPE BATTLE CARD FOR EXPEDITED PNG SAVING */}
            <div className="overflow-hidden rounded-3xl border-2 border-purple-500/40 shadow-2xl relative">
              <div 
                ref={duelCardRef}
                className="w-full bg-slate-950 p-4 sm:p-6 space-y-4 relative overflow-hidden text-white font-sans aspect-[16/9] min-h-[360px] sm:min-h-[420px] flex flex-col justify-between"
              >
                {/* Background Ambient Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-pink-950/40 via-purple-950/30 to-slate-950 pointer-events-none" />

                {/* Card Top Header */}
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5 relative z-10">
                  <div className="flex items-center gap-2">
                    <Swords className="w-4 h-4 text-pink-400" />
                    <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-white">
                      WALLET DUEL BATTLE RESULT ⚔️
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono font-extrabold text-cyan-300 block">
                      T.ME/HOWDOWNBADAREYOUBOT
                    </span>
                    <span className="text-[8px] font-mono text-slate-400 uppercase tracking-widest block">
                      MADE BY GBEMICHARLES
                    </span>
                  </div>
                </div>

                {/* SIDE-BY-SIDE PLAYER A & B CARDS (SIDE BY SIDE ON ALL SCREENS) */}
                <div className="grid grid-cols-2 gap-2 sm:gap-4 relative z-10 my-auto items-stretch">
                  
                  {/* Player A Card */}
                  <div className={`p-2.5 sm:p-4 rounded-2xl border transition-all flex flex-col justify-between relative ${
                    duelResult.winner === 'A'
                      ? 'bg-gradient-to-b from-pink-600/25 to-purple-600/25 border-pink-500 shadow-xl shadow-pink-500/20'
                      : 'bg-slate-900/60 border-slate-800/80 opacity-90'
                  }`}>
                    {duelResult.winner === 'A' && (
                      <div className="absolute -top-3 right-2 bg-gradient-to-r from-amber-500 to-pink-500 text-slate-950 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-lg">
                        <Crown className="w-3 h-3" />
                        <span>CHAMPION</span>
                      </div>
                    )}

                    <div className="space-y-1">
                      <span className="text-[8px] sm:text-[10px] font-mono font-extrabold text-slate-400 block uppercase">
                        PLAYER 1
                      </span>
                      <h4 className="text-xs sm:text-base font-black text-white truncate">
                        {duelResult.walletAData.walletAddress.slice(0, 6)}...{duelResult.walletAData.walletAddress.slice(-4)}
                      </h4>
                    </div>

                    <div className="my-2 space-y-0.5">
                      <div className={`text-sm sm:text-2xl font-black ${
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

                  {/* Player B Card */}
                  <div className={`p-2.5 sm:p-4 rounded-2xl border transition-all flex flex-col justify-between relative ${
                    duelResult.winner === 'B'
                      ? 'bg-gradient-to-b from-pink-600/25 to-purple-600/25 border-pink-500 shadow-xl shadow-pink-500/20'
                      : 'bg-slate-900/60 border-slate-800/80 opacity-90'
                  }`}>
                    {duelResult.winner === 'B' && (
                      <div className="absolute -top-3 right-2 bg-gradient-to-r from-amber-500 to-pink-500 text-slate-950 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-lg">
                        <Crown className="w-3 h-3" />
                        <span>CHAMPION</span>
                      </div>
                    )}

                    <div className="space-y-1">
                      <span className="text-[8px] sm:text-[10px] font-mono font-extrabold text-slate-400 block uppercase">
                        PLAYER 2
                      </span>
                      <h4 className="text-xs sm:text-base font-black text-white truncate">
                        {duelResult.walletBData.walletAddress.slice(0, 6)}...{duelResult.walletBData.walletAddress.slice(-4)}
                      </h4>
                    </div>

                    <div className="my-2 space-y-0.5">
                      <div className={`text-sm sm:text-2xl font-black ${
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

                  {/* 100% Inline Base64 Pedro Raccoon Standing Natively inside Duel Card */}
                  <div className="col-span-4 sm:col-span-3 flex justify-end items-center relative">
                    <div className={`w-16 h-16 sm:w-24 sm:h-24 relative flex items-center justify-center filter drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)] transition-all duration-300 ${
                      isShuffling ? 'scale-90 opacity-40 rotate-6' : 'scale-100 opacity-100 rotate-0'
                    }`}>
                      <img 
                        src={currentPedroImg} 
                        alt="Pedro Raccoon Battle Referee" 
                        className="w-full h-full object-contain pointer-events-none"
                      />
                    </div>
                  </div>

                </div>

              </div>
            </div>

            {/* Duel Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
              
              <button
                onClick={handleShareOnX}
                className="px-4 py-3 rounded-2xl bg-black hover:bg-slate-900 border border-slate-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-pink-400" />
                <span>POST DUEL ON X 🐦</span>
              </button>

              <button
                onClick={handleCopyDuelImage}
                disabled={isGeneratingImg}
                className="px-4 py-3 rounded-2xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {copySuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>COPIED BATTLE CARD!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-cyan-400" />
                    <span>COPY BATTLE CARD 📋</span>
                  </>
                )}
              </button>

              <button
                onClick={handleDownloadDuelCard}
                disabled={isGeneratingImg}
                className="px-4 py-3 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-pink-600/30 transition-all cursor-pointer disabled:opacity-50"
              >
                {isGeneratingImg ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Generating...</span>
                  </>
                ) : downloadSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>SAVED BATTLE CARD!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 text-white" />
                    <span>DOWNLOAD CARD 🖼️</span>
                  </>
                )}
              </button>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
