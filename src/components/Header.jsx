import React from 'react';
import { Skull, ShieldCheck, Swords } from 'lucide-react';
import { triggerHaptic } from '../utils/haptics.js';

export default function Header({ onReset, onOpenDuel }) {
  const handleLogoClick = () => {
    triggerHaptic('selection');
    onReset();
  };

  const handleDuelClick = () => {
    triggerHaptic('impact', 'medium');
    onOpenDuel();
  };

  return (
    <header className="w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md sticky top-0 z-40 pt-10 sm:pt-3 pb-2.5 px-3 sm:px-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
        
        {/* Logo */}
        <button 
          onClick={handleLogoClick}
          className="flex items-center gap-2 group focus:outline-none cursor-pointer min-w-0"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-pink-600 to-purple-600 flex items-center justify-center shadow-lg shadow-pink-500/20 group-hover:scale-105 transition-transform shrink-0">
            <Skull className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <span className="font-black text-sm sm:text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent truncate">
            HOW DOWN BAD ARE YOU? <span className="text-pink-500">💀</span>
          </span>
        </button>

        {/* Action Bar */}
        <div className="flex items-center gap-2 shrink-0">
          
          <button
            onClick={handleDuelClick}
            className="px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-600/30 to-pink-600/30 border border-purple-500/40 hover:from-purple-600/50 hover:to-pink-600/50 text-white font-extrabold text-[11px] sm:text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
          >
            <Swords className="w-3.5 h-3.5 text-pink-400" />
            <span>DUEL ⚔️</span>
          </button>

          {/* Security Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Read-Only</span>
          </div>

        </div>

      </div>
    </header>
  );
}
