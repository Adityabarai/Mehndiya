import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Star, MessageSquare, Quote } from 'lucide-react';
import { api } from '../../services/api';

export default function ArtistReviews() {
  const { artistProfile } = useAuth();
  const artistId = artistProfile?.id || 'art-1';

  const [reviews, setReviews] = useState([]);
  const [ratingBreakdown, setRatingBreakdown] = useState({ 5: 85, 4: 10, 3: 3, 2: 1, 1: 1 });
  const [avgRating, setAvgRating] = useState(4.9);

  useEffect(() => {
    api.getReviews({ artistId })
      .then(res => {
        if (res.success) {
          setReviews(res.data);
          if (res.avgRating) setAvgRating(res.avgRating);
        }
      })
      .catch(console.error);
  }, [artistId]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#143823]">
          Customer Reviews & Reputation
        </h1>
        <p className="text-xs sm:text-sm text-[#6B645C]">
          Track client feedback, verified testimonials, and star rating distributions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Rating Overview Card Matching Prompt Item 19 */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-[#E8DFC8] shadow-sm space-y-6">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#8C8479]">Overall Rating</span>
            <div className="flex items-center gap-3 mt-1">
              <span className="font-serif text-5xl font-black text-[#143823]">{avgRating}</span>
              <div>
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-[#7A7369] mt-0.5">Based on client wedding reviews</p>
              </div>
            </div>
          </div>

          {/* 5-Star Distribution Table (Prompt Item 19) */}
          <div className="space-y-2.5 pt-4 border-t border-[#EFE9DC] text-xs font-sans">
            <span className="font-bold text-[#143823] text-xs block mb-2">Rating Distribution:</span>
            {[
              { stars: '★★★★★', pct: 85, label: '5 Star' },
              { stars: '★★★★', pct: 10, label: '4 Star' },
              { stars: '★★★', pct: 3, label: '3 Star' },
              { stars: '★★', pct: 1, label: '2 Star' },
              { stars: '★', pct: 1, label: '1 Star' }
            ].map(item => (
              <div key={item.label} className="flex items-center gap-3">
                <span className="w-16 font-mono font-bold text-amber-600 text-xs">{item.stars}</span>
                <div className="flex-1 h-2 rounded-full bg-stone-100 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#D4AF37] to-[#143823] rounded-full"
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
                <span className="w-10 text-right font-bold text-[#143823] text-xs">{item.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Reviews List */}
        <div className="lg:col-span-7 space-y-4">
          <h2 className="font-serif text-lg font-bold text-[#143823]">
            Client Testimonials ({reviews.length})
          </h2>

          <div className="space-y-4">
            {reviews.map(rev => (
              <div
                key={rev.id}
                className="bg-white rounded-2xl p-5 border border-[#E8DFC8] shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={rev.userAvatar} alt={rev.userName} className="w-10 h-10 rounded-full object-cover ring-2 ring-[#D4AF37]/30" />
                    <div>
                      <h4 className="font-serif font-bold text-sm text-[#143823]">{rev.userName}</h4>
                      <p className="text-[11px] text-[#7A7369]">{rev.service}</p>
                    </div>
                  </div>
                  <span className="text-xs text-[#8C8479] font-mono">{rev.date}</span>
                </div>

                <div className="flex text-amber-500">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>

                <p className="text-xs text-[#5C554E] leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
