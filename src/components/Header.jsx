import React from 'react';
import { Skull, ShieldCheck, Swords } from 'lucide-react';

export default function Header({ onReset, onOpenDuel }) {
  return (
    <header className="w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between">
        
        {/* Logo */}
        <button 
          onClick={onReset}
          className="flex items-center gap-2.5 group focus:outline-none cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-600 to-purple-600 flex items-center justify-center shadow-lg shadow-pink-500/20 group-hover:scale-105 transition-transform">
            <Skull className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            HOW DOWN BAD ARE YOU? <span className="text-pink-500">💀</span>
          </span>
        </button>

        {/* Action Bar */}
        <div className="flex items-center gap-3">
          
          <button
            onClick={onOpenDuel}
            className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-purple-600/30 to-pink-600/30 border border-purple-500/40 hover:from-purple-600/50 hover:to-pink-600/50 text-white font-extrabold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
          >
            <Swords className="w-3.5 h-3.5 text-pink-400" />
            <span className="hidden sm:inline">WALLET DUEL ⚔️</span>
            <span className="sm:hidden">DUEL ⚔️</span>
          </button>

          {/* Security Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="hidden md:inline">100% Read-Only Wallet Analysis</span>
            <span className="md:hidden">Read-Only</span>
          </div>

        </div>

      </div>
    </header>
  );
}
