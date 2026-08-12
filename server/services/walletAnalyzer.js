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

  // Filter positions actually held with non-zero balance
  const heldPositions = validPositions.filter(p => p.quantity > 0 || p.currentValueUsd > 0);

  // Calculate totals
  const totalCurrentValueUsd = heldPositions.reduce((acc, p) => acc + p.currentValueUsd, 0);
  const totalCostBasisUsd = heldPositions.reduce((acc, p) => acc + p.estimatedCostBasisUsd, 0);
  
  let overallPnlUsd = 0;
  let overallPnlPercent = 0;

  if (totalCostBasisUsd > 0) {
    overallPnlUsd = totalCurrentValueUsd - totalCostBasisUsd;
    overallPnlPercent = ((totalCurrentValueUsd - totalCostBasisUsd) / totalCostBasisUsd) * 100;
  }

  // Highlight positions (Biggest Bag)
  const biggestBag = heldPositions.length > 0 ? heldPositions[0] : null;
  const biggestBagConcentration = (biggestBag && totalCurrentValueUsd > 0) 
    ? (biggestBag.currentValueUsd / totalCurrentValueUsd) * 100 
    : 0;

  // Jetton positions (Strictly exclude native TON and official GRAM)
  const jettonPositions = heldPositions.filter(p => {
    const sym = (p.symbol || '').toUpperCase();
    return sym !== 'TON' && sym !== 'GRAM';
  });

  // Find biggest loser among held Jettons (lowest estimatedPnlPercent)
  let biggestLoser = null;
  const losingJettons = jettonPositions.filter(p => p.pnlStatus === 'loss');
  
  if (losingJettons.length > 0) {
    losingJettons.sort((a, b) => (a.estimatedPnlPercent || 0) - (b.estimatedPnlPercent || 0));
    biggestLoser = losingJettons[0];
  } else if (jettonPositions.length > 0) {
    // If no negative PnL Jetton, pick lowest performing Jetton held by user
    jettonPositions.sort((a, b) => (a.estimatedPnlPercent || 0) - (b.estimatedPnlPercent || 0));
    biggestLoser = jettonPositions[0];
  }

  // Winning positions among held positions
  let biggestWinner = null;
  const winningPositions = heldPositions.filter(p => p.pnlStatus === 'profit');
  if (winningPositions.length > 0) {
    winningPositions.sort((a, b) => (b.estimatedPnlPercent || 0) - (a.estimatedPnlPercent || 0));
    biggestWinner = winningPositions[0];
  } else if (heldPositions.length > 0) {
    biggestWinner = heldPositions[0];
  }

  // Calculate Feature #1: Copium ATH Simulator Metrics
  const copiumMetrics = calculateCopiumMetrics(heldPositions, totalCurrentValueUsd);

  // Calculate Feature #2: Web3 Financial Astrology Horoscope
  const astrology = generateFinancialAstrology(rawData.address, heldPositions);

  return {
    walletAddress: rawData.address,
    isDemo: rawData.isDemo || false,
    totalCurrentValueUsd,
    estimatedCostBasisUsd: totalCostBasisUsd,
    estimatedPnlUsd: overallPnlUsd,
    estimatedPnlPercent: overallPnlPercent,
    ignoredTokensCount,
    totalPositionsCount: heldPositions.length,
    losingPositionsCount: losingJettons.length,
    winningPositionsCount: winningPositions.length,
    biggestBag,
    biggestLoser,
    biggestWinner,
    biggestBagConcentration,
    copiumMetrics,
    astrology,
    positions: heldPositions
  };
}
