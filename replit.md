# How Down Bad Are You? 💀

A Telegram Mini App that analyzes TON wallet addresses and generates humorous "roasts" about a user's crypto portfolio decisions.

## Stack

- **Frontend**: React 18 + Vite + Tailwind CSS (port 5000)
- **Backend**: Express.js REST API (port 3001)
- **Blockchain data**: Public APIs — TonAPI.io, Toncenter v3, Ston.fi, DeDust (no API key required)

## How to run

The workflow `Start application` runs both services together:

```
node server/index.js & npm run dev
```

- Vite dev server on port **5000** (proxies `/api` → port 3001)
- Express API server on port **3001**

## Project structure

```
server/
  index.js                  # Express app entry point
  services/
    tonProvider.js          # TON blockchain data fetching
    walletAnalyzer.js       # Portfolio analysis logic
    personalityEngine.js    # Scoring & personality types
    roastEngine.js          # Roast text generation
    astrologyEngine.js      # Financial astrology feature
    copiumEngine.js         # Copium calculator feature
    duelEngine.js           # Wallet duel feature
  middleware/
    cacheAndRateLimit.js    # In-memory cache + rate limiting
src/
  App.jsx                   # Root component
  components/               # UI components (Homepage, ResultDashboard, modals, etc.)
  utils/
    telegramWebApp.js       # Telegram WebApp SDK helpers

public/assets/              # Static assets
scripts/                    # Utility scripts
```

## User preferences

- Keep existing project structure and stack
