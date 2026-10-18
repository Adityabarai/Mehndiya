import React, { useState, useEffect } from 'react';
import { Sparkles, Clock, Check, ArrowRight, ShieldCheck } from 'lucide-react';
import { api } from '../../services/api';

export default function ServicesPage({ onOpenBooking, onNavigate }) {
  const [services, setServices] = useState([]);
  const [category, setCategory] = useState('All');

  useEffect(() => {
    api.getServices({ category: category === 'All' ? undefined : category })
      .then(res => {
        if (res.success) setServices(res.data);
      })
      .catch(console.error);
  }, [category]);

  const categories = ['All', 'Bridal', 'Engagement', 'Arabic', 'Party', 'Minimal', 'Festival', 'Home Service'];

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#143823]/10 border border-[#D4AF37]/30 text-[#143823] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Couture Mehndi Packages</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#143823] tracking-tight">
            Services & Pricing
          </h1>
          <p className="text-sm text-[#6B645C] max-w-2xl font-sans">
            Transparent pricing with 100% organic Sojat henna paste, clove-oil stain intensifiers, and aftercare kit included with every package.
          </p>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                category === cat
                  ? 'bg-[#143823] text-[#F3E5AB] shadow-md shadow-[#143823]/20'
                  : 'bg-white text-[#5C554E] hover:text-[#143823] border border-[#E8DFC8]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Services List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map(srv => (
            <div
              key={srv.id}
              className="bg-white rounded-3xl overflow-hidden border border-[#E8DFC8] shadow-sm hover:shadow-xl hover:border-[#D4AF37] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-52 bg-stone-100 overflow-hidden">
                  <img src={srv.image} alt={srv.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#FAF7F2]/90 backdrop-blur-sm border border-[#D4AF37]/40 text-[#143823] text-xs font-bold">
                    {srv.category}
                  </div>
                  <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-[#143823]/90 text-[#F3E5AB] text-xs font-semibold flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{srv.duration}</span>
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <h3 className="font-serif text-xl font-bold text-[#143823]">{srv.name}</h3>
                  <p className="text-xs text-[#6B645C] leading-relaxed">{srv.description}</p>
                  
                  <div className="space-y-1.5 pt-2">
                    <div className="flex items-center gap-2 text-xs text-[#143823]">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>100% Organic Sojat Cones</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#143823]">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Complimentary Sealant Spray & Clove Balm</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 space-y-3">
                <div className="pt-4 border-t border-[#EFE9DC] flex items-center justify-between">
                  <span className="text-xs text-[#7A7369]">Base Price</span>
                  <span className="font-serif text-2xl font-black text-[#143823]">
                    ₹{srv.basePrice.toLocaleString('en-IN')}
                  </span>
                </div>

                <button
                  onClick={() => onOpenBooking(srv)}
                  className="w-full py-3 rounded-xl bg-[#143823] hover:bg-[#1C4B30] text-[#F3E5AB] text-xs font-bold shadow-md shadow-[#143823]/20 flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                  <span>Book This Package</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
