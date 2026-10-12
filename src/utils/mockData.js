const MOCK_ASSETS = [
  {
    id: "bitcoin",
    symbol: "BTC",
    name: "Bitcoin",
    price: 96420.18,
    change24h: 2.41,
    marketCap: 1910000000000,
  },
  {
    id: "ethereum",
    symbol: "ETH",
    name: "Ethereum",
    price: 3420.55,
    change24h: 1.87,
    marketCap: 412000000000,
  },
  {
    id: "tether",
    symbol: "USDT",
    name: "Tether",
    price: 1.0,
    change24h: 0.01,
    marketCap: 138000000000,
  },
  {
    id: "binancecoin",
    symbol: "BNB",
    name: "BNB",
    price: 682.3,
    change24h: -0.94,
    marketCap: 99400000000,
  },
  {
    id: "solana",
    symbol: "SOL",
    name: "Solana",
    price: 189.72,
    change24h: 4.63,
    marketCap: 90100000000,
  },
  {
    id: "usd-coin",
    symbol: "USDC",
    name: "USDC",
    price: 1.0,
    change24h: 0.0,
    marketCap: 46200000000,
  },
  {
    id: "ripple",
    symbol: "XRP",
    name: "XRP",
    price: 2.14,
    change24h: -2.35,
    marketCap: 123000000000,
  },
  {
    id: "dogecoin",
    symbol: "DOGE",
    name: "Dogecoin",
    price: 0.3241,
    change24h: 3.12,
    marketCap: 47600000000,
  },
  {
    id: "cardano",
    symbol: "ADA",
    name: "Cardano",
    price: 0.9124,
    change24h: -1.42,
    marketCap: 32100000000,
  },
  {
    id: "tron",
    symbol: "TRX",
    name: "TRON",
    price: 0.2487,
    change24h: 0.68,
    marketCap: 21300000000,
  },
  {
    id: "avalanche-2",
    symbol: "AVAX",
    name: "Avalanche",
    price: 38.64,
    change24h: 2.05,
    marketCap: 16100000000,
  },
  {
    id: "shiba-inu",
    symbol: "SHIB",
    name: "Shiba Inu",
    price: 0.00002184,
    change24h: -3.78,
    marketCap: 12900000000,
  },
  {
    id: "chainlink",
    symbol: "LINK",
    name: "Chainlink",
    price: 22.47,
    change24h: 1.33,
    marketCap: 14300000000,
  },
  {
    id: "polkadot",
    symbol: "DOT",
    name: "Polkadot",
    price: 6.82,
    change24h: -0.56,
    marketCap: 9900000000,
  },
  {
    id: "bitcoin-cash",
    symbol: "BCH",
    name: "Bitcoin Cash",
    price: 462.11,
    change24h: 1.08,
    marketCap: 9200000000,
  },
  {
    id: "near",
    symbol: "NEAR",
    name: "NEAR Protocol",
    price: 5.41,
    change24h: 5.22,
    marketCap: 6100000000,
  },
  {
    id: "litecoin",
    symbol: "LTC",
    name: "Litecoin",
    price: 108.35,
    change24h: -1.15,
    marketCap: 8100000000,
  },
  {
    id: "uniswap",
    symbol: "UNI",
    name: "Uniswap",
    price: 13.92,
    change24h: 2.88,
    marketCap: 8300000000,
  },
  {
    id: "polygon-ecosystem-token",
    symbol: "POL",
    name: "Polygon",
    price: 0.4821,
    change24h: -2.01,
    marketCap: 4700000000,
  },
  {
    id: "stellar",
    symbol: "XLM",
    name: "Stellar",
    price: 0.4113,
    change24h: 0.92,
    marketCap: 12400000000,
  },
  {
    id: "matic-coin",
    symbol: "MATIC",
    name: "Polygon",
    price: 0.5214,
    change24h: -0.77,
    marketCap: 5100000000,
  },
  {
    id: "dash",
    symbol: "DASH",
    name: "Dash",
    price: 31.28,
    change24h: 1.76,
    marketCap: 380000000,
  },
  {
    id: "monero",
    symbol: "XMR",
    name: "Monero",
    price: 214.63,
    change24h: 0.44,
    marketCap: 3900000000,
  },
  {
    id: "cosmos",
    symbol: "ATOM",
    name: "Cosmos Hub",
    price: 6.94,
    change24h: -1.88,
    marketCap: 2700000000,
  },
  {
    id: "aptos",
    symbol: "APT",
    name: "Aptos",
    price: 9.17,
    change24h: 3.45,
    marketCap: 5400000000,
  },
];

export const MOCK_TOP_25 = Object.freeze(
  MOCK_ASSETS.map((asset) => ({
    id: asset.id,
    symbol: asset.symbol,
    name: asset.name,
    image: null,
    price: asset.price,
    change24h: asset.change24h,
    marketCap: asset.marketCap,
  })),
);

export function driftMockAssets(tick) {
  const t = Number(tick) || 0;
  return MOCK_TOP_25.map((asset, index) => {
    const wave =
      Math.sin((t + index * 1.7) / 2.5) * 0.012 +
      Math.cos((t * 0.9 + index * 0.6) / 3.1) * 0.008;
    const price = asset.price * (1 + wave);
    return {
      ...asset,
      price,
      change24h: asset.change24h + wave * 35,
      marketCap: asset.marketCap * (1 + wave),
    };
  });
}

function hashString(str) {
  let hash = 2166136261;
  for (let i = 0; i < str.length; i += 1) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function mulberry32(seed) {
  let a = seed >>> 0;
  return function next() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const RANGE_DAYS = Object.freeze({ "7D": 7, "30D": 30, "90D": 90 });

export function generatePriceSeries(symbol, range = "30D", currentPrice = 0) {
  const days = RANGE_DAYS[range] || 30;
  const seed = hashString(`${String(symbol).toUpperCase()}:${range}`);
  const random = mulberry32(seed);
  const anchor = Number(currentPrice) > 0 ? Number(currentPrice) : 100;
  const volatility = range === "7D" ? 0.02 : range === "90D" ? 0.045 : 0.032;

  const closes = new Array(days);
  closes[days - 1] = anchor;
  for (let i = days - 2; i >= 0; i -= 1) {
    const step = (random() - 0.48) * volatility * 2;
    closes[i] = Math.max(closes[i + 1] * (1 + step), anchor * 0.25);
  }

  const today = new Date();

  return closes.map((price, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (days - 1 - index));
    return {
      date: date.toISOString(),
      label: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      price,
    };
  });
}
