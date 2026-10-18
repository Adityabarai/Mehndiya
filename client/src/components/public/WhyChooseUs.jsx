import React from 'react';
import { ShieldCheck, Heart, Sparkles, Clock, Award, Users } from 'lucide-react';

export default function WhyChooseUs() {
  const perks = [
    {
      title: '100% Organic Sojat Henna',
      desc: 'Made fresh with triple-filtered organic Lawsonia inermis powder, pure eucalyptus oil, and sugar. Guaranteed chemical and PPD-free.',
      icon: ShieldCheck
    },
    {
      title: 'Conflict-Free Slot Guarantee',
      desc: 'Our real-time booking engine prevents double bookings and respects artist working hours and designated blocked personal days.',
      icon: Clock
    },
    {
      title: 'Verified & Approved Artists',
      desc: 'Every listed artist is manually verified by our team for design precision, portfolio authenticity, and punctuality.',
      icon: Award
    },
    {
      title: 'Personalized Bridal Motifs',
      desc: 'From groom portraits and wedding hashtags to Rajasthani jharokhas and temple bells, our artists customize every millimeter.',
      icon: Sparkles
    },
    {
      title: 'Doorstep & Venue Travel',
      desc: 'Enjoy professional studio-grade henna in the comfort of your home, bridal suite, or destination hotel anywhere in India.',
      icon: Heart
    },
    {
      title: 'Transparent Pricing & Policies',
      desc: 'No hidden charges or surprise surcharges. See clear package costs, group guest rates, and fair cancellation policies.',
      icon: Users
    }
  ];

  return (
    <section className="py-20 bg-[#FAF7F2] border-t border-[#E8DFC8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#143823]/10 border border-[#D4AF37]/30 text-[#143823] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>The Mehndi Difference</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#143823] tracking-tight">
            Why Brides & Families Choose Us
          </h2>
          <p className="text-sm sm:text-base text-[#6B645C]">
            We elevate traditional mehndi into a luxurious, dependable, and memorable ritual.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {perks.map((perk, i) => {
            const Icon = perk.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DFC8] shadow-sm hover:border-[#D4AF37] hover:shadow-lg transition-all space-y-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#FAF7F2] border border-[#D4AF37]/30 text-[#143823] flex items-center justify-center shadow-inner">
                  <Icon className="w-6 h-6 text-[#143823]" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#143823]">
                  {perk.title}
                </h3>
                <p className="text-xs text-[#6B645C] leading-relaxed">
                  {perk.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
