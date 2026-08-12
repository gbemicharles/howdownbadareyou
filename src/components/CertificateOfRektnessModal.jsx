import React, { useRef, useState } from 'react';
import { toPng, toBlob } from 'html-to-image';
import { QRCodeSVG } from 'qrcode.react';
import { X, Download, Share2, Award, Sparkles, Check, Loader2, ShieldCheck, Copy, Feather } from 'lucide-react';

export default function CertificateOfRektnessModal({ roastData, onClose }) {
  const certRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const { walletAddress, downBadScore, isProfitable, personality, estimatedPnlUsd, roasts } = roastData;

  // Determine Certificate Rank Title
  let rankTitle = "CERTIFIED EXIT LIQUIDITY PROVIDER";
  if (isProfitable || downBadScore === 0) {
    rankTitle = "ORDER OF THE BREAKEVEN CHAMPION";
  } else if (downBadScore >= 80) {
    rankTitle = "GRANDMASTER EXIT LIQUIDITY PROVIDER";
  } else if (downBadScore >= 50) {
    rankTitle = "SENIOR BAG COLLECTOR & COPIUM INHALER";
  } else {
    rankTitle = "HONORARY DIAMOND HANDS SURVIVOR";
  }

  const formatUsd = (num) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num || 0);

  const handleDownloadCert = async () => {
    if (!certRef.current || isGenerating) return;

    try {
      setIsGenerating(true);
      const dataUrl = await toPng(certRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#0c0a06'
      });

      const link = document.createElement('a');
      link.download = `certificate-of-rektness-${walletAddress.slice(0, 6)}.png`;
      link.href = dataUrl;
      link.click();

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to generate certificate:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyCert = async () => {
    if (!certRef.current || isGenerating) return;

    try {
      setIsGenerating(true);
      const blob = await toBlob(certRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#0c0a06'
      });

      if (blob && navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 3000);
      } else {
        handleDownloadCert();
      }
    } catch (err) {
      console.error('Failed to copy certificate:', err);
      handleDownloadCert();
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShareCertOnX = () => {
    const tweetText = encodeURIComponent(`📜 OFFICIAL CERTIFICATE OF REKTNESS 📜\n\nThis certifies that TON Wallet ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)} has officially achieved ${downBadScore}% Down Bad score!\n\nRank: ${rankTitle}\nGet your certificate on Telegram at https://t.me/howdownbadareyoubot 💀 #TON #Web3`);
    const intentUrl = `https://x.com/intent/tweet?text=${tweetText}`;
    window.open(intentUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg overflow-y-auto">
      
      <div className="max-w-2xl w-full bg-slate-950/95 border border-amber-500/30 rounded-3xl p-5 sm:p-7 space-y-5 relative shadow-2xl my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-purple-600 to-pink-600 p-0.5 shadow-lg shadow-amber-500/30">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Award className="w-5 h-5 text-amber-400 animate-pulse" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                OFFICIAL CERTIFICATE OF REKTNESS 📜
              </h3>
              <p className="text-xs font-bold text-slate-400">
                Cyber Parchment Diploma with Telegram Mini App QR Code!
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

        {/* ---------------- CERTIFICATE PARCHMENT CANVAS ---------------- */}
        <div className="overflow-hidden rounded-3xl border-2 border-amber-500/40 shadow-[0_0_50px_rgba(245,158,11,0.15)] relative">
          <div 
            ref={certRef}
            className="w-full bg-[#0c0a04] p-6 sm:p-9 space-y-6 relative text-amber-100 font-serif overflow-hidden border-8 border-[#171408]"
            style={{
              backgroundImage: 'radial-gradient(at 50% 10%, rgba(245,158,11,0.15) 0px, transparent 60%), radial-gradient(at 50% 90%, rgba(139,92,246,0.15) 0px, transparent 60%)'
            }}
          >
            {/* Corner Decorative Borders */}
            <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-amber-500/60 pointer-events-none" />
            <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-amber-500/60 pointer-events-none" />
            <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-amber-500/60 pointer-events-none" />
            <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-amber-500/60 pointer-events-none" />

            {/* Header Title */}
            <div className="text-center space-y-1 font-sans">
              <div className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-400">
                TON BLOCKCHAIN ON-CHAIN DIPLOMA
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase border-b border-amber-500/30 pb-3">
                CERTIFICATE OF REKTNESS 📜
              </h1>
            </div>

            {/* Recipient & Rank */}
            <div className="text-center space-y-3 font-sans py-2">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">THIS OFFICIAL CERTIFICATE IS PROUDLY PRESENTED TO:</p>
              
              <div className="font-mono text-sm sm:text-base font-extrabold text-amber-300 bg-amber-500/10 py-1.5 px-4 rounded-xl border border-amber-500/30 inline-block">
                {walletAddress}
              </div>

              <div className="pt-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-purple-300 block">AWARDED DEGREE RANK:</span>
                <h2 className="text-lg sm:text-xl font-black bg-gradient-to-r from-amber-300 via-pink-400 to-purple-300 bg-clip-text text-transparent tracking-wide">
                  {rankTitle}
                </h2>
              </div>
            </div>

            {/* Citation Statement */}
            <div className="bg-amber-500/5 border border-amber-500/20 p-4 rounded-2xl text-center space-y-1 font-sans">
              <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider block">OFFICIAL CITATION:</span>
              <p className="text-xs font-bold text-slate-300 italic leading-relaxed">
                "Having demonstrated legendary conviction by holding positions through -90% drops, inhaling unmeasured quantities of Copium, and selflessly providing exit liquidity to devs in need, this wallet is hereby granted everlasting Web3 distinction."
              </p>
            </div>

            {/* Signatures, Gold Seal & QR Code Row */}
            <div className="grid grid-cols-3 gap-2 items-center pt-4 border-t border-amber-500/30 text-center font-sans text-xs">
              
              {/* Signature A */}
              <div className="space-y-1 text-left">
                <span className="text-base font-serif italic text-amber-200 block font-bold">Pavel Durov</span>
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Founder, Telegram / TON</span>
                <span className="text-[8px] font-extrabold text-amber-400/80 uppercase block pt-1 font-mono">MADE BY GBEMICHARLES</span>
              </div>

              {/* Gold Seal */}
              <div className="flex justify-center">
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-500 p-1 shadow-lg shadow-amber-500/30 flex items-center justify-center">
                  <div className="w-full h-full rounded-full bg-[#0c0a04] border border-amber-400 flex flex-col items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-amber-400" />
                    <span className="text-[7px] font-black text-amber-300 tracking-widest uppercase">VERIFIED</span>
                  </div>
                </div>
              </div>

              {/* DYNAMIC TELEGRAM BOT QR CODE */}
              <div className="flex flex-col items-end gap-1">
                <div className="p-1 bg-[#0c0a04] border border-amber-500/40 rounded-xl shadow-md">
                  <QRCodeSVG 
                    value="https://t.me/howdownbadareyoubot" 
                    size={52} 
                    bgColor="#0c0a04" 
                    fgColor="#fbbf24" 
                    level="L" 
                  />
                </div>
                <span className="text-[8px] font-black text-amber-400 tracking-widest uppercase font-mono">
                  T.ME/HOWDOWNBADAREYOUBOT
                </span>
              </div>

            </div>

          </div>
        </div>
        {/* ---------------- END PARCHMENT CANVAS ---------------- */}

        {/* Modal Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
          
          <button
            onClick={handleDownloadCert}
            disabled={isGenerating}
            className="px-4 py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-purple-600 hover:from-amber-500 hover:to-purple-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-600/30 transition-all cursor-pointer disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generating...</span>
              </>
            ) : downloadSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>CERTIFICATE SAVED!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>DOWNLOAD DIPLOMA 📜</span>
              </>
            )}
          </button>

          <button
            onClick={handleCopyCert}
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
                <span>COPY DIPLOMA 📋</span>
              </>
            )}
          </button>

          <button
            onClick={handleShareCertOnX}
            className="px-4 py-3 rounded-2xl bg-black hover:bg-slate-900 border border-slate-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
          >
            <Share2 className="w-4 h-4 text-pink-400" />
            <span>SHARE ON X 🐦</span>
          </button>

        </div>

      </div>
    </div>
  );
}
