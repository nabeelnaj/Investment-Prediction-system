import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  watchlist: string[];
  addToWatchlist: (symbol: string, name: string) => Promise<void>;
  removeFromWatchlist: (symbol: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [watchlist, setWatchlist] = useState<string[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      if (session?.user) loadWatchlist(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        (async () => { await loadWatchlist(session.user.id); })();
      } else {
        setWatchlist([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function loadWatchlist(userId: string) {
    const { data } = await supabase
      .from('watchlists')
      .select('symbol')
      .eq('user_id', userId);
    setWatchlist((data ?? []).map(r => r.symbol));
  }

  async function signUp(email: string, password: string, fullName: string) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { error: error.message };
    if (data.user) {
      await supabase.from('profiles').insert({ id: data.user.id, full_name: fullName });
    }
    return { error: null };
  }

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  async function addToWatchlist(symbol: string, name: string) {
    if (!user) return;
    await supabase.from('watchlists').insert({ user_id: user.id, symbol, company_name: name });
    setWatchlist(prev => [...prev, symbol]);
  }

  async function removeFromWatchlist(symbol: string) {
    if (!user) return;
    await supabase.from('watchlists').delete().eq('user_id', user.id).eq('symbol', symbol);
    setWatchlist(prev => prev.filter(s => s !== symbol));
  }

  return (
    <AuthContext.Provider value={{ session, user, loading, signUp, signIn, signOut, watchlist, addToWatchlist, removeFromWatchlist }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
