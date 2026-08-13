import React, { useRef, useState } from 'react';
import { exportElementToBlob } from '../utils/exportHelper.js';
import { saveImageBlob } from '../utils/mobileDownload.js';
import PedroCharacter from './PedroCharacter';
import { triggerHaptic } from '../utils/haptics.js';
import { QRCodeSVG } from 'qrcode.react';
import { X, Download, Copy, Share2, Check, Loader2, Award, ShieldCheck, ArrowLeft } from 'lucide-react';

export default function CertificateOfRektnessModal({ roastData, onClose }) {
  const certRef = useRef(null);

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
    biggestBag,
    biggestLoser,
    roasts
  } = roastData;

  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const displayAddr = (walletAddress && walletAddress.toLowerCase().endsWith('.ton'))
    ? walletAddress
    : (walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : "TON Wallet");

  const handleDownloadDiploma = async () => {
    if (!certRef.current || isGenerating) return;
    triggerHaptic('impact', 'medium');

    try {
      setIsGenerating(true);
      const blob = await exportElementToBlob(certRef.current, { backgroundColor: '#06070a' });
      if (blob) {
        await saveImageBlob(blob, `certificate-rektness-${walletAddress.slice(0, 6)}.png`);
        setDownloadSuccess(true);
        setTimeout(() => setDownloadSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Failed to generate diploma:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyDiploma = async () => {
    if (!certRef.current || isGenerating) return;
    triggerHaptic('impact', 'medium');

    try {
      setIsGenerating(true);
      const blob = await exportElementToBlob(certRef.current, { backgroundColor: '#06070a' });

      if (blob && navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 3000);
      } else if (blob) {
        await saveImageBlob(blob, `certificate-rektness-${walletAddress.slice(0, 6)}.png`);
      }
    } catch (err) {
      console.error('Failed to copy diploma image:', err);
      handleDownloadDiploma();
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePostToX = () => {
    triggerHaptic('impact', 'light');
    const tweetText = encodeURIComponent(`📜 Official Certificate of Web3 Financial Rektness!\n\nI have officially graduated from the TON Trenches with ${isProfitable ? 'PROFIT SURVIVOR' : `${downBadScore}% DOWN BAD`} status!\n\nGet your diploma at https://t.me/howdownbadareyoubot #TON #Web3`);
    const intentUrl = `https://x.com/intent/tweet?text=${tweetText}`;
    window.open(intentUrl, '_blank', 'noopener,noreferrer');
  };

  const formatUsd = (num) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num || 0);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-start pt-20 sm:pt-14 pb-24 px-3 sm:px-4 bg-black/90 backdrop-blur-lg overflow-y-auto min-h-screen">
      
      <div className="max-w-3xl w-full bg-slate-950/95 border border-amber-500/30 rounded-3xl p-4 sm:p-7 space-y-4 relative shadow-2xl mt-8 sm:mt-10 mb-24 pb-20 sm:pb-7">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 pt-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-purple-600 to-pink-600 p-0.5 shadow-lg shadow-amber-500/30 shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Award className="w-5 h-5 text-amber-400 animate-pulse" />
              </div>
            </div>
            <div>
              <h3 className="text-base sm:text-xl font-black text-white tracking-tight flex items-center gap-2">
                CERTIFICATE OF REKTNESS 📜
              </h3>
              <p className="text-[11px] sm:text-xs font-bold text-slate-400">
                Official Web3 Honorary Diploma of Financial Experience
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

        {/* ---------------- DIPLOMA CANVAS CONTAINER ---------------- */}
        <div className="overflow-hidden rounded-3xl border-2 border-amber-500/40 shadow-2xl relative">
          <div 
            ref={certRef}
            className="w-full bg-[#06070a] p-6 sm:p-10 space-y-6 relative overflow-hidden text-amber-100 font-serif min-h-[480px] flex flex-col justify-between border-8 border-[#121620]"
          >
            {/* Elegant Ornamental Borders */}
            <div className="absolute inset-2 border border-amber-500/30 pointer-events-none rounded-xl" />
            <div className="absolute inset-4 border border-amber-500/20 pointer-events-none rounded-lg" />

            {/* Top Header & Crest */}
            <div className="text-center space-y-2 relative z-10 font-sans">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 to-pink-500 p-0.5 shadow-lg shadow-amber-500/30 mx-auto">
                <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6 text-amber-400" />
                </div>
              </div>
              <h2 className="text-xs font-mono font-black text-amber-400 tracking-[0.3em] uppercase">
                TON BLOCKCHAIN ACADEMY OF DEGEN TRENCHES
              </h2>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight font-serif uppercase">
                CERTIFICATE OF REKTNESS
              </h1>
              <p className="text-[11px] font-mono text-slate-400 uppercase tracking-widest">
                THIS HONORARY DIPLOMA IS OFFICIALLY CONFERRED UPON
              </p>
            </div>

            {/* Recipient Address & Score Box */}
            <div className="text-center space-y-3 relative z-10 my-auto bg-slate-950/80 p-4 sm:p-6 rounded-2xl border border-amber-500/30">
              <div className="text-sm sm:text-xl font-mono font-extrabold text-cyan-300 tracking-wider">
                {displayAddr}
              </div>

              <div className="space-y-1">
                <div className={`text-2xl sm:text-4xl font-black font-sans tracking-tight ${
                  isProfitable ? 'text-emerald-400' : 'text-pink-500'
                }`}>
                  {isProfitable ? levelText : `${downBadScore}% DOWN BAD`}
                </div>
                <div className="text-xs sm:text-sm font-black font-sans text-amber-300 uppercase tracking-wider">
                  HONORARY TITLE: {personality.title}
                </div>
              </div>

              <p className="text-xs font-sans italic text-slate-300 max-w-lg mx-auto leading-relaxed">
                "Having survived market volatility, uncurated memecoins, and emotional damage in the TON Trenches with unwavering conviction and zero risk management."
              </p>
            </div>

            {/* Bottom Signatures & Stamp */}
            <div className="grid grid-cols-12 gap-4 items-end relative z-10 font-sans pt-2 border-t border-amber-500/20">
              
              <div className="col-span-5 space-y-1 text-left">
                <div className="text-[10px] font-mono font-black text-amber-400 uppercase">
                  DATE CONFERRED: {currentDate}
                </div>
                <div className="text-[9px] font-mono text-slate-400 block">
                  VERIFIED TON BLOCKCHAIN DIAGNOSIS
                </div>
              </div>

              {/* Center Seal */}
              <div className="col-span-2 flex justify-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 to-pink-500 p-0.5 shadow-xl flex items-center justify-center">
                  <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center p-1">
                    <QRCodeSVG value="https://t.me/howdownbadareyoubot" size={36} bgColor="#090a0f" fgColor="#f59e0b" />
                  </div>
                </div>
              </div>

              <div className="col-span-5 text-right space-y-1">
                <div className="text-[10px] font-mono font-black text-pink-400 uppercase">
                  OFFICIAL CHIEF ROASTER
                </div>
                <div className="text-[9px] font-mono text-slate-400 block">
                  GBEMICHARLES (@GBEMICHARLES)
                </div>
              </div>

            </div>

          </div>
        </div>
        {/* ---------------- END DIPLOMA CANVAS ---------------- */}

        {/* Modal Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
          
          <button
            onClick={handlePostToX}
            disabled={isGenerating}
            className="px-4 py-3 rounded-2xl bg-black hover:bg-slate-900 border border-slate-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
          >
            <Share2 className="w-4 h-4 text-amber-400" />
            <span>SHARE DIPLOMA ON X 🐦</span>
          </button>

          <button
            onClick={handleCopyDiploma}
            disabled={isGenerating}
            className="px-4 py-3 rounded-2xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            {copySuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>COPIED DIPLOMA!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-cyan-400" />
                <span>COPY DIPLOMA IMAGE 📋</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownloadDiploma}
            disabled={isGenerating}
            className="px-4 py-3 rounded-2xl bg-gradient-to-r from-amber-600 via-purple-600 to-pink-600 hover:from-amber-500 hover:to-pink-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-600/30 transition-all cursor-pointer disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generating...</span>
              </>
            ) : downloadSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>SAVED DIPLOMA!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>DOWNLOAD DIPLOMA 📜</span>
              </>
            )}
          </button>

        </div>

      </div>
    </div>
  );
}
