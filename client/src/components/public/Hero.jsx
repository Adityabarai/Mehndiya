import React from 'react';
import { Sparkles, Calendar, Search, Star, ShieldCheck, Heart, ArrowRight } from 'lucide-react';

export default function Hero({ onOpenBooking, onNavigate }) {
  return (
    <section className="relative overflow-hidden bg-[#FAF7F2] pt-12 pb-20 sm:pt-20 sm:pb-28">
      {/* Decorative Traditional Paisley / Henna Arch Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-[#D4AF37]/10 via-[#143823]/5 to-transparent pointer-events-none rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Henna Motif Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#143823]/10 border border-[#D4AF37]/40 text-[#143823] text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>🌿 Handcrafted Organic Bridal & Festive Henna</span>
            </div>

            {/* Main Title Required by Spec */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#143823] tracking-tight leading-[1.15]">
              Beautiful Mehndi.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#B8860B] to-[#8C6D38]">
                Beautiful Moments.
              </span>
            </h1>

            {/* Subtitle Required by Spec */}
            <p className="font-sans text-base sm:text-lg text-[#5C554E] max-w-2xl leading-relaxed">
              Bespoke bridal mehndi, intricate jharokha portraits, and celebratory packages by Ayushi & team. Handcrafted fresh organic Sojat henna with guaranteed deep dark stain.
            </p>

            {/* Action Buttons Required by Spec */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={() => onOpenBooking()}
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#143823] via-[#1C4B30] to-[#143823] text-[#F3E5AB] font-semibold text-sm sm:text-base shadow-xl shadow-[#143823]/25 hover:brightness-110 active:scale-95 transition-all flex items-center gap-2.5"
              >
                <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                Book Appointment
              </button>

              <button
                onClick={() => onNavigate('designs')}
                className="px-7 py-3.5 rounded-xl border-2 border-[#143823]/20 hover:border-[#143823] text-[#143823] font-semibold text-sm sm:text-base hover:bg-white transition-all flex items-center gap-2"
              >
                View Design Gallery
                <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
              </button>
            </div>

            {/* Trust Badges */}
            <div className="pt-8 border-t border-[#E8DFC8] grid grid-cols-3 gap-4 text-center lg:text-left">
              <div>
                <p className="font-serif text-2xl font-bold text-[#143823]">500+</p>
                <p className="text-xs text-[#7A7369] font-medium">Weddings Adorned</p>
              </div>
              <div>
                <p className="font-serif text-2xl font-bold text-[#143823]">4.95 ★</p>
                <p className="text-xs text-[#7A7369] font-medium">Verified Reviews</p>
              </div>
              <div>
                <p className="font-serif text-2xl font-bold text-[#143823]">100%</p>
                <p className="text-xs text-[#7A7369] font-medium">Organic Sojat Henna</p>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Showcase Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Back Card Glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#D4AF37] to-[#143823] rounded-3xl blur-2xl opacity-20 transform -rotate-3 scale-95" />

              {/* Main Card */}
              <div className="relative rounded-3xl overflow-hidden border-2 border-[#D4AF37]/40 shadow-2xl bg-white">
                <img
                  src="https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?auto=format&fit=crop&w=800&q=80"
                  alt="Heirloom Bridal Mehndi"
                  className="w-full h-96 object-cover object-center transform hover:scale-105 transition-transform duration-700"
                />

                {/* Floating Verified Artist Card Overlay */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-[#FAF7F2]/95 backdrop-blur-md border border-[#D4AF37]/40 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                        alt="Ayushi Verma"
                        className="w-11 h-11 rounded-full object-cover ring-2 ring-[#D4AF37]"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-serif font-bold text-sm text-[#143823]">Ayushi Verma</h4>
                          <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                        </div>
                        <p className="text-[11px] text-[#7A7369]">Founder & Master Couturier • Mehndi with Ayushi</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-xs font-bold text-amber-600">
                        <Star className="w-3.5 h-3.5 fill-current text-amber-500 mr-1" />
                        4.95 (198)
                      </div>
                      <p className="text-[10px] text-[#143823] font-semibold">Bridal from ₹3,500</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
