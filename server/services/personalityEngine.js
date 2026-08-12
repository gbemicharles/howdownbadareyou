/**
 * Personality & Scoring Engine
 * Calculates Down Bad Score (0-100), Down Bad Level thresholds,
 * assigns 1 of 7 hilarious, sarcastic wallet personalities, and generates entertainment metrics.
 */

export function calculatePersonalityAndScores(analysis) {
  const pnlPercent = analysis.estimatedPnlPercent || 0;
  const isProfitable = pnlPercent > 0.05;
  const isBreakeven = Math.abs(pnlPercent) <= 0.05 || analysis.estimatedPnlUsd === 0;
  const lossPercent = Math.min(100, Math.max(0, -pnlPercent));

  // 1. Calculate Down Bad Score (0 - 100)
  // Profitable and breakeven wallets are strictly 0% Down Bad!
  let downBadScore = 0;
  if (isBreakeven || isProfitable) {
    downBadScore = 0;
  } else {
    // Loss percentage is primary factor for non-profitable wallets
    let score = lossPercent;
    
    // Add concentration penalty if single bag > 60%
    if (analysis.biggestBag && analysis.biggestBag.concentrationPercent > 60) {
      score += 5;
    }

    // Add losing ratio penalty
    if (analysis.totalPositionsCount > 0) {
      const lossRatio = analysis.losingPositionsCount / analysis.totalPositionsCount;
      score += lossRatio * 8;
    }

    downBadScore = Math.min(100, Math.max(0, Math.round(score)));
  }

  // 2. Down Bad Level Description
  const levelText = getDownBadLevelText(downBadScore, isProfitable, isBreakeven, pnlPercent);

  // 3. Classify Personality
  const personality = classifyPersonality(analysis, isProfitable, isBreakeven, pnlPercent, lossPercent);

  // 4. Generate Entertainment Metrics
  const entertainmentMetrics = generateEntertainmentMetrics(analysis, downBadScore, isProfitable, isBreakeven, lossPercent);

  return {
    downBadScore,
    isProfitable,
    isBreakeven,
    levelText,
    personality,
    metrics: entertainmentMetrics
  };
}

function getDownBadLevelText(score, isProfitable, isBreakeven, pnlPercent) {
  if (isBreakeven) {
    return "0% DOWN BAD ⚖️ (Net $0 P&L)";
  }
  if (isProfitable) {
    if (pnlPercent > 100) return `+${Math.round(pnlPercent)}% UP BAD 🚀 (Accidental Millionaire)`;
    return `+${Math.round(pnlPercent)}% UP BAD 🚀 (In Profit)`;
  }

  if (score <= 10) return "You're chilling... for now. ☕";
  if (score <= 25) return "Slightly cooked 🍳";
  if (score <= 40) return "Getting uncomfortable 😳";
  if (score <= 55) return "Medium rare cooked 🥩";
  if (score <= 70) return "Deeply cooked 💀";
  if (score <= 85) return "Financially adventurous 🧗‍♂️";
  if (score <= 95) return "Absolutely down bad 😭";
  if (score <= 99) return "Portfolio Emergency 🚨";
  return "Call somebody 📞💀";
}

function classifyPersonality(analysis, isProfitable, isBreakeven, pnlPercent, lossPercent) {
  if (isBreakeven) {
    return {
      title: "THE BREAKEVEN SURVIVOR ⚖️",
      tagline: "800 hours on Telegram just to make exactly $0.00.",
      description: "Your total investment matches your current portfolio value down to the cent. You braved 47 rugpulls, 12 presales, and 3 panic-sells just to achieve the exact financial return of keeping your money under a mattress."
    };
  }

  // 1. SURVIVOR (PROFITABLE)
  if (isProfitable) {
    return {
      title: "THE SURVIVOR 🏆",
      tagline: "Somehow you escaped the trenches with money.",
      description: "Against all known laws of crypto gravity and bad decisions, your wallet is green. Don't get cocky — one random Telegram call from @CryptoGigaChad will fix that real quick."
    };
  }

  // 2. ONE-TOKEN BELIEVER
  if (analysis.biggestBag && analysis.biggestBag.concentrationPercent >= 70) {
    return {
      title: "THE ONE-TOKEN BELIEVER 🫡",
      tagline: "Diversification is apparently FUD.",
      description: `You put ${analysis.biggestBag.concentrationPercent}% of your net worth into $${analysis.biggestBag.symbol} because a guy with an anime avatar on Telegram said 'trust the process'. Mainnet or main street, baby!`
    };
  }

  // 3. BAG COLLECTOR
  if (analysis.totalPositionsCount >= 10) {
    return {
      title: "THE BAG COLLECTOR 🎒",
      tagline: "You collect dead project tokens like Pokémon.",
      description: `With ${analysis.totalPositionsCount} different positions in your wallet, you aren't a trader — you're running an un-curated museum of abandoned Telegram project tokens.`
    };
  }

  // 4. AIRDROP FARMER
  if (analysis.totalPositionsCount >= 6 && analysis.totalCurrentValueUsd < 500 && analysis.ignoredTokensCount >= 3) {
    return {
      title: "THE AIRDROP FARMER 🌾",
      tagline: "340 micro-transactions for a $0.42 claim.",
      description: "You've spent $35 in TON gas fees to farm an airdrop worth $0.18. Honest work, zero profit, pure dedication to the hustle."
    };
  }

  // 5. EXIT LIQUIDITY PROVIDER
  if (lossPercent >= 60 && analysis.biggestLoser) {
    return {
      title: "THE EXIT LIQUIDITY PROVIDER 🫡",
      tagline: "Somewhere in Dubai, a whale bought a G-Wagon with your money.",
      description: "You routinely buy speculative memecoins 3 seconds before the dev hits the market sell button. Thank you for your service to the global luxury market!"
    };
  }

  // 6. DIAMOND HAND
  if (lossPercent >= 40) {
    return {
      title: "THE DIAMOND HAND 💎",
      tagline: "You've decided selling is a myth invented by banks.",
      description: "You watched your portfolio plummet 70%+ and held on through sheer willpower, denial, and pure stubbornness. Respect the grit, fear the bank balance."
    };
  }

  // 7. SERIAL DEGEN
  return {
    title: "THE SERIAL DEGEN 🔥",
    tagline: "High turnover, zero risk management, pure chaos.",
    description: "Your trading strategy is reading Telegram sticker vibes and buying whatever has a fire emoji. Technical analysis? Never heard of her."
  };
}

function generateEntertainmentMetrics(analysis, downBadScore, isProfitable, isBreakeven, lossPercent) {
  const conc = analysis.biggestBag ? analysis.biggestBag.concentrationPercent : 30;
  
  const emotionalDamage = isBreakeven 
    ? 5 
    : (isProfitable 
        ? Math.max(5, Math.round(30 - Math.min(25, analysis.estimatedPnlPercent / 5)))
        : Math.min(99, Math.round(downBadScore * 0.95 + 8)));

  const conviction = Math.min(99, Math.max(25, Math.round(conc * 0.7 + (100 - downBadScore) * 0.3 + 20)));

  const degenLevel = Math.min(99, Math.max(35, Math.round(
    (analysis.totalPositionsCount * 4) + (conc > 50 ? 25 : 10) + (analysis.ignoredTokensCount * 3) + 20
  )));

  const diversificationScore = Math.max(4, Math.min(98, Math.round(100 - conc)));

  const exitProbability = isBreakeven ? 100 : (isProfitable ? 88 : Math.max(2, Math.round(100 - downBadScore * 0.92)));

  return {
    emotionalDamage,
    conviction,
    degenLevel,
    diversificationScore,
    exitProbability: `${exitProbability}%`
  };
}

export function getConcentrationComment(concPercent) {
  if (concPercent >= 90) return "Diversification: What's That? 💀 (100% YOLO)";
  if (concPercent >= 70) return "Diversification: Absolutely Not 💀 (All Eggs, One Basket)";
  if (concPercent >= 50) return "Diversification: Bro has chosen a side.";
  return "Diversification: Look at you acting like a wall street banker.";
}
