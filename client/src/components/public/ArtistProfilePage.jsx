import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Star, 
  MapPin, 
  Calendar, 
  Clock, 
  Phone, 
  Sparkles, 
  ArrowLeft, 
  Check, 
  MessageSquare, 
  Heart,
  Share2
} from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export default function ArtistProfilePage({ artistId, onNavigate, onOpenBooking }) {
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });
  const [activeTab, setActiveTab] = useState('portfolio'); // portfolio, services, reviews, schedule
  const { toastSuccess, toastInfo } = useToast();

  useEffect(() => {
    if (!artistId) return;
    setLoading(false);
    api.getArtist(artistId)
      .then(res => {
        if (res.success) setArtist(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [artistId]);

  if (!artist && !loading) {
    return (
      <div className="py-20 text-center bg-[#FAF7F2] min-h-screen">
        <p className="text-sm text-[#7A7369]">Artist profile not found.</p>
        <button
          onClick={() => onNavigate('artists')}
          className="mt-4 px-4 py-2 bg-[#143823] text-[#F3E5AB] rounded-xl text-xs font-semibold"
        >
          Back to Artists
        </button>
      </div>
    );
  }

  // Check if selected date is available
  const isDateBlocked = artist?.blockedDates?.some(b => b.date === selectedDate);
  const blockedObj = artist?.blockedDates?.find(b => b.date === selectedDate);
  const dateObj = new Date(selectedDate + 'T12:00:00');
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const dayName = dayNames[dateObj.getDay()];
  const isDayOff = artist?.workingHours && artist.workingHours[dayName]?.available === false;

  const handleContactArtist = () => {
    const phone = artist?.phone || '+91 98765 43210';
    const text = `Hello ${artist.name}! I found your mehndi profile on Mehndi platform and would love to check your availability.`;
    window.open(`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen pb-20">
      {/* Cover Banner */}
      <div className="relative h-72 sm:h-80 bg-gradient-to-r from-[#143823] to-[#1C4B30] overflow-hidden">
        <img
          src={artist?.coverImage || 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1200&q=80'}
          alt="Artist Cover"
          className="w-full h-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#143823] via-[#143823]/40 to-transparent" />

        {/* Back Button */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 absolute top-6 left-0 right-0">
          <button
            onClick={() => onNavigate('artists')}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-semibold transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Artists</span>
          </button>
        </div>
      </div>

      {/* Profile Header Card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DFC8] shadow-xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            {/* Left: Avatar & Basic Info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="relative">
                <img
                  src={artist?.profileImage}
                  alt={artist?.name}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-4 ring-[#D4AF37]/50 shadow-md"
                />
                {artist?.verified && (
                  <div className="absolute -bottom-2 -right-2 p-1.5 rounded-full bg-[#143823] text-[#D4AF37] border-2 border-white shadow">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#143823]">
                    {artist?.name}
                  </h1>
                  {artist?.verified && (
                    <span className="px-2.5 py-0.5 rounded-full bg-[#143823]/10 text-[#143823] text-[11px] font-bold border border-[#D4AF37]/40">
                      Verified Master
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-[#7A7369] font-sans">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                    {artist?.location}
                  </span>
                  <span>•</span>
                  <span>{artist?.experience} Experience</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-bold text-[#143823]">
                    <Star className="w-3.5 h-3.5 fill-current text-amber-500" />
                    {artist?.rating} ({artist?.reviewCount} reviews)
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {artist?.specializations?.map((spec, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-0.5 rounded-md bg-[#FAF7F2] border border-[#E8DFC8] text-[11px] font-medium text-[#143823]"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Booking & Contact CTA */}
            <div className="w-full md:w-auto flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={handleContactArtist}
                className="w-full sm:w-auto px-5 py-3 rounded-xl border border-[#143823]/30 hover:bg-[#FAF7F2] text-[#143823] text-xs font-bold transition-all flex items-center justify-center gap-2"
              >
                <Phone className="w-3.5 h-3.5 text-[#143823]" />
                <span>Contact Artist</span>
              </button>

              <button
                onClick={() => onOpenBooking(null, artist)}
                className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-[#143823] to-[#1C4B30] text-[#F3E5AB] text-xs font-bold shadow-lg shadow-[#143823]/25 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                <span>Book Appointment</span>
              </button>
            </div>
          </div>

          {/* About Paragraph */}
          <div className="mt-6 pt-6 border-t border-[#EFE9DC]">
            <h3 className="font-serif text-sm font-bold text-[#143823] uppercase tracking-wider mb-2">
              About the Artist
            </h3>
            <p className="text-sm text-[#5C554E] leading-relaxed max-w-4xl">
              {artist?.about}
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-[#E8DFC8] mt-10">
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`pb-3 px-4 text-sm font-bold transition-all ${
              activeTab === 'portfolio'
                ? 'text-[#143823] border-b-2 border-[#D4AF37]'
                : 'text-[#7A7369] hover:text-[#143823]'
            }`}
          >
            Portfolio Gallery ({artist?.designs?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`pb-3 px-4 text-sm font-bold transition-all ${
              activeTab === 'schedule'
                ? 'text-[#143823] border-b-2 border-[#D4AF37]'
                : 'text-[#7A7369] hover:text-[#143823]'
            }`}
          >
            Availability & Slots
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`pb-3 px-4 text-sm font-bold transition-all ${
              activeTab === 'services'
                ? 'text-[#143823] border-b-2 border-[#D4AF37]'
                : 'text-[#7A7369] hover:text-[#143823]'
            }`}
          >
            Offered Services & Pricing
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 px-4 text-sm font-bold transition-all ${
              activeTab === 'reviews'
                ? 'text-[#143823] border-b-2 border-[#D4AF37]'
                : 'text-[#7A7369] hover:text-[#143823]'
            }`}
          >
            Reviews & Ratings ({artist?.reviews?.length || 0})
          </button>
        </div>

        {/* TAB 1: Portfolio Gallery */}
        {activeTab === 'portfolio' && (
          <div className="py-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {artist?.designs?.map(design => (
                <div
                  key={design.id}
                  className="group bg-white rounded-2xl overflow-hidden border border-[#E8DFC8] shadow-sm hover:shadow-xl transition-all"
                >
                  <div className="relative aspect-square overflow-hidden bg-stone-100">
                    <img
                      src={design.imageUrl}
                      alt={design.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 text-white text-[10px] font-bold">
                      {design.category}
                    </div>
                  </div>
                  <div className="p-3">
                    <h4 className="font-serif font-bold text-xs text-[#143823] truncate">
                      {design.title}
                    </h4>
                    <p className="text-[11px] text-[#7A7369] mt-1 flex items-center justify-between">
                      <span>{design.likes} Likes</span>
                      <button
                        onClick={() => onOpenBooking(null, artist)}
                        className="text-[#143823] font-bold hover:underline"
                      >
                        Book This
                      </button>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: Availability & Slots Preview */}
        {activeTab === 'schedule' && (
          <div className="py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Date Selector Card */}
            <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-[#E8DFC8] shadow-sm space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#143823] flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#D4AF37]" />
                <span>Select Date to Check Available Slots</span>
              </h3>
              <p className="text-xs text-[#6B645C]">
                Pick your anticipated celebration date to inspect real-time working hours and slot availability.
              </p>

              <div>
                <input
                  type="date"
                  value={selectedDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={e => setSelectedDate(e.target.value)}
                  className="w-full p-3 rounded-xl border border-[#E8DFC8] bg-[#FAF7F2] text-sm font-semibold text-[#143823] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40"
                />
              </div>

              {/* Status Message */}
              {isDateBlocked ? (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                  <p className="font-bold">⚠️ Artist Unavailable on {selectedDate}</p>
                  <p className="mt-1">Reason: {blockedObj?.reason || 'Personal Commitment'}</p>
                </div>
              ) : isDayOff ? (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
                  <p className="font-bold">⚠️ Weekly Off on {dayName.toUpperCase()}</p>
                  <p className="mt-1">This artist does not take bookings on {dayName}s.</p>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
                  <p className="font-bold">✅ Available for Booking on {selectedDate}!</p>
                  <p className="mt-1">Select one of the open time slots below.</p>
                </div>
              )}
            </div>

            {/* Time Slots Preview Card */}
            <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-[#E8DFC8] shadow-sm space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#143823] flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#D4AF37]" />
                <span>Available Time Slots ({selectedDate})</span>
              </h3>

              {isDateBlocked || isDayOff ? (
                <div className="p-8 text-center text-xs text-[#8C8479]">
                  No slots available on this date. Please pick another date.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {(artist?.timeSlots || ['10:00 AM', '11:30 AM', '01:00 PM', '03:00 PM', '05:00 PM', '07:00 PM']).map((slot, i) => (
                    <button
                      key={i}
                      onClick={() => onOpenBooking(null, artist, { date: selectedDate, timeSlot: slot })}
                      className="p-3 rounded-xl border border-[#D4AF37]/50 bg-[#FAF7F2] hover:bg-[#143823] hover:text-[#F3E5AB] text-xs font-bold text-[#143823] transition-all text-center"
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: Services & Pricing */}
        {activeTab === 'services' && (
          <div className="py-8 space-y-4">
            {artist?.services?.map(service => (
              <div
                key={service.id}
                className="bg-white p-6 rounded-2xl border border-[#E8DFC8] flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div>
                  <h4 className="font-serif font-bold text-lg text-[#143823]">{service.name}</h4>
                  <p className="text-xs text-[#7A7369] mt-1">{service.description}</p>
                  <div className="flex items-center gap-2 mt-2 text-xs font-semibold text-[#143823]">
                    <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Duration: {service.duration}</span>
                  </div>
                </div>

                <div className="text-right flex items-center gap-4">
                  <div>
                    <span className="text-[10px] text-[#7A7369] uppercase font-bold block">Base Price</span>
                    <span className="font-serif text-xl font-bold text-[#143823]">
                      ₹{service.basePrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <button
                    onClick={() => onOpenBooking(service, artist)}
                    className="px-4 py-2 bg-[#143823] text-[#F3E5AB] rounded-xl text-xs font-bold shadow-md hover:bg-[#1C4B30]"
                  >
                    Select Service
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: Reviews & Rating Breakdown */}
        {activeTab === 'reviews' && (
          <div className="py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-[#E8DFC8] space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#143823]">Rating Overview</h3>
              <div className="flex items-center gap-3">
                <span className="font-serif text-4xl font-extrabold text-[#143823]">{artist?.rating}</span>
                <div>
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs text-[#7A7369] mt-0.5">{artist?.reviewCount} Total Reviews</p>
                </div>
              </div>

              {/* 5-star distribution */}
              <div className="space-y-2 pt-4 border-t border-[#EFE9DC] text-xs font-sans">
                {[5, 4, 3, 2, 1].map(stars => {
                  const count = artist?.ratingBreakdown ? artist.ratingBreakdown[stars] || 0 : (stars === 5 ? 85 : 15);
                  const pct = artist?.reviewCount ? Math.round((count / artist.reviewCount) * 100) : (stars === 5 ? 85 : 10);
                  return (
                    <div key={stars} className="flex items-center gap-2">
                      <span className="w-6 font-bold text-[#143823]">{stars}★</span>
                      <div className="flex-1 h-2 rounded-full bg-stone-100 overflow-hidden">
                        <div className="h-full bg-[#D4AF37] rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="w-8 text-right text-[11px] text-[#7A7369]">{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-8 space-y-4">
              {artist?.reviews?.map(rev => (
                <div key={rev.id} className="bg-white p-5 rounded-2xl border border-[#E8DFC8] space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img src={rev.userAvatar} alt={rev.userName} className="w-8 h-8 rounded-full object-cover" />
                      <span className="font-serif font-bold text-sm text-[#143823]">{rev.userName}</span>
                    </div>
                    <span className="text-xs text-[#7A7369]">{rev.date}</span>
                  </div>
                  <div className="flex text-amber-500">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs text-[#5C554E] leading-relaxed">"{rev.comment}"</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
