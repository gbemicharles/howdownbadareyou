import { getWalletRawData } from '../server/services/tonProvider.js';
import { analyzeWallet } from '../server/services/walletAnalyzer.js';
import { calculatePersonalityAndScores } from '../server/services/personalityEngine.js';

async function main() {
  const testAddresses = [
    'gusgus.ton',
    'damx.ton',
    'EQBvW8Z5huBkMJYdnfAEMnTW9Xn1_Rrekt_Trader_Demo_01',
    'EQCo9kHiyX3qvovvM40gOH8H-k73HisMfSf5xq5MFTeP10G0'
  ];

  for (const addr of testAddresses) {
    console.log(`\n================ Testing [${addr}] ================`);
    try {
      const rawData = await getWalletRawData(addr);
      console.log(`Cleaned address: ${rawData.address}`);
      console.log(`Raw address: ${rawData.rawAddress}`);
      console.log(`TON Balance: ${rawData.tonBalance} (Price: $${rawData.tonPriceUsd})`);
      console.log(`Total Token Count: ${rawData.tokens.length}`);

      const analysis = analyzeWallet(rawData);
      console.log(`Analysis Total Holdings Value USD: $${analysis.totalCurrentValueUsd}`);
      console.log(`Analysis Total Cost Basis USD: $${analysis.estimatedCostBasisUsd}`);
      console.log(`Analysis Est PnL USD: $${analysis.estimatedPnlUsd} (${analysis.estimatedPnlPercent}%)`);

      const scores = calculatePersonalityAndScores(analysis);
      console.log(`Down Bad Score: ${scores.downBadScore}%`);
      console.log(`Is Profitable: ${scores.isProfitable}`);
      console.log(`Personality Title: ${scores.personality.title}`);
    } catch (e) {
      console.error(`Error testing [${addr}]:`, e);
    }
  }
}

main();
