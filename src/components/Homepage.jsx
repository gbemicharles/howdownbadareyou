import React, { useState } from 'react';
import { Flame, ShieldAlert, Sparkles, ArrowRight, AlertCircle } from 'lucide-react';
import { isValidTonAddress, sanitizeTonAddress } from '../../server/services/tonProvider.js';
import TelegramMiniAppBanner from './TelegramMiniAppBanner.jsx';

export default function Homepage({ onSubmitAddress }) {
  const [addressInput, setAddressInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const sanitized = sanitizeTonAddress(addressInput);

    if (!sanitized) {
      setErrorMsg("Please paste a TON wallet address or TON DNS domain first bro 💀");
      return;
    }

    if (!isValidTonAddress(sanitized)) {
      setErrorMsg("That’s not a valid TON wallet address or DNS domain bro 💀");
      return;
    }

    setErrorMsg('');
    onSubmitAddress(sanitized);
  };

  const handleInputFocus = (e) => {
    // Auto-scroll input to center so soft keyboard never covers it on mobile
    setTimeout(() => {
      e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 150);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4 py-8 sm:py-12 relative overflow-hidden pb-32 sm:pb-12">
      
      {/* Background Decorative Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/3 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-2xl w-full text-center relative z-10 space-y-6">
        
        {/* Meme Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400 text-xs font-bold uppercase tracking-wider animate-pulse-fast">
          <Sparkles className="w-3.5 h-3.5" />
          TON Blockchain Roast Engine v1.0 💀
        </div>

        {/* Hero Headlines */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-none bg-gradient-to-br from-white via-slate-100 to-slate-400 bg-clip-text text-transparent drop-shadow-sm">
            HOW DOWN BAD ARE YOU? <span className="inline-block animate-bounce text-pink-500">💀</span>
          </h1>
          <p className="text-base sm:text-xl text-slate-400 font-medium max-w-lg mx-auto leading-relaxed">
            Paste your TON wallet address or TON DNS and let us investigate your financial decisions.
          </p>
        </div>

        {/* Address Input Form */}
        <div className="glass-panel p-3 sm:p-4 rounded-2xl shadow-2xl border border-slate-800 space-y-4">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={addressInput}
                onFocus={handleInputFocus}
                onChange={(e) => {
                  setAddressInput(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="Paste your TON wallet address (EQ... or UQ... or .ton)"
                className={`w-full px-4 py-3.5 rounded-xl bg-slate-900/90 text-white placeholder-slate-500 border ${
                  errorMsg ? 'border-red-500 focus:ring-red-500' : 'border-slate-700/80 focus:border-pink-500'
                } focus:outline-none focus:ring-2 focus:ring-pink-500/30 font-mono text-sm sm:text-base transition-all`}
              />
            </div>
            
            <button
              type="submit"
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white font-extrabold text-base flex items-center justify-center gap-2 shadow-lg shadow-pink-600/30 hover:shadow-pink-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
            >
              <span>ROAST MY WALLET</span>
              <Flame className="w-5 h-5 text-pink-300" />
            </button>
          </form>

          {errorMsg && (
            <div className="flex items-center gap-2 text-red-400 text-xs font-bold bg-red-500/10 p-2.5 rounded-xl border border-red-500/20 text-left">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Telegram Group Bot Command Banner */}
        <TelegramMiniAppBanner />

        {/* Privacy Assurance */}
        <div className="flex items-center justify-center gap-2 text-xs font-mono text-slate-500 pt-2">
          <ShieldAlert className="w-4 h-4 text-emerald-400" />
          <span>100% Read-Only Blockchain Inspection. No transactions requested.</span>
        </div>

      </div>

    </div>
  );
}
