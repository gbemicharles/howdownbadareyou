/**
 * Roast & Meme Text Engine
 * Generates savage, hilarious, sarcastic, dark humor roasts for position highlights,
 * contextual tokens (Pedro, Vampepe, NOT, DOGS, USDT), and X sharing intent text.
 */

const WORST_DECISION_ROASTS = [
  "You didn't buy the dip. You caught a falling knife with your teeth 💀",
  "Satoshi invented Bitcoin to free humanity, and you used TON to fund a scammer's Dubai rental lambo 🚗💨",
  "This chart isn't a dip, it's a crime scene. Even your local McDonald's won't accept this trading resume 🍟",
  "Somewhere in Dubai, a Telegram dev is drinking Dom Pérignon bought with your life savings 🍾",
  "You held this position through -90%, -95%, and -99%. At this point, it's not an investment, it's hostage syndrome 🫡",
  "Bought near the peak, held through the bedrock floor. True craftsmanship in money-burning 🕯️",
  "This trade single-handedly lowered the average IQ of the entire TON blockchain 🧠📉",
  "Your financial advisor took one look at this position and blocked your phone number 📞❌"
];

const SAVING_GRACE_ROASTS = [
  "Your single green token is carrying this entire wallet harder than Messi carried Argentina 🇦🇷",
  "Don't get cocky. One accidental 2x doesn't fix 47 rugpulls and a broken bank balance 💀",
  "You accidentally made money. Quickly sell before your inner degen buys a token called $ELON-DOGE-INU 🚀",
  "The lone green candle floating in a sea of blood, tears, and bad decisions.",
  "Your wallet has 1 win and 200 losses. You're basically the Detroit Lions of crypto 🏈"
];

const GENERAL_ROAST_TAGLINES = [
  "We ran your wallet through our diagnostic scanner and the scanner asked for psychological support 💀",
  "Your wallet belongs in an artistic museum of financial tragedy right next to BitConnect 🏛️",
  "Satoshi didn't die for your portfolio to look like a red crime scene tape 🚨",
  "We investigated your financial decisions so your therapist doesn't have to.",
  "If holding heavy bags was an Olympic sport, you'd be wearing 14 gold medals 🥇🎒",
  "You swapped real hard-earned cash for digital raccoon dust. Your parents are changing their will 📜💀"
];

const TOKEN_SPECIFIC_ROASTS = {
  PEDRO: "Ah, $PEDRO. Nothing screams sound macroeconomic policy like trading raccoon memes at 3 AM 🦝💀",
  VAMPEPE: "VAMPEPE token... because normal Pepe wasn't vampire enough to suck out the last 5% of your net worth 🧛‍♂️📉",
  NOT: "Notcoin... literally named 'NOT' money, yet you were shocked when it acted like not money 💀",
  DOGS: "DOGS token. You traded hard-earned fiat for a Telegram sticker dog. Woof 🐶📉",
  HMSTR: "Hamster Kombat... you tapped a phone screen 5,000 times for $0.12 worth of dust 🐹💀",
  USDT: "Holding USDT on a degen app... Bro is playing it safe while the rest of his wallet burns 💵🛡️",
  GRAM: "TON/GRAM token... Durov's gift to humanity, and your gift to the DEX liquidity pools 💎🫡"
};

export function generateRoasts(analysis, personality, scoreData) {
  let worstDecisionRoast = selectRoast(WORST_DECISION_ROASTS, analysis.walletAddress, 1);
  let savingGraceRoast = selectRoast(SAVING_GRACE_ROASTS, analysis.walletAddress, 2);
  const generalTagline = selectRoast(GENERAL_ROAST_TAGLINES, analysis.walletAddress, 3);

  // Inject token-specific roasts if user holds iconic memecoins (Pedro, Vampepe, NOT, DOGS)
  if (analysis.biggestLoser) {
    const sym = (analysis.biggestLoser.symbol || "").toUpperCase();
    if (TOKEN_SPECIFIC_ROASTS[sym]) {
      worstDecisionRoast = TOKEN_SPECIFIC_ROASTS[sym];
    }
  }

  if (analysis.biggestWinner) {
    const sym = (analysis.biggestWinner.symbol || "").toUpperCase();
    if (TOKEN_SPECIFIC_ROASTS[sym]) {
      savingGraceRoast = TOKEN_SPECIFIC_ROASTS[sym];
    }
  }

  // Generate X (Twitter) Tweet Share Intent Text
  const tweetText = generateTweetText(analysis, personality, scoreData);

  return {
    worstDecisionRoast,
    savingGraceRoast,
    generalTagline,
    tweetText
  };
}

function selectRoast(arr, seedStr, offset) {
  let hash = offset;
  for (let i = 0; i < seedStr.length; i++) {
    hash = (hash * 31 + seedStr.charCodeAt(i)) % 10007;
  }
  return arr[hash % arr.length];
}

function generateTweetText(analysis, personality, scoreData) {
  const score = scoreData.downBadScore;
  const isProfitable = scoreData.isProfitable;
  const isBreakeven = scoreData.isBreakeven;
  const damage = scoreData.metrics.emotionalDamage;

  if (isBreakeven) {
    return `I just checked my TON wallet on How Down Bad Are You? 💀\n\nResult: 0% DOWN BAD ⚖️ (Breakeven)\nPersonality: THE BREAKEVEN SURVIVOR\nEmotional Damage: 0/100 🛡️\n\nNet $0 gain, net $0 loss. Check yours 👇\nhttps://howdownbadareyou.com`;
  }

  if (isProfitable) {
    return `I just checked my TON wallet on How Down Bad Are You? 💀\n\nResult: ${scoreData.levelText}\nPersonality: ${personality.title}\nExit Probability: ${scoreData.metrics.exitProbability}\n\nAm I actually winning? Check yours 👇\nhttps://howdownbadareyou.com`;
  }

  const templates = [
    `I just checked my TON wallet on How Down Bad Are You? 💀\n\nApparently I'm ${score}% down bad.\nEmotional damage: ${damage}/100 😭\nDiagnosis: "${personality.tagline}"\n\nCheck yours 👇\nhttps://howdownbadareyou.com`,
    `Apparently diversification was FUD 💀\n\nMy TON wallet is ${score}% down bad!\nPersonality: ${personality.title}\n\nRoast your financial decisions here 👇\nhttps://howdownbadareyou.com`,
    `My TON wallet score: ${score}% DOWN BAD 💀\n\n"You didn't buy the dip. You caught a falling knife with your teeth."\n\nCheck how down bad your wallet is 👇\nhttps://howdownbadareyou.com`
  ];

  let hash = 0;
  for (let i = 0; i < analysis.walletAddress.length; i++) {
    hash += analysis.walletAddress.charCodeAt(i);
  }
  return templates[hash % templates.length];
}
