import React, { useState } from 'react';
import Header from './components/Header.jsx';
import Homepage from './components/Homepage.jsx';
import LoadingScreen from './components/LoadingScreen.jsx';
import ResultDashboard from './components/ResultDashboard.jsx';
import ResultCardModal from './components/ResultCardModal.jsx';
import WalletDuelModal from './components/WalletDuelModal.jsx';
import CertificateOfRektnessModal from './components/CertificateOfRektnessModal.jsx';

// Direct Client-Side Fallback Services for seamless standalone offline/Vite operation
import { isValidTonAddress, getWalletRawData } from '../server/services/tonProvider.js';
import { analyzeWallet } from '../server/services/walletAnalyzer.js';
import { calculatePersonalityAndScores, getConcentrationComment } from '../server/services/personalityEngine.js';
import { generateRoasts } from '../server/services/roastEngine.js';

export default function App() {
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'loading' | 'result'
  const [activeAddress, setActiveAddress] = useState('');
  const [roastData, setRoastData] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isDuelModalOpen, setIsDuelModalOpen] = useState(false);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);

  // Trigger Roast Analysis
  const handleStartRoast = async (address) => {
    setActiveAddress(address);
    setErrorMsg(null);
    setCurrentView('loading');

    try {
      let payload = null;
      try {
        const timestamp = Date.now();
        const apiPath = `/api/roast/${encodeURIComponent(address)}?t=${timestamp}`;
        const res = await fetch(apiPath, {
          headers: { 'Cache-Control': 'no-cache' }
        });
        if (res.ok) {
          payload = await res.json();
        }
      } catch (e) {
        // Express API backend not reachable directly, using client-side engine pipeline fallback
      }

      if (!payload) {
        const rawData = await getWalletRawData(address);
        const analysis = analyzeWallet(rawData);

        if (analysis.totalPositionsCount === 0 && analysis.totalCurrentValueUsd === 0) {
          payload = {
            emptyWallet: true,
            walletAddress: address,
            message: "We found the wallet.\n\nUnfortunately, there's nothing here to roast 💀"
          };
        } else {
          const scoreData = calculatePersonalityAndScores(analysis);
          const roasts = generateRoasts(analysis, scoreData.personality, scoreData);
          const concentrationComment = getConcentrationComment(
            analysis.biggestBag ? analysis.biggestBag.concentrationPercent : 0
          );

          payload = {
            emptyWallet: false,
            walletAddress: address,
            isDemo: analysis.isDemo,
            totalCurrentValueUsd: analysis.totalCurrentValueUsd,
            estimatedCostBasisUsd: analysis.estimatedCostBasisUsd,
            estimatedPnlUsd: analysis.estimatedPnlUsd,
            estimatedPnlPercent: analysis.estimatedPnlPercent,
            downBadScore: scoreData.downBadScore,
            isProfitable: scoreData.isProfitable,
            levelText: scoreData.levelText,
            personality: scoreData.personality,
            metrics: scoreData.metrics,
            ignoredTokensCount: analysis.ignoredTokensCount,
            totalPositionsCount: analysis.totalPositionsCount,
            losingPositionsCount: analysis.losingPositionsCount,
            winningPositionsCount: analysis.winningPositionsCount,
            biggestBag: analysis.biggestBag,
            biggestLoser: analysis.biggestLoser,
            biggestWinner: analysis.biggestWinner,
            concentrationComment,
            copiumMetrics: analysis.copiumMetrics,
            astrology: analysis.astrology,
            roasts,
            positions: analysis.positions
          };
        }
      }

      if (payload.emptyWallet) {
        setErrorMsg(payload.message || "We found the wallet. Unfortunately, there's nothing here to roast 💀");
        setCurrentView('home');
        return;
      }

      setRoastData(payload);

      setTimeout(() => {
        setCurrentView('result');
      }, 1200);

    } catch (err) {
      console.error('Roast processing error:', err);
      setErrorMsg("The blockchain is having a moment. Try again in a few seconds 💀");
      setCurrentView('home');
    }
  };

  const handleReset = () => {
    setCurrentView('home');
    setActiveAddress('');
    setRoastData(null);
    setErrorMsg(null);
    setIsShareModalOpen(false);
    setIsDuelModalOpen(false);
    setIsCertModalOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-pink-500 selection:text-white relative">
      
      {/* Header */}
      <Header 
        onReset={handleReset} 
        onOpenDuel={() => setIsDuelModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {errorMsg && (
          <div className="max-w-xl mx-auto mt-6 px-4">
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-center font-bold text-sm">
              {errorMsg}
            </div>
          </div>
        )}

        {currentView === 'home' && (
          <Homepage 
            onSubmitAddress={handleStartRoast}
            onSelectDemo={handleStartRoast}
          />
        )}

        {currentView === 'loading' && (
          <LoadingScreen address={activeAddress} />
        )}

        {currentView === 'result' && roastData && (
          <ResultDashboard 
            roastData={roastData} 
            onReset={handleReset}
            onOpenShareCard={() => setIsShareModalOpen(true)}
            onOpenCert={() => setIsCertModalOpen(true)}
          />
        )}
      </main>

      {/* Result Card Modal */}
      {isShareModalOpen && roastData && (
        <ResultCardModal 
          roastData={roastData} 
          onClose={() => setIsShareModalOpen(false)}
        />
      )}

      {/* Wallet Duel Modal */}
      {isDuelModalOpen && (
        <WalletDuelModal 
          initialWalletA={activeAddress}
          onClose={() => setIsDuelModalOpen(false)}
        />
      )}

      {/* Certificate of Rektness Modal */}
      {isCertModalOpen && roastData && (
        <CertificateOfRektnessModal 
          roastData={roastData} 
          onClose={() => setIsCertModalOpen(false)}
        />
      )}

      {/* STICKY FOOTER */}
      <footer className="sticky bottom-0 z-40 w-full border-t border-slate-800/80 py-3.5 text-center text-xs text-slate-500 bg-slate-950/90 backdrop-blur-lg shadow-2xl">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-bold">How Down Bad Are You? 💀</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-500">TON Wallet Roast Engine</span>
          </div>

          {/* CREATOR BRANDING TAG */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-semibold shadow-inner">
            <span className="text-slate-400">Made by <strong className="text-white font-extrabold">Gbemicharles</strong></span>
            <span className="text-slate-700">|</span>
            <a 
              href="https://x.com/gbemicharles_" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-pink-400 hover:text-pink-300 font-extrabold flex items-center gap-1 transition-colors hover:underline"
            >
              <span>X / Twitter 🐦</span>
            </a>
            <span className="text-slate-700">•</span>
            <a 
              href="https://t.me/gbemicharles" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 font-extrabold flex items-center gap-1 transition-colors hover:underline"
            >
              <span>Telegram 📲</span>
            </a>
          </div>

          <span className="text-slate-600 text-[11px]">Entertainment & Meme Utility Only</span>

        </div>
      </footer>

    </div>
  );
}
