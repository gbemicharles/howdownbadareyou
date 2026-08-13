function parseTonAddressToRaw(address) {
  if (!address || typeof address !== 'string') return null;
  let cleaned = address.trim().replace(/^["']|["']$/g, '');
  if (cleaned.startsWith('ton://transfer/')) {
    cleaned = cleaned.replace('ton://transfer/', '');
  }

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
    console.log(`Buffer length for [${cleaned.slice(0, 10)}...]:`, buf.length);
    if (buf.length === 36) {
      let workchain = buf[1];
      if (workchain === 255) workchain = -1;
      const hex = buf.slice(2, 34).toString('hex');
      return `${workchain}:${hex}`;
    }
  } catch (e) {
    console.warn('Decode error:', e);
  }

  if (/^(EQ|UQ|kQ|0Q|Ef)[A-Za-z0-9_-]{34,55}$/.test(cleaned)) {
    return cleaned;
  }

  return null;
}

// Real user TON addresses (UQ and EQ formats)
const testAddresses = [
  'UQC1B7HYpebyikpKx3EWVf3NHzFCX9PCx1Xz3p2jxYpjUGiB',
  'EQBvW8Z5huBkMJYdnfAEMnTW9Xn1_Rrekt_Trader_Demo_01',
  'EQAx-1234567890abcdef1234567890abcdef1234567890a'
];

testAddresses.forEach(addr => {
  const raw = parseTonAddressToRaw(addr);
  console.log(`INPUT: ${addr}\nRAW:   ${raw}\n`);
});
