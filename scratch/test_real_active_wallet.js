import { getWalletRawData } from '../server/services/tonProvider.js';
import { analyzeWallet } from '../server/services/walletAnalyzer.js';
import { calculatePersonalityAndScores } from '../server/services/personalityEngine.js';

async function testRealWallet(address) {
  console.log(`\n================ Testing Active Wallet: ${address} ================`);
  const rawData = await getWalletRawData(address);
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

async function run() {
  await testRealWallet('0:1b17e1d8a5e6f28990a4f7716d05dd7d3ce1425fd3c21665f3de9ae3c58a6350');
  await testRealWallet('EQB1wggf4t2wsl0sxdxx2hhd0uq087ydblfk652tnp80b2r7');
}

run();
