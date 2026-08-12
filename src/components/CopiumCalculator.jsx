import React, { useState } from 'react';
import { Flame, Sparkles, TrendingUp, Zap, HelpCircle } from 'lucide-react';
import { getCopiumRoast } from '../../server/services/copiumEngine';

export default function CopiumCalculator({ copiumMetrics, totalCurrentValueUsd = 0, biggestBag, positions = [] }) {
  const [dose, setDose] = useState(50); // Default 50% copium intake

  // Fallback calculation if copiumMetrics object is missing
  const currentUsd = copiumMetrics?.currentTotalUsd ?? totalCurrentValueUsd ?? 0;
  const athUsd = copiumMetrics?.totalAthUsd ?? (currentUsd > 0 ? currentUsd * 3.5 : 5000);
  const topSymbol = biggestBag ? biggestBag.symbol : (positions.length > 0 ? positions[0].symbol : "TON");

  const { title, simulatedUsd, roast } = getCopiumRoast(dose, currentUsd, athUsd, topSymbol);

  const formatUsd = (num) => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(num || 0);

  const gainMultiplier = currentUsd > 0 ? (simulatedUsd / currentUsd).toFixed(1) : (1 + (dose / 20)).toFixed(1);

  const positionList = copiumMetrics?.positions || positions || [];

  return (
    <div className="bg-slate-950/80 border border-purple-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden my-8 backdrop-blur-md">
      
      {/* Ambient background glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-pink-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Title Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-600 p-0.5 shadow-lg shadow-purple-500/30 shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Flame className="w-5 h-5 text-pink-400 animate-pulse" />
            </div>
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-2">
              COPIUM ATH SIMULATOR 🧪💨
            </h3>
            <p className="text-xs font-bold text-slate-400">
              Drag the Copium Slider to see what your wallet is worth if tokens return to ATH!
            </p>
          </div>
        </div>

        <div className="px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 font-mono text-xs font-black shadow-inner shrink-0">
          {gainMultiplier}x Multiplier
        </div>
      </div>

      {/* Dual Value Display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
        
        {/* Real Current Value */}
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl space-y-1">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block">
            Brutal Reality (Current Value) 💀
          </span>
          <span className="text-2xl font-black text-white font-mono block">
            {formatUsd(currentUsd)}
          </span>
          <span className="text-[10px] text-slate-500 font-bold block">
            Live On-Chain Balance
          </span>
        </div>

        {/* Simulated Copium ATH Value */}
        <div className="bg-gradient-to-br from-purple-950/50 to-pink-950/50 border border-purple-500/40 p-4 rounded-2xl space-y-1 relative shadow-lg shadow-purple-500/10">
          <span className="text-xs font-extrabold uppercase tracking-wider text-purple-300 block flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            Simulated ATH Portfolio 🚀
          </span>
          <span className="text-3xl font-black bg-gradient-to-r from-pink-400 via-purple-300 to-cyan-400 bg-clip-text text-transparent font-mono block">
            {formatUsd(simulatedUsd)}
          </span>
          <span className="text-[10px] text-purple-300 font-bold block">
            +{formatUsd(simulatedUsd - currentUsd)} Copium Boost
          </span>
        </div>

      </div>

      {/* INTERACTIVE COPIUM DOSAGE SLIDER */}
      <div className="space-y-3 relative z-10 bg-slate-900/60 p-4 sm:p-5 rounded-2xl border border-slate-800">
        <div className="flex items-center justify-between text-xs font-extrabold">
          <span className="text-slate-400 uppercase tracking-widest">COPIUM INTAKE DOSAGE:</span>
          <span className="text-pink-400 font-mono text-sm">{dose}% INHALED</span>
        </div>

        <input 
          type="range" 
          min="0" 
          max="100" 
          value={dose} 
          onChange={(e) => setDose(parseInt(e.target.value))}
          className="w-full h-3 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-pink-500 shadow-inner"
        />

        <div className="flex justify-between text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
          <span>0% (Brutal Reality)</span>
          <span>50% (Delusion)</span>
          <span>100% (Lethal Fantasy 🚀)</span>
        </div>
      </div>

      {/* DYNAMIC COPIUM ROAST DIAGNOSIS */}
      <div className="bg-gradient-to-r from-purple-900/30 via-pink-900/30 to-slate-900/60 border border-purple-500/30 p-4 rounded-2xl space-y-2 relative z-10">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          <h4 className="text-xs font-black uppercase tracking-wider text-purple-300">
            {title}
          </h4>
        </div>
        <p className="text-sm font-bold text-slate-200 italic leading-relaxed">
          "{roast}"
        </p>
      </div>

      {/* TOP ATH MULTIPLIERS PREVIEW TABLE */}
      {positionList && positionList.length > 0 && (
        <div className="space-y-2 relative z-10">
          <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400 block">
            Top Token ATH Recovery Multipliers:
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {positionList.slice(0, 4).map((pos, idx) => {
              const posAth = pos.athPriceUsd || (pos.currentPriceUsd ? pos.currentPriceUsd * 2.5 : 1.5);
              const posMult = pos.multiplier || (pos.currentPriceUsd > 0 ? (posAth / pos.currentPriceUsd).toFixed(1) : '2.5');
              return (
                <div key={idx} className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 space-y-0.5">
                  <span className="font-extrabold text-white block truncate">${pos.symbol}</span>
                  <span className="text-[10px] text-purple-400 font-mono font-bold block">
                    ATH ${posAth < 0.01 ? posAth.toFixed(5) : posAth.toFixed(2)} ({posMult}x)
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
