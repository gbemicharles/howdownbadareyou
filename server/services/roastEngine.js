/**
 * Roast Generator Service
 * Combines wallet analysis, scores, and templates to generate hilarious, shareable roasts.
 */

const ROAST_VARIATIONS = [
  {
    primary: "Your portfolio looks like a crime scene where the only victims are your savings. You bought every single peak and sold every single bottom with mathematical precision.",
    tweet: "My TON wallet score: {score}% DOWN BAD 💀\n\n'You didn't buy the dip. You caught a falling knife with your teeth.'\n\nCheck how down bad your wallet is on Telegram 👇\nhttps://t.me/howdownbadareyoubot #TON #Web3"
  },
  {
    primary: "Holding this many dead Jettons requires a level of emotional attachment usually reserved for stray dogs. Half of these tokens haven't had a buy order since last Tuesday.",
    tweet: "Apparently diversification was FUD 💀\n\nMy TON wallet is {score}% down bad!\nPersonality: {title}\n\nRoast your financial decisions on Telegram 👇\nhttps://t.me/howdownbadareyoubot #TON #Web3"
  },
  {
    primary: "You didn't just buy the dip — you financed the entire canyon. If copium was a currency, you'd be Forbes 30 Under 30.",
    tweet: "I just checked my TON wallet on How Down Bad Are You? 💀\n\nResult: {score}% DOWN BAD\nEmotional damage: 100/100 😭\n\nCheck yours on Telegram 👇\nhttps://t.me/howdownbadareyoubot #TON #Web3"
  }
];

export function generateRoasts(params) {
  const {
    walletAddress,
    totalCurrentValueUsd,
    estimatedPnlUsd,
    downBadScore,
    isProfitable,
    levelText,
    personalityTitle,
    biggestBagSymbol,
    biggestLoserSymbol
  } = params;

  let primaryRoast = "";

  if (isProfitable) {
    primaryRoast = `Unbelievable. You actually made profit in this market. While everyone else is breathing medical-grade Copium, your portfolio is up. Enjoy the green candles before the dev pulls the liquidity pool.`;
  } else if (downBadScore >= 80) {
    primaryRoast = `Grandmaster Exit Liquidity Provider! You have managed to hold every single meme Jetton to absolute zero. If there was an Olympic medal for catching falling knives with your teeth, you'd be a national hero.`;
  } else if (downBadScore >= 50) {
    primaryRoast = `Solidly Down Bad. Your portfolio is a graveyard of abandoned Telegram meme coins. Your biggest hope right now is that a random dev wakes up and decides to pump $${biggestBagSymbol || 'TON'} by 50,000%.`;
  } else {
    primaryRoast = `Surviving, but barely. You've avoided total annihilation so far, but holding $${biggestLoserSymbol || 'tokens'} shows you still have a soft spot for financial self-harm.`;
  }

  const tweetText = generateTweetText(params);

  return {
    primaryRoast,
    tweetText
  };
}

function generateTweetText(params) {
  const { downBadScore, isProfitable, levelText, personalityTitle, walletAddress } = params;

  const addrShort = `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;

  if (isProfitable) {
    return `I just checked my TON wallet (${addrShort}) on How Down Bad Are You? 💀\n\nResult: ${levelText || 'PROFIT SURVIVOR'}\nPersonality: ${personalityTitle || 'SURVIVOR'}\n\nAm I actually winning? Check yours on Telegram 👇\nhttps://t.me/howdownbadareyoubot #TON #Web3`;
  }

  return `I just checked my TON wallet (${addrShort}) on How Down Bad Are You? 💀\n\nResult: ${downBadScore}% DOWN BAD 😭\nPersonality: ${personalityTitle || 'BAG HOLDER'}\n\nRoast your financial decisions on Telegram 👇\nhttps://t.me/howdownbadareyoubot #TON #Web3`;
}
