import { getWalletRawData } from '../server/services/tonProvider.js';
import { analyzeWallet } from '../server/services/walletAnalyzer.js';
import { calculatePersonalityAndScores } from '../server/services/personalityEngine.js';

async function testDnsWallet(domain) {
  console.log(`\n================ Testing DNS Wallet: ${domain} ================`);
  const rawData = await getWalletRawData(domain);
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

async function main() {
  await testDnsWallet('gusgus.ton');
  await testDnsWallet('gbemicharles.ton');
  await testDnsWallet('damx.ton');
}

main();
