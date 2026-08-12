import React, { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import Homepage from './components/Homepage.jsx';
import LoadingScreen from './components/LoadingScreen.jsx';
import ResultDashboard from './components/ResultDashboard.jsx';
import ResultCardModal from './components/ResultCardModal.jsx';
import WalletDuelModal from './components/WalletDuelModal.jsx';
import CertificateOfRektnessModal from './components/CertificateOfRektnessModal.jsx';
import { getWalletRawData } from '../server/services/tonProvider.js';
import { analyzeWallet } from '../server/services/walletAnalyzer.js';
import { calculatePersonalityAndScores } from '../server/services/personalityEngine.js';
import { calculateCopiumMetrics } from '../server/services/copiumEngine.js';
import { generateFinancialAstrology } from '../server/services/astrologyEngine.js';
import { generateRoasts } from '../server/services/roastEngine.js';

export default function App() {
  const [appState, setAppState] = useState('home'); // 'home' | 'loading' | 'results'
  const [currentAddress, setCurrentAddress] = useState('');
  const [roastData, setRoastData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Modal Visibility States
  const [isResultCardModalOpen, setIsResultCardModalOpen] = useState(false);
  const [isDuelModalOpen, setIsDuelModalOpen] = useState(false);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);

  // Auto-scan address if query param is passed (e.g. ?address=EQ...)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const addr = params.get('address');
    if (addr) {
      handleAddressSubmitted(addr);
    }
  }, []);

  const handleAddressSubmitted = async (address) => {
    setCurrentAddress(address);
    setAppState('loading');
    setErrorMessage('');

    const startTime = Date.now();

    let fullData = null;

    try {
      // 1. Try Express API Endpoint first
      const response = await fetch(`/api/roast/${encodeURIComponent(address)}`);
      
      if (response.ok) {
        fullData = await response.json();
      }
    } catch (err) {
      console.warn('API endpoint unreachable, falling back to client-side pipeline:', err);
    }

    if (!fullData) {
      // 2. Client-side Fallback Pipeline (if server endpoint is unavailable)
      try {
        const rawData = await getWalletRawData(address);
        const analysis = analyzeWallet(rawData);
        const scores = calculatePersonalityAndScores(analysis);
        const copiumMetrics = calculateCopiumMetrics(analysis.positions, analysis.totalCurrentValueUsd);
        const astrology = generateFinancialAstrology(analysis.walletAddress, analysis.biggestBag);
        const roasts = generateRoasts({
          walletAddress: analysis.walletAddress,
          totalCurrentValueUsd: analysis.totalCurrentValueUsd,
          estimatedPnlUsd: analysis.estimatedPnlUsd,
          downBadScore: scores.downBadScore,
          isProfitable: scores.isProfitable,
          levelText: scores.levelText,
          personalityTitle: scores.personality.title,
          biggestBagSymbol: analysis.biggestBag?.symbol,
          biggestLoserSymbol: analysis.biggestLoser?.symbol
        });

        fullData = {
          walletAddress: analysis.walletAddress,
          rawAddress: analysis.rawAddress,
          totalCurrentValueUsd: analysis.totalCurrentValueUsd,
          estimatedCostBasisUsd: analysis.estimatedCostBasisUsd,
          estimatedPnlUsd: analysis.estimatedPnlUsd,
          estimatedPnlPercent: analysis.estimatedPnlPercent,
          downBadScore: scores.downBadScore,
          isProfitable: scores.isProfitable,
          levelText: scores.levelText,
          personality: scores.personality,
          metrics: scores.metrics,
          ignoredTokensCount: analysis.ignoredTokensCount,
          biggestBag: analysis.biggestBag,
          biggestLoser: analysis.biggestLoser,
          biggestWinner: analysis.biggestWinner,
          concentrationComment: analysis.concentrationComment,
          copiumMetrics,
          astrology,
          roasts,
          positions: analysis.positions
        };
      } catch (err) {
        console.error('Failed to analyze wallet:', err);
        setErrorMessage(err.message || 'Failed to fetch TON wallet data. Please verify the address.');
        setAppState('home');
        return;
      }
    }

    // Guarantee minimum 2.5-second loading screen so user sees step-by-step scanning steps!
    const elapsed = Date.now() - startTime;
    const remainingDelay = Math.max(0, 2500 - elapsed);

    setTimeout(() => {
      setRoastData(fullData);
      setAppState('results');
    }, remainingDelay);
  };

  const handleReset = () => {
    setAppState('home');
    setCurrentAddress('');
    setRoastData(null);
    setErrorMessage('');
    window.history.replaceState({}, document.title, window.location.pathname);
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 font-sans flex flex-col justify-between selection:bg-pink-500 selection:text-white pt-3 sm:pt-0">
      
      {/* GLOBAL HEADER NAV */}
      <Header 
        onOpenDuel={() => setIsDuelModalOpen(true)}
        onReset={handleReset}
      />

      {/* ERROR ALERT TOAST */}
      {errorMessage && (
        <div className="max-w-xl mx-auto mt-4 px-4">
          <div className="bg-red-950/80 border border-red-500/50 text-red-200 px-4 py-3 rounded-2xl text-xs font-bold flex items-center justify-between shadow-xl">
            <span>⚠️ {errorMessage}</span>
            <button onClick={() => setErrorMessage('')} className="text-red-400 hover:text-white font-mono">✕</button>
          </div>
        </div>
      )}

      {/* MAIN VIEWPORT SWITCHER */}
      <main className="flex-1 pt-4 sm:pt-6">
        {appState === 'home' && (
          <Homepage onSubmitAddress={handleAddressSubmitted} />
        )}

        {appState === 'loading' && (
          <LoadingScreen address={currentAddress} onCancel={handleReset} />
        )}

        {appState === 'results' && roastData && (
          <ResultDashboard 
            roastData={roastData} 
            onReset={handleReset}
            onOpenShareCard={() => setIsResultCardModalOpen(true)}
            onOpenCert={() => setIsCertModalOpen(true)}
          />
        )}
      </main>

      {/* MODALS */}
      {isResultCardModalOpen && roastData && (
        <ResultCardModal 
          roastData={roastData} 
          onClose={() => setIsResultCardModalOpen(false)} 
        />
      )}

      {isDuelModalOpen && (
        <WalletDuelModal 
          initialWalletA={currentAddress}
          onClose={() => setIsDuelModalOpen(false)}
        />
      )}

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
            
            {/* 1. X / TWITTER FIRST */}
            <a 
              href="https://x.com/gbemicharles_" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-pink-400 hover:text-pink-300 font-extrabold flex items-center gap-1 transition-colors hover:underline"
            >
              <span>X 🐦</span>
            </a>

            <span className="text-slate-700">•</span>

            {/* 2. TELEGRAM SECOND */}
            <a 
              href="https://t.me/gbemicharles" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 font-extrabold flex items-center gap-1 transition-colors hover:underline"
            >
              <span>Telegram 📲</span>
            </a>

            <span className="text-slate-700">•</span>

            {/* 3. WEBSITE THIRD (gbemicharles.com) */}
            <a 
              href="https://gbemicharles.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-amber-400 hover:text-amber-300 font-extrabold flex items-center gap-1 transition-colors hover:underline"
            >
              <span>Website 🌐</span>
            </a>
          </div>

          <span className="text-slate-600 text-[11px]">Entertainment & Meme Utility Only</span>

        </div>
      </footer>

    </div>
  );
}
