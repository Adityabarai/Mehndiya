import React from 'react';
import { Sparkles, Calendar, ArrowRight } from 'lucide-react';

export default function CtaBanner({ onOpenBooking, onNavigate }) {
  return (
    <section className="py-16 bg-[#143823] text-[#FAF7F2] relative overflow-hidden">
      {/* Background Mandala Watermark */}
      <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full border-8 border-[#D4AF37]/10 pointer-events-none" />
      <div className="absolute -left-20 -top-20 w-80 h-80 rounded-full border-8 border-[#D4AF37]/10 pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-[#D4AF37]/40 text-[#F3E5AB] text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Auspicious Celebrations Begin Here</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#FAF7F2]">
          Ready to Adorn Your Special Day with Royal Henna?
        </h2>

        <p className="text-sm sm:text-base text-emerald-100/80 max-w-2xl mx-auto font-sans leading-relaxed">
          Reserve your preferred wedding date with top verified mehndi artists across India. Instant slot availability check with zero double bookings.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={() => onOpenBooking()}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#DFB96C] text-[#143823] font-bold text-sm sm:text-base shadow-xl shadow-black/20 hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            <span>Book Appointment Now</span>
          </button>

          <button
            onClick={() => onNavigate('artists')}
            className="px-7 py-3.5 rounded-xl border border-white/30 hover:border-white text-white font-medium text-sm sm:text-base hover:bg-white/10 transition-all flex items-center gap-2"
          >
            <span>Explore Artist Profiles</span>
            <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
          </button>
        </div>
      </div>
    </section>
  );
}
