import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Phone, MapPin, Save, ShieldCheck } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export default function UserProfile() {
  const { user } = useAuth();
  const { toastSuccess } = useToast();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [city, setCity] = useState('Mumbai');
  const [saving, setSaving] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toastSuccess('Profile preferences updated!');
    }, 600);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#143823]">
          Customer Profile & Preferences
        </h1>
        <p className="text-xs sm:text-sm text-[#6B645C]">
          Update your contact details and default location for rapid checkout.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DFC8] shadow-sm space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-[#E8DFC8]">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80'}
            alt={user?.name}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-[#D4AF37]/50"
          />
          <div>
            <h3 className="font-serif font-bold text-lg text-[#143823]">{user?.name}</h3>
            <p className="text-xs text-[#7A7369]">{user?.email}</p>
            <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-[#143823]/10 text-[10px] font-bold text-[#143823] uppercase">
              Role: {user?.role}
            </span>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs font-sans">
          <div>
            <label className="block text-xs font-bold text-[#143823] uppercase tracking-wider mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full p-3 rounded-xl border border-[#E8DFC8] bg-[#FAF7F2] text-sm text-[#143823]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#143823] uppercase tracking-wider mb-1">
              WhatsApp / Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="w-full p-3 rounded-xl border border-[#E8DFC8] bg-[#FAF7F2] text-sm text-[#143823]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#143823] uppercase tracking-wider mb-1">
              Default City
            </label>
            <select
              value={city}
              onChange={e => setCity(e.target.value)}
              className="w-full p-3 rounded-xl border border-[#E8DFC8] bg-[#FAF7F2] text-sm text-[#143823]"
            >
              <option value="Mumbai">Mumbai</option>
              <option value="Jaipur">Jaipur</option>
              <option value="Delhi NCR">Delhi NCR</option>
              <option value="Bengaluru">Bengaluru</option>
              <option value="Udaipur">Udaipur</option>
            </select>
          </div>

          <div className="pt-3">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-[#143823] hover:bg-[#1C4B30] text-[#F3E5AB] font-bold text-xs shadow-md shadow-[#143823]/20 flex items-center gap-2"
            >
              <Save className="w-4 h-4 text-[#D4AF37]" />
              <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
