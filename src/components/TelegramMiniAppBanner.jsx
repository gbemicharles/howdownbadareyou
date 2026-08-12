import React from 'react';
import { Send, Bot, Check, Sparkles } from 'lucide-react';

export default function TelegramMiniAppBanner() {
  return (
    <div className="bg-gradient-to-r from-blue-950/50 via-slate-900/80 to-purple-950/50 border border-blue-500/30 rounded-3xl p-4 sm:p-5 my-6 shadow-xl relative overflow-hidden backdrop-blur-md text-left">
      
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 p-0.5 shadow-lg shadow-cyan-500/30 shrink-0">
          <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
            <Bot className="w-5 h-5 text-cyan-400 animate-pulse" />
          </div>
        </div>
        <div>
          <h3 className="text-sm sm:text-base font-black text-white tracking-tight flex items-center gap-2">
            TELEGRAM GROUP BOT COMMANDS 🤖💬
          </h3>
          <p className="text-xs font-bold text-slate-300 pt-0.5">
            Add <span className="text-cyan-400 font-mono">@howdownbadareyoubot</span> to your Telegram group and run <code className="text-pink-400 bg-slate-900 px-2 py-0.5 rounded font-mono border border-slate-800">/roast &lt;address&gt;</code> to roast your degen friends!
          </p>
        </div>
      </div>

    </div>
  );
}
