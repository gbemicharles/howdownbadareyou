import React, { useEffect, useState } from 'react';
import { Send, Bot, Check, ExternalLink, Sparkles } from 'lucide-react';
import { initTelegramWebApp, isInsideTelegramWebApp } from '../utils/telegramWebApp';

export default function TelegramMiniAppBanner() {
  const [inTelegram, setInTelegram] = useState(false);

  useEffect(() => {
    initTelegramWebApp();
    setInTelegram(isInsideTelegramWebApp());
  }, []);

  const handleOpenTelegramBot = () => {
    window.open('https://t.me/howdownbadareyoubot', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-gradient-to-r from-blue-950/50 via-slate-900/80 to-purple-950/50 border border-blue-500/30 rounded-3xl p-5 sm:p-6 space-y-4 my-6 shadow-xl relative overflow-hidden backdrop-blur-md">
      
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
        
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 p-0.5 shadow-lg shadow-cyan-500/30 shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Send className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h3 className="text-base font-black text-white tracking-tight">
                TELEGRAM MINI APP & BOT 🤖📲
              </h3>
              {inTelegram ? (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase flex items-center gap-1 border border-emerald-500/30">
                  <Check className="w-3 h-3" />
                  Inside TMA
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-300 text-[10px] font-black uppercase border border-blue-500/30">
                  Ready for TMA
                </span>
              )}
            </div>
            <p className="text-xs font-bold text-slate-400">
              Run live Telegram group bot roasts with <code className="text-cyan-300 bg-slate-900 px-1.5 py-0.5 rounded font-mono">/roast &lt;address&gt;</code>!
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenTelegramBot}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer shrink-0"
        >
          <Bot className="w-4 h-4" />
          <span>OPEN IN TELEGRAM 🤖</span>
        </button>

      </div>

    </div>
  );
}
