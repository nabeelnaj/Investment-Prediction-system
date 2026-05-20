import { useState } from 'react';
import { Star, TrendingUp, TrendingDown, BarChart2, Bell, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { STOCKS, NEWS_ITEMS, formatMarketCap, formatVolume } from '../lib/mockData';

interface DashboardProps {
  onNavigate: (page: string, symbol?: string) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { user, watchlist, removeFromWatchlist } = useAuth();
  const [activeTab, setActiveTab] = useState<'watchlist' | 'market' | 'news'>('watchlist');

  const watchlistStocks = STOCKS.filter(s => watchlist.includes(s.symbol));
  const indices = [
    { name: 'S&P 500', value: '5,127.79', change: '+0.87%', up: true },
    { name: 'NASDAQ', value: '16,091.92', change: '+1.12%', up: true },
    { name: 'DOW', value: '38,503.82', change: '+0.42%', up: true },
    { name: 'VIX', value: '13.24', change: '-3.18%', up: false },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Good morning, {user?.email?.split('@')[0]}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Here's your market overview for today</p>
        </div>

        {/* Indices */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {indices.map(idx => (
            <div key={idx.name} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-4">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{idx.name}</div>
              <div className="text-xl font-bold text-gray-900 dark:text-white">{idx.value}</div>
              <div className={`text-sm font-semibold mt-1 flex items-center gap-1 ${idx.up ? 'text-green-500' : 'text-red-500'}`}>
                {idx.up ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {idx.change}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="flex border-b border-gray-100 dark:border-gray-800">
                {(['watchlist', 'market', 'news'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-3.5 text-sm font-medium capitalize transition-colors ${
                      activeTab === tab
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {activeTab === 'watchlist' && (
                <div>
                  {watchlistStocks.length === 0 ? (
                    <div className="py-16 text-center">
                      <Star size={32} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                      <p className="text-gray-500 dark:text-gray-400 text-sm">Your watchlist is empty.</p>
                      <button onClick={() => onNavigate('screener')} className="mt-3 text-blue-600 text-sm font-medium hover:underline">Browse stocks to add</button>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-50 dark:divide-gray-800">
                      {watchlistStocks.map(s => (
                        <div key={s.symbol} className="flex items-center gap-4 px-5 py-4">
                          <button onClick={() => onNavigate('stock', s.symbol)} className="flex items-center gap-4 flex-1 min-w-0 text-left">
                            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center font-bold text-blue-600 text-xs shrink-0">
                              {s.symbol.slice(0, 2)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-sm text-gray-900 dark:text-white">{s.symbol}</div>
                              <div className="text-xs text-gray-500 truncate">{s.name}</div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold text-sm text-gray-900 dark:text-white">${s.price.toFixed(2)}</div>
                              <div className={`text-xs font-semibold ${s.changePct >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {s.changePct >= 0 ? '+' : ''}{s.changePct.toFixed(2)}%
                              </div>
                            </div>
                          </button>
                          <button onClick={() => removeFromWatchlist(s.symbol)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'market' && (
                <div className="divide-y divide-gray-50 dark:divide-gray-800">
                  {STOCKS.map(s => (
                    <button key={s.symbol} onClick={() => onNavigate('stock', s.symbol)} className="w-full flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors text-left">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center font-bold text-blue-600 text-xs shrink-0">
                        {s.symbol.slice(0, 2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm text-gray-900 dark:text-white">{s.symbol}</div>
                        <div className="text-xs text-gray-500 truncate">{s.sector}</div>
                      </div>
                      <div className="hidden sm:block text-right">
                        <div className="text-xs text-gray-500">Vol</div>
                        <div className="text-xs text-gray-700 dark:text-gray-300">{formatVolume(s.volume)}</div>
                      </div>
                      <div className="hidden sm:block text-right">
                        <div className="text-xs text-gray-500">Mkt Cap</div>
                        <div className="text-xs text-gray-700 dark:text-gray-300">{formatMarketCap(s.marketCap)}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-semibold text-sm text-gray-900 dark:text-white">${s.price.toFixed(2)}</div>
                        <div className={`text-xs font-semibold ${s.changePct >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {s.changePct >= 0 ? '+' : ''}{s.changePct.toFixed(2)}%
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {activeTab === 'news' && (
                <div className="divide-y divide-gray-50 dark:divide-gray-800">
                  {NEWS_ITEMS.map(n => (
                    <div key={n.id} className="flex items-start gap-3 px-5 py-4">
                      <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.sentiment === 'positive' ? 'bg-green-500' : n.sentiment === 'negative' ? 'bg-red-500' : 'bg-yellow-500'}`} />
                      <div className="flex-1">
                        <p className="text-sm text-gray-800 dark:text-gray-200 leading-snug mb-1">{n.headline}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <span className="font-medium">{n.source}</span>
                          <span>•</span>
                          <span>{n.time}</span>
                          <span className={`ml-auto font-semibold ${n.sentiment === 'positive' ? 'text-green-500' : n.sentiment === 'negative' ? 'text-red-500' : 'text-yellow-500'}`}>
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

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
              <div className="flex items-center gap-2 mb-4">
                <Bell size={16} className="text-blue-600" />
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Quick Actions</h3>
              </div>
              <div className="space-y-2">
                <button onClick={() => onNavigate('screener')} className="w-full flex items-center gap-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-left">
                  <BarChart2 size={16} className="text-blue-600" />
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Open Stock Screener</span>
                </button>
                <button onClick={() => setActiveTab('watchlist')} className="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left">
                  <Star size={16} className="text-yellow-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">View Watchlist ({watchlist.length})</span>
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-3">Sector Performance</h3>
              <div className="space-y-2.5">
                {[
                  { name: 'Technology', change: +1.45 },
                  { name: 'Healthcare', change: -0.28 },
                  { name: 'Financials', change: +0.82 },
                  { name: 'Consumer', change: +0.34 },
                  { name: 'Energy', change: -0.71 },
                ].map(s => (
                  <div key={s.name} className="flex items-center justify-between">
                    <span className="text-xs text-gray-600 dark:text-gray-400">{s.name}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${s.change >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
                          style={{ width: `${Math.min(100, Math.abs(s.change) * 30 + 30)}%` }}
                        />
                      </div>
                      <span className={`text-xs font-semibold w-12 text-right ${s.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {s.change >= 0 ? '+' : ''}{s.change.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
