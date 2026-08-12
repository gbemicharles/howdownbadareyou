/**
 * Wallet Duel / Challenge a Friend Battle Engine
 * Compares two wallets side-by-side to crown the "DOWN BAD CHAMPION 👑💀" (The wallet with the BIGGEST loss)!
 */

export function compareWalletsForDuel(walletAData, walletBData) {
  if (!walletAData || !walletBData) return null;

  const scoreA = walletAData.downBadScore || 0;
  const scoreB = walletBData.downBadScore || 0;

  const pnlA = walletAData.estimatedPnlUsd || 0;
  const pnlB = walletBData.estimatedPnlUsd || 0;

  let winner = 'A';
  let loser = 'B';

  // IN DOWN BAD DUEL: HIGHER DOWN BAD SCORE / WORSE LOSS = CHAMPION 👑
  if (scoreA > scoreB) {
    winner = 'A';
    loser = 'B';
  } else if (scoreA < scoreB) {
    winner = 'B';
    loser = 'A';
  } else {
    // Tie breaker when Down Bad scores are equal:
    // If one is in loss (pnl < 0) and the other in profit (pnl >= 0), the loss wallet wins
    if (pnlA < 0 && pnlB >= 0) {
      winner = 'A';
      loser = 'B';
    } else if (pnlB < 0 && pnlA >= 0) {
      winner = 'B';
      loser = 'A';
    } else if (pnlA <= pnlB) {
      // Lower P&L USD wins (worse loss)
      winner = 'A';
      loser = 'B';
    } else {
      winner = 'B';
      loser = 'A';
    }
  }

  const winnerData = winner === 'A' ? walletAData : walletBData;
  const loserData = loser === 'A' ? walletAData : walletBData;

  const winnerAddrShort = `${winnerData.walletAddress.slice(0, 6)}...${winnerData.walletAddress.slice(-4)}`;
  const loserAddrShort = `${loserData.walletAddress.slice(0, 6)}...${loserData.walletAddress.slice(-4)}`;

  const winnerPnlPct = Math.round(winnerData.estimatedPnlPercent || 0);
  const loserPnlPct = Math.round(loserData.estimatedPnlPercent || 0);
  const scoreDiff = Math.abs(scoreA - scoreB);

  let battleCommentary = "";
  let tweetText = "";

  if (scoreA === scoreB && pnlA === pnlB) {
    battleCommentary = `IT'S A DEAD DRAW! Both wallets are equally ${scoreA}% Down Bad. You are twin bag collectors in the same Telegram copium voice chat 🤝`;
    tweetText = `⚔️ WALLET DUEL BATTLE RESULT ⚔️\n\n${winnerAddrShort} tied with ${loserAddrShort} (${scoreA}% Down Bad)! Both equal Down Bad legends 🤝\n\nTest your wallet duel on Telegram at https://t.me/howdownbadareyoubot 💀 #TON #Web3`;
  } else if (!winnerData.isProfitable && loserData.isProfitable) {
    // Winner is Down Bad, Loser is in Profit
    battleCommentary = `CROWNED DOWN BAD CHAMPION: ${winnerAddrShort}! While ${loserAddrShort} committed the ultimate sin of making profit (+${loserPnlPct}% Up Bad), ${winnerAddrShort} stayed true to the trenches with an epic ${winnerData.downBadScore}% Down Bad score 👑💀`;
    tweetText = `⚔️ WALLET DUEL BATTLE RESULT ⚔️\n\n${winnerAddrShort} (${winnerData.downBadScore}% Down Bad 👑💀) CROWNED DOWN BAD CHAMPION against ${loserAddrShort} (+${loserPnlPct}% Up Bad)!\n\nWho is down badder in your group? Test your wallet on Telegram at https://t.me/howdownbadareyoubot 💀 #TON #Web3`;
  } else if (winnerData.isProfitable && loserData.isProfitable) {
    // Both in profit: Smaller profit wins Down Badder
    battleCommentary = `DOWN BAD CHAMPION: ${winnerAddrShort}! While ${loserAddrShort} made +${loserPnlPct}% profit, ${winnerAddrShort} only made +${winnerPnlPct}%, bringing them dangerously closer to being rekt 💀`;
    tweetText = `⚔️ WALLET DUEL BATTLE RESULT ⚔️\n\n${winnerAddrShort} (+${winnerPnlPct}% Up Bad 👑💀) CROWNED DOWN BAD CHAMPION against ${loserAddrShort} (+${loserPnlPct}% Up Bad)!\n\nTest your wallet duel on Telegram at https://t.me/howdownbadareyoubot 💀 #TON #Web3`;
  } else {
    // Both down bad: Worse loss wins Down Bad Champion
    battleCommentary = `CROWNED DOWN BAD CHAMPION: ${winnerAddrShort}! With a brutal ${winnerData.downBadScore}% Down Bad score, ${winnerAddrShort} completely out-rekt ${loserAddrShort} (${loserData.downBadScore}% Down Bad) by ${scoreDiff.toFixed(0)}%! Undisputed Bag Collector King 👑💀`;
    tweetText = `⚔️ WALLET DUEL BATTLE RESULT ⚔️\n\n${winnerAddrShort} (${winnerData.downBadScore}% Down Bad 👑💀) CROWNED DOWN BAD CHAMPION against ${loserAddrShort} (${loserData.downBadScore}% Down Bad)!\n\nWho is down badder in your group? Test your wallet on Telegram at https://t.me/howdownbadareyoubot 💀 #TON #Web3`;
  }

  return {
    winner,
    loser,
    scoreDiff,
    walletAData,
    walletBData,
    winnerData,
    loserData,
    battleCommentary,
    tweetText
  };
}
