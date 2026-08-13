import { getWalletRawData } from '../server/services/tonProvider.js';
import { analyzeWallet } from '../server/services/walletAnalyzer.js';
import { calculatePersonalityAndScores } from '../server/services/personalityEngine.js';

async function testUqAddress() {
  const uqAddr = 'UQC1B7HYpebyikpKx3EWVf3NHzFCX9PCx1Xz3p2jxYpjUGiB';
  console.log(`\n================ Testing UQ Address: ${uqAddr} ================`);
  const rawData = await getWalletRawData(uqAddr);
  console.log('Raw Data Address:', rawData.address);
  console.log('Raw Data RawAddress:', rawData.rawAddress);
  console.log('Liquid TON Balance:', rawData.tonBalance);
  console.log('Token Positions Count:', rawData.tokens.length);

  const analysis = analyzeWallet(rawData);
  console.log('Analysis Total Value USD:', analysis.totalCurrentValueUsd);
  console.log('Analysis Est. PnL USD:', analysis.estimatedPnlUsd);
  console.log('Analysis Total Positions:', analysis.totalPositionsCount);

  const scoreData = calculatePersonalityAndScores(analysis);
  console.log('Down Bad Score:', scoreData.downBadScore);
  console.log('Personality:', scoreData.personality.title);
}

testUqAddress();
