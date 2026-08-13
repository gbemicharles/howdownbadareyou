export const PEDRO_KEYS = ['rockstar', 'rekt', 'copium', 'wizard', 'clown', 'diamond', 'rocket'];

export const getPedroKeyForPersonality = (title, isProfitable, score) => {
  if (isProfitable) return 'rockstar';
  if (!title) return 'rockstar';
  const t = title.toUpperCase();
  if (t.includes('ONE-TOKEN') || t.includes('BELIEVER')) return 'rocket';
  if (t.includes('BAG COLLECTOR')) return 'diamond';
  if (t.includes('AIRDROP')) return 'clown';
  if (t.includes('EXIT LIQUIDITY') || score >= 80) return 'rekt';
  if (t.includes('DIAMOND')) return 'diamond';
  if (t.includes('ASTROLOGY') || t.includes('WIZARD')) return 'wizard';
  if (score >= 50) return 'copium';
  return 'rockstar';
};
