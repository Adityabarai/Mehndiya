import React, { useEffect, useState } from 'react';
import { Star, Quote, Sparkles } from 'lucide-react';
import { api } from '../../services/api';

export default function CustomerReviews() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    api.getReviews()
      .then(res => {
        if (res.success) setReviews(res.data);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="py-20 bg-gradient-to-b from-[#F5EFE6] to-[#FAF7F2] border-t border-[#E8DFC8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#143823]/10 border border-[#D4AF37]/30 text-[#143823] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Bride Stories</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#143823] tracking-tight">
            Customer Reviews & Testimonials
          </h2>
          <p className="text-sm sm:text-base text-[#6B645C]">
            Hear from hundreds of delighted brides who trusted our artists for their most cherished wedding celebrations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map(review => (
            <div
              key={review.id}
              className="bg-white rounded-3xl p-7 border border-[#E8DFC8] shadow-sm hover:shadow-lg transition-all flex flex-col justify-between relative"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-[#D4AF37]/20 pointer-events-none" />

              <div className="space-y-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating ? 'fill-amber-500 text-amber-500' : 'text-stone-300'
                      }`}
                    />
                  ))}
                  <span className="text-xs font-bold text-[#143823] ml-1.5">{review.rating}.0</span>
                </div>

                <p className="text-xs sm:text-sm text-[#4A453F] leading-relaxed italic">
                  "{review.comment}"
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-[#EFE9DC] flex items-center gap-3.5">
                <img
                  src={review.userAvatar}
                  alt={review.userName}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-[#D4AF37]/40"
                />
                <div>
                  <h4 className="font-serif font-bold text-sm text-[#143823]">
                    {review.userName}
                  </h4>
                  <p className="text-[11px] text-[#7A7369]">
                    {review.service} • Artist: <span className="font-semibold text-[#143823]">{review.artistName}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
