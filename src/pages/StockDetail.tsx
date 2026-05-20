import { useState } from 'react';
import { ArrowLeft, Star, TrendingUp, TrendingDown, BarChart2, DollarSign, Activity, Info } from 'lucide-react';
import { STOCKS, getAIPrediction, formatMarketCap, formatVolume, NEWS_ITEMS } from '../lib/mockData';
import StockChart from '../components/StockChart';
import AIPredictionCard from '../components/AIPredictionCard';
import { useAuth } from '../contexts/AuthContext';

interface StockDetailProps {
  symbol: string;
  onNavigate: (page: string, symbol?: string) => void;
  onAuthClick: (mode: 'signin' | 'signup') => void;
}

export default function StockDetail({ symbol, onNavigate, onAuthClick }: StockDetailProps) {
  const { user, watchlist, addToWatchlist, removeFromWatchlist } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'financials' | 'news'>('overview');

  const stock = STOCKS.find(s => s.symbol === symbol) ?? STOCKS[0];
  const prediction = getAIPrediction(stock.symbol);
  const inWatchlist = watchlist.includes(stock.symbol);

  function handleWatchlist() {
    if (!user) { onAuthClick('signin'); return; }
    if (inWatchlist) removeFromWatchlist(stock.symbol);
    else addToWatchlist(stock.symbol, stock.name);
  }

  const metrics = [
    { label: 'Open', value: `$${stock.open.toFixed(2)}` },
    { label: "Day's High", value: `$${stock.high.toFixed(2)}`, color: 'text-green-500' },
    { label: "Day's Low", value: `$${stock.low.toFixed(2)}`, color: 'text-red-500' },
    { label: '52W High', value: `$${stock.week52High.toFixed(2)}` },
    { label: '52W Low', value: `$${stock.week52Low.toFixed(2)}` },
    { label: 'Volume', value: formatVolume(stock.volume) },
    { label: 'Market Cap', value: formatMarketCap(stock.marketCap) },
    { label: 'P/E Ratio', value: stock.pe.toFixed(1) },
    { label: 'EPS', value: `$${stock.eps.toFixed(2)}` },
    { label: 'Div Yield', value: stock.dividendYield > 0 ? `${stock.dividendYield.toFixed(2)}%` : '—' },
    { label: 'P/B Value', value: stock.pbv.toFixed(1) },
    { label: 'ROE', value: `${stock.roe.toFixed(1)}%` },
    { label: 'Debt/Equity', value: stock.debtEquity.toFixed(2) },
    { label: 'RSI (14)', value: stock.rsi.toFixed(1), color: stock.rsi > 70 ? 'text-red-500' : stock.rsi < 30 ? 'text-green-500' : undefined },
  ];

  const rsiBarWidth = stock.rsi;
  const rsiColor = stock.rsi > 70 ? '#ef4444' : stock.rsi < 30 ? '#22c55e' : '#3b82f6';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-16">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Back */}
        <button onClick={() => onNavigate('screener')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mb-6 transition-colors">
          <ArrowLeft size={16} /> Back to Screener
        </button>

        {/* Header */}
        <div className="flex flex-wrap items-start gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center font-bold text-blue-600 text-lg shrink-0">
            {stock.symbol.slice(0, 2)}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{stock.symbol}</h1>
              <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-xs text-gray-500">{stock.sector}</span>
              <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-xs text-gray-500">{stock.industry}</span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">{stock.name}</p>
            <div className="flex items-baseline gap-3 mt-2">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">${stock.price.toFixed(2)}</span>
              <div className={`flex items-center gap-1 text-sm font-semibold ${stock.changePct >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {stock.changePct >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePct >= 0 ? '+' : ''}{stock.changePct.toFixed(2)}%)
              </div>
            </div>
          </div>
          <button
            onClick={handleWatchlist}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-medium text-sm transition-colors ${
              inWatchlist
                ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700 text-yellow-600'
                : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-blue-500 hover:text-blue-600'
            }`}
          >
            <Star size={15} fill={inWatchlist ? 'currentColor' : 'none'} />
            {inWatchlist ? 'Watchlisted' : 'Add to Watchlist'}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-gray-200 dark:border-gray-800 mb-6">
          {(['overview', 'financials', 'news'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-sm font-medium capitalize border-b-2 transition-colors -mb-px ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Chart */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
                <h2 className="font-semibold text-gray-900 dark:text-white text-sm mb-4">Price Chart</h2>
                <StockChart
                  symbol={stock.symbol}
                  currentPrice={stock.price}
                  predictionLow={prediction.predictedLow}
                  predictionHigh={prediction.predictedHigh}
                />
              </div>

              {/* Metrics grid */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
                <h2 className="font-semibold text-gray-900 dark:text-white text-sm mb-4 flex items-center gap-2">
                  <Activity size={15} className="text-blue-600" /> Key Statistics
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
                  {metrics.map(m => (
                    <div key={m.label} className="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">{m.label}</div>
                      <div className={`font-semibold text-sm ${m.color ?? 'text-gray-900 dark:text-white'}`}>{m.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technical indicators */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
                <h2 className="font-semibold text-gray-900 dark:text-white text-sm mb-4 flex items-center gap-2">
                  <BarChart2 size={15} className="text-blue-600" /> Technical Indicators
                </h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs text-gray-500">RSI (14) — {stock.rsi.toFixed(1)}</span>
                      <span className="text-xs font-medium" style={{ color: rsiColor }}>
                        {stock.rsi > 70 ? 'Overbought' : stock.rsi < 30 ? 'Oversold' : 'Neutral'}
                      </span>
                    </div>
                    <div className="relative h-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                      <div className="absolute left-0 top-0 bottom-0 rounded-full transition-all" style={{ width: `${rsiBarWidth}%`, backgroundColor: rsiColor }} />
                      <div className="absolute top-1/2 -translate-y-1/2 w-0.5 h-3 bg-red-400 opacity-50" style={{ left: '70%' }} />
                      <div className="absolute top-1/2 -translate-y-1/2 w-0.5 h-3 bg-green-400 opacity-50" style={{ left: '30%' }} />
                    </div>
                    <div className="flex justify-between mt-0.5 text-xs text-gray-400">
                      <span>0</span>
                      <span>30</span>
                      <span>70</span>
                      <span>100</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { name: 'SMA 20', value: (stock.price * 0.97).toFixed(2), signal: 'Buy' },
                      { name: 'EMA 50', value: (stock.price * 0.94).toFixed(2), signal: 'Buy' },
                      { name: 'MACD', value: (stock.changePct * 0.5).toFixed(3), signal: stock.changePct > 0 ? 'Buy' : 'Sell' },
                    ].map(ind => (
                      <div key={ind.name} className="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl text-center">
                        <div className="text-xs text-gray-500 mb-1">{ind.name}</div>
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">{ind.value}</div>
                        <div className={`text-xs font-semibold mt-0.5 ${ind.signal === 'Buy' ? 'text-green-500' : 'text-red-500'}`}>{ind.signal}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <AIPredictionCard prediction={prediction} currentPrice={stock.price} />

              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-3 flex items-center gap-2">
                  <Info size={14} className="text-blue-600" /> 52-Week Range
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>${stock.week52Low.toFixed(2)}</span>
                    <span className="text-gray-900 dark:text-white font-medium">${stock.price.toFixed(2)}</span>
                    <span>${stock.week52High.toFixed(2)}</span>
                  </div>
                  <div className="relative h-2 bg-gray-100 dark:bg-gray-700 rounded-full">
                    <div
                      className="absolute h-full bg-blue-500 rounded-full"
                      style={{
                        left: '0%',
                        width: `${((stock.price - stock.week52Low) / (stock.week52High - stock.week52Low)) * 100}%`,
                      }}
                    />
                    <div
                      className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-blue-600 border-2 border-white dark:border-gray-900 rounded-full shadow"
                      style={{
                        left: `calc(${((stock.price - stock.week52Low) / (stock.week52High - stock.week52Low)) * 100}% - 6px)`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>52W Low</span>
                    <span>52W High</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'financials' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[
              {
                title: 'Income Statement',
                icon: DollarSign,
                rows: [
                  ['Revenue (TTM)', '$394.3B'],
                  ['Gross Profit', '$170.8B'],
                  ['Operating Income', '$114.3B'],
                  ['Net Income', '$100.0B'],
                  ['EBITDA', '$125.8B'],
                  ['EPS (Diluted)', `$${stock.eps.toFixed(2)}`],
                ],
              },
              {
                title: 'Balance Sheet',
                icon: BarChart2,
                rows: [
                  ['Total Assets', '$352.6B'],
                  ['Total Liabilities', '$290.4B'],
                  ['Shareholders Equity', '$62.1B'],
                  ['Cash & Equivalents', '$29.9B'],
                  ['Total Debt', '$123.9B'],
                  ['Debt/Equity', stock.debtEquity.toFixed(2)],
                ],
              },
              {
                title: 'Cash Flow',
                icon: TrendingUp,
                rows: [
                  ['Operating Cash Flow', '$110.5B'],
                  ['Capital Expenditures', '-$11.5B'],
                  ['Free Cash Flow', '$99.0B'],
                  ['Dividends Paid', stock.dividendYield > 0 ? `-$${(stock.price * 0.001 * stock.dividendYield).toFixed(1)}B` : '—'],
                  ['Share Buybacks', '-$85.5B'],
                  ['Net Change in Cash', '+$7.1B'],
                ],
              },
              {
                title: 'Valuation Metrics',
                icon: Activity,
                rows: [
                  ['P/E Ratio', stock.pe.toFixed(1)],
                  ['Forward P/E', (stock.pe * 0.88).toFixed(1)],
                  ['P/B Value', stock.pbv.toFixed(1)],
                  ['P/S Ratio', '7.5'],
                  ['EV/EBITDA', (stock.pe * 0.9).toFixed(1)],
                  ['ROE', `${stock.roe.toFixed(1)}%`],
                ],
              },
            ].map(({ title, icon: Icon, rows }) => (
              <div key={title} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
                  <Icon size={15} className="text-blue-600" />
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{title}</h3>
                </div>
                <div className="divide-y divide-gray-50 dark:divide-gray-800">
                  {rows.map(([label, value]) => (
                    <div key={label} className="flex items-center justify-between px-5 py-3">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'news' && (
          <div className="space-y-3 max-w-3xl">
            {NEWS_ITEMS.map(n => (
              <div key={n.id} className="flex items-start gap-4 p-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600 transition-colors cursor-pointer">
                <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${n.sentiment === 'positive' ? 'bg-green-500' : n.sentiment === 'negative' ? 'bg-red-500' : 'bg-yellow-500'}`} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200 leading-snug mb-2">{n.headline}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span className="font-semibold text-gray-500 dark:text-gray-400">{n.source}</span>
                    <span>•</span>
                    <span>{n.time}</span>
                    <span className={`ml-auto px-2 py-0.5 rounded-full text-xs font-semibold ${n.sentiment === 'positive' ? 'bg-green-50 dark:bg-green-900/20 text-green-600' : n.sentiment === 'negative' ? 'bg-red-50 dark:bg-red-900/20 text-red-600' : 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600'}`}>
                      {n.sentiment}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
