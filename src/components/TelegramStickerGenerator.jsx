import React, { useRef, useState, useEffect } from 'react';
import { toPng, toBlob } from 'html-to-image';
import { Download, Check, Loader2, Copy, Smile, Shuffle } from 'lucide-react';

const PEDRO_KEYS = ['rockstar', 'rekt', 'copium', 'wizard', 'clown', 'diamond', 'rocket'];

const PEDRO_CHARACTER_ARTS = {
  rockstar: {
    title: "🎤 Rockstar Pedro",
    image: "/assets/pedro/nobg/pedro_rockstar.png",
    quote: "Singing through -90% Down Bad losses!"
  },
  rekt: {
    title: "😭 Devastated Rekt Pedro",
    image: "/assets/pedro/nobg/pedro_rekt.png",
    quote: "100% Down Bad & Liquidated!"
  },
  copium: {
    title: "🧪 Copium Inhaler Pedro",
    image: "/assets/pedro/nobg/pedro_copium.png",
    quote: "Inhaling 99% Pure Down Bad Copium!"
  },
  wizard: {
    title: "🔮 Wizard Astrology Pedro",
    image: "/assets/pedro/nobg/pedro_wizard.png",
    quote: "Foreseeing ATH Recovery from Down Bad!"
  },
  clown: {
    title: "🤡 Clown Circus Pedro",
    image: "/assets/pedro/nobg/pedro_clown.png",
    quote: "Honk Honk Down Bad Degen Circus!"
  },
  diamond: {
    title: "💎 Diamond Hands Pedro",
    image: "/assets/pedro/nobg/pedro_diamond.png",
    quote: "Holding Heavy Down Bad Bags!"
  },
  rocket: {
    title: "🚀 Rocket Blast Pedro",
    image: "/assets/pedro/nobg/pedro_rocket.png",
    quote: "Surviving the Down Bad Trenches!"
  }
};

export default function TelegramStickerGenerator({ roastData }) {
  const stickerRef = useRef(null);
  const [pedroKeyIndex, setPedroKeyIndex] = useState(0);
  const [isShuffling, setIsShuffling] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const { walletAddress, downBadScore, isProfitable, estimatedPnlPercent, personality, roasts } = roastData;

  useEffect(() => {
    handleRandomizeSticker();
  }, []);

  const handleRandomizeSticker = () => {
    setIsShuffling(true);
    const randomIndex = Math.floor(Math.random() * PEDRO_KEYS.length);
    setPedroKeyIndex(randomIndex);
    setTimeout(() => setIsShuffling(false), 400);
  };

  const activeKey = PEDRO_KEYS[pedroKeyIndex] || 'rockstar';
  const mascot = PEDRO_CHARACTER_ARTS[activeKey] || PEDRO_CHARACTER_ARTS.rockstar;

  const handleDownloadSticker = async () => {
    if (!stickerRef.current || isGenerating) return;

    try {
      setIsGenerating(true);
      const dataUrl = await toPng(stickerRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        width: 512,
        height: 512,
        backgroundColor: '#090a0f'
      });

      const link = document.createElement('a');
      link.download = `downbad-sticker-${walletAddress.slice(0, 6)}.png`;
      link.href = dataUrl;
      link.click();

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to generate sticker:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopySticker = async () => {
    if (!stickerRef.current || isGenerating) return;

    try {
      setIsGenerating(true);
      const blob = await toBlob(stickerRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        width: 512,
        height: 512,
        backgroundColor: '#090a0f'
      });

      if (blob && navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 3000);
      } else {
        handleDownloadSticker();
      }
    } catch (err) {
      console.error('Failed to copy sticker:', err);
      handleDownloadSticker();
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-slate-950/80 border border-pink-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden my-8 backdrop-blur-md">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-600 via-purple-600 to-cyan-400 p-0.5 shadow-lg shadow-pink-500/30">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-xl overflow-hidden p-1">
              <img 
                src={mascot.image} 
                alt="Pedro Raccoon" 
                className="w-full h-full object-contain" 
              />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
              HOW DOWN BAD ARE YOU TELEGRAM STICKER 🦝📦
            </h3>
            <p className="text-xs font-bold text-slate-400">
              Export 512x512 Telegram Meme Stickers for your Down Bad wallet score!
            </p>
          </div>
        </div>

        <button
          onClick={handleRandomizeSticker}
          disabled={isShuffling}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer disabled:opacity-50"
        >
          <Shuffle className={`w-3.5 h-3.5 ${isShuffling ? 'animate-spin' : ''}`} />
          <span>RANDOMIZE STICKER 🎲</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center relative z-10">
        
        {/* 512x512 STICKER CANVAS PREVIEW */}
        <div className="flex justify-center">
          <div 
            ref={stickerRef}
            className="w-[280px] h-[280px] sm:w-[340px] sm:h-[340px] bg-[#090a0f] border-2 border-slate-800 rounded-3xl p-5 flex flex-col justify-between items-center text-center relative overflow-hidden shadow-2xl"
          >
            {/* 100% TRANSPARENT PEDRO RACCOON CHARACTER ARTWORK */}
            <div className="w-36 h-36 sm:w-44 sm:h-44 relative flex items-center justify-center -my-1">
              <img 
                src={mascot.image} 
                alt="Pedro Raccoon Pose" 
                className={`w-full h-full object-contain drop-shadow-[0_0_25px_rgba(236,72,153,0.5)] scale-110 transition-all duration-300 ${
                  isShuffling ? 'scale-90 opacity-40 rotate-6' : 'scale-110 opacity-100 rotate-0'
                }`}
              />
            </div>

            {/* Score & Title */}
            <div className="space-y-0.5">
              <h2 className={`text-2xl sm:text-3xl font-black font-mono tracking-tight ${
                isProfitable ? 'text-emerald-400' : 'text-white'
              }`}>
                {isProfitable 
                  ? `+${Math.round(estimatedPnlPercent || 0)}% UP BAD` 
                  : (downBadScore === 0 ? '0% DOWN BAD' : `${downBadScore}% DOWN BAD`)}
              </h2>
              <span className="text-[9px] font-black uppercase tracking-widest text-pink-400 block bg-slate-900/90 px-3 py-0.5 rounded-full border border-slate-800">
                {personality.title}
              </span>
            </div>

            {/* Short Quote */}
            <p className="text-[10px] font-bold text-slate-300 italic px-2 leading-tight">
              "{mascot.quote}"
            </p>

            {/* Watermark Footer */}
            <div className="text-[8px] font-extrabold text-slate-500 uppercase tracking-widest pt-1 border-t border-slate-800/80 w-full flex justify-between font-mono">
              <span>T.ME/HOWDOWNBADAREYOUBOT</span>
              <span>MADE BY GBEMICHARLES</span>
            </div>
          </div>
        </div>

        {/* CONTROLS & DESCRIPTION */}
        <div className="space-y-4">
          <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
            <span className="font-extrabold text-purple-300 uppercase tracking-wider block">
              YOUR DOWN BAD STICKER: {mascot.title}
            </span>
            <p className="text-slate-400 font-medium leading-relaxed">
              Click <strong>RANDOMIZE STICKER 🎲</strong> to shuffle Pedro raccoon poses, then export your 512x512 PNG Telegram sticker to share your Down Bad score in chat groups!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              onClick={handleDownloadSticker}
              disabled={isGenerating}
              className="px-4 py-3.5 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-pink-600/30 transition-all cursor-pointer disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Exporting...</span>
                </>
              ) : downloadSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>SAVED STICKER!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>EXPORT STICKER (512x512) 📦</span>
                </>
              )}
            </button>

            <button
              onClick={handleCopySticker}
              disabled={isGenerating}
              className="px-4 py-3.5 rounded-2xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {copySuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>COPIED TO CLIPBOARD!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-cyan-400" />
                  <span>COPY STICKER 📋</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
