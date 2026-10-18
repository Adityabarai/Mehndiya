import React, { useEffect, useState } from 'react';
import { ShieldCheck, Star, MapPin, Sparkles, ArrowRight, Calendar, Heart } from 'lucide-react';
import { api } from '../../services/api';

export default function FeaturedArtists({ onNavigate, onOpenBooking, onSelectArtist }) {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getArtists()
      .then(res => {
        if (res.success) setArtists(res.data.slice(0, 4));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-20 bg-gradient-to-b from-[#FAF7F2] via-[#F4EFE6] to-[#FAF7F2] border-t border-[#E8DFC8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#143823]/10 border border-[#D4AF37]/30 text-[#143823] text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Master Henna Artisans</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#143823] tracking-tight">
              Our Artisans & Henna Team
            </h2>
            <p className="text-sm text-[#6B645C] max-w-xl">
              Boutique craftsmanship led by founder Ayushi Verma and our master bridal henna artists. Dedicated to heirloom symmetry, organic Sojat henna, and personalized care.
            </p>
          </div>

          <button
            onClick={() => onNavigate('artists')}
            className="self-start md:self-auto inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#D4AF37]/50 text-[#143823] font-semibold text-xs hover:bg-white transition-all"
          >
            <span>View All Artists</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
          </button>
        </div>

        {/* Artist Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {artists.map(artist => (
            <div
              key={artist.id}
              className="bg-white rounded-3xl overflow-hidden border border-[#E8DFC8] shadow-sm hover:shadow-xl hover:border-[#D4AF37] transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Artist Photo Header */}
                <div className="relative h-60 bg-stone-100 overflow-hidden">
                  <img
                    src={artist.profileImage}
                    alt={artist.name}
                    className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Verified Badge */}
                  {artist.verified && (
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#FAF7F2]/95 backdrop-blur-md border border-[#D4AF37]/40 text-[#143823] text-[11px] font-bold flex items-center gap-1.5 shadow-sm">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Verified</span>
                    </div>
                  )}

                  {/* Home Service Available pill */}
                  {artist.homeService && (
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#143823]/90 backdrop-blur-md text-[#F3E5AB] text-[10px] font-semibold">
                      Home Visit
                    </div>
                  )}

                  {/* Rating Tag */}
                  <div className="absolute bottom-3 left-3 px-3 py-1 rounded-xl bg-black/75 backdrop-blur-sm text-white text-xs font-bold flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 fill-current text-[#D4AF37]" />
                    <span>{artist.rating}</span>
                    <span className="text-white/60 font-normal">({artist.reviewCount || 140})</span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#143823]">
                      {artist.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-[#7A7369] mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Studio & Doorstep Service</span>
                      <span className="text-[#D4AF37]">•</span>
                      <span>{artist.experience} Experience</span>
                    </div>
                  </div>

                  {/* Specializations */}
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#8C8479] tracking-wider block mb-1.5">
                      Specialized In:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {artist.specializations.map((spec, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-[#FAF7F2] border border-[#E8DFC8] text-[11px] font-medium text-[#143823]"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Price & Action Buttons */}
              <div className="p-5 pt-0 space-y-3">
                <div className="pt-3 border-t border-[#EFE9DC] flex items-center justify-between">
                  <span className="text-xs text-[#7A7369]">Starting from</span>
                  <span className="font-serif text-lg font-bold text-[#143823]">
                    ₹{artist.startingPrice.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      if (onSelectArtist) onSelectArtist(artist);
                      onNavigate('artist-detail', { artistId: artist.id });
                    }}
                    className="w-full py-2 rounded-xl border border-[#D4AF37]/50 text-[#143823] text-xs font-semibold hover:bg-[#FAF7F2] transition-colors text-center"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={() => onOpenBooking(null, artist)}
                    className="w-full py-2 rounded-xl bg-[#143823] hover:bg-[#1C4B30] text-[#F3E5AB] text-xs font-bold shadow-sm active:scale-95 transition-all text-center"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
