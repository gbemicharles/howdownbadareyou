/**
 * Copium Calculator Engine (ATH Simulator)
 * Calculates simulated ATH portfolio values and generates hilarious copium roasts based on slider dosage (0% - 100%).
 */

// Historical All-Time High (ATH) prices for major TON tokens
const ATH_PRICE_MAP = {
  "NOT": 0.029,
  "DOGS": 0.00163,
  "HMSTR": 0.0102,
  "CATI": 1.15,
  "STON": 9.80,
  "SCALE": 4.50,
  "GRAM": 8.25,
  "TON": 8.25,
  "MAJOR": 1.95,
  "MY": 1.45,
  "REDO": 1.85,
  "UTYA": 0.12,
  "GROYP": 0.25
};

/**
 * Calculates ATH simulated values for a list of token positions
 */
export function calculateCopiumMetrics(positions = [], currentTotalUsd = 0) {
  let totalAthUsd = 0;

  const positionsWithAth = positions.map(pos => {
    const symUpper = pos.symbol ? pos.symbol.toUpperCase() : "TOKEN";
    const isStablecoin = symUpper === "USDT" || symUpper === "USD₮" || symUpper === "USDC" || symUpper === "JUSDT" || symUpper === "JUSDC";

    let athPrice = pos.currentPriceUsd;

    if (isStablecoin) {
      athPrice = 1.00;
    } else if (ATH_PRICE_MAP[symUpper]) {
      athPrice = Math.max(ATH_PRICE_MAP[symUpper], pos.currentPriceUsd);
    } else if (pos.currentPriceUsd > 0) {
      // Default memecoin ATH multiplier (10x historical peak assumption)
      athPrice = pos.currentPriceUsd * 10.0;
    } else {
      athPrice = 0.001; // Speculative value for 0-price memecoins at 100% ATH
    }

    const currentVal = pos.currentValueUsd || (pos.quantity * pos.currentPriceUsd);
    const athVal = pos.quantity * athPrice;
    const multiplier = currentVal > 0 ? (athVal / currentVal) : 10.0;

    totalAthUsd += athVal;

    return {
      symbol: pos.symbol,
      name: pos.name,
      quantity: pos.quantity,
      currentValueUsd: currentVal,
      athPriceUsd: athPrice,
      athValueUsd: athVal,
      multiplier: parseFloat(multiplier.toFixed(1))
    };
  });

  if (totalAthUsd < currentTotalUsd) {
    totalAthUsd = currentTotalUsd * 1.5;
  }

  return {
    currentTotalUsd,
    totalAthUsd,
    athGainUsd: totalAthUsd - currentTotalUsd,
    athMultiplier: currentTotalUsd > 0 ? parseFloat((totalAthUsd / currentTotalUsd).toFixed(1)) : 5.0,
    positions: positionsWithAth
  };
}

/**
 * Generates dynamic Copium Roasts based on copiumDose slider percentage (0 to 100)
 */
export function getCopiumRoast(copiumDose, currentUsd, athUsd, topSymbol = "MEME") {
  const simulatedUsd = currentUsd + ((athUsd - currentUsd) * (copiumDose / 100));

  const formatUsd = (num) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num);

  if (copiumDose === 0) {
    return {
      title: "0% COPIUM: Brutal Reality 💀",
      simulatedUsd,
      roast: `Your wallet is currently worth ${formatUsd(simulatedUsd)}. No delusions, no fantasy. Just raw, unfiltered pain.`
    };
  } else if (copiumDose <= 25) {
    return {
      title: "25% COPIUM: Micro Dose 🧪",
      simulatedUsd,
      roast: `Inhaling mild copium: If $${topSymbol} bounces back slightly, your portfolio hits ${formatUsd(simulatedUsd)}. You can buy a 2-piece chicken tender combo.`
    };
  } else if (copiumDose <= 50) {
    return {
      title: "50% COPIUM: Medium Hallucination 🌀",
      simulatedUsd,
      roast: `Mid-level Copium active: At ${formatUsd(simulatedUsd)}, you can finally pay off your Telegram Premium subscription and afford 1 month of groceries.`
    };
  } else if (copiumDose <= 75) {
    return {
      title: "75% COPIUM: Heavy Delusion 🛸",
      simulatedUsd,
      roast: `High Copium level: Portfolio hits ${formatUsd(simulatedUsd)}! You start browsing used 2014 Hondas and typing 'wAGMI' in Telegram groups.`
    };
  } else {
    return {
      title: "100% LETHAL COPIUM: Pure Fantasy 🚀👑",
      simulatedUsd,
      roast: `100% PURE LETHAL COPIUM INHALED! If all your tokens hit ATH, your portfolio reaches ${formatUsd(simulatedUsd)}! You are 1 green candle away from buying a Lambo and renting a yacht in Dubai 😭`
    };
  }
}
