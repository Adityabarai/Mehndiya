import { Sparkles, Heart, ShieldCheck, Phone, Mail, MapPin, Share2, Globe, MessageCircle } from 'lucide-react';

export default function Footer({ onNavigate, onOpenBooking }) {
  return (
    <footer className="bg-[#122B1C] text-[#FAF7F2] border-t border-[#D4AF37]/30">
      {/* Top Value Propositions */}
      <div className="border-b border-white/10 bg-[#0E2316]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-[#D4AF37]" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm text-[#F3E5AB]">100% Organic Henna</h4>
              <p className="text-xs text-white/70">Triple-filtered pure Sojat leaves, zero PPD or chemicals.</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 text-[#D4AF37]" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm text-[#F3E5AB]">Verified Master Artists</h4>
              <p className="text-xs text-white/70">Strict portfolio vetting and guaranteed dark stain results.</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center shrink-0">
              <MapPin className="w-6 h-6 text-[#D4AF37]" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm text-[#F3E5AB]">Studio & Doorstep Visits</h4>
              <p className="text-xs text-white/70">At-home bridal sessions and destination wedding coverage.</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center shrink-0">
              <Heart className="w-6 h-6 text-[#D4AF37]" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm text-[#F3E5AB]">Conflict-Free Slots</h4>
              <p className="text-xs text-white/70">Instant live availability check and booking protection.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* Brand Info */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#143823] to-[#D4AF37] p-[1.5px] shadow-md">
              <div className="w-full h-full bg-[#FAF7F2] rounded-[14px] flex items-center justify-center">
                <span className="font-serif font-black text-xl text-[#143823]">M</span>
              </div>
            </div>
            <div>
              <span className="font-serif text-2xl font-bold tracking-tight text-[#F3E5AB]">
                Mehndi with Ayushi
              </span>
              <p className="text-[10px] tracking-widest uppercase font-semibold text-[#D4AF37] font-sans">
                Boutique Bridal Henna Studio
              </p>
            </div>
          </div>

          <p className="text-sm text-white/75 leading-relaxed max-w-sm">
            Handcrafted heirloom bridal mehndi, delicate floral fusion, and celebratory guest henna by Ayushi & team. Prepared fresh with 100% triple-sifted organic Sojat leaves and pure essential oils.
          </p>

          <div className="pt-2 flex items-center gap-3 text-white/70">
            <a href="#share" className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#D4AF37]/20 hover:text-[#D4AF37] flex items-center justify-center transition-colors">
              <Share2 className="w-4 h-4" />
            </a>
            <a href="#globe" className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#D4AF37]/20 hover:text-[#D4AF37] flex items-center justify-center transition-colors">
              <Globe className="w-4 h-4" />
            </a>
            <a href="#contact" className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#D4AF37]/20 hover:text-[#D4AF37] flex items-center justify-center transition-colors">
              <MessageCircle className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-serif font-bold text-sm tracking-wide text-[#F3E5AB] uppercase mb-4">
            Navigation
          </h4>
          <ul className="space-y-2.5 text-sm text-white/70 font-sans">
            <li>
              <button onClick={() => onNavigate('home')} className="hover:text-[#D4AF37] transition-colors">
                Home
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('artists')} className="hover:text-[#D4AF37] transition-colors">
                Find Artists
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('designs')} className="hover:text-[#D4AF37] transition-colors">
                Design Gallery
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('services')} className="hover:text-[#D4AF37] transition-colors">
                Services & Pricing
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('about')} className="hover:text-[#D4AF37] transition-colors">
                About & Philosophy
              </button>
            </li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h4 className="font-serif font-bold text-sm tracking-wide text-[#F3E5AB] uppercase mb-4">
            Henna Services
          </h4>
          <ul className="space-y-2.5 text-sm text-white/70 font-sans">
            <li>
              <button onClick={() => onNavigate('services')} className="hover:text-[#D4AF37] transition-colors">
                Royal Bridal Couture
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('services')} className="hover:text-[#D4AF37] transition-colors">
                Engagement & Roka
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('services')} className="hover:text-[#D4AF37] transition-colors">
                Sangeet Party Henna
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('services')} className="hover:text-[#D4AF37] transition-colors">
                Modern Arabic Vines
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('services')} className="hover:text-[#D4AF37] transition-colors">
                Doorstep Home Visits
              </button>
            </li>
          </ul>
        </div>

        {/* Contact & Booking */}
        <div>
          <h4 className="font-serif font-bold text-sm tracking-wide text-[#F3E5AB] uppercase mb-4">
            Contact & Support
          </h4>
          <ul className="space-y-3 text-xs text-white/75 font-sans">
            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-[#D4AF37]" />
              <span>+91 98112 34567</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-[#D4AF37]" />
              <span>ayushi@mehndi.com</span>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
              <span>Studio Visits & Doorstep Service | Available for Destination Weddings</span>
            </li>
          </ul>

          <div className="mt-6">
            <button
              onClick={() => onOpenBooking()}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#DFB96C] text-[#143823] font-bold text-xs shadow-lg hover:brightness-110 active:scale-95 transition-all text-center"
            >
              Book An Appointment
            </button>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/10 py-6 text-center text-xs text-white/50 font-sans">
        <p>© 2026 Mehndi with Ayushi. Beautiful Mehndi, Beautiful Moments. All rights reserved.</p>
      </div>
    </footer>
  );
}
