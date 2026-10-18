import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Sparkles, Clock, MessageSquare } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export default function ContactPage({ onOpenBooking }) {
  const { toastSuccess } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    toastSuccess('Thank you! Our concierge team will reach out within 2 hours.');
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#143823]/10 border border-[#D4AF37]/30 text-[#143823] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Concierge Support</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#143823] tracking-tight">
            Contact Mehndi with Ayushi
          </h1>
          <p className="text-sm text-[#6B645C]">
            Have inquiries regarding bridal dates, customized couple portraits, or booking our team for your celebration?
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto">
          {/* Contact Details */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#143823] to-[#1C4B30] text-[#FAF7F2] p-8 rounded-3xl shadow-xl flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              <h3 className="font-serif text-2xl font-bold text-[#F3E5AB]">
                Get in Touch
              </h3>
              <p className="text-xs text-emerald-100/80 leading-relaxed font-sans">
                Ayushi & her team are available 7 days a week to help coordinate your appointment date, travel schedules, and custom bridal motifs.
              </p>

              <div className="space-y-4 text-xs font-sans">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                  <div>
                    <span className="text-white/60 block text-[10px] uppercase">Phone / WhatsApp</span>
                    <strong className="text-white text-sm">+91 98112 34567</strong>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                  <div>
                    <span className="text-white/60 block text-[10px] uppercase">Direct Email</span>
                    <strong className="text-white text-sm">ayushi@mehndi.com</strong>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                  <div>
                    <span className="text-white/60 block text-[10px] uppercase">Studio & Service Area</span>
                    <strong className="text-white text-xs">Studio Appointments & Doorstep Visits (Available for Wedding Venues & Travel)</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10">
              <button
                onClick={() => onOpenBooking()}
                className="w-full py-3 rounded-xl bg-[#D4AF37] hover:bg-[#DFB96C] text-[#143823] font-bold text-xs shadow-md transition-all text-center"
              >
                Book Appointment Directly
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-[#E8DFC8] shadow-sm">
            {sent ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <Sparkles className="w-7 h-7" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#143823]">Message Sent!</h3>
                <p className="text-xs text-[#6B645C] max-w-sm mx-auto">
                  Thank you for reaching out. A wedding concierge coordinator will respond to you shortly.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="px-5 py-2 text-xs font-bold text-[#143823] border border-[#143823] rounded-xl"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
                <h3 className="font-serif text-xl font-bold text-[#143823]">Send Us a Message</h3>

                <div>
                  <label className="block text-xs font-bold text-[#143823] uppercase mb-1">Your Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    placeholder="e.g. Rahul Kapoor"
                    className="w-full p-3 rounded-xl border border-[#E8DFC8] bg-[#FAF7F2] text-sm text-[#143823]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#143823] uppercase mb-1">Email *</label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      placeholder="rahul@example.com"
                      className="w-full p-3 rounded-xl border border-[#E8DFC8] bg-[#FAF7F2] text-sm text-[#143823]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#143823] uppercase mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full p-3 rounded-xl border border-[#E8DFC8] bg-[#FAF7F2] text-sm text-[#143823]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#143823] uppercase mb-1">Message / Ceremony Details *</label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    required
                    placeholder="Tell us about your wedding dates, guest size, and questions..."
                    className="w-full p-3 rounded-xl border border-[#E8DFC8] bg-[#FAF7F2] text-sm text-[#143823]"
                  />
                </div>

                <button
                  type="submit"
                  className="px-7 py-3 rounded-xl bg-[#143823] text-[#F3E5AB] font-bold text-xs shadow-md hover:bg-[#1C4B30] flex items-center gap-2 transition-all"
                >
                  <Send className="w-4 h-4 text-[#D4AF37]" />
                  <span>Send Inquiry</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
