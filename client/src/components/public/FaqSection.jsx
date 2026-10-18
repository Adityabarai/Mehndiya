import React, { useState } from 'react';
import { ChevronDown, Sparkles } from 'lucide-react';

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: 'How far in advance should I book my bridal mehndi?',
      a: 'We recommend booking 2 to 4 months in advance, especially during the auspicious wedding season (October to March). Peak weekend slots fill up rapidly.'
    },
    {
      q: 'What is the booking workflow and confirmation process?',
      a: 'When you submit a booking request, its status is set to PENDING. Your chosen artist reviews your event date, timing, and venue location. Upon artist acceptance, the status becomes CONFIRMED, and you receive an immediate in-app and email notification.'
    },
    {
      q: 'Is the mehndi paste 100% natural and safe for sensitive skin?',
      a: 'Yes, absolutely. All verified artists on our platform strictly use homemade, triple-sifted organic henna leaves from Sojat (Rajasthan), mixed with pure cajeput/eucalyptus essential oil and sugar. No black dye, chemicals, or PPD are ever allowed.'
    },
    {
      q: 'Can the artist travel to my wedding venue or hotel outside their base city?',
      a: 'Yes! Most of our master artists offer destination wedding travel. Nominal travel charges are calculated transparently during the booking wizard based on distance.'
    },
    {
      q: 'Can I provide my own reference images or custom portraits?',
      a: 'Definitely! During Step 5 of the booking wizard, you can upload or paste a link to your inspiration photos (couple portraits, wedding hashtags, palace jharokha sketches), which the artist prepares before your ceremony.'
    },
    {
      q: 'What is your cancellation and rescheduling policy?',
      a: 'Appointments can be cancelled or rescheduled up to 48 hours prior to the event date directly from your Customer Panel without penalty.'
    }
  ];

  return (
    <section className="py-20 bg-[#FAF7F2] border-t border-[#E8DFC8]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#143823]/10 border border-[#D4AF37]/30 text-[#143823] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Got Questions?</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#143823] tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-[#6B645C]">
            Everything you need to know about booking, artist verification, and organic stain care.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-[#E8DFC8] overflow-hidden shadow-sm transition-all"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-serif font-bold text-sm sm:text-base text-[#143823] hover:text-[#8C6D38] transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#D4AF37] shrink-0 transition-transform duration-300 ${
                      isOpen ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-[#5C554E] font-sans leading-relaxed border-t border-[#EFE9DC] pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
