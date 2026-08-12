import React, { useRef, useState, useEffect } from 'react';
import { toPng, toBlob } from 'html-to-image';
import { QRCodeSVG } from 'qrcode.react';
import { 
  X, Download, Share2, Copy, Sparkles, Check, Loader2, 
  Flame, Award, ShieldCheck, Zap, Shuffle, Eye, EyeOff
} from 'lucide-react';

const PRESET_BACKGROUNDS = [
  { id: 'cyber', name: 'Cyber Blue', class: 'bg-gradient-to-r from-slate-950 via-[#0a0f1d] to-[#0d162a] border-cyan-500/30' },
  { id: 'fire', name: 'Neon Fire', class: 'bg-gradient-to-r from-slate-950 via-[#1a0a14] to-[#250d18] border-red-500/40' },
  { id: 'matrix', name: 'Hacker Matrix', class: 'bg-gradient-to-r from-slate-950 via-[#081813] to-[#0c241c] border-emerald-500/40' },
  { id: 'gold', name: 'Golden Glory', class: 'bg-gradient-to-r from-slate-950 via-[#181308] to-[#241c0c] border-amber-500/40' },
  { id: 'void', name: 'Midnight Void', class: 'bg-gradient-to-r from-slate-950 via-slate-900 to-black border-slate-700/50' },
  { id: 'synthwave', name: 'Synthwave Sunset', class: 'bg-gradient-to-r from-purple-950 via-slate-950 to-pink-950 border-pink-500/40' }
];

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

export default function ResultCardModal({ roastData, onClose }) {
  const cardRef = useRef(null);

  const [themeIndex, setThemeIndex] = useState(0);
  const [pedroKeyIndex, setPedroKeyIndex] = useState(0);
  const [hideHoldings, setHideHoldings] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

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
    biggestBag,
    biggestWinner,
    biggestLoser,
    roasts
  } = roastData;

  // Auto-randomize theme and Pedro pose on modal open
  useEffect(() => {
    handleRandomize();
  }, []);

  const handleRandomize = () => {
    setIsShuffling(true);

    const randomTheme = Math.floor(Math.random() * PRESET_BACKGROUNDS.length);
    const randomPedro = Math.floor(Math.random() * PEDRO_KEYS.length);

    setThemeIndex(randomTheme);
    setPedroKeyIndex(randomPedro);

    setTimeout(() => setIsShuffling(false), 400);
  };

  const activeThemeObj = PRESET_BACKGROUNDS[themeIndex] || PRESET_BACKGROUNDS[0];
  const currentPedroKey = PEDRO_KEYS[pedroKeyIndex] || 'rockstar';
  const currentPedroImg = PEDRO_CHARACTER_ARTS[currentPedroKey] || PEDRO_CHARACTER_ARTS.rockstar;

  const handleDownloadCard = async () => {
    if (!cardRef.current || isGenerating) return;

    try {
      setIsGenerating(true);
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#090a0f'
      });

      const link = document.createElement('a');
      link.download = `downbad-card-${walletAddress.slice(0, 6)}.png`;
      link.href = dataUrl;
      link.click();

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to generate image:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyCardImage = async () => {
    if (!cardRef.current || isGenerating) return;

    try {
      setIsGenerating(true);
      const blob = await toBlob(cardRef.current, {
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
        handleDownloadCard();
      }
    } catch (err) {
      console.error('Failed to copy image to clipboard:', err);
      handleDownloadCard();
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePostToXWithImage = async () => {
    await handleCopyCardImage();
    const tweetText = encodeURIComponent(`💀 Check out my TON Wallet Diagnosis report! I scored ${isProfitable ? 'PROFIT SURVIVOR' : `${downBadScore}% DOWN BAD`}.\n\nTest your wallet on Telegram at https://t.me/howdownbadareyoubot #TON #Web3`);
    const intentUrl = `https://x.com/intent/tweet?text=${tweetText}`;
    window.open(intentUrl, '_blank', 'noopener,noreferrer');
  };

  const formatUsd = (num) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num || 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg overflow-y-auto">
      
      <div className="max-w-3xl w-full bg-slate-950/95 border border-pink-500/30 rounded-3xl p-5 sm:p-7 space-y-5 relative shadow-2xl my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-600 via-purple-600 to-cyan-400 p-0.5 shadow-lg shadow-pink-600/30">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Flame className="w-5 h-5 text-pink-400 animate-pulse" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                HOW DOWN BAD ARE YOU RESULT CARD 🖼️💀
              </h3>
              <p className="text-xs font-bold text-slate-400">
                Export and share your official TON wallet diagnosis card!
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

        {/* CONTROLS BAR: RANDOMIZE BACKGROUND & HIDE HOLDINGS PRIVACY TOGGLE */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-900/70 p-3 rounded-2xl border border-slate-800">
          
          {/* Randomize Background Button */}
          <button
            onClick={handleRandomize}
            disabled={isShuffling}
            className="py-3 px-4 rounded-xl bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-500 hover:from-pink-500 hover:to-cyan-400 text-white font-black text-xs tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition-all cursor-pointer disabled:opacity-50"
          >
            <Shuffle className={`w-4 h-4 ${isShuffling ? 'animate-spin' : 'animate-bounce'}`} />
            <span>RANDOMIZE BACKGROUND 🎲</span>
          </button>

          {/* Hide Holdings Privacy Toggle Button */}
          <button
            onClick={() => setHideHoldings(!hideHoldings)}
            className={`py-3 px-4 rounded-xl font-black text-xs tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer border ${
              hideHoldings 
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 shadow-md' 
                : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-900'
            }`}
          >
            {hideHoldings ? <Eye className="w-4 h-4 text-amber-400" /> : <EyeOff className="w-4 h-4 text-cyan-400" />}
            <span>{hideHoldings ? 'SHOW HOLDINGS 👁️' : 'HIDE HOLDINGS 🙈'}</span>
          </button>

        </div>

        {/* ---------------- REFERENCE SAMPLE MATCHED RESULT CARD CANVAS ---------------- */}
        <div className="overflow-hidden rounded-3xl border-2 border-slate-800/90 shadow-2xl relative">
          <div 
            ref={cardRef} 
            className={`w-full ${activeThemeObj.class} p-6 sm:p-8 space-y-6 relative overflow-hidden text-slate-100 font-sans min-h-[380px] flex flex-col justify-between transition-all duration-500`}
          >
            {/* Faint Glowing Chart Trend Line in Background */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
              <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 500 200">
                <path d="M0,150 Q120,80 250,120 T500,30" fill="none" stroke="#38bdf8" strokeWidth="4" />
                <circle cx="250" cy="120" r="6" fill="#38bdf8" />
                <circle cx="500" cy="30" r="6" fill="#38bdf8" />
              </svg>
            </div>

            {/* TOP HEADER: CLEAN NON-OVERLAPPING BRANDING & WALLET ADDRESS */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 relative z-10 gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center shadow-md shrink-0">
                  <Flame className="w-5 h-5 text-white" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-black text-white text-xs tracking-wider uppercase leading-none">
                    HOW DOWN BAD ARE YOU?
                  </span>
                  <span className="text-[11px] font-mono font-extrabold text-cyan-300 block truncate mt-1 leading-snug">
                    {walletAddress}
                  </span>
                </div>
              </div>

              <div className="px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-[10px] font-mono font-extrabold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5 shrink-0">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>VERIFIED ON TON</span>
              </div>
            </div>

            {/* MAIN TWO-COLUMN BODY: LEFT DATA & HERO SCORE, RIGHT PEDRO NATIVE ARTWORK */}
            <div className="grid grid-cols-12 gap-4 items-center relative z-10 my-auto">
              
              {/* LEFT COLUMN: HERO SCORE & KEY METRICS (Occupies 7 cols) */}
              <div className="col-span-7 space-y-3">
                
                {/* MASSIVE SCORE HERO TEXT */}
                <div>
                  <h1 className={`text-4xl sm:text-6xl font-black tracking-tight leading-none ${
                    isProfitable 
                      ? 'text-emerald-400 drop-shadow-[0_0_20px_rgba(52,211,153,0.4)]' 
                      : 'text-pink-500 drop-shadow-[0_0_20px_rgba(236,72,153,0.4)]'
                  }`}>
                    {isProfitable ? levelText : `${downBadScore}% DOWN BAD`}
                  </h1>
                </div>

                {/* Personality Badge Title */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-200 text-xs font-black">
                  <Award className="w-3.5 h-3.5 text-purple-400" />
                  <span>{personality.title}</span>
                </div>

                {/* Metrics Summary List (Holdings / Est PnL / Best Bag / Worst Bag) */}
                <div className="space-y-1 font-mono text-xs text-slate-300 pt-1">
                  
                  {/* Holdings with Hide Holdings Privacy Support */}
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 uppercase font-black text-[10px] w-20">Holdings:</span>
                    <strong className="text-white font-extrabold">
                      {hideHoldings ? '*****' : formatUsd(totalCurrentValueUsd)}
                    </strong>
                  </div>

                  {/* Est P&L with Hide Holdings Privacy Support */}
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 uppercase font-black text-[10px] w-20">Est. P&L:</span>
                    <strong className={`font-extrabold ${estimatedPnlUsd >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {hideHoldings ? '*****' : formatUsd(estimatedPnlUsd)}
                    </strong>
                  </div>

                  {/* Best Bag */}
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 uppercase font-black text-[10px] w-20">Best Bag:</span>
                    <strong className="text-emerald-400 font-extrabold">
                      ${biggestWinner ? biggestWinner.symbol : 'USDT'} {biggestWinner && biggestWinner.estimatedPnlPercent ? `(+${biggestWinner.estimatedPnlPercent.toFixed(0)}%)` : ''}
                    </strong>
                  </div>

                  {/* Worst Bag */}
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 uppercase font-black text-[10px] w-20">Worst Bag:</span>
                    <strong className="text-pink-400 font-extrabold">
                      ${biggestLoser ? biggestLoser.symbol : 'GRAM'} {biggestLoser && biggestLoser.estimatedPnlPercent ? `(${biggestLoser.estimatedPnlPercent.toFixed(0)}%)` : ''}
                    </strong>
                  </div>

                </div>

              </div>

              {/* RIGHT COLUMN: 100% TRANSPARENT PEDRO RACCOON NATIVE CHARACTER ART */}
              <div className="col-span-5 flex justify-end items-center relative min-h-[230px]">
                <div className="w-full max-w-[220px] h-[230px] sm:h-[250px] relative flex items-center justify-center">
                  {/* Glowing Ambient Aura Behind Pedro */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/20 via-purple-500/20 to-cyan-500/20 rounded-full blur-2xl pointer-events-none" />
                  
                  <img 
                    src={currentPedroImg} 
                    alt="Pedro Raccoon Character" 
                    className={`w-full h-full object-contain drop-shadow-[0_10px_25px_rgba(0,0,0,0.9)] scale-125 transition-all duration-500 ${
                      isShuffling ? 'scale-90 opacity-40 rotate-6' : 'scale-125 opacity-100 rotate-0'
                    }`}
                  />
                </div>
              </div>

            </div>

            {/* BOTTOM FOOTER: QR CODE ON LEFT & TMA BOT WATERMARK */}
            <div className="flex items-end justify-between border-t border-slate-800/80 pt-3 relative z-10 font-mono">
              
              {/* Bottom Left: QR Code + Referral / TMA Callout Box */}
              <div className="flex items-center gap-3 bg-slate-950/90 p-2 rounded-2xl border border-slate-800 shadow-xl">
                <div className="p-1 bg-white rounded-xl shrink-0">
                  <QRCodeSVG 
                    value="https://t.me/howdownbadareyoubot" 
                    size={46} 
                    bgColor="#ffffff" 
                    fgColor="#090a0f" 
                    level="L" 
                  />
                </div>
                <div className="space-y-0.5 text-left">
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">TELEGRAM BOT</span>
                  <span className="text-[11px] font-black text-white block tracking-tight">t.me/howdownbadareyoubot</span>
                  <span className="text-[8px] font-extrabold text-cyan-400 uppercase tracking-wider block">SCAN TO START MINI APP</span>
                </div>
              </div>

              {/* Bottom Right Watermark */}
              <div className="text-right space-y-0.5">
                <span className="text-[10px] font-black text-pink-400 uppercase tracking-widest block">
                  MADE BY GBEMICHARLES
                </span>
                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-wider block">
                  TON BLOCKCHAIN DIAGNOSIS
                </span>
              </div>

            </div>

          </div>
        </div>
        {/* ---------------- END REFERENCE MATCHED CANVAS ---------------- */}

        {/* Modal Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
          
          <button
            onClick={handlePostToXWithImage}
            disabled={isGenerating}
            className="px-4 py-3 rounded-2xl bg-black hover:bg-slate-900 border border-slate-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
          >
            <Share2 className="w-4 h-4 text-pink-400" />
            <span>POST CARD ON X 🐦</span>
          </button>

          <button
            onClick={handleCopyCardImage}
            disabled={isGenerating}
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
                <span>COPY CARD IMAGE 📋</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownloadCard}
            disabled={isGenerating}
            className="px-4 py-3 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-pink-600/30 transition-all cursor-pointer disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generating...</span>
              </>
            ) : downloadSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>SAVED CARD!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>DOWNLOAD CARD 🖼️</span>
              </>
            )}
          </button>

        </div>

      </div>
    </div>
  );
}
