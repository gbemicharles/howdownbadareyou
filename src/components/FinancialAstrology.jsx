import React from 'react';
import { Sparkles, Moon, Sun, Compass, AlertCircle, ShieldAlert } from 'lucide-react';
import { generateFinancialAstrology } from '../../server/services/astrologyEngine';

export default function FinancialAstrology({ walletAddress, positions, astrologyData }) {
  const astrology = astrologyData || generateFinancialAstrology(walletAddress, positions);

  if (!astrology) return null;

  return (
    <div className="bg-slate-950/80 border border-cyan-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden my-8 backdrop-blur-md">
      
      {/* Ambient Celestial Glow */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-cyan-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-600 to-purple-600 p-0.5 shadow-lg shadow-cyan-500/30">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Moon className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
              WEB3 FINANCIAL ASTROLOGY 🔮✨
            </h3>
            <p className="text-xs font-bold text-slate-400">
              Celestial Zodiac Alignment & Daily Horoscope Warning
            </p>
          </div>
        </div>

        <div className="px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-black shadow-inner">
          {astrology.alignment}
        </div>
      </div>

      {/* Main Zodiac Sign & Trait */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 relative z-10">
        
        {/* Zodiac Sign Card */}
        <div className="sm:col-span-2 bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-purple-950/40 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
              YOUR CRYPTO ZODIAC SIGN:
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-black uppercase">
              {astrology.element}
            </span>
          </div>

          <h2 className="text-2xl font-black bg-gradient-to-r from-cyan-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
            {astrology.zodiacSign}
          </h2>

          <p className="text-xs text-slate-300 font-bold leading-relaxed">
            "{astrology.trait}"
          </p>
        </div>

        {/* Lucky & Unlucky Tokens */}
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl space-y-3 flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 block">
              LUCKY TOKEN 🌟
            </span>
            <span className="text-base font-black text-white font-mono block">
              ${astrology.luckyToken}
            </span>
          </div>

          <div className="space-y-1 border-t border-slate-800/80 pt-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-red-400 block">
              UNLUCKY TOKEN 🪐
            </span>
            <span className="text-base font-black text-red-400 font-mono block">
              ${astrology.unluckyToken}
            </span>
          </div>
        </div>

      </div>

      {/* Daily Horoscope Warning Quote */}
      <div className="bg-gradient-to-r from-cyan-950/40 via-purple-950/40 to-slate-900/60 border border-cyan-500/30 p-4.5 rounded-2xl space-y-1.5 relative z-10">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <h4 className="text-xs font-black uppercase tracking-wider text-cyan-300">
            DAILY HOROSCOPE WARNING:
          </h4>
        </div>
        <p className="text-xs sm:text-sm font-bold text-cyan-100 italic leading-relaxed">
          "{astrology.dailyWarning}"
        </p>
      </div>

    </div>
  );
}
