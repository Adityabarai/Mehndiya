import React, { useState, useEffect } from 'react';
import { ShieldCheck, Star, MapPin, Search, Filter, Sparkles, SlidersHorizontal, ArrowRight, Clock } from 'lucide-react';
import { api } from '../../services/api';
import EmptyState from '../common/EmptyState';

export default function ArtistListingPage({ onNavigate, onOpenBooking, onSelectArtist }) {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters matching Prompt Item 6
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('All Locations');
  const [specialization, setSpecialization] = useState('All Specializations');
  const [minRating, setMinRating] = useState('0');
  const [maxPrice, setMaxPrice] = useState(10000);
  const [homeServiceOnly, setHomeServiceOnly] = useState(false);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (location !== 'All Locations') params.location = location;
    if (specialization !== 'All Specializations') params.specialization = specialization;
    if (minRating !== '0') params.minRating = minRating;
    if (maxPrice < 10000) params.maxPrice = maxPrice;
    if (homeServiceOnly) params.availability = 'homeService';

    api.getArtists(params)
      .then(res => {
        if (res.success) setArtists(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [search, location, specialization, minRating, maxPrice, homeServiceOnly]);

  const handleResetFilters = () => {
    setSearch('');
    setLocation('All Locations');
    setSpecialization('All Specializations');
    setMinRating('0');
    setMaxPrice(10000);
    setHomeServiceOnly(false);
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#143823]/10 border border-[#D4AF37]/30 text-[#143823] text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Master Henna Artisans</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#143823] tracking-tight">
            Our Henna Artists & Team
          </h1>
          <p className="text-sm text-[#6B645C] max-w-2xl font-sans">
            Meet Ayushi and our dedicated bridal henna artists. Book customized studio sessions or at-home doorstep services for weddings, engagements, and festive celebrations.
          </p>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-white p-5 rounded-3xl border border-[#E8DFC8] shadow-sm mb-10 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="relative md:col-span-2">
              <Search className="w-4 h-4 text-[#8C8479] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search artist name or style (Bridal, Arabic, Traditional)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E8DFC8] text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 bg-[#FAF7F2]"
              />
            </div>

            {/* Service Mode Filter */}
            <div>
              <select
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-[#E8DFC8] text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 bg-[#FAF7F2]"
              >
                <option value="All Locations">All Service Modes</option>
                <option value="Studio Visits">Studio Visits</option>
                <option value="Home Service">Doorstep / Home Visit</option>
                <option value="Wedding Venue">Wedding Venue Booking</option>
              </select>
            </div>

            {/* Specialization Filter */}
            <div>
              <select
                value={specialization}
                onChange={e => setSpecialization(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-[#E8DFC8] text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 bg-[#FAF7F2]"
              >
                <option value="All Specializations">All Specializations</option>
                <option value="Bridal">Bridal Henna</option>
                <option value="Arabic">Arabic Mehndi</option>
                <option value="Traditional">Traditional Rajasthani</option>
                <option value="Minimal">Minimal Modern</option>
                <option value="Indo-Arabic">Indo-Arabic Fusion</option>
                <option value="Portraits">Portrait Henna</option>
              </select>
            </div>
          </div>

          {/* Secondary Filters: Rating & Home Service */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-[#EFE9DC] text-xs">
            <div className="flex flex-wrap items-center gap-4">
              {/* Rating Selector */}
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-[#143823]">Rating:</span>
                <select
                  value={minRating}
                  onChange={e => setMinRating(e.target.value)}
                  className="px-2 py-1 rounded-lg border border-[#E8DFC8] bg-[#FAF7F2] font-medium"
                >
                  <option value="0">Any Rating</option>
                  <option value="4.5">4.5+ ★</option>
                  <option value="4.8">4.8+ ★</option>
                  <option value="4.9">4.9+ ★</option>
                </select>
              </div>

              {/* Price Max slider */}
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#143823]">Max Starting Price:</span>
                <span className="font-semibold text-[#8C6D38]">₹{maxPrice.toLocaleString('en-IN')}</span>
                <input
                  type="range"
                  min="1500"
                  max="10000"
                  step="500"
                  value={maxPrice}
                  onChange={e => setMaxPrice(Number(e.target.value))}
                  className="w-24 accent-[#143823]"
                />
              </div>

              {/* Home Service toggle */}
              <label className="flex items-center gap-2 cursor-pointer font-medium text-[#143823]">
                <input
                  type="checkbox"
                  checked={homeServiceOnly}
                  onChange={e => setHomeServiceOnly(e.target.checked)}
                  className="rounded text-[#143823] focus:ring-[#D4AF37]"
                />
                <span>Home Visit Available</span>
              </label>
            </div>

            <button
              onClick={handleResetFilters}
              className="text-[#8C6D38] hover:underline font-semibold"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Results Counter */}
        <div className="mb-6 flex items-center justify-between text-xs text-[#7A7369]">
          <span>Showing <strong className="text-[#143823]">{artists.length}</strong> verified mehndi artists</span>
        </div>

        {/* Artists Grid */}
        {artists.length === 0 ? (
          <EmptyState
            title="No Mehndi Artists Found"
            description="We couldn't find any verified artists matching your selected filters. Try broadening your search or resetting filters."
            icon={Search}
            actionText="Reset Filters"
            onAction={handleResetFilters}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {artists.map(artist => (
              <div
                key={artist.id}
                className="bg-white rounded-3xl overflow-hidden border border-[#E8DFC8] shadow-sm hover:shadow-xl hover:border-[#D4AF37] transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Photo Header */}
                  <div className="relative h-64 bg-stone-100 overflow-hidden">
                    <img
                      src={artist.profileImage}
                      alt={artist.name}
                      className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                    />

                    {artist.verified && (
                      <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#FAF7F2]/95 backdrop-blur-md border border-[#D4AF37]/40 text-[#143823] text-xs font-bold flex items-center gap-1.5 shadow-sm">
                        <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                        <span>Verified Artist</span>
                      </div>
                    )}

                    {artist.homeService && (
                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#143823]/90 text-[#F3E5AB] text-[11px] font-semibold">
                        Home Visit
                      </div>
                    )}

                    <div className="absolute bottom-3 left-3 px-3 py-1 rounded-xl bg-black/75 backdrop-blur-sm text-white text-xs font-bold flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 fill-current text-[#D4AF37]" />
                      <span>{artist.rating}</span>
                      <span className="text-white/60 font-normal">({artist.reviewCount || 140} reviews)</span>
                    </div>
                  </div>

                  {/* Body Content Exactly Matching Prompt Item 6 */}
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-[#143823]">
                        {artist.name}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-[#7A7369] mt-1 font-sans">
                        <span className="font-semibold text-[#143823]">{artist.experience} Experience</span>
                        <span className="text-[#D4AF37]">•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                          Studio & Doorstep Service
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#8C8479] tracking-wider block mb-1.5">
                        Specialized In:
                      </span>
                      <p className="text-xs font-semibold text-[#143823]">
                        {artist.specializations.join(' • ')}
                      </p>
                    </div>

                    <p className="text-xs text-[#6B645C] line-clamp-2 leading-relaxed">
                      {artist.about}
                    </p>
                  </div>
                </div>

                {/* Pricing & Buttons */}
                <div className="p-6 pt-0 space-y-4">
                  <div className="pt-4 border-t border-[#EFE9DC] flex items-center justify-between">
                    <span className="text-xs text-[#7A7369]">Starting from</span>
                    <span className="font-serif text-2xl font-black text-[#143823]">
                      ₹{artist.startingPrice.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        if (onSelectArtist) onSelectArtist(artist);
                        onNavigate('artist-detail', { artistId: artist.id });
                      }}
                      className="w-full py-2.5 rounded-xl border border-[#D4AF37]/50 text-[#143823] text-xs font-bold hover:bg-[#FAF7F2] transition-colors text-center"
                    >
                      View Profile
                    </button>
                    <button
                      onClick={() => onOpenBooking(null, artist)}
                      className="w-full py-2.5 rounded-xl bg-[#143823] hover:bg-[#1C4B30] text-[#F3E5AB] text-xs font-bold shadow-md shadow-[#143823]/20 active:scale-95 transition-all text-center flex items-center justify-center gap-1"
                    >
                      <span>Book Now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
