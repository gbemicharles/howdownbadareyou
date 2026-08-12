import React, { useState, useEffect } from 'react';
import { Skull, ArrowLeft } from 'lucide-react';

const LOADING_MESSAGES = [
  "Scanning wallet...",
  "Checking your bags...",
  "Finding your worst decisions...",
  "Calculating emotional damage...",
  "Preparing the roast..."
];

export default function LoadingScreen({ address, onCancel }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progressPercent, setProgressPercent] = useState(15);

  useEffect(() => {
    // Cycle through messages naturally over ~2.5 seconds total
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < LOADING_MESSAGES.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 500);

    const progressInterval = setInterval(() => {
      setProgressPercent((prev) => {
        if (prev < 95) {
          return prev + Math.floor(Math.random() * 15) + 8;
        }
        return 95;
      });
    }, 300);

    return () => {
      clearInterval(interval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-140px)] px-4 relative overflow-hidden cyber-scanlines">
      
      {/* Glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full text-center space-y-8 relative z-10">
        
        {/* Animated Radar/Skull Scanner */}
        <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
          
          {/* Radar Rotating Beam */}
          <div className="absolute inset-0 rounded-full border border-pink-500/30 p-1">
            <div className="w-full h-full rounded-full border border-pink-500/20 relative overflow-hidden">
              <div className="absolute inset-0 origin-center bg-gradient-to-tr from-pink-500/40 via-transparent to-transparent animate-radar" />
            </div>
          </div>

          {/* Central Skull Icon */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-600 to-purple-700 flex items-center justify-center shadow-xl shadow-pink-500/30 animate-pulse">
            <Skull className="w-10 h-10 text-white" />
          </div>
        </div>

        {/* Address Display */}
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-pink-400">
            Analyzing TON Address
          </p>
          <p className="font-mono text-sm text-slate-300 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800 inline-block max-w-xs truncate">
            {address}
          </p>
        </div>

        {/* Loading Step Message */}
        <div className="space-y-3">
          <div className="h-8 flex items-center justify-center">
            <p className="text-xl font-black text-white tracking-wide transition-all animate-pulse">
              {LOADING_MESSAGES[currentStepIndex]}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800 p-0.5">
            <div 
              className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Bottom Funny Hint */}
        <p className="text-xs text-slate-500 italic">
          Hold on tight. Financial truths can be painful. 💀
        </p>

        {/* Cancel Button */}
        {onCancel && (
          <button
            onClick={onCancel}
            className="mt-2 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 font-bold text-xs transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Cancel
          </button>
        )}

      </div>
    </div>
  );
}
