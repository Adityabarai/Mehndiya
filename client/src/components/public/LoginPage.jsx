import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, ArrowRight, AlertCircle, UserPlus } from 'lucide-react';

export default function LoginPage({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setError('');
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (res.success) {
      if (res.user.role === 'ADMIN') onNavigate('admin-dashboard');
      else if (res.user.role === 'ARTIST') onNavigate('artist-dashboard');
      else onNavigate('user-dashboard');
    } else {
      setError(res.error || 'User is not registered. Please register first to login.');
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
          <h2 className="font-serif text-2xl font-bold text-[#143823]">Welcome to mehndiya</h2>
          <p className="text-xs text-[#6B645C]">Sign in to access your appointments and management portal</p>
        </div>

        {/* Error Alert with Registration Prompt */}
        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex flex-col gap-1.5 animate-fadeIn">
            <div className="flex items-center gap-2 font-bold">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('register')}
              className="text-left font-bold text-[#143823] underline hover:text-[#D4AF37] mt-0.5"
            >
              Click here to register an account first &rarr;
            </button>
          </div>
        )}

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
                onChange={e => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
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
                onChange={e => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                placeholder="•••••••••"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E8DFC8] text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 bg-[#FAF7F2]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#143823] hover:bg-[#1C4B30] text-[#F3E5AB] font-bold text-sm shadow-md shadow-[#143823]/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Signing in...' : 'Sign In'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Registration CTA */}
        <div className="pt-4 border-t border-[#E8DFC8] text-center space-y-2">
          <p className="text-xs text-[#7A7369]">
            Don't have an account yet? You must register first before logging in.
          </p>
          <button
            type="button"
            onClick={() => onNavigate('register')}
            className="w-full py-2.5 rounded-xl border border-[#143823] text-[#143823] hover:bg-[#143823] hover:text-[#F3E5AB] font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Create New Account / Register</span>
          </button>
        </div>
      </div>
    </div>
  );
}
