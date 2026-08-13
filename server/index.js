import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import { isValidTonAddress, getWalletRawData, DEMO_WALLETS } from './services/tonProvider.js';
import { analyzeWallet } from './services/walletAnalyzer.js';
import { calculatePersonalityAndScores, getConcentrationComment } from './services/personalityEngine.js';
import { generateRoasts } from './services/roastEngine.js';
import { getCachedWalletData, setCachedWalletData, rateLimiterMiddleware } from './middleware/cacheAndRateLimit.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;
const isProd = process.env.NODE_ENV === 'production';

app.use(cors());
app.use(express.json());
app.use(rateLimiterMiddleware);

const tempImages = new Map();
const TEMP_IMAGE_TTL = 10 * 60 * 1000;

app.use(express.json({ limit: '10mb' }));

app.post('/api/share-image', (req, res) => {
  try {
    const { imageData, mimeType = 'image/png' } = req.body;
    if (!imageData) return res.status(400).json({ error: 'No imageData' });

    const buf = Buffer.from(imageData.replace(/^data:image\/\w+;base64,/, ''), 'base64');
    const id = crypto.randomBytes(12).toString('hex');
    tempImages.set(id, { buf, mime: mimeType, expiresAt: Date.now() + TEMP_IMAGE_TTL });

    for (const [k, v] of tempImages) {
      if (v.expiresAt < Date.now()) tempImages.delete(k);
    }

    res.json({ id, url: `/api/share-image/${id}` });
  } catch (e) {
    res.status(500).json({ error: 'Upload failed' });
  }
});

app.get('/api/share-image/:id', (req, res) => {
  const entry = tempImages.get(req.params.id);
  if (!entry || entry.expiresAt < Date.now()) return res.status(404).send('Not found');
  res.set('Content-Type', entry.mime);
  res.set('Cache-Control', 'no-store');
  res.send(entry.buf);
});

app.get('/api/demos', (req, res) => {
  res.json(Object.values(DEMO_WALLETS).map(d => ({
    address: d.address,
    label: d.label
  })));
});

app.get('/api/roast/:address', async (req, res) => {
  try {
    const rawAddress = req.params.address;
    const bypassCache = req.query.nocache === 'true' || req.query.t;

    if (!isValidTonAddress(rawAddress)) {
      return res.status(400).json({
        error: "That's not a TON wallet bro 💀"
      });
    }

    const address = rawAddress.trim();

    if (!bypassCache) {
      const cached = getCachedWalletData(address);
      if (cached) {
        return res.json({ ...cached, cached: true });
      }
    }

    const rawData = await getWalletRawData(address);
    const analysis = analyzeWallet(rawData);

    if (analysis.totalPositionsCount === 0 && analysis.totalCurrentValueUsd === 0) {
      return res.json({
        emptyWallet: true,
        walletAddress: rawData.address || address,
        message: "We found the wallet.\n\nUnfortunately, there's nothing here to roast 💀"
      });
    }

    const scoreData = calculatePersonalityAndScores(analysis);
    const roasts = generateRoasts(analysis, scoreData.personality, scoreData);

    const concentrationComment = getConcentrationComment(
      analysis.biggestBag ? analysis.biggestBag.concentrationPercent : 0
    );

    const responsePayload = {
      emptyWallet: false,
      walletAddress: rawData.address || address,
      rawAddress: rawData.rawAddress,
      isDemo: analysis.isDemo,
      totalCurrentValueUsd: analysis.totalCurrentValueUsd,
      estimatedCostBasisUsd: analysis.estimatedCostBasisUsd,
      estimatedPnlUsd: analysis.estimatedPnlUsd,
      estimatedPnlPercent: analysis.estimatedPnlPercent,
      downBadScore: scoreData.downBadScore,
      isProfitable: scoreData.isProfitable,
      isBreakeven: scoreData.isBreakeven,
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
      copiumMetrics: analysis.copiumMetrics,
      astrology: analysis.astrology,
      roasts,
      positions: analysis.positions
    };

    setCachedWalletData(address, responsePayload);
    return res.json(responsePayload);

  } catch (err) {
    console.error('[API Error]', err);
    return res.status(500).json({
      error: "The blockchain is having a moment. Try again in a few seconds 💀"
    });
  }
});

if (isProd) {
  const distPath = path.resolve(__dirname, '..', 'dist');
  app.use(express.static(distPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`🔥 How Down Bad Are You API server running on http://localhost:${PORT}`);
});
