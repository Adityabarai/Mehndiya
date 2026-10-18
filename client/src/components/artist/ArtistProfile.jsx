import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, MapPin, Phone, Mail, Save, ShieldCheck, DollarSign } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export default function ArtistProfile() {
  const { artistProfile, user } = useAuth();
  const { toastSuccess, toastError } = useToast();
  const artistId = artistProfile?.id || 'art-1';

  const [name, setName] = useState(artistProfile?.name || user?.name || '');
  const [location, setLocation] = useState(artistProfile?.location || 'Mumbai');
  const [experience, setExperience] = useState(artistProfile?.experience || '8 Years');
  const [startingPrice, setStartingPrice] = useState(artistProfile?.startingPrice || 2500);
  const [travelCharge, setTravelCharge] = useState(artistProfile?.travelCharge || 500);
  const [homeService, setHomeService] = useState(artistProfile?.homeService ?? true);
  const [about, setAbout] = useState(artistProfile?.about || '');
  const [phone, setPhone] = useState(artistProfile?.phone || user?.phone || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.updateArtist(artistId, {
        name,
        location,
        experience,
        startingPrice: Number(startingPrice),
        travelCharge: Number(travelCharge),
        homeService,
        about,
        phone
      });
      if (res.success) {
        toastSuccess('Artist profile updated successfully!');
      }
    } catch (err) {
      toastError(err.message || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#143823]">
          Artist Profile Settings
        </h1>
        <p className="text-xs sm:text-sm text-[#6B645C]">
          Update your public profile, travel coverage, and client contact details.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DFC8] shadow-sm space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-[#E8DFC8]">
          <div className="relative">
            <img
              src={artistProfile?.profileImage || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80'}
              alt={name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-[#D4AF37]"
            />
            {artistProfile?.verified && (
              <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-[#143823] text-[#D4AF37]">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
            )}
          </div>

          <div>
            <h3 className="font-serif font-bold text-lg text-[#143823]">{name}</h3>
            <span className="text-xs text-[#7A7369]">{location} • {experience}</span>
            <div className="mt-1">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">
                Status: {artistProfile?.approvalStatus || 'approved'}
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs font-sans">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#143823] uppercase mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full p-3 rounded-xl border border-[#E8DFC8] bg-[#FAF7F2] text-sm font-semibold text-[#143823]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#143823] uppercase mb-1">
                City / Base Location
              </label>
              <select
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="w-full p-3 rounded-xl border border-[#E8DFC8] bg-[#FAF7F2] text-sm text-[#143823]"
              >
                <option value="Mumbai">Mumbai</option>
                <option value="Jaipur">Jaipur</option>
                <option value="Delhi NCR">Delhi NCR</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Udaipur">Udaipur</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#143823] uppercase mb-1">
                Experience
              </label>
              <input
                type="text"
                value={experience}
                onChange={e => setExperience(e.target.value)}
                className="w-full p-3 rounded-xl border border-[#E8DFC8] bg-[#FAF7F2] text-sm text-[#143823]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#143823] uppercase mb-1">
                Starting Price (₹)
              </label>
              <input
                type="number"
                value={startingPrice}
                onChange={e => setStartingPrice(e.target.value)}
                className="w-full p-3 rounded-xl border border-[#E8DFC8] bg-[#FAF7F2] text-sm text-[#143823]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#143823] uppercase mb-1">
                Travel Charge (₹)
              </label>
              <input
                type="number"
                value={travelCharge}
                onChange={e => setTravelCharge(e.target.value)}
                className="w-full p-3 rounded-xl border border-[#E8DFC8] bg-[#FAF7F2] text-sm text-[#143823]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#143823] uppercase mb-1">
              WhatsApp / Booking Phone
            </label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="w-full p-3 rounded-xl border border-[#E8DFC8] bg-[#FAF7F2] text-sm text-[#143823]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#143823] uppercase mb-1">
              About Artist & Bio
            </label>
            <textarea
              rows={3}
              value={about}
              onChange={e => setAbout(e.target.value)}
              className="w-full p-3 rounded-xl border border-[#E8DFC8] bg-[#FAF7F2] text-sm text-[#143823]"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-[#143823]">
            <input
              type="checkbox"
              checked={homeService}
              onChange={e => setHomeService(e.target.checked)}
              className="rounded text-[#143823] focus:ring-[#D4AF37]"
            />
            <span>Offer Doorstep / Hotel Venue Travel (Home Service)</span>
          </label>

          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-[#143823] text-[#F3E5AB] font-bold text-xs shadow-md hover:bg-[#1C4B30] flex items-center gap-2"
            >
              <Save className="w-4 h-4 text-[#D4AF37]" />
              <span>{saving ? 'Saving...' : 'Save Profile'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
