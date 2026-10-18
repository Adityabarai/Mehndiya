import React from 'react';
import { Search, Calendar, CheckCircle2, Sparkles } from 'lucide-react';

export default function HowItWorks({ onOpenBooking }) {
  const steps = [
    {
      number: '01',
      title: 'Select Service & Artist',
      description: 'Browse our curated portfolio of bridal couture, Arabic vines, or group party packages and pick your preferred verified artist.',
      icon: Search
    },
    {
      number: '02',
      title: 'Select Date & Available Slot',
      description: 'Choose your event date and preferred time slot. Our conflict prevention engine ensures artists are never double-booked.',
      icon: Calendar
    },
    {
      number: '03',
      title: 'Artist Reviews & Confirms',
      description: 'Your artist reviews your ceremony requirements and accepts the appointment. You receive an instant in-app notification.',
      icon: CheckCircle2
    },
    {
      number: '04',
      title: 'Enjoy Flawless Organic Henna',
      description: 'Your artist arrives punctually with fresh triple-sifted organic Sojat henna cones and aftercare sealant for a guaranteed dark stain.',
      icon: Sparkles
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-[#FAF7F2] to-[#F5EFE6] border-t border-[#E8DFC8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#143823]/10 border border-[#D4AF37]/30 text-[#143823] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Simple & Seamless</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#143823] tracking-tight">
            How Mehndi Booking Works
          </h2>
          <p className="text-sm sm:text-base text-[#6B645C]">
            Experience a stress-free appointment booking process built specifically for Indian weddings and special events.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="relative bg-white rounded-3xl p-6 border border-[#E8DFC8] shadow-sm hover:shadow-lg transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-serif text-3xl font-extrabold text-[#D4AF37]/40 group-hover:text-[#D4AF37] transition-colors">
                      {step.number}
                    </span>
                    <div className="w-12 h-12 rounded-2xl bg-[#FAF7F2] border border-[#D4AF37]/30 text-[#143823] flex items-center justify-center shadow-inner group-hover:bg-[#143823] group-hover:text-[#F3E5AB] transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  <h3 className="font-serif text-lg font-bold text-[#143823] mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs text-[#6B645C] leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#EFE9DC]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C6D38]">
                    Step {step.number} of 04
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
