export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePct: number;
  volume: number;
  marketCap: number;
  pe: number;
  eps: number;
  dividendYield: number;
  pbv: number;
  roe: number;
  debtEquity: number;
  sector: string;
  industry: string;
  week52High: number;
  week52Low: number;
  rsi: number;
  open: number;
  high: number;
  low: number;
}

export interface Candle {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface AIPrediction {
  symbol: string;
  period: string;
  trendDirection: 'bullish' | 'bearish' | 'neutral';
  trendProbability: number;
  predictedLow: number;
  predictedHigh: number;
  confidence: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  sentimentScore: number;
  summary: string;
}

export const STOCKS: Stock[] = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 189.30, change: 2.15, changePct: 1.15, volume: 58_420_000, marketCap: 2_940_000_000_000, pe: 30.2, eps: 6.27, dividendYield: 0.52, pbv: 46.8, roe: 160.1, debtEquity: 1.98, sector: 'Technology', industry: 'Consumer Electronics', week52High: 199.62, week52Low: 143.90, rsi: 58.4, open: 187.20, high: 190.15, low: 186.80 },
  { symbol: 'MSFT', name: 'Microsoft Corp.', price: 415.50, change: -1.20, changePct: -0.29, volume: 22_100_000, marketCap: 3_090_000_000_000, pe: 36.8, eps: 11.29, dividendYield: 0.72, pbv: 13.4, roe: 36.2, debtEquity: 0.35, sector: 'Technology', industry: 'Software', week52High: 430.82, week52Low: 309.45, rsi: 52.1, open: 416.90, high: 418.20, low: 414.60 },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 172.65, change: 3.40, changePct: 2.01, volume: 31_500_000, marketCap: 2_130_000_000_000, pe: 27.4, eps: 6.30, dividendYield: 0.48, pbv: 6.9, roe: 25.3, debtEquity: 0.06, sector: 'Technology', industry: 'Internet Services', week52High: 193.31, week52Low: 120.21, rsi: 61.3, open: 169.30, high: 173.45, low: 168.90 },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 185.20, change: 4.80, changePct: 2.66, volume: 44_200_000, marketCap: 1_930_000_000_000, pe: 59.7, eps: 3.10, dividendYield: 0, pbv: 9.2, roe: 15.4, debtEquity: 0.75, sector: 'Consumer Discretionary', industry: 'E-Commerce', week52High: 201.20, week52Low: 118.35, rsi: 65.7, open: 180.45, high: 186.10, low: 179.80 },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 875.40, change: 22.10, changePct: 2.59, volume: 49_800_000, marketCap: 2_160_000_000_000, pe: 74.2, eps: 11.80, dividendYield: 0.03, pbv: 38.6, roe: 52.1, debtEquity: 0.41, sector: 'Technology', industry: 'Semiconductors', week52High: 974.00, week52Low: 402.64, rsi: 68.9, open: 855.00, high: 879.50, low: 852.30 },
  { symbol: 'META', name: 'Meta Platforms Inc.', price: 505.25, change: -6.80, changePct: -1.33, volume: 18_600_000, marketCap: 1_290_000_000_000, pe: 28.4, eps: 17.79, dividendYield: 0.44, pbv: 8.5, roe: 29.8, debtEquity: 0.13, sector: 'Technology', industry: 'Social Media', week52High: 531.49, week52Low: 274.38, rsi: 48.2, open: 512.00, high: 513.40, low: 503.80 },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 175.40, change: -8.30, changePct: -4.52, volume: 111_000_000, marketCap: 559_000_000_000, pe: 45.1, eps: 3.89, dividendYield: 0, pbv: 10.2, roe: 22.6, debtEquity: 0.17, sector: 'Consumer Discretionary', industry: 'Electric Vehicles', week52High: 299.29, week52Low: 138.80, rsi: 35.6, open: 184.20, high: 185.50, low: 174.10 },
  { symbol: 'JPM', name: 'JPMorgan Chase & Co.', price: 197.80, change: 1.50, changePct: 0.76, volume: 12_400_000, marketCap: 572_000_000_000, pe: 11.8, eps: 16.76, dividendYield: 2.34, pbv: 1.8, roe: 15.4, debtEquity: 1.25, sector: 'Financials', industry: 'Banking', week52High: 220.82, week52Low: 135.19, rsi: 55.2, open: 196.30, high: 198.80, low: 195.90 },
  { symbol: 'JNJ', name: 'Johnson & Johnson', price: 152.10, change: 0.85, changePct: 0.56, volume: 8_900_000, marketCap: 365_000_000_000, pe: 22.6, eps: 6.73, dividendYield: 3.12, pbv: 5.4, roe: 23.8, debtEquity: 0.45, sector: 'Healthcare', industry: 'Pharmaceuticals', week52High: 175.97, week52Low: 143.13, rsi: 46.8, open: 151.25, high: 152.80, low: 150.90 },
  { symbol: 'V', name: 'Visa Inc.', price: 274.50, change: 2.30, changePct: 0.84, volume: 7_600_000, marketCap: 556_000_000_000, pe: 30.9, eps: 8.88, dividendYield: 0.76, pbv: 14.7, roe: 47.6, debtEquity: 0.61, sector: 'Financials', industry: 'Payment Processing', week52High: 290.96, week52Low: 220.18, rsi: 57.3, open: 272.20, high: 275.60, low: 271.80 },
  { symbol: 'WMT', name: 'Walmart Inc.', price: 67.25, change: 0.45, changePct: 0.67, volume: 14_200_000, marketCap: 543_000_000_000, pe: 30.5, eps: 2.20, dividendYield: 1.32, pbv: 7.6, roe: 24.9, debtEquity: 0.65, sector: 'Consumer Staples', industry: 'Retail', week52High: 74.24, week52Low: 47.80, rsi: 54.6, open: 66.90, high: 67.60, low: 66.75 },
  { symbol: 'UNH', name: 'UnitedHealth Group', price: 476.20, change: -3.40, changePct: -0.71, volume: 4_800_000, marketCap: 436_000_000_000, pe: 21.4, eps: 22.26, dividendYield: 1.59, pbv: 5.8, roe: 27.1, debtEquity: 0.72, sector: 'Healthcare', industry: 'Health Insurance', week52High: 554.48, week52Low: 407.23, rsi: 42.1, open: 479.60, high: 480.20, low: 474.80 },
];

export const SECTORS = ['All', 'Technology', 'Financials', 'Healthcare', 'Consumer Discretionary', 'Consumer Staples', 'Energy', 'Industrials', 'Materials'];

function generateCandles(basePrice: number, days: number): Candle[] {
  const candles: Candle[] = [];
  let price = basePrice * 0.75;
  const now = new Date();
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    if (date.getDay() === 0 || date.getDay() === 6) continue;
    const change = (Math.random() - 0.48) * price * 0.025;
    const open = price;
    price = Math.max(price + change, 1);
    const high = Math.max(open, price) * (1 + Math.random() * 0.01);
    const low = Math.min(open, price) * (1 - Math.random() * 0.01);
    candles.push({
      date: date.toISOString().split('T')[0],
      open: +open.toFixed(2),
      high: +high.toFixed(2),
      low: +low.toFixed(2),
      close: +price.toFixed(2),
      volume: Math.floor(Math.random() * 50_000_000 + 5_000_000),
    });
  }
  return candles;
}

const candleCache = new Map<string, Candle[]>();

export function getCandles(symbol: string, days = 365): Candle[] {
  const key = `${symbol}-${days}`;
  if (!candleCache.has(key)) {
    const stock = STOCKS.find(s => s.symbol === symbol);
    candleCache.set(key, generateCandles(stock?.price ?? 100, days));
  }
  return candleCache.get(key)!;
}

export function getAIPrediction(symbol: string): AIPrediction {
  const stock = STOCKS.find(s => s.symbol === symbol)!;
  const isBullish = stock.changePct > 0 && stock.rsi < 70;
  const isBearish = stock.changePct < -1 || stock.rsi > 70;
  const direction = isBullish ? 'bullish' : isBearish ? 'bearish' : 'neutral';
  const prob = isBullish ? 60 + Math.floor(Math.random() * 20) : isBearish ? 30 + Math.floor(Math.random() * 20) : 45 + Math.floor(Math.random() * 10);
  const sentiment = stock.changePct > 1 ? 'positive' : stock.changePct < -1 ? 'negative' : 'neutral';
  const factor = direction === 'bullish' ? 1 : direction === 'bearish' ? -1 : 0;
  return {
    symbol,
    period: '30-day',
    trendDirection: direction,
    trendProbability: prob,
    predictedLow: +(stock.price * (1 + factor * 0.03 - 0.07)).toFixed(2),
    predictedHigh: +(stock.price * (1 + factor * 0.08 + 0.02)).toFixed(2),
    confidence: 55 + Math.floor(Math.random() * 25),
    sentiment,
    sentimentScore: sentiment === 'positive' ? 0.6 + Math.random() * 0.3 : sentiment === 'negative' ? Math.random() * 0.4 : 0.4 + Math.random() * 0.2,
    summary: direction === 'bullish'
      ? `${symbol} shows strong momentum with positive earnings outlook and favorable sector trends. Technical indicators suggest continued upside potential.`
      : direction === 'bearish'
      ? `${symbol} faces headwinds from macro uncertainty and elevated valuation. Risk-off sentiment may drive near-term consolidation.`
      : `${symbol} is range-bound with mixed signals. Watch for a breakout above resistance or breakdown below support for directional clarity.`,
  };
}

export function formatMarketCap(val: number): string {
  if (val >= 1e12) return `$${(val / 1e12).toFixed(2)}T`;
  if (val >= 1e9) return `$${(val / 1e9).toFixed(2)}B`;
  if (val >= 1e6) return `$${(val / 1e6).toFixed(2)}M`;
  return `$${val.toLocaleString()}`;
}

export function formatVolume(val: number): string {
  if (val >= 1e9) return `${(val / 1e9).toFixed(2)}B`;
  if (val >= 1e6) return `${(val / 1e6).toFixed(2)}M`;
  if (val >= 1e3) return `${(val / 1e3).toFixed(2)}K`;
  return val.toString();
}

export const NEWS_ITEMS = [
  { id: 1, headline: 'Fed signals potential rate cuts in Q3 amid cooling inflation data', time: '2h ago', sentiment: 'positive' as const, source: 'Reuters' },
  { id: 2, headline: 'NVIDIA surpasses $2T market cap on record AI chip demand', time: '3h ago', sentiment: 'positive' as const, source: 'Bloomberg' },
  { id: 3, headline: 'Tesla misses delivery estimates for second consecutive quarter', time: '4h ago', sentiment: 'negative' as const, source: 'WSJ' },
  { id: 4, headline: 'Apple eyes next-generation AI features for iPhone 17 lineup', time: '5h ago', sentiment: 'positive' as const, source: 'CNBC' },
  { id: 5, headline: 'JPMorgan raises S&P 500 year-end target to 5,800', time: '6h ago', sentiment: 'positive' as const, source: 'MarketWatch' },
  { id: 6, headline: 'Meta faces EU antitrust probe over ad targeting practices', time: '7h ago', sentiment: 'negative' as const, source: 'FT' },
  { id: 7, headline: 'Amazon Web Services reports 17% YoY revenue growth', time: '8h ago', sentiment: 'positive' as const, source: 'Reuters' },
  { id: 8, headline: 'Oil prices steady as OPEC+ maintains production cuts', time: '9h ago', sentiment: 'neutral' as const, source: 'Bloomberg' },
];
