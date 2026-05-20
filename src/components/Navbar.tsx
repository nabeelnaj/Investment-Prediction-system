import { useState } from 'react';
import { TrendingUp, Sun, Moon, Search, Bell, User, LogOut, LayoutDashboard, BarChart2, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { STOCKS } from '../lib/mockData';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string, symbol?: string) => void;
  onAuthClick: (mode: 'signin' | 'signup') => void;
}

export default function Navbar({ currentPage, onNavigate, onAuthClick }: NavbarProps) {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const searchResults = searchQuery.length >= 1
    ? STOCKS.filter(s =>
        s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6)
    : [];

  function handleStockSelect(symbol: string) {
    setSearchQuery('');
    setShowSearch(false);
    onNavigate('stock', symbol);
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 h-16 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 flex items-center px-4 lg:px-6 gap-4">
      <button onClick={() => onNavigate('landing')} className="flex items-center gap-2.5 shrink-0">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <TrendingUp size={18} className="text-white" />
        </div>
        <span className="font-bold text-gray-900 dark:text-white hidden sm:block text-sm">InvestPredictor</span>
      </button>

      <div className="flex-1 max-w-sm relative hidden md:block">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search stocks, symbols..."
          value={searchQuery}
          onChange={e => { setSearchQuery(e.target.value); setShowSearch(true); }}
          onFocus={() => setShowSearch(true)}
          onBlur={() => setTimeout(() => setShowSearch(false), 200)}
          className="w-full pl-9 pr-4 py-2 text-sm rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border border-transparent focus:border-blue-500 focus:outline-none transition-colors"
        />
        {showSearch && searchResults.length > 0 && (
          <div className="absolute top-full mt-1 left-0 right-0 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden z-50">
            {searchResults.map(s => (
              <button
                key={s.symbol}
                onMouseDown={() => handleStockSelect(s.symbol)}
                className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
              >
                <div>
                  <span className="font-semibold text-sm text-gray-900 dark:text-white">{s.symbol}</span>
                  <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">{s.name}</span>
                </div>
                <span className={`text-xs font-medium ${s.changePct >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {s.changePct >= 0 ? '+' : ''}{s.changePct.toFixed(2)}%
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="hidden md:flex items-center gap-1 ml-2">
        {user && (
          <>
            <NavBtn active={currentPage === 'dashboard'} onClick={() => onNavigate('dashboard')}>
              <LayoutDashboard size={15} /> Dashboard
            </NavBtn>
            <NavBtn active={currentPage === 'screener'} onClick={() => onNavigate('screener')}>
              <BarChart2 size={15} /> Screener
            </NavBtn>
          </>
        )}
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors">
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {user ? (
          <div className="relative">
            <button onClick={() => setShowUserMenu(v => !v)} className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                {user.email?.[0].toUpperCase()}
              </div>
              <span className="text-sm text-gray-700 dark:text-gray-200 hidden sm:block">{user.email?.split('@')[0]}</span>
            </button>
            {showUserMenu && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden z-50">
                <button onClick={() => { onNavigate('dashboard'); setShowUserMenu(false); }} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <LayoutDashboard size={15} /> Dashboard
                </button>
                <button onClick={() => { onNavigate('screener'); setShowUserMenu(false); }} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <BarChart2 size={15} /> Screener
                </button>
                <button onClick={() => { onNavigate('profile'); setShowUserMenu(false); }} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <User size={15} /> Profile
                </button>
                <hr className="border-gray-200 dark:border-gray-700" />
                <button onClick={signOut} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                  <LogOut size={15} /> Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="hidden sm:flex items-center gap-2">
            <button onClick={() => onAuthClick('signin')} className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
              Sign In
            </button>
            <button onClick={() => onAuthClick('signup')} className="px-3 py-1.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
              Get Started
            </button>
          </div>
        )}

        <button onClick={() => setMobileMenuOpen(v => !v)} className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300">
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 p-4 space-y-3 md:hidden z-40">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search stocks..."
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setShowSearch(true); }}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none"
            />
            {showSearch && searchResults.length > 0 && (
              <div className="absolute top-full mt-1 left-0 right-0 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden z-50">
                {searchResults.map(s => (
                  <button
                    key={s.symbol}
                    onMouseDown={() => { handleStockSelect(s.symbol); setMobileMenuOpen(false); }}
                    className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 text-left"
                  >
                    <span className="font-semibold text-sm text-gray-900 dark:text-white">{s.symbol}</span>
                    <span className="text-xs text-gray-500">{s.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          {!user ? (
            <div className="flex gap-2">
              <button onClick={() => { onAuthClick('signin'); setMobileMenuOpen(false); }} className="flex-1 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-lg">Sign In</button>
              <button onClick={() => { onAuthClick('signup'); setMobileMenuOpen(false); }} className="flex-1 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg">Get Started</button>
            </div>
          ) : (
            <div className="space-y-1">
              <button onClick={() => { onNavigate('dashboard'); setMobileMenuOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                <LayoutDashboard size={15} /> Dashboard
              </button>
              <button onClick={() => { onNavigate('screener'); setMobileMenuOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                <BarChart2 size={15} /> Screener
              </button>
              <button onClick={() => { signOut(); setMobileMenuOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                <LogOut size={15} /> Sign Out
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

function NavBtn({ children, active, onClick }: { children: React.ReactNode; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
        active
          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
      }`}
    >
      {children}
    </button>
  );
}
