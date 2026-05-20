import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, TrendingUp, TrendingDown, Download, Star, ChevronUp, ChevronDown } from 'lucide-react';
import { STOCKS, SECTORS, formatMarketCap, formatVolume, type Stock } from '../lib/mockData';
import { useAuth } from '../contexts/AuthContext';

interface ScreenerProps {
  onNavigate: (page: string, symbol?: string) => void;
  onAuthClick: (mode: 'signin' | 'signup') => void;
}

type SortField = keyof Stock;
type SortDir = 'asc' | 'desc';

export default function Screener({ onNavigate, onAuthClick }: ScreenerProps) {
  const { user, watchlist, addToWatchlist, removeFromWatchlist } = useAuth();
  const [query, setQuery] = useState('');
  const [sector, setSector] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [minPE, setMinPE] = useState('');
  const [maxPE, setMaxPE] = useState('');
  const [minDivYield, setMinDivYield] = useState('');
  const [sortField, setSortField] = useState<SortField>('marketCap');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const filtered = useMemo(() => {
    let list = STOCKS.filter(s => {
      const matchQuery = !query || s.symbol.toLowerCase().includes(query.toLowerCase()) || s.name.toLowerCase().includes(query.toLowerCase());
      const matchSector = sector === 'All' || s.sector === sector;
      const matchMinPE = !minPE || s.pe >= parseFloat(minPE);
      const matchMaxPE = !maxPE || s.pe <= parseFloat(maxPE);
      const matchDiv = !minDivYield || s.dividendYield >= parseFloat(minDivYield);
      return matchQuery && matchSector && matchMinPE && matchMaxPE && matchDiv;
    });
    list.sort((a, b) => {
      const av = a[sortField] as number;
      const bv = b[sortField] as number;
      return sortDir === 'asc' ? av - bv : bv - av;
    });
    return list;
  }, [query, sector, minPE, maxPE, minDivYield, sortField, sortDir]);

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  }

  function SortBtn({ field, label }: { field: SortField; label: string }) {
    const active = sortField === field;
    return (
      <button onClick={() => handleSort(field)} className={`flex items-center gap-0.5 whitespace-nowrap font-medium transition-colors ${active ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>
        {label}
        {active ? (sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />) : <ChevronDown size={12} className="opacity-30" />}
      </button>
    );
  }

  function handleWatchlist(e: React.MouseEvent, s: Stock) {
    e.stopPropagation();
    if (!user) { onAuthClick('signin'); return; }
    if (watchlist.includes(s.symbol)) {
      removeFromWatchlist(s.symbol);
    } else {
      addToWatchlist(s.symbol, s.name);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Stock Screener</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Filter and analyze US equities across NASDAQ & NYSE</p>
        </div>

        {/* Filters bar */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 mb-4">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-48">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search symbol or company..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={sector}
              onChange={e => setSector(e.target.value)}
              className="px-3 py-2 text-sm rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {SECTORS.map(s => <option key={s}>{s}</option>)}
            </select>
            <button
              onClick={() => setShowFilters(v => !v)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${showFilters ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
            >
              <SlidersHorizontal size={14} />
              Filters
            </button>
            <button className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              <Download size={14} />
              Export
            </button>
            <div className="text-xs text-gray-400 ml-auto">{filtered.length} results</div>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Min P/E</label>
                <input type="number" value={minPE} onChange={e => setMinPE(e.target.value)} placeholder="0" className="w-full px-3 py-1.5 text-sm rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Max P/E</label>
                <input type="number" value={maxPE} onChange={e => setMaxPE(e.target.value)} placeholder="100" className="w-full px-3 py-1.5 text-sm rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Min Div Yield (%)</label>
                <input type="number" value={minDivYield} onChange={e => setMinDivYield(e.target.value)} placeholder="0" className="w-full px-3 py-1.5 text-sm rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
              <div className="flex items-end">
                <button onClick={() => { setMinPE(''); setMaxPE(''); setMinDivYield(''); }} className="w-full py-1.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                  Reset Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <th className="text-left px-5 py-3 text-xs">
                    <SortBtn field="symbol" label="Symbol" />
                  </th>
                  <th className="text-right px-4 py-3 text-xs">
                    <SortBtn field="price" label="Price" />
                  </th>
                  <th className="text-right px-4 py-3 text-xs">
                    <SortBtn field="changePct" label="% Chg" />
                  </th>
                  <th className="text-right px-4 py-3 text-xs hidden sm:table-cell">
                    <SortBtn field="marketCap" label="Mkt Cap" />
                  </th>
                  <th className="text-right px-4 py-3 text-xs hidden md:table-cell">
                    <SortBtn field="volume" label="Volume" />
                  </th>
                  <th className="text-right px-4 py-3 text-xs hidden lg:table-cell">
                    <SortBtn field="pe" label="P/E" />
                  </th>
                  <th className="text-right px-4 py-3 text-xs hidden lg:table-cell">
                    <SortBtn field="eps" label="EPS" />
                  </th>
                  <th className="text-right px-4 py-3 text-xs hidden xl:table-cell">
                    <SortBtn field="dividendYield" label="Div %" />
                  </th>
                  <th className="text-right px-4 py-3 text-xs hidden xl:table-cell">
                    <SortBtn field="rsi" label="RSI" />
                  </th>
                  <th className="text-center px-4 py-3 text-xs w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {filtered.map(s => (
                  <tr key={s.symbol} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer" onClick={() => onNavigate('stock', s.symbol)}>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center font-bold text-blue-600 text-xs shrink-0">
                          {s.symbol.slice(0, 2)}
                        </div>
                        <div>
                          <div className="font-semibold text-sm text-gray-900 dark:text-white">{s.symbol}</div>
                          <div className="text-xs text-gray-500 truncate max-w-32">{s.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <span className="font-semibold text-sm text-gray-900 dark:text-white">${s.price.toFixed(2)}</span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <span className={`inline-flex items-center gap-0.5 text-xs font-semibold ${s.changePct >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {s.changePct >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                        {s.changePct >= 0 ? '+' : ''}{s.changePct.toFixed(2)}%
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right hidden sm:table-cell">
                      <span className="text-xs text-gray-700 dark:text-gray-300">{formatMarketCap(s.marketCap)}</span>
                    </td>
                    <td className="px-4 py-3.5 text-right hidden md:table-cell">
                      <span className="text-xs text-gray-700 dark:text-gray-300">{formatVolume(s.volume)}</span>
                    </td>
                    <td className="px-4 py-3.5 text-right hidden lg:table-cell">
                      <span className="text-xs text-gray-700 dark:text-gray-300">{s.pe.toFixed(1)}</span>
                    </td>
                    <td className="px-4 py-3.5 text-right hidden lg:table-cell">
                      <span className="text-xs text-gray-700 dark:text-gray-300">${s.eps.toFixed(2)}</span>
                    </td>
                    <td className="px-4 py-3.5 text-right hidden xl:table-cell">
                      <span className="text-xs text-gray-700 dark:text-gray-300">{s.dividendYield > 0 ? `${s.dividendYield.toFixed(2)}%` : '—'}</span>
                    </td>
                    <td className="px-4 py-3.5 text-right hidden xl:table-cell">
                      <span className={`text-xs font-medium ${s.rsi > 70 ? 'text-red-500' : s.rsi < 30 ? 'text-green-500' : 'text-gray-700 dark:text-gray-300'}`}>
                        {s.rsi.toFixed(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-center" onClick={e => handleWatchlist(e, s)}>
                      <button className={`p-1 rounded transition-colors ${watchlist.includes(s.symbol) ? 'text-yellow-500 hover:text-yellow-600' : 'text-gray-300 hover:text-yellow-400'}`}>
                        <Star size={14} fill={watchlist.includes(s.symbol) ? 'currentColor' : 'none'} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="py-16 text-center text-gray-400 text-sm">No results matching your filters.</div>
          )}
        </div>
      </div>
    </div>
  );
}
