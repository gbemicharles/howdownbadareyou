import React, { useRef, useState, useEffect } from 'react';
import { toBlob } from 'html-to-image';
import { saveImageBlob } from '../utils/mobileDownload.js';
import { inlineContainerImages } from '../utils/imagePreloader.js';
import { PEDRO_DATA_URIS } from '../assets/pedroDataURIs.js';
import { PEDRO_ASSETS } from '../assets/pedroAssets.js';
import { triggerHaptic } from '../utils/haptics.js';
import { Download, Check, Loader2, Smile, Shuffle, ExternalLink } from 'lucide-react';

const PEDRO_KEYS = ['rockstar', 'rekt', 'copium', 'wizard', 'clown', 'diamond', 'rocket'];

const PEDRO_CHARACTER_ARTS = {
  rockstar: {
    title: "🎤 Rockstar Pedro",
    quote: "Singing through -90% Down Bad losses!"
  },
  rekt: {
    title: "😭 Devastated Rekt Pedro",
    quote: "100% Down Bad & Liquidated!"
  },
  copium: {
    title: "🧪 Copium Inhaler Pedro",
    quote: "Inhaling 99% Pure Down Bad Copium!"
  },
  wizard: {
    title: "🔮 Wizard Astrology Pedro",
    quote: "Foreseeing ATH Recovery from Down Bad!"
  },
  clown: {
    title: "🤡 Clown Circus Pedro",
    quote: "Honk Honk Down Bad Degen Circus!"
  },
  diamond: {
    title: "💎 Diamond Hands Pedro",
    quote: "Holding Heavy Down Bad Bags!"
  },
  rocket: {
    title: "🚀 Rocket Blast Pedro",
    quote: "Surviving the Down Bad Trenches!"
  }
};

export default function TelegramStickerGenerator({ roastData }) {
  const stickerRef = useRef(null);
  const [pedroKeyIndex, setPedroKeyIndex] = useState(0);
  const [isShuffling, setIsShuffling] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const { walletAddress, downBadScore, isProfitable, personality } = roastData;

  useEffect(() => {
    handleRandomizeSticker();
  }, []);

  const handleRandomizeSticker = () => {
    triggerHaptic('selection');
    setIsShuffling(true);
    const randomIndex = Math.floor(Math.random() * PEDRO_KEYS.length);
    setPedroKeyIndex(randomIndex);
    setTimeout(() => setIsShuffling(false), 400);
  };

  const activeKey = PEDRO_KEYS[pedroKeyIndex] || 'rockstar';
  const mascot = PEDRO_CHARACTER_ARTS[activeKey] || PEDRO_CHARACTER_ARTS.rockstar;
  const pedroImgUri = PEDRO_DATA_URIS[activeKey] || PEDRO_ASSETS[activeKey] || PEDRO_DATA_URIS.rockstar;

  const displayAddr = (walletAddress && walletAddress.toLowerCase().endsWith('.ton'))
    ? walletAddress
    : (walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : "TON Wallet");

  const generateStickerBlob = async () => {
    if (!stickerRef.current) return null;
    
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }

    await inlineContainerImages(stickerRef.current);
    await new Promise(r => setTimeout(r, 100));

    return await toBlob(stickerRef.current, {
      pixelRatio: 2,
      width: 512,
      height: 512,
      backgroundColor: '#090a0f'
    });
  };

  const handleSaveAndOpenStickersBot = async () => {
    if (!stickerRef.current || isGenerating) return;
    triggerHaptic('impact', 'medium');
    try {
      setIsGenerating(true);
      const blob = await generateStickerBlob();
      if (blob) {
        await saveImageBlob(blob, `downbad-sticker-${walletAddress.slice(0, 6)}.png`);
        setDownloadSuccess(true);
        setTimeout(() => setDownloadSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Failed to save sticker:', err);
    } finally {
      setIsGenerating(false);
    }

    const tg = window.Telegram?.WebApp;
    if (tg?.openTelegramLink) {
      tg.openTelegramLink('https://t.me/Stickers');
    } else {
      window.open('https://t.me/Stickers', '_blank', 'noopener,noreferrer');
    }
  };

  const handleDownloadSticker = async () => {
    if (!stickerRef.current || isGenerating) return;
    triggerHaptic('impact', 'medium');

    try {
      setIsGenerating(true);
      const blob = await generateStickerBlob();
      if (blob) {
        await saveImageBlob(blob, `downbad-sticker-${walletAddress.slice(0, 6)}.png`);
        setDownloadSuccess(true);
        setTimeout(() => setDownloadSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Failed to generate sticker:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-slate-950/80 border border-pink-500/30 rounded-3xl p-5 sm:p-7 space-y-6 shadow-2xl relative overflow-hidden backdrop-blur-md">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-600 to-purple-600 p-0.5 shadow-lg shadow-pink-500/30 shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Smile className="w-5 h-5 text-pink-400 animate-pulse" />
            </div>
          </div>
          <div>
            <h3 className="text-base sm:text-xl font-black text-white tracking-tight flex items-center gap-2">
              TELEGRAM STICKER GENERATOR 🖼️
            </h3>
            <p className="text-xs font-bold text-slate-400">
              Export 512x512 PNG stickers to upload to Telegram's @Stickers bot!
            </p>
          </div>
        </div>

        <button
          onClick={handleRandomizeSticker}
          disabled={isShuffling}
          className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-extrabold text-xs flex items-center gap-1.5 hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <Shuffle className={`w-3.5 h-3.5 ${isShuffling ? 'animate-spin' : ''}`} />
          <span>RANDOMIZE PEDRO 🎲</span>
        </button>
      </div>

      {/* 512x512 STICKER CANVAS PREVIEW WITH SCALED OUTER WRAPPER */}
      <div className="flex justify-center">
        <div className="overflow-hidden rounded-3xl border-2 border-pink-500/40 shadow-2xl w-[340px] h-[340px] relative">
          
          <div className="origin-top-left scale-[0.664] w-[512px] h-[512px]">
            
            {/* PRISTINE UNSCALED 512x512 DOM ELEMENT CAPTURED BY html-to-image */}
            <div 
              ref={stickerRef}
              className="w-[512px] h-[512px] bg-[#090a0f] p-8 space-y-6 relative overflow-hidden text-white font-sans flex flex-col justify-between"
            >
              {/* Ambient Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-b from-pink-950/40 via-purple-950/20 to-slate-950 pointer-events-none" />

              {/* Sticker Top Header */}
              <div className="flex items-center justify-between border-b border-pink-500/30 pb-3 relative z-10">
                <span className="text-xs font-black uppercase tracking-widest text-pink-400">
                  HOW DOWN BAD ARE YOU?
                </span>
                <span className="text-[11px] font-mono font-extrabold text-cyan-300">
                  {displayAddr}
                </span>
              </div>

              {/* Main Center Score & Pedro Character Artwork */}
              <div className="grid grid-cols-12 gap-4 items-center relative z-10 my-auto">
                
                <div className="col-span-7 space-y-2">
                  <h1 className={`text-5xl font-black tracking-tight ${
                    isProfitable ? 'text-emerald-400' : 'text-pink-500'
                  }`}>
                    {isProfitable ? 'SURVIVOR 🏆' : `${downBadScore}% DOWN BAD`}
                  </h1>
                  <div className="text-xs font-black text-purple-300 uppercase tracking-wider">
                    {personality.title}
                  </div>
                  <p className="text-xs font-bold text-slate-300 italic">
                    "{mascot.quote}"
                  </p>
                </div>

                {/* 100% Inline Base64 Pedro Raccoon Character */}
                <div className="col-span-5 flex justify-end items-center relative">
                  <div className="w-36 h-36 relative flex items-center justify-center filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.9)]">
                    <img 
                      src={pedroImgUri} 
                      alt={mascot.title}
                      className="w-full h-full object-contain pointer-events-none"
                    />
                  </div>
                </div>

              </div>

              {/* Sticker Bottom Watermark */}
              <div className="flex items-end justify-between border-t border-pink-500/30 pt-3 relative z-10 font-mono text-xs">
                <span className="font-extrabold text-cyan-300">T.ME/HOWDOWNBADAREYOUBOT</span>
                <span className="font-extrabold text-pink-400 uppercase">MADE BY GBEMICHARLES</span>
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        
        <button
          onClick={handleSaveAndOpenStickersBot}
          disabled={isGenerating}
          className="w-full px-4 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer disabled:opacity-50"
        >
          {isGenerating ? (
            <><Loader2 className="w-4 h-4 animate-spin" /><span>Saving sticker...</span></>
          ) : downloadSuccess ? (
            <><Check className="w-4 h-4 text-emerald-400" /><span>SAVED! Opening @Stickers bot...</span></>
          ) : (
            <><ExternalLink className="w-4 h-4" /><span>SAVE & OPEN @Stickers BOT ✈️</span></>
          )}
        </button>

        <button
          onClick={handleDownloadSticker}
          disabled={isGenerating}
          className="w-full px-4 py-3.5 rounded-2xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300 font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
        >
          <Download className="w-4 h-4 text-pink-400" />
          <span>JUST SAVE STICKER (512×512)</span>
        </button>

      </div>

    </div>
  );
}
