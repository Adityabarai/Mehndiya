import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, Mail, Lock, ArrowRight, ShieldCheck, User, Palette } from 'lucide-react';

export default function LoginPage({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, loginAsAdmin, loginAsArtist, loginAsUser } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (res.success) {
      if (res.user.role === 'ADMIN') onNavigate('admin-dashboard');
      else if (res.user.role === 'ARTIST') onNavigate('artist-dashboard');
      else onNavigate('user-dashboard');
    }
  };

  const handleQuickDemo = async (roleType) => {
    setLoading(true);
    let res;
    if (roleType === 'admin') res = await loginAsAdmin();
    else if (roleType === 'artist') res = await loginAsArtist();
    else res = await loginAsUser();
    setLoading(false);

    if (res.success) {
      if (res.user.role === 'ADMIN') onNavigate('admin-dashboard');
      else if (res.user.role === 'ARTIST') onNavigate('artist-dashboard');
      else onNavigate('user-dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-16 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-[#E8DFC8] shadow-xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-[#143823] to-[#D4AF37] p-[1.5px] shadow-md">
            <div className="w-full h-full bg-[#FAF7F2] rounded-[14px] flex items-center justify-center">
              <span className="font-serif font-black text-2xl text-[#143823]">M</span>
            </div>
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#143823]">Welcome to Mehndi with Ayushi</h2>
          <p className="text-xs text-[#6B645C]">Sign in to access your appointments and management portal</p>
        </div>

        {/* Quick Test Logins for easy testing */}
        <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#D4AF37]/40 space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#143823]">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Quick Test Credentials:</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('user')}
              className="p-2 rounded-xl bg-white border border-[#E8DFC8] hover:border-[#143823] text-center shadow-xs transition-all text-[11px]"
            >
              <User className="w-3.5 h-3.5 text-[#143823] mx-auto mb-1" />
              <strong className="block text-[#143823]">Customer</strong>
              <span className="text-[9px] text-[#7A7369]">Ananya</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('artist')}
              className="p-2 rounded-xl bg-white border border-[#E8DFC8] hover:border-[#143823] text-center shadow-xs transition-all text-[11px]"
            >
              <Palette className="w-3.5 h-3.5 text-[#8C6D38] mx-auto mb-1" />
              <strong className="block text-[#143823]">Artist</strong>
              <span className="text-[9px] text-[#7A7369]">Ayushi</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              className="p-2 rounded-xl bg-white border border-[#E8DFC8] hover:border-[#143823] text-center shadow-xs transition-all text-[11px]"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 mx-auto mb-1" />
              <strong className="block text-[#143823]">Admin</strong>
              <span className="text-[9px] text-[#7A7369]">Radhika</span>
            </button>
          </div>
        </div>

        {/* Manual Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#143823] uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#8C8479] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E8DFC8] text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 bg-[#FAF7F2]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#143823] uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#8C8479] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E8DFC8] text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 bg-[#FAF7F2]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#143823] hover:bg-[#1C4B30] text-[#F3E5AB] font-bold text-sm shadow-md shadow-[#143823]/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-[#7A7369]">
          Don't have an account yet?{' '}
          <button
            onClick={() => onNavigate('register')}
            className="text-[#143823] font-bold hover:underline"
          >
            Create an Account
          </button>
        </div>
      </div>
    </div>
  );
}
