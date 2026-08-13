async function testAddressNormalization(inputAddr) {
  console.log(`\n--- Testing Input Address: ${inputAddr} ---`);
  try {
    const res = await fetch(`https://tonapi.io/v2/accounts/${encodeURIComponent(inputAddr)}`);
    console.log('HTTP Status:', res.status);
    if (res.ok) {
      const data = await res.json();
      console.log('Normalized Account Address:', data.address);
      console.log('Account Status:', data.status);
      console.log('TON Balance (nTON):', data.balance);
      return data.address;
    }
  } catch (e) {
    console.error('Fetch error:', e.message);
  }
  return null;
}

async function run() {
  // Test various real TON wallet address formats
  const addresses = [
    'UQAAxJ8n1L2y5H_8Q4S6w7X9y0z1a2b3c4d5e6f7g8h9i0j', // UQ base64url format
    'EQBvW8Z5huBkMJYdnfAEMnTW9Xn1_Rrekt_Trader_Demo_01',
    '0:1b17e1d8a5e6f28990a4f7716d05dd7d3ce1425fd3c21665f3de9ae3c58a6350',
    'EQA_Survivor_Lucky_Gainer_Winning_Big_777777'
  ];

  for (const addr of addresses) {
    await testAddressNormalization(addr);
  }
}

run();
