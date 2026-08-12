/**
 * Wallet Analyzer Engine
 * Filters spam tokens, calculates normalized position P&Ls, portfolio concentration,
 * calculates copium ATH metrics, financial astrology, and identifies key highlights.
 */

import { calculateCopiumMetrics } from './copiumEngine.js';
import { generateFinancialAstrology } from './astrologyEngine.js';

export function analyzeWallet(rawData) {
  const rawTokens = rawData.tokens || [];
  let ignoredTokensCount = 0;
  const validPositions = [];

  for (const token of rawTokens) {
    const symbolUpper = (token.symbol || "").toUpperCase();
    const nameUpper = (token.name || "").toUpperCase();
    const currentValueUsd = token.quantity * (token.currentPriceUsd || 0);

    const isExplicitPhishingScam = 
      nameUpper.includes("VISIT") || 
      nameUpper.includes("CLAIM-TON") || 
      nameUpper.includes("FREE-AIRDROP") ||
      symbolUpper.includes("CLAIM-TON");

    if (token.isSpam && isExplicitPhishingScam && currentValueUsd < 0.05) {
      ignoredTokensCount++;
      continue;
    }

    const estCostBasis = token.estAcquisitionCost || 0;

    let estPnlUsd = 0;
    let estPnlPercent = 0;

    if (estCostBasis > 0 && currentValueUsd > 0) {
      estPnlUsd = currentValueUsd - estCostBasis;
      estPnlPercent = ((currentValueUsd - estCostBasis) / estCostBasis) * 100;
    }

    validPositions.push({
      symbol: token.symbol,
      name: token.name,
      decimals: token.decimals || 9,
      quantity: token.quantity,
      currentPriceUsd: token.currentPriceUsd,
      currentValueUsd,
      estimatedCostBasisUsd: estCostBasis,
      estimatedPnlUsd: estCostBasis > 0 ? estPnlUsd : null,
      estimatedPnlPercent: estCostBasis > 0 ? estPnlPercent : null,
      pnlStatus: estCostBasis > 0 ? (estPnlUsd >= 0 ? 'profit' : 'loss') : 'unavailable',
      confidence: estCostBasis > 0 ? 'medium' : 'low'
    });
  }

  // Sort positions by current value descending
  validPositions.sort((a, b) => b.currentValueUsd - a.currentValueUsd);

  // Calculate totals
  const totalCurrentValueUsd = validPositions.reduce((acc, p) => acc + p.currentValueUsd, 0);
  const totalCostBasisUsd = validPositions.reduce((acc, p) => acc + p.estimatedCostBasisUsd, 0);
  
  let overallPnlUsd = 0;
  let overallPnlPercent = 0;

  if (totalCostBasisUsd > 0) {
    overallPnlUsd = totalCurrentValueUsd - totalCostBasisUsd;
    overallPnlPercent = ((totalCurrentValueUsd - totalCostBasisUsd) / totalCostBasisUsd) * 100;
  }

  // Highlight positions
  const biggestBag = validPositions.length > 0 ? validPositions[0] : null;
  const biggestBagConcentration = (biggestBag && totalCurrentValueUsd > 0) 
    ? (biggestBag.currentValueUsd / totalCurrentValueUsd) * 100 
    : 0;

  // Jetton Losing positions (Strictly exclude TON and official GRAM)
  const jettonLosingPositions = validPositions.filter(p => {
    const sym = (p.symbol || '').toUpperCase();
    return p.pnlStatus === 'loss' && sym !== 'TON' && sym !== 'GRAM';
  });
  
  jettonLosingPositions.sort((a, b) => (a.estimatedPnlPercent || 0) - (b.estimatedPnlPercent || 0));
  
  let biggestLoser = jettonLosingPositions.length > 0 ? jettonLosingPositions[0] : null;
  
  // If no losing Jetton found, pick any Jetton position (excluding TON and GRAM)
  if (!biggestLoser) {
    const otherJettons = validPositions.filter(p => {
      const sym = (p.symbol || '').toUpperCase();
      return sym !== 'TON' && sym !== 'GRAM';
    });
    if (otherJettons.length > 0) {
      otherJettons.sort((a, b) => (a.estimatedPnlPercent || 0) - (b.estimatedPnlPercent || 0));
      biggestLoser = otherJettons[0];
    }
  }

  // Winning positions
  const winningPositions = validPositions.filter(p => p.pnlStatus === 'profit');
  winningPositions.sort((a, b) => (b.estimatedPnlPercent || 0) - (a.estimatedPnlPercent || 0));
  const biggestWinner = winningPositions.length > 0 ? winningPositions[0] : null;

  // Calculate Feature #1: Copium ATH Simulator Metrics
  const copiumMetrics = calculateCopiumMetrics(validPositions, totalCurrentValueUsd);

  // Calculate Feature #2: Web3 Financial Astrology Horoscope
  const astrology = generateFinancialAstrology(rawData.address, validPositions);

  return {
    walletAddress: rawData.address,
    isDemo: rawData.isDemo || false,
    totalCurrentValueUsd,
    estimatedCostBasisUsd: totalCostBasisUsd,
    estimatedPnlUsd: overallPnlUsd,
    estimatedPnlPercent: overallPnlPercent,
    ignoredTokensCount,
    totalPositionsCount: validPositions.length,
    losingPositionsCount: jettonLosingPositions.length,
    winningPositionsCount: winningPositions.length,
    biggestBag,
    biggestLoser,
    biggestWinner,
    biggestBagConcentration,
    copiumMetrics,
    astrology,
    positions: validPositions
  };
}
