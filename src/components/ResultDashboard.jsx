import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Skull, Flame, TrendingDown, TrendingUp, Share2, Download, 
  RefreshCw, AlertTriangle, Coins, ShieldAlert, Award, ExternalLink, Zap,
  ChevronLeft, ChevronRight, FileText
} from 'lucide-react';
import CopiumCalculator from './CopiumCalculator';
import FinancialAstrology from './FinancialAstrology';
import TelegramStickerGenerator from './TelegramStickerGenerator';
import { PEDRO_DATA_URIS } from '../assets/pedroDataURIs.js';
import { PEDRO_ASSETS } from '../assets/pedroAssets.js';

const getPedroKeyForPersonality = (title, isProfitable, score) => {
  if (isProfitable) return 'rockstar';
  if (!title) return 'rockstar';
  const t = title.toUpperCase();
  if (t.includes('ONE-TOKEN') || t.includes('BELIEVER')) return 'rocket';
  if (t.includes('BAG COLLECTOR')) return 'diamond';
  if (t.includes('AIRDROP')) return 'clown';
  if (t.includes('EXIT LIQUIDITY') || score >= 80) return 'rekt';
  if (t.includes('DIAMOND')) return 'diamond';
  if (t.includes('ASTROLOGY') || t.includes('WIZARD')) return 'wizard';
  if (score >= 50) return 'copium';
  return 'rockstar';
};

export default function ResultDashboard({ roastData, onReset, onOpenShareCard, onOpenCert }) {
  const {
    walletAddress,
    totalCurrentValueUsd,
    estimatedCostBasisUsd,
    estimatedPnlUsd,
    estimatedPnlPercent,
    downBadScore,
    isProfitable,
    levelText,
    personality,
    metrics,
    ignoredTokensCount,
    biggestBag,
    biggestLoser,
    biggestWinner,
    concentrationComment,
    copiumMetrics,
    astrology,
    roasts,
    positions
  } = roastData;

  useEffect(() => {
    if (isProfitable) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [isProfitable]);

  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(positions.length / ITEMS_PER_PAGE) || 1;
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedPositions = positions.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleShareOnX = () => {
    const tweetText = encodeURIComponent(roasts.tweetText);
    const intentUrl = `https://x.com/intent/tweet?text=${tweetText}`;
    window.open(intentUrl, '_blank', 'noopener,noreferrer');
  };

  const formatUsd = (num) => {
    if (num === null || num === undefined) return 'P&L N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(num);
  };

  const formatPercent = (num) => {
    if (num === null || num === undefined) return '';
    const sign = num > 0 ? '+' : '';
    return `${sign}${num.toFixed(1)}%`;
  };

  const displayAddr = (walletAddress && walletAddress.toLowerCase().endsWith('.ton'))
    ? walletAddress
    : (walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : "TON Wallet");

  const pedroKey = getPedroKeyForPersonality(personality?.title, isProfitable, downBadScore);
  const pedroImg = PEDRO_DATA_URIS[pedroKey] || PEDRO_ASSETS[pedroKey] || PEDRO_DATA_URIS.rockstar;

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 animate-fade-in pb-12 px-3 sm:px-4">
      
      {/* 1. TOP HEADER BRANDING & ACTION BAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 glass-panel rounded-2xl">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-600 to-purple-600 flex items-center justify-center shadow-lg shadow-pink-600/30 shrink-0">
            <Skull className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <h2 className="text-xs sm:text-sm font-extrabold text-white tracking-tight">WALLET DIAGNOSIS REPORT</h2>
            <p className="text-[11px] sm:text-xs font-mono text-slate-400 truncate">
              Address: <span className="text-pink-400 font-bold">{displayAddr}</span>
            </p>
          </div>
        </div>

        {/* Responsive Button Grid for Mobile */}
        <div className="grid grid-cols-3 sm:flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={onReset}
            className="px-2.5 sm:px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 font-bold text-[11px] sm:text-xs flex items-center justify-center gap-1 sm:gap-1.5 transition-all cursor-pointer truncate"
          >
            <RefreshCw className="w-3.5 h-3.5 shrink-0" />
            <span>ROAST</span>
          </button>

          <button
            onClick={onOpenCert}
            className="px-2.5 sm:px-3.5 py-2.5 rounded-xl bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/40 text-amber-300 font-extrabold text-[11px] sm:text-xs flex items-center justify-center gap-1 sm:gap-1.5 transition-all cursor-pointer truncate"
          >
            <FileText className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>DIPLOMA</span>
          </button>

          <button
            onClick={onOpenShareCard}
            className="px-2.5 sm:px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-extrabold text-[11px] sm:text-xs flex items-center justify-center gap-1 sm:gap-1.5 shadow-lg shadow-pink-600/30 transition-all cursor-pointer truncate"
          >
            <Download className="w-3.5 h-3.5 shrink-0" />
            <span>CARD</span>
          </button>
        </div>
      </div>

      {/* 2. MAIN HERO DOWN BAD SCORE CARD WITH NATIVE PEDRO RACCOON CHARACTER */}
      <div className="glass-panel p-5 sm:p-8 rounded-3xl space-y-6 relative overflow-hidden">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10">
          
          <div className="col-span-1 md:col-span-8 space-y-3 text-center md:text-left">
            <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-widest text-slate-400 bg-slate-900/80 px-3.5 py-1.5 rounded-full border border-slate-800 inline-block">
              {isProfitable ? 'PROFIT SURVIVOR STATUS 🏆' : 'YOUR DOWN BAD SCORE 💀'}
            </span>

            <h1 className={`text-4xl sm:text-6xl font-black tracking-tight ${
              isProfitable ? 'text-emerald-400' : 'text-gradient-pink'
            }`}>
              {isProfitable ? levelText : `${downBadScore}% DOWN BAD`}
            </h1>

            <div>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-2xl bg-purple-500/20 border border-purple-500/40 text-purple-300 font-extrabold text-xs sm:text-sm">
                <Award className="w-4 h-4 text-purple-400" />
                <span>{personality.title}</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm font-medium text-slate-300 italic leading-relaxed pt-1">
              "{personality.description}"
            </p>
          </div>

          {/* Native Standing Pedro Raccoon Character Artwork */}
          <div className="col-span-1 md:col-span-4 flex justify-center items-center">
            <div className="w-36 h-36 sm:w-44 sm:h-44 relative flex items-center justify-center filter drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)]">
              <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/20 via-purple-500/20 to-cyan-500/20 rounded-full blur-2xl pointer-events-none" />
              <img 
                src={pedroImg} 
                alt="Pedro Raccoon Character" 
                className="w-full h-full object-contain pointer-events-none drop-shadow-[0_5px_15px_rgba(0,0,0,0.9)]" 
              />
            </div>
          </div>

        </div>

        {/* Key Portfolio Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-4 border-t border-slate-800/80 font-mono text-left">
          
          <div className="p-3 sm:p-4 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-1">
            <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-bold block">Portfolio Value</span>
            <span className="text-sm sm:text-lg font-black text-white block">{formatUsd(totalCurrentValueUsd)}</span>
          </div>

          <div className="p-3 sm:p-4 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-1">
            <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-bold block">Est. Net P&L</span>
            <span className={`text-sm sm:text-lg font-black block ${
              estimatedPnlUsd >= 0 ? 'text-emerald-400' : 'text-red-400'
            }`}>
              {formatUsd(estimatedPnlUsd)}
            </span>
          </div>

          <div className="p-3 sm:p-4 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-1">
            <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-bold block">Best Winner</span>
            <span className="text-sm sm:text-lg font-black text-emerald-400 block truncate">
              {biggestWinner ? `${biggestWinner.symbol}` : 'NONE'}
            </span>
          </div>

          <div className="p-3 sm:p-4 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-1">
            <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-bold block">Rekt Bag</span>
            <span className="text-sm sm:text-lg font-black text-pink-400 block truncate">
              {biggestLoser ? `${biggestLoser.symbol}` : 'NONE 🎉'}
            </span>
          </div>

        </div>

      </div>

      {/* 3. ROAST DIAGNOSIS CRITIQUE */}
      <div className="glass-panel p-5 sm:p-8 rounded-3xl space-y-4 border-l-4 border-l-pink-500">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-pink-500 animate-pulse" />
          <h3 className="text-sm font-black text-white uppercase tracking-wider">BLOCKCHAIN DIAGNOSIS CRITIQUE</h3>
        </div>
        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
          {roasts.primaryRoast}
        </p>
      </div>

      {/* 4. COPIUM CALCULATOR (ATH REBOUND SIMULATOR) - GUARANTEED ALWAYS RENDERED */}
      <CopiumCalculator 
        copiumMetrics={copiumMetrics}
        totalCurrentValueUsd={totalCurrentValueUsd}
        biggestBag={biggestBag}
        positions={positions}
      />

      {/* 5. TELEGRAM STICKER GENERATOR */}
      <TelegramStickerGenerator roastData={roastData} />

      {/* 6. WEB3 FINANCIAL ASTROLOGY */}
      <FinancialAstrology astrology={astrology} />

      {/* 7. TOKEN POSITIONS BREAKDOWN TABLE */}
      <div className="glass-panel p-5 sm:p-8 rounded-3xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-4">
          <div>
            <h3 className="text-sm sm:text-base font-black text-white tracking-tight flex items-center gap-2">
              <Coins className="w-4 h-4 text-cyan-400" />
              <span>TOKEN HOLDINGS ({positions.length})</span>
            </h3>
            <p className="text-xs text-slate-400">
              Verified TON Jetton holdings & P&L breakdown
            </p>
          </div>
          {ignoredTokensCount > 0 && (
            <span className="text-[10px] font-mono text-slate-500 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
              {ignoredTokensCount} dust tokens hidden
            </span>
          )}
        </div>

        {/* Table / List View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800/80 text-[10px] font-mono uppercase text-slate-400">
                <th className="pb-3 font-bold">Asset</th>
                <th className="pb-3 font-bold text-right">Balance</th>
                <th className="pb-3 font-bold text-right">Value (USD)</th>
                <th className="pb-3 font-bold text-right">Est. P&L</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 text-xs font-mono">
              {paginatedPositions.map((pos, idx) => (
                <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3.5 pr-2">
                    <div className="flex items-center gap-2.5">
                      {pos.image ? (
                        <img src={pos.image} alt={pos.symbol} className="w-6 h-6 rounded-full object-cover shrink-0" />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center font-extrabold text-[10px] text-pink-400 shrink-0">
                          {pos.symbol.slice(0, 2)}
                        </div>
                      )}
                      <div className="min-w-0">
                        <span className="font-extrabold text-white block truncate">{pos.symbol}</span>
                        <span className="text-[9px] text-slate-400 block truncate">{pos.name}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 text-right font-semibold text-slate-200">
                    {new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(pos.quantity ?? pos.balance ?? 0)}
                  </td>
                  <td className="py-3.5 text-right font-extrabold text-white">
                    {formatUsd(pos.currentValueUsd)}
                  </td>
                  <td className="py-3.5 text-right font-extrabold">
                    {pos.estimatedPnlUsd !== undefined && pos.estimatedPnlUsd !== null ? (
                      <span className={pos.estimatedPnlUsd >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                        {formatUsd(pos.estimatedPnlUsd)} ({formatPercent(pos.estimatedPnlPercent)})
                      </span>
                    ) : (
                      <span className="text-slate-500">N/A</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 text-xs font-mono text-slate-400">
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-slate-900 transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-white" />
              </button>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-slate-900 transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 8. SHARE ON X FOOTER CTA */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 glass-panel rounded-3xl border border-pink-500/30">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="font-extrabold text-white text-sm">Flex Your Down Bad Diagnosis On X 🐦</h4>
          <p className="text-xs text-slate-400">Post your score & tag your degens to compare who is down badder!</p>
        </div>
        <button
          onClick={handleShareOnX}
          className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-black hover:bg-slate-900 border border-slate-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
        >
          <Share2 className="w-4 h-4 text-pink-400" />
          <span>POST ON X (TWITTER) 🐦</span>
        </button>
      </div>

    </div>
  );
}
