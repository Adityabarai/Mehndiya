import React, { useEffect, useState } from 'react';
import { Sparkles, Clock, Check, ArrowRight } from 'lucide-react';
import { api } from '../../services/api';

export default function PopularServices({ onOpenBooking, onNavigate }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getServices()
      .then(res => {
        if (res.success) setServices(res.data.slice(0, 6));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-20 bg-[#FAF7F2] border-t border-[#E8DFC8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#143823]/10 border border-[#D4AF37]/30 text-[#143823] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Curated Packages</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#143823] tracking-tight">
            Popular Mehndi Services
          </h2>
          <p className="text-sm sm:text-base text-[#6B645C] font-sans">
            Crafted with hand-blended organic henna, customized motifs, and guaranteed deep mahogany stain.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map(service => (
            <div
              key={service.id}
              className="group bg-white rounded-3xl overflow-hidden border border-[#E8DFC8] shadow-sm hover:shadow-xl hover:border-[#D4AF37] transition-all duration-300 flex flex-col"
            >
              {/* Image banner */}
              <div className="relative h-52 overflow-hidden bg-stone-100">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#FAF7F2]/90 backdrop-blur-sm border border-[#D4AF37]/40 text-[#143823] text-xs font-bold font-sans">
                  {service.category}
                </div>
                <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-[#143823]/90 backdrop-blur-sm text-[#F3E5AB] text-xs font-semibold flex items-center gap-1.5 font-sans">
                  <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{service.duration}</span>
                </div>
              </div>

              {/* Service Details */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#143823] group-hover:text-[#8C6D38] transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-xs text-[#6B645C] mt-2 line-clamp-2 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#EFE9DC] flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-[#8C8479] uppercase font-bold tracking-wider block">
                      Starting from
                    </span>
                    <span className="font-serif text-xl font-black text-[#143823]">
                      ₹{service.basePrice.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <button
                    onClick={() => onOpenBooking(service)}
                    className="px-4 py-2.5 rounded-xl bg-[#143823] hover:bg-[#1C4B30] text-[#F3E5AB] text-xs font-bold shadow-md shadow-[#143823]/20 active:scale-95 transition-all flex items-center gap-1.5"
                  >
                    <span>Book Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Services Link */}
        <div className="text-center mt-12">
          <button
            onClick={() => onNavigate('services')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-[#D4AF37]/50 text-[#143823] font-semibold text-sm hover:bg-white hover:border-[#143823] transition-all"
          >
            <span>Explore All 10 Mehndi Services</span>
            <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
          </button>
        </div>
      </div>
    </section>
  );
}
