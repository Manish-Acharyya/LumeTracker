const COINGECKO_MARKETS_URL =
  'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=25&page=1&sparkline=false&price_change_percentage=24h';

function normalizeAsset(coin) {
  return {
    id: String(coin.id ?? coin.symbol ?? '').toLowerCase(),
    symbol: String(coin.symbol ?? '').toUpperCase(),
    name: String(coin.name ?? 'Unknown'),
    image: coin.image ?? null,
    price: Number(coin.current_price) || 0,
    change24h: Number(coin.price_change_percentage_24h) || 0,
    marketCap: Number(coin.market_cap) || 0,
  };
}

export async function fetchMarketData(signal) {
  const response = await fetch(COINGECKO_MARKETS_URL, { signal });

  if (!response.ok) {
    const error = new Error(`CoinGecko responded with status ${response.status}`);
    error.status = response.status;
    throw error;
  }

  const payload = await response.json();

  if (!Array.isArray(payload) || payload.length === 0) {
    throw new Error('CoinGecko returned an empty market payload');
  }

  return payload.map(normalizeAsset);
}
