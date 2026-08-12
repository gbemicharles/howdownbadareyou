import express from 'express';
import cors from 'cors';
import { isValidTonAddress, getWalletRawData, DEMO_WALLETS } from './services/tonProvider.js';
import { analyzeWallet } from './services/walletAnalyzer.js';
import { calculatePersonalityAndScores, getConcentrationComment } from './services/personalityEngine.js';
import { generateRoasts } from './services/roastEngine.js';
import { getCachedWalletData, setCachedWalletData, rateLimiterMiddleware } from './middleware/cacheAndRateLimit.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(rateLimiterMiddleware);

// Get Demo Wallets endpoint
app.get('/api/demos', (req, res) => {
  res.json(Object.values(DEMO_WALLETS).map(d => ({
    address: d.address,
    label: d.label
  })));
});

// Main Roast API Endpoint
app.get('/api/roast/:address', async (req, res) => {
  try {
    const rawAddress = req.params.address;
    const bypassCache = req.query.nocache === 'true' || req.query.t;

    // 1. Validate TON Address
    if (!isValidTonAddress(rawAddress)) {
      return res.status(400).json({
        error: "That's not a TON wallet bro 💀"
      });
    }

    const address = rawAddress.trim();

    // 2. Check Cache (unless bypassed)
    if (!bypassCache) {
      const cached = getCachedWalletData(address);
      if (cached) {
        return res.json({ ...cached, cached: true });
      }
    }

    // 3. Retrieve raw blockchain data
    const rawData = await getWalletRawData(address);

    // 4. Analyze Wallet
    const analysis = analyzeWallet(rawData);

    // Handle Empty Wallet case
    if (analysis.totalPositionsCount === 0 && analysis.totalCurrentValueUsd === 0) {
      return res.json({
        emptyWallet: true,
        walletAddress: address,
        message: "We found the wallet.\n\nUnfortunately, there's nothing here to roast 💀"
      });
    }

    // 5. Calculate Scores & Personality
    const scoreData = calculatePersonalityAndScores(analysis);

    // 6. Generate Roasts & Share Text
    const roasts = generateRoasts(analysis, scoreData.personality, scoreData);

    const concentrationComment = getConcentrationComment(
      analysis.biggestBag ? analysis.biggestBag.concentrationPercent : 0
    );

    const responsePayload = {
      emptyWallet: false,
      walletAddress: address,
      isDemo: analysis.isDemo,
      totalCurrentValueUsd: analysis.totalCurrentValueUsd,
      estimatedCostBasisUsd: analysis.estimatedCostBasisUsd,
      estimatedPnlUsd: analysis.estimatedPnlUsd,
      estimatedPnlPercent: analysis.estimatedPnlPercent,
      downBadScore: scoreData.downBadScore,
      isProfitable: scoreData.isProfitable,
      levelText: scoreData.levelText,
      personality: scoreData.personality,
      metrics: scoreData.metrics,
      ignoredTokensCount: analysis.ignoredTokensCount,
      totalPositionsCount: analysis.totalPositionsCount,
      losingPositionsCount: analysis.losingPositionsCount,
      winningPositionsCount: analysis.winningPositionsCount,
      biggestBag: analysis.biggestBag,
      biggestLoser: analysis.biggestLoser,
      biggestWinner: analysis.biggestWinner,
      concentrationComment,
      roasts,
      positions: analysis.positions
    };

    // Save to Cache
    setCachedWalletData(address, responsePayload);

    return res.json(responsePayload);

  } catch (err) {
    console.error('[API Error]', err);
    return res.status(500).json({
      error: "The blockchain is having a moment. Try again in a few seconds 💀"
    });
  }
});

app.listen(PORT, () => {
  console.log(`🔥 How Down Bad Are You API server running on http://localhost:${PORT}`);
});
