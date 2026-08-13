async function resolveTonDns(domain) {
  console.log(`\n--- Resolving DNS for: ${domain} ---`);
  
  // Method 1: Account info lookup
  try {
    const res = await fetch(`https://tonapi.io/v2/accounts/${encodeURIComponent(domain)}`);
    console.log(`Method 1 (accounts/${domain}) HTTP status:`, res.status);
    if (res.ok) {
      const data = await res.json();
      console.log('Method 1 (accounts) address:', data.address);
      if (data.address) return data.address;
    }
  } catch (e) {
    console.warn('Method 1 failed:', e.message);
  }

  // Method 2: DNS resolve endpoint
  try {
    const res = await fetch(`https://tonapi.io/v2/dns/${encodeURIComponent(domain)}/resolve`);
    console.log(`Method 2 (dns/${domain}/resolve) HTTP status:`, res.status);
    if (res.ok) {
      const data = await res.json();
      console.log('Method 2 (dns/resolve) wallet:', data.wallet);
      if (data.wallet?.address) return data.wallet.address;
    }
  } catch (e) {
    console.warn('Method 2 failed:', e.message);
  }

  return null;
}

async function run() {
  const domains = ['gusgus.ton', 'gbemicharles.ton', 'damx.ton'];
  for (const d of domains) {
    const resolved = await resolveTonDns(d);
    console.log(`>>> FINAL RESOLUTION RESULT [${d}] => ${resolved}`);
  }
}

run();
