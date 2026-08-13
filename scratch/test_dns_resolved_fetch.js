async function resolveDnsToHex(domain) {
  try {
    const res = await fetch(`https://tonapi.io/v2/accounts/${encodeURIComponent(domain)}`);
    if (res.ok) {
      const data = await res.json();
      if (data.address) return data.address;
    }
  } catch (e) {}
  return domain;
}

async function testDnsResolved(domain) {
  console.log(`\n================ Testing DNS Resolved: ${domain} ================`);
  const hexAddr = await resolveDnsToHex(domain);
  console.log(`Resolved [${domain}] -> [${hexAddr}]`);

  // Query events using hexAddr
  const evRes = await fetch(`https://tonapi.io/v2/accounts/${hexAddr}/events?limit=100`);
  console.log('Events HTTP Status:', evRes.status);
  let swapCount = 0;
  if (evRes.ok) {
    const evData = await evRes.json();
    console.log('Events Count:', evData.events?.length || 0);
  }

  // Query jettons using hexAddr
  const jetRes = await fetch(`https://tonapi.io/v2/accounts/${hexAddr}/jettons?currencies=usd`);
  console.log('Jettons HTTP Status:', jetRes.status);
  if (jetRes.ok) {
    const jetData = await jetRes.json();
    console.log('Jettons Count:', jetData.balances?.length || 0);
  }

  // Query Toncenter v3 using hexAddr
  const tcRes = await fetch(`https://toncenter.com/api/v3/jetton/wallets?owner_address=${encodeURIComponent(hexAddr)}&limit=500`);
  console.log('Toncenter v3 HTTP Status:', tcRes.status);
  if (tcRes.ok) {
    const tcData = await tcRes.json();
    console.log('Toncenter v3 Wallets Count:', tcData.jetton_wallets?.length || 0);
  }
}

async function run() {
  await testDnsResolved('damx.ton');
  await testDnsResolved('gusgus.ton');
  await testDnsResolved('gbemicharles.ton');
}

run();
