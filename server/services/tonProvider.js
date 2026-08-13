/**
 * TON Blockchain Data Provider Layer
 * Queries live TON blockchain data via TonAPI.io, Toncenter, Ston.fi, and DeDust
 * Ticker Note: Native TON token is represented with symbol 'GRAM' (GRAM / Toncoin).
 */

// Registry of officially verified contracts for major bluechip, stablecoin, & wrapped assets
const OFFICIAL_BLUECHIP_CONTRACTS = new Set([
  '0:b113a994b5024a16719f69139328eb759596c38a25f59028b146fecdc3621dfe', // Tether USD (USD₮)
  'eqcxe6mutqjkfngfarotkot1lzbdiix1kcixrv7nw2id_sds',
  '0:220f84577bf64e9a039750005740445d3c870425a7534436585145b206771dcc', // jUSDT
  'eqbynbo2vmmhvqc9ejjtje27p2xgjfpgpvphb2egjfkj25mz',
  '0:62b29e061803737b420215b3e21820468bd8a0026e6ef92176ee6fb73d56f671', // jUSDC
  'eqb-mpwrd1g6wknklz_vnv6wq0qyfzfZm2nqr8v5b_j6hj2c',
  '0:2b9b2707248f32810a9501d51c3603d6d07e6e584f938933b9347d4e339a2d8b', // NOT (Notcoin)
  'eqcs2ycxi48ygqqvadu0xcdxdh5uw0-tikd400no05otio9l',
  '0:a3988e04043fb9873a4b9c1d683a48e71b26f582f347eb10b9338f0d86940df1', // DOGS
  'eqdjooeuqdu5xzpbnx2o-kihcypb2vdc80frv-g6hpqnh33v',
  '0:75c40685e13d964a50d2c676d1e434f3b603eb6df77d853e8705f426569106fb', // STON
  'eqb1wggf4t2wsl0sxdxx2hhd0uq087ydblfk652tnp80b2r7'
]);

// Sample Demo Wallets for Instant Roasting & Testing
export const DEMO_WALLETS = {
  rekt_trader: {
    address: "EQBvW8Z5huBkMJYdnfAEMnTW9Xn1_Rrekt_Trader_Demo_01",
    label: "Rekt Trader 💀",
    tonBalance: 42.5,
    tonPriceUsd: 6.80,
    tokens: [
      { symbol: "GRAM", name: "GRAM (Toncoin)", decimals: 9, quantity: 42.5, currentPriceUsd: 6.80, estAcquisitionCost: 850.0 },
      { symbol: "PEPE-TON", name: "Pepe TON Meme", decimals: 9, quantity: 5000000, currentPriceUsd: 0.00008, estAcquisitionCost: 3200.0 },
      { symbol: "NOT", name: "Notcoin", decimals: 9, quantity: 120000, currentPriceUsd: 0.0095, estAcquisitionCost: 2800.0 },
      { symbol: "DOGS", name: "DOGS Community", decimals: 9, quantity: 85000, currentPriceUsd: 0.00065, estAcquisitionCost: 950.0 },
      { symbol: "CATI", name: "Catizen Token", decimals: 9, quantity: 350, currentPriceUsd: 0.42, estAcquisitionCost: 1100.0 },
      { symbol: "SCAM-AIRDROP-1", name: "Claim 10000 GRAM Scam", decimals: 9, quantity: 10000, currentPriceUsd: 0, estAcquisitionCost: 0, isSpam: true },
      { symbol: "SCAM-AIRDROP-2", name: "Free Voucher NFT Token", decimals: 9, quantity: 1, currentPriceUsd: 0, estAcquisitionCost: 0, isSpam: true },
      { symbol: "FREE-REWARD-99", name: "Visit ton-reward-fake.org", decimals: 9, quantity: 500, currentPriceUsd: 0, estAcquisitionCost: 0, isSpam: true },
    ]
  },

  whale_degen: {
    address: "EQDWhale_Degen_Mega_Wallet_000999888777666555444",
    label: "Whale Degen 🐋",
    tonBalance: 1250.0,
    tonPriceUsd: 6.80,
    tokens: [
      { symbol: "GRAM", name: "GRAM (Toncoin)", decimals: 9, quantity: 1250.0, currentPriceUsd: 6.80, estAcquisitionCost: 6200.0 },
      { symbol: "STON", name: "STON.fi Token", decimals: 9, quantity: 4500, currentPriceUsd: 4.10, estAcquisitionCost: 32000.0 },
      { symbol: "SCALE", name: "DeDust Scale", decimals: 9, quantity: 18000, currentPriceUsd: 0.85, estAcquisitionCost: 45000.0 },
      { symbol: "REKT", name: "Rekt Coin", decimals: 9, quantity: 9900000, currentPriceUsd: 0.00012, estAcquisitionCost: 15000.0 },
      { symbol: "SPAM-TOKEN-A", name: "Visit fake-airdrop.com", decimals: 9, quantity: 1, currentPriceUsd: 0, estAcquisitionCost: 0, isSpam: true },
      { symbol: "SPAM-TOKEN-B", name: "Free GRAM Voucher", decimals: 9, quantity: 500, currentPriceUsd: 0, estAcquisitionCost: 0, isSpam: true }
    ]
  },

  diamond_hands: {
    address: "EQB_Diamond_Hands_Hodler_Never_Selling_112233",
    label: "Diamond Hands 💎",
    tonBalance: 310.0,
    tonPriceUsd: 6.80,
    tokens: [
      { symbol: "GRAM", name: "GRAM (Toncoin)", decimals: 9, quantity: 310.0, currentPriceUsd: 6.80, estAcquisitionCost: 1800.0 },
      { symbol: "MY", name: "MyTonWallet Token", decimals: 9, quantity: 8500, currentPriceUsd: 0.25, estAcquisitionCost: 8900.0 },
      { symbol: "NOT", name: "Notcoin", decimals: 9, quantity: 140000, currentPriceUsd: 0.0095, estAcquisitionCost: 5400.0 },
      { symbol: "SPAM-1", name: "Fake Airdrop Token", decimals: 9, quantity: 100, currentPriceUsd: 0, estAcquisitionCost: 0, isSpam: true }
    ]
  },

  airdrop_farmer: {
    address: "EQC_Airdrop_Farmer_100_Small_Positions_998877",
    label: "Airdrop Farmer 🌾",
    tonBalance: 12.4,
    tonPriceUsd: 6.80,
    tokens: [
      { symbol: "GRAM", name: "GRAM (Toncoin)", decimals: 9, quantity: 12.4, currentPriceUsd: 6.80, estAcquisitionCost: 75.0 },
      { symbol: "NOT", name: "Notcoin", decimals: 9, quantity: 4500, currentPriceUsd: 0.0095, estAcquisitionCost: 35.0 },
      { symbol: "DOGS", name: "DOGS", decimals: 9, quantity: 12000, currentPriceUsd: 0.00065, estAcquisitionCost: 8.0 },
      { symbol: "HMSTR", name: "Hamster Kombat", decimals: 9, quantity: 15000, currentPriceUsd: 0.0022, estAcquisitionCost: 33.0 },
      { symbol: "CATI", name: "Catizen", decimals: 9, quantity: 45, currentPriceUsd: 0.42, estAcquisitionCost: 19.0 },
      { symbol: "MAJOR", name: "Major Token", decimals: 9, quantity: 300, currentPriceUsd: 0.80, estAcquisitionCost: 240.0 },
      { symbol: "SPAM-JUNK-1", name: "Junk Spam 1", decimals: 9, quantity: 1, currentPriceUsd: 0, estAcquisitionCost: 0, isSpam: true },
      { symbol: "SPAM-JUNK-2", name: "Junk Spam 2", decimals: 9, quantity: 10, currentPriceUsd: 0, estAcquisitionCost: 0, isSpam: true },
      { symbol: "SPAM-JUNK-3", name: "Junk Spam 3", decimals: 9, quantity: 50, currentPriceUsd: 0, estAcquisitionCost: 0, isSpam: true },
    ]
  },

  survivor_winner: {
    address: "EQA_Survivor_Lucky_Gainer_Winning_Big_777777",
    label: "Survivor 🏆",
    tonBalance: 840.0,
    tonPriceUsd: 6.80,
    tokens: [
      { symbol: "GRAM", name: "GRAM (Toncoin)", decimals: 9, quantity: 840.0, currentPriceUsd: 6.80, estAcquisitionCost: 2400.0 },
      { symbol: "STON", name: "STON.fi", decimals: 9, quantity: 1200, currentPriceUsd: 4.10, estAcquisitionCost: 1500.0 },
      { symbol: "NOT", name: "Notcoin", decimals: 9, quantity: 800000, currentPriceUsd: 0.0095, estAcquisitionCost: 2100.0 }
    ]
  }
};

/**
 * Clean whitespace, quotes, and URI scheme prefixes
 */
export function sanitizeTonAddress(address) {
  if (!address || typeof address !== 'string') return '';
  let cleaned = address.trim().replace(/^["']|["']$/g, '');
  if (cleaned.startsWith('ton://transfer/')) {
    cleaned = cleaned.replace('ton://transfer/', '');
  }
  return cleaned;
}

/**
 * Converts user-friendly base64url TON address (EQ... / UQ...) into raw format (workchain:hex)
 */
export function parseTonAddressToRaw(address) {
  const cleaned = sanitizeTonAddress(address);
  if (!cleaned) return null;

  if (cleaned.toLowerCase().endsWith('.ton')) {
    return cleaned;
  }

  if (/^-?\d+:[a-fA-F0-9]{64}$/.test(cleaned)) {
    return cleaned;
  }

  if (/^[a-fA-F0-9]{64}$/.test(cleaned)) {
    return `0:${cleaned}`;
  }

  try {
    let base64 = cleaned.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4 !== 0) {
      base64 += '=';
    }
    const buf = Buffer.from(base64, 'base64');
    if (buf.length === 36) {
      let workchain = buf[1];
      if (workchain === 255) workchain = -1;
      const hex = buf.slice(2, 34).toString('hex');
      return `${workchain}:${hex}`;
    }
  } catch (e) {}

  if (/^(EQ|UQ|kQ|0Q|Ef)[A-Za-z0-9_-]{34,55}$/.test(cleaned)) {
    return cleaned;
  }

  return null;
}

/**
 * Validates whether a string resembles a valid TON wallet address
 */
export function isValidTonAddress(address) {
  if (!address || typeof address !== 'string') return false;
  const cleaned = sanitizeTonAddress(address);
  if (cleaned.length < 3) return false;

  if (cleaned.toLowerCase().endsWith('.ton')) {
    return true;
  }

  if (Object.values(DEMO_WALLETS).some(d => d.address.toLowerCase() === cleaned.toLowerCase())) {
    return true;
  }

  const raw = parseTonAddressToRaw(cleaned);
  return raw !== null;
}

/**
 * Multi-DEX price map cache (Ston.fi Assets + Ston.fi Pools + DeDust Pools)
 * Indexed STRICTLY by Contract Address to prevent fake symbol price hijacking!
 */
let dexPriceMapCache = null;
let dexPriceMapCacheTime = 0;

async function getDexPriceMap(tonPriceUsd = 1.35) {
  if (dexPriceMapCache && (Date.now() - dexPriceMapCacheTime < 10 * 60 * 1000)) {
    return dexPriceMapCache;
  }

  const priceMap = new Map();

  // 1. Ston.fi Assets (Strict contract address mapping)
  try {
    const res = await fetch('https://api.ston.fi/v1/assets');
    if (res.ok) {
      const data = await res.json();
      if (data.asset_list && Array.isArray(data.asset_list)) {
        for (const asset of data.asset_list) {
          const price = parseFloat(asset.dex_usd_price || "0");
          if (price > 0 && price < 50000) {
            if (asset.contract_address) {
              const contractLower = asset.contract_address.toLowerCase();
              priceMap.set(contractLower, price);
              const rawContract = parseTonAddressToRaw(asset.contract_address);
              if (rawContract) {
                priceMap.set(rawContract.toLowerCase(), price);
              }
            }
          }
        }
      }
    }
  } catch (e) {
    console.warn('[TON Provider] Ston.fi assets price fetch warning:', e.message);
  }

  // 2. Ston.fi Pools (LP Jettons)
  try {
    const poolRes = await fetch('https://api.ston.fi/v1/pools');
    if (poolRes.ok) {
      const poolData = await poolRes.json();
      for (const pool of poolData.pool_list || []) {
        const lpPrice = parseFloat(pool.lp_price_usd || "0");
        if (lpPrice > 0 && pool.address) {
          const addrLower = pool.address.toLowerCase();
          priceMap.set(addrLower, lpPrice);
          const raw = parseTonAddressToRaw(pool.address);
          if (raw) priceMap.set(raw.toLowerCase(), lpPrice);
        }
      }
    }
  } catch (e) {
    console.warn('[TON Provider] Ston.fi pools price fetch warning:', e.message);
  }

  // 3. DeDust Pools (Strict contract address mapping with minimum 2 TON reserve liquidity)
  try {
    const dedustRes = await fetch('https://api.dedust.io/v2/pools');
    if (dedustRes.ok) {
      const pools = await dedustRes.json();
      for (const pool of pools || []) {
        if (!pool.assets || !pool.reserves || pool.assets.length < 2 || pool.reserves.length < 2) continue;

        const asset0 = pool.assets[0];
        const asset1 = pool.assets[1];
        const res0 = parseFloat(pool.reserves[0] || "0");
        const res1 = parseFloat(pool.reserves[1] || "0");

        if (res0 <= 0 || res1 <= 0) continue;

        let tonRes = 0;
        let tokenAsset = null;
        let tokenRes = 0;

        if (asset0.type === 'native') {
          tonRes = res0 / 1e9;
          tokenAsset = asset1;
          tokenRes = res1 / Math.pow(10, asset1.metadata?.decimals ? parseInt(asset1.metadata.decimals) : 9);
        } else if (asset1.type === 'native') {
          tonRes = res1 / 1e9;
          tokenAsset = asset0;
          tokenRes = res0 / Math.pow(10, asset0.metadata?.decimals ? parseInt(asset0.metadata.decimals) : 9);
        }

        if (tonRes >= 2.0 && tokenRes > 0 && tokenAsset && tokenAsset.address) {
          const tokenPrice = (tonRes * tonPriceUsd) / tokenRes;

          if (tokenPrice > 0 && tokenPrice < 50000) {
            const contractAddr = tokenAsset.address.toLowerCase();
            const raw = parseTonAddressToRaw(tokenAsset.address);

            if (!priceMap.has(contractAddr)) {
              priceMap.set(contractAddr, tokenPrice);
            }
            if (raw && !priceMap.has(raw.toLowerCase())) {
              priceMap.set(raw.toLowerCase(), tokenPrice);
            }
          }
        }
      }
    }
  } catch (e) {
    console.warn('[TON Provider] DeDust pools price fetch warning:', e.message);
  }

  dexPriceMapCache = priceMap;
  dexPriceMapCacheTime = Date.now();
  return priceMap;
}

/**
 * Fetch raw live blockchain data for a TON wallet address or TON DNS domain
 */
export async function getWalletRawData(address) {
  const cleaned = sanitizeTonAddress(address);

  // Check demo wallet match first
  for (const demoKey of Object.keys(DEMO_WALLETS)) {
    const demo = DEMO_WALLETS[demoKey];
    if (demo.address.toLowerCase() === cleaned.toLowerCase()) {
      return {
        address: demo.address,
        isDemo: true,
        tonBalance: demo.tonBalance,
        tonPriceUsd: demo.tonPriceUsd,
        tokens: demo.tokens,
      };
    }
  }

  let rawAddr = parseTonAddressToRaw(cleaned) || cleaned;

  // AUTOMATIC TON DNS RESOLUTION FOR .ton DOMAINS (e.g. gusgus.ton, damx.ton, gbemicharles.ton)
  if (cleaned.toLowerCase().endsWith('.ton')) {
    try {
      const dnsRes = await fetch(`https://tonapi.io/v2/accounts/${encodeURIComponent(cleaned)}`);
      if (dnsRes.ok) {
        const dnsData = await dnsRes.json();
        if (dnsData.address) {
          rawAddr = dnsData.address;
        }
      }
    } catch (e) {
      console.warn('[TON Provider] DNS resolution failed for:', cleaned, e);
    }
  }

  // Query live TON API, Staking Pools, Toncenter v3, and DEX price feeds concurrently using resolved rawAddr
  const [accRes, jetRes, rateRes, evRes, stakRes, toncenterRes] = await Promise.all([
    fetch(`https://tonapi.io/v2/accounts/${encodeURIComponent(rawAddr)}`).catch(() => null),
    fetch(`https://tonapi.io/v2/accounts/${encodeURIComponent(rawAddr)}/jettons?currencies=usd`).catch(() => null),
    fetch(`https://tonapi.io/v2/rates?tokens=ton&currencies=usd`).catch(() => null),
    fetch(`https://tonapi.io/v2/accounts/${encodeURIComponent(rawAddr)}/events?limit=100`).catch(() => null),
    fetch(`https://tonapi.io/v2/staking/nominator/${encodeURIComponent(rawAddr)}/pools`).catch(() => null),
    fetch(`https://toncenter.com/api/v3/jetton/wallets?owner_address=${encodeURIComponent(rawAddr)}&limit=500`).catch(() => null)
  ]);

  let tonBalance = 0;
  let tonPriceUsd = 6.80;

  if (rateRes && rateRes.ok) {
    try {
      const rateData = await rateRes.json();
      if (rateData.rates?.TON?.prices?.USD) {
        tonPriceUsd = parseFloat(rateData.rates.TON.prices.USD);
      }
    } catch (e) {}
  }

  const dexPriceMap = await getDexPriceMap(tonPriceUsd);

  if (accRes && accRes.ok) {
    try {
      const accData = await accRes.json();
      tonBalance = parseInt(accData.balance || "0") / 1e9;
    } catch (e) {}
  }

  // Check Staking Nominator Pools (Tonkeeper Earn, Tonstakers, Bemo, TF Pools)
  let stakedTonBalance = 0;
  if (stakRes && stakRes.ok) {
    try {
      const stakData = await stakRes.json();
      for (const pool of stakData.pools || []) {
        const amt = parseFloat(pool.amount || "0") / 1e9;
        if (amt > 0) stakedTonBalance += amt;
      }
    } catch (e) {}
  }

  // Deep transaction & event analysis for DEX swaps
  const swapCosts = new Map();

  if (evRes && evRes.ok) {
    try {
      const evData = await evRes.json();
      const events = evData.events || [];

      for (const ev of events) {
        if (!ev.actions) continue;
        for (const action of ev.actions) {
          if (action.type === 'JettonSwap' || action.type === 'Swap') {
            const swap = action.JettonSwap || action.Swap || {};
            const jettonOut = swap.jetton_master_out || {};
            const symbolOut = (jettonOut.symbol || "").toUpperCase();
            const tonSpent = parseFloat(swap.ton_in || "0") / 1e9;
            const usdSpent = tonSpent > 0 ? (tonSpent * tonPriceUsd) : (swap.ton_out ? (parseFloat(swap.ton_out) / 1e9 * tonPriceUsd) : 0);

            if (symbolOut && usdSpent > 0) {
              const currentSpent = swapCosts.get(symbolOut) || 0;
              swapCosts.set(symbolOut, currentSpent + usdSpent);
            }
          }
        }
      }
    } catch (e) {}
  }

  const tokenMap = new Map();

  // Total TON = Native liquid balance + Staked Pool balance
  const totalTonBalance = tonBalance + stakedTonBalance;

  // Add native GRAM (Toncoin) balance if > 0
  if (totalTonBalance > 0) {
    const gramSwapCost = swapCosts.get("GRAM") || 0;
    const gramCostBasis = gramSwapCost > 0 ? gramSwapCost : (totalTonBalance * tonPriceUsd);

    tokenMap.set("GRAM", {
      symbol: "GRAM",
      name: stakedTonBalance > 0 ? "GRAM (Native + Staked)" : "GRAM (Toncoin)",
      decimals: 9,
      quantity: totalTonBalance,
      currentPriceUsd: tonPriceUsd,
      estAcquisitionCost: gramCostBasis,
      isSpam: false
    });
  }

  // Parse Jetton balances from TonAPI
  if (jetRes && jetRes.ok) {
    try {
      const jetData = await jetRes.json();
      const balances = jetData.balances || [];

      for (const b of balances) {
        const meta = b.jetton || {};

        const decimals = (meta.decimals !== undefined && meta.decimals !== null && meta.decimals !== "") 
          ? parseInt(meta.decimals) 
          : 9;

        const rawQty = parseFloat(b.balance || "0");
        const quantity = rawQty / Math.pow(10, decimals);

        if (quantity <= 0) continue;

        let symbol = (meta.symbol || "UNKNOWN").toUpperCase();
        let name = meta.name || "Unknown Jetton";
        const contractAddr = (meta.address || b.jetton?.address || "").toLowerCase();
        const rawContract = parseTonAddressToRaw(contractAddr) || contractAddr;

        // Standardize TON symbol to GRAM
        if (symbol === "TON") {
          symbol = "GRAM";
          name = "GRAM (Toncoin)";
        }

        const isVerifiedBluechip = OFFICIAL_BLUECHIP_CONTRACTS.has(contractAddr) || OFFICIAL_BLUECHIP_CONTRACTS.has(rawContract.toLowerCase());
        const isStablecoin = symbol === "USDT" || symbol === "USD₮" || symbol === "USDC" || symbol === "JUSDT" || symbol === "JUSDC";

        // Determine price USD STRICTLY by contract address
        let priceUsd = b.price?.prices?.USD ? parseFloat(b.price.prices.USD) : 0;

        if (priceUsd === 0 && dexPriceMap.size > 0) {
          priceUsd = 
            dexPriceMap.get(contractAddr) || 
            dexPriceMap.get(rawContract.toLowerCase()) || 
            0;
        }

        // Fallback $1.00 for verified official stablecoins ONLY!
        if (priceUsd === 0) {
          if (isVerifiedBluechip && isStablecoin) {
            priceUsd = 1.00;
          } else if (symbol === "TSTON" || symbol === "STTON" || symbol === "HTON" || symbol === "WTON") {
            priceUsd = tonPriceUsd * 1.05;
          }
        }

        // Deep estimated acquisition cost basis:
        // STABLECOINS ALWAYS MATCH CURRENT HELD VALUE ($1.00 USD PEG = 0.0% P&L)
        let estCost = 0;
        if (isStablecoin && (isVerifiedBluechip || priceUsd > 0)) {
          estCost = quantity * (priceUsd || 1.00);
        } else {
          const swapCost = swapCosts.get(symbol) || 0;
          estCost = swapCost > 0 ? swapCost : (priceUsd > 0 ? quantity * priceUsd : 0);
        }

        const isExplicitPhishingScam = 
          name.toUpperCase().includes("VISIT") || 
          name.toUpperCase().includes("CLAIM-TON") || 
          name.toUpperCase().includes("FREE-AIRDROP") ||
          (!isVerifiedBluechip && isStablecoin && quantity > 10000);

        const isSpam = isExplicitPhishingScam || (!isVerifiedBluechip && priceUsd === 0 && quantity > 100000);

        const key = contractAddr || symbol;
        tokenMap.set(key, {
          symbol: meta.symbol || symbol,
          name,
          decimals,
          quantity,
          currentPriceUsd: priceUsd,
          estAcquisitionCost: estCost,
          isSpam
        });
      }
    } catch (e) {}
  }

  // Merge Toncenter v3 Jetton Wallets fallback
  if (toncenterRes && toncenterRes.ok) {
    try {
      const tcData = await toncenterRes.json();
      for (const w of tcData.jetton_wallets || []) {
        const masterAddr = (w.jetton || w.address || "").toLowerCase();
        if (masterAddr && !tokenMap.has(masterAddr)) {
          const rawQty = parseFloat(w.balance || "0");
          const quantity = rawQty / 1e9;
          if (quantity > 0) {
            tokenMap.set(masterAddr, {
              symbol: "JETTON",
              name: "TON Jetton Wallet",
              decimals: 9,
              quantity,
              currentPriceUsd: 0,
              estAcquisitionCost: 0,
              isSpam: false
            });
          }
        }
      }
    } catch (e) {}
  }

  return {
    address: cleaned, // Preserve original DNS address (e.g. gusgus.ton)
    rawAddress: rawAddr,
    isDemo: false,
    tonBalance: totalTonBalance,
    tonPriceUsd,
    tokens: Array.from(tokenMap.values())
  };
}
