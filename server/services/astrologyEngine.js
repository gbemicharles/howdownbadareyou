/**
 * Web3 Financial Astrology & Daily Horoscope Engine
 * Generates deterministic crypto zodiac signs, celestial alignments, lucky/unlucky tokens,
 * and hilarious sarcastic daily horoscope predictions based on wallet address hash & holdings.
 */

const ZODIAC_SIGNS = [
  { sign: "Aries Degen ♈", trait: "Impulsiveape who buys every green candle 5 seconds before the dump.", element: "Fire 🔥" },
  { sign: "Taurus Bagholder ♉", trait: "Refuses to sell even when down 99.4%. Diamond hands or hostage syndrome?", element: "Earth 🌍" },
  { sign: "Gemini Swing Trader ♊", trait: "Swaps tokens 40 times a day just to lose $50 on DEX gas fees.", element: "Air 💨" },
  { sign: "Cancer Copium Inhaler ♋", trait: "Cries in Telegram voice chats every time TON drops $0.10.", element: "Water 🌊" },
  { sign: "Leo Whale Pretender ♌", trait: "Posts flex screenshots on X with a $42.00 total wallet value.", element: "Fire 🔥" },
  { sign: "Virgo Chart Overthinker ♍", trait: "Draws 80 Fibonacci lines on TradingView only to get liquidated anyway.", element: "Earth 🌍" },
  { sign: "Libra Breakeven Survivor ♎", trait: "Spent 800 hours on Telegram just to make exactly $0.00 net profit.", element: "Air 💨" },
  { sign: "Scorpio Leverage Fiend ♏", trait: "Uses 50x leverage on Ston.fi and prays to Satoshi before sleeping.", element: "Water 🌊" },
  { sign: "Sagittarius Airdrop Farmer ♐", trait: "Has 140 wallet addresses, zero real money, and infinite hope.", element: "Fire 🔥" },
  { sign: "Capricorn Exit Liquidity ♑", trait: "The unsung hero who buys tokens at absolute ATH so devs can buy Lambos.", element: "Earth 🌍" }
];

const DAILY_WARNINGS = [
  "Mercury is in retrograde: Do NOT open Ston.fi today. Your next trade has a 94% chance of funding a dev's Dubai rental.",
  "Sun in Degen, Moon in Rugpull: High probability of buying a memecoin named after a Elon Musk tweet.",
  "Celestial Alignment: The stars predict you will check your wallet 47 times today and nothing will change.",
  "Cosmic Warning: If a Telegram admin DMs you offering double your TON, block them before your rent money vanishes.",
  "Planetary Shift: Venus enters your 2nd house. Expect a 12% pump on your worst token right after you sell it."
];

/**
 * Deterministic hash string into integer
 */
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function generateFinancialAstrology(walletAddress = "", positions = []) {
  const hash = hashString(walletAddress || "EQDemoWallet123");
  
  const signIndex = hash % ZODIAC_SIGNS.length;
  const warningIndex = (hash + 3) % DAILY_WARNINGS.length;
  const luckyScore = 40 + ((hash % 55)); // 40% - 95%

  const zodiac = ZODIAC_SIGNS[signIndex];

  // Determine lucky and unlucky tokens
  const luckyToken = positions.length > 0 ? positions[0].symbol : "GRAM";
  const unluckyToken = positions.length > 1 ? positions[positions.length - 1].symbol : "SCAM";

  return {
    zodiacSign: zodiac.sign,
    element: zodiac.element,
    trait: zodiac.trait,
    luckyScore,
    dailyWarning: DAILY_WARNINGS[warningIndex],
    luckyToken,
    unluckyToken,
    alignment: luckyScore > 70 ? "Cosmically Bullish 🌟" : "Heavy Retrograde 🪐"
  };
}
