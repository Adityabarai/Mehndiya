import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, User, Palette, Mail, Phone, Lock, MapPin, ArrowRight, ShieldAlert } from 'lucide-react';

export default function RegisterPage({ onNavigate }) {
  const [role, setRole] = useState('USER'); // 'USER' or 'ARTIST'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  
  // Artist specific fields (Prompt item 24)
  const [location, setLocation] = useState('Mumbai');
  const [experience, setExperience] = useState('5 Years');
  const [specializations, setSpecializations] = useState(['Bridal', 'Arabic']);
  const [startingPrice, setStartingPrice] = useState(2500);
  const [homeService, setHomeService] = useState(true);
  const [about, setAbout] = useState('');
  
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      name,
      email,
      phone,
      password,
      role,
      location,
      experience,
      specializations,
      startingPrice,
      homeService,
      about
    };

    const res = await register(payload);
    setLoading(false);

    if (res.success) {
      if (res.user.role === 'ARTIST') {
        onNavigate('artist-dashboard');
      } else {
        onNavigate('user-dashboard');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-16 flex items-center justify-center px-4">
      <div className="max-w-xl w-full bg-white rounded-3xl p-8 border border-[#E8DFC8] shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-[#143823] to-[#D4AF37] p-[1.5px] shadow-md">
            <div className="w-full h-full bg-[#FAF7F2] rounded-[14px] flex items-center justify-center">
              <span className="font-serif font-black text-2xl text-[#143823]">M</span>
            </div>
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#143823]">Create Your Mehndi Account</h2>
          <p className="text-xs text-[#6B645C]">Join as a client or register as a professional mehndi artist</p>
        </div>

        {/* Role Toggle Selector */}
        <div className="grid grid-cols-2 gap-3 p-1.5 rounded-2xl bg-[#FAF7F2] border border-[#E8DFC8]">
          <button
            type="button"
            onClick={() => setRole('USER')}
            className={`py-3 rounded-xl font-sans font-bold text-xs flex items-center justify-center gap-2 transition-all ${
              role === 'USER'
                ? 'bg-[#143823] text-[#F3E5AB] shadow-md'
                : 'text-[#5C554E] hover:text-[#143823]'
            }`}
          >
            <User className="w-4 h-4" />
            <span>I am a Customer</span>
          </button>
          <button
            type="button"
            onClick={() => setRole('ARTIST')}
            className={`py-3 rounded-xl font-sans font-bold text-xs flex items-center justify-center gap-2 transition-all ${
              role === 'ARTIST'
                ? 'bg-[#143823] text-[#F3E5AB] shadow-md'
                : 'text-[#5C554E] hover:text-[#143823]'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>I am a Mehndi Artist</span>
          </button>
        </div>

        {role === 'ARTIST' && (
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <p>
              <strong>Artist Verification Policy:</strong> After registration, your profile status will be <em>Pending Verification</em>. The admin team will review and approve your profile before you can receive public bookings.
            </p>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#143823] uppercase tracking-wider mb-1">
                Full Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                placeholder="e.g. Priya Sharma"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DFC8] text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 bg-[#FAF7F2]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#143823] uppercase tracking-wider mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                required
                placeholder="+91 98765 43210"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DFC8] text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 bg-[#FAF7F2]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#143823] uppercase tracking-wider mb-1">
                Email Address *
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="name@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DFC8] text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 bg-[#FAF7F2]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#143823] uppercase tracking-wider mb-1">
                Password *
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DFC8] text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 bg-[#FAF7F2]"
              />
            </div>
          </div>

          {/* Artist Extra Fields */}
          {role === 'ARTIST' && (
            <div className="space-y-4 pt-3 border-t border-[#E8DFC8]">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#143823] uppercase tracking-wider mb-1">
                    City / Location
                  </label>
                  <select
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E8DFC8] text-sm bg-[#FAF7F2]"
                  >
                    <option value="Mumbai">Mumbai</option>
                    <option value="Jaipur">Jaipur</option>
                    <option value="Delhi NCR">Delhi NCR</option>
                    <option value="Bengaluru">Bengaluru</option>
                    <option value="Udaipur">Udaipur</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#143823] uppercase tracking-wider mb-1">
                    Experience
                  </label>
                  <input
                    type="text"
                    value={experience}
                    onChange={e => setExperience(e.target.value)}
                    placeholder="e.g. 5 Years"
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E8DFC8] text-sm bg-[#FAF7F2]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#143823] uppercase tracking-wider mb-1">
                    Starting Price (₹)
                  </label>
                  <input
                    type="number"
                    value={startingPrice}
                    onChange={e => setStartingPrice(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E8DFC8] text-sm bg-[#FAF7F2]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#143823] uppercase tracking-wider mb-1">
                  About Your Craft & Henna Experience
                </label>
                <textarea
                  rows={2}
                  value={about}
                  onChange={e => setAbout(e.target.value)}
                  placeholder="Share your specialization, henna heritage, and bridal portfolio summary..."
                  className="w-full p-3 rounded-xl border border-[#E8DFC8] text-sm bg-[#FAF7F2]"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#143823]">
                <input
                  type="checkbox"
                  checked={homeService}
                  onChange={e => setHomeService(e.target.checked)}
                  className="rounded text-[#143823]"
                />
                <span>Available for Doorstep / Venue Travel (Home Service)</span>
              </label>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-[#143823] hover:bg-[#1C4B30] text-[#F3E5AB] font-bold text-sm shadow-md shadow-[#143823]/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {loading ? 'Registering...' : (role === 'ARTIST' ? 'Submit Artist Application' : 'Register Customer Account')}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-[#7A7369]">
          Already have an account?{' '}
          <button
            onClick={() => onNavigate('login')}
            className="text-[#143823] font-bold hover:underline"
          >
            Sign In here
          </button>
        </div>
      </div>
    </div>
  );
}
