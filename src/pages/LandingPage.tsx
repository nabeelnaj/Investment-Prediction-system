import { TrendingUp, TrendingDown, BarChart2, Brain, Shield, Zap, ChevronRight, Activity, Globe, Star } from 'lucide-react';
import { STOCKS, NEWS_ITEMS, formatMarketCap, formatVolume } from '../lib/mockData';

interface LandingPageProps {
  onNavigate: (page: string, symbol?: string) => void;
  onAuthClick: (mode: 'signin' | 'signup') => void;
}

export default function LandingPage({ onNavigate, onAuthClick }: LandingPageProps) {
  const topMovers = [...STOCKS].sort((a, b) => Math.abs(b.changePct) - Math.abs(a.changePct)).slice(0, 5);
  const gainers = [...STOCKS].filter(s => s.changePct > 0).sort((a, b) => b.changePct - a.changePct).slice(0, 3);
  const losers = [...STOCKS].filter(s => s.changePct < 0).sort((a, b) => a.changePct - b.changePct).slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white">
      {/* Hero */}
      <section className="relative pt-24 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-6">
              <Activity size={12} />
              Real-time US Market Data + AI Predictions
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Smarter Investing
              <span className="block text-blue-600">Powered by AI</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed max-w-2xl">
              Access real-time US stock data, advanced screening tools, interactive charts, and AI-driven price range predictions — all on one platform built for serious investors.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => onAuthClick('signup')}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-blue-600/25 text-sm"
              >
                Start Free <ChevronRight size={16} />
              </button>
              <button
                onClick={() => onNavigate('screener')}
                className="flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 text-gray-700 dark:text-gray-200 font-semibold rounded-xl transition-colors text-sm"
              >
                Browse Stocks
              </button>
            </div>
            <div className="mt-8 flex flex-wrap gap-6 text-sm text-gray-500 dark:text-gray-400">
              {['5,000+ US Stocks', 'NASDAQ & NYSE', 'AI Predictions', 'Free to start'].map(f => (
                <div key={f} className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  {f}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Market Ticker */}
      <section className="border-y border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 py-3 overflow-hidden">
        <div className="flex gap-0 animate-none">
          <div className="flex gap-8 px-4 overflow-x-auto scrollbar-hide">
            {STOCKS.map(s => (
              <button
                key={s.symbol}
                onClick={() => onNavigate('stock', s.symbol)}
                className="flex items-center gap-2.5 shrink-0 hover:opacity-80 transition-opacity"
              >
                <span className="font-bold text-sm text-gray-900 dark:text-white">{s.symbol}</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">${s.price.toFixed(2)}</span>
                <span className={`text-xs font-semibold ${s.changePct >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {s.changePct >= 0 ? '▲' : '▼'} {Math.abs(s.changePct).toFixed(2)}%
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Market Overview */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Market Overview</h2>
            <button onClick={() => onNavigate('screener')} className="text-blue-600 text-sm font-medium flex items-center gap-1 hover:underline">
              View All <ChevronRight size={14} />
            </button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Top Movers */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Top Movers</h3>
              </div>
              <div className="divide-y divide-gray-50 dark:divide-gray-800">
                {topMovers.map(s => (
                  <button
                    key={s.symbol}
                    onClick={() => onNavigate('stock', s.symbol)}
                    className="w-full flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors text-left"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 font-bold text-xs shrink-0">
                      {s.symbol.slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm text-gray-900 dark:text-white">{s.symbol}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{s.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-sm text-gray-900 dark:text-white">${s.price.toFixed(2)}</div>
                      <div className={`text-xs font-semibold ${s.changePct >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {s.changePct >= 0 ? '+' : ''}{s.changePct.toFixed(2)}%
                      </div>
                    </div>
                    <div className="text-right hidden sm:block">
                      <div className="text-xs text-gray-500">Vol</div>
                      <div className="text-xs text-gray-700 dark:text-gray-300">{formatVolume(s.volume)}</div>
                    </div>
                    <div className="text-right hidden sm:block">
                      <div className="text-xs text-gray-500">Mkt Cap</div>
                      <div className="text-xs text-gray-700 dark:text-gray-300">{formatMarketCap(s.marketCap)}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Gainers / Losers */}
            <div className="space-y-4">
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
                  <TrendingUp size={14} className="text-green-500" />
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Top Gainers</h3>
                </div>
                <div className="divide-y divide-gray-50 dark:divide-gray-800">
                  {gainers.map(s => (
                    <button key={s.symbol} onClick={() => onNavigate('stock', s.symbol)} className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors">
                      <div>
                        <div className="font-semibold text-sm text-gray-900 dark:text-white">{s.symbol}</div>
                        <div className="text-xs text-gray-500">${s.price.toFixed(2)}</div>
                      </div>
                      <span className="text-green-500 font-bold text-sm">+{s.changePct.toFixed(2)}%</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
                  <TrendingDown size={14} className="text-red-500" />
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Top Losers</h3>
                </div>
                <div className="divide-y divide-gray-50 dark:divide-gray-800">
                  {losers.map(s => (
                    <button key={s.symbol} onClick={() => onNavigate('stock', s.symbol)} className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors">
                      <div>
                        <div className="font-semibold text-sm text-gray-900 dark:text-white">{s.symbol}</div>
                        <div className="text-xs text-gray-500">${s.price.toFixed(2)}</div>
                      </div>
                      <span className="text-red-500 font-bold text-sm">{s.changePct.toFixed(2)}%</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Everything you need to invest smarter</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">Professional-grade tools that were once reserved for Wall Street, now accessible to everyone.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: BarChart2, title: 'Advanced Screener', desc: 'Filter 5,000+ US stocks by PE, EPS, market cap, dividend yield, RSI, and 30+ more metrics.' },
              { icon: Brain, title: 'AI Predictions', desc: 'Machine learning models analyze price history, fundamentals, and news sentiment to forecast trend probability and price ranges.' },
              { icon: Activity, title: 'Interactive Charts', desc: 'Candlestick & line charts with SMA, EMA, Bollinger Bands, MACD, RSI overlays. Multiple timeframes.' },
              { icon: Globe, title: 'Real-time Data', desc: 'Live prices for NASDAQ and NYSE equities. Updated every 5 minutes with WebSocket support.' },
              { icon: Shield, title: 'Secure & Reliable', desc: 'Bank-grade security with encrypted data transmission. 99.9% uptime SLA for production workloads.' },
              { icon: Zap, title: 'Instant Alerts', desc: 'Set price threshold alerts and receive AI trend notifications via email. Never miss a move.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-6 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-800/50 transition-colors group">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-4 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors">
                  <Icon size={18} className="text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* News */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Latest Market News</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {NEWS_ITEMS.slice(0, 6).map(n => (
              <div key={n.id} className="flex items-start gap-3 p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600 transition-colors cursor-pointer">
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.sentiment === 'positive' ? 'bg-green-500' : n.sentiment === 'negative' ? 'bg-red-500' : 'bg-yellow-500'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800 dark:text-gray-200 leading-snug mb-1">{n.headline}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span>{n.source}</span>
                    <span>•</span>
                    <span>{n.time}</span>
                    <span className={`ml-auto font-medium ${n.sentiment === 'positive' ? 'text-green-500' : n.sentiment === 'negative' ? 'text-red-500' : 'text-yellow-500'}`}>
                      {n.sentiment}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="#f59e0b" className="text-yellow-400" />)}
            <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">Trusted by 10,000+ investors</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to invest with confidence?
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            Join thousands of traders and analysts who use InvestPredictor for smarter, data-driven decisions.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => onAuthClick('signup')}
              className="flex items-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-blue-600/25"
            >
              Create Free Account <ChevronRight size={16} />
            </button>
            <button
              onClick={() => onAuthClick('signin')}
              className="px-8 py-3.5 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-semibold rounded-xl hover:border-blue-500 transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
              <TrendingUp size={14} className="text-white" />
            </div>
            <span className="font-bold text-gray-900 dark:text-white text-sm">InvestPredictor</span>
          </div>
          <p className="text-xs text-gray-400">For informational purposes only. Not financial advice. Data may be delayed.</p>
        </div>
      </footer>
    </div>
  );
}
