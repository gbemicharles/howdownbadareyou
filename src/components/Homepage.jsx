import React, { useState } from 'react';
import { Flame, ShieldAlert, Sparkles, ArrowRight, AlertCircle } from 'lucide-react';
import { isValidTonAddress, sanitizeTonAddress, DEMO_WALLETS } from '../../server/services/tonProvider.js';
import TelegramMiniAppBanner from './TelegramMiniAppBanner.jsx';

export default function Homepage({ onSubmitAddress, onSelectDemo }) {
  const [addressInput, setAddressInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const sanitized = sanitizeTonAddress(addressInput);

    if (!sanitized) {
      setErrorMsg("Please paste a TON wallet address first bro 💀");
      return;
    }

    if (!isValidTonAddress(sanitized)) {
      setErrorMsg("That’s not a TON wallet bro 💀");
      return;
    }

    setErrorMsg('');
    onSubmitAddress(sanitized);
  };

  const handleDemoClick = (demoAddress) => {
    setErrorMsg('');
    setAddressInput(demoAddress);
    onSelectDemo(demoAddress);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4 py-12 relative overflow-hidden">
      
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
            Paste your TON wallet address and let us investigate your financial decisions.
          </p>
        </div>

        {/* Address Input Form */}
        <div className="glass-panel p-3 sm:p-4 rounded-2xl shadow-2xl border border-slate-800 space-y-4">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={addressInput}
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
              <Flame className="w-5 h-5 fill-current" />
            </button>
          </form>

          {/* Validation Error Message */}
          {errorMsg && (
            <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-bold animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Security Disclaimer */}
          <div className="flex items-center justify-center gap-2 text-xs text-slate-400 pt-1">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Read-only wallet analysis. Never enter your seed phrase or private key.</span>
          </div>
        </div>

        {/* FEATURE #6: TELEGRAM MINI APP BANNER */}
        <TelegramMiniAppBanner />

        {/* Demo Wallets Selection */}
        <div className="space-y-3 pt-2">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Don't have a wallet handy? Try a Demo Wallet:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {Object.values(DEMO_WALLETS).map((demo) => (
              <button
                key={demo.address}
                onClick={() => handleDemoClick(demo.address)}
                className="px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-pink-500/50 text-xs font-semibold text-slate-300 hover:text-white transition-all flex items-center gap-1.5 group cursor-pointer"
              >
                <span>{demo.label}</span>
                <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-pink-400 group-hover:translate-x-0.5 transition-all" />
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
