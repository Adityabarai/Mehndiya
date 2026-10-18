import React from 'react';
import { Sparkles, Phone, Mail, MapPin, MessageCircle, Heart } from 'lucide-react';

// Inline Instagram SVG (lucide-react v1.x doesn't include it)
const InstagramIcon = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);


export default function Footer({ onOpenBooking }) {
  return (
    <footer style={{
      background: 'var(--color-maroon-dark)',
      color: '#fff',
      padding: '5rem 0 2rem',
      position: 'relative',
      borderTop: '3px solid var(--color-gold)'
    }}>
      <div className="container">
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '3.5rem',
          marginBottom: '4rem'
        }}>
          
          {/* Brand Column */}
          <div>
            <div style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.6rem',
              fontWeight: 800,
              color: '#fff',
              letterSpacing: '0.04em',
              marginBottom: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}>
              Mehndi with Ayushi
              <Sparkles size={16} color="var(--color-gold)" />
            </div>

            <p style={{
              fontSize: '0.92rem',
              color: '#d4c7c5',
              lineHeight: 1.75,
              marginBottom: '1.5rem'
            }}>
              Bespoke heirloom bridal henna couture celebrating ancient Indian traditions and contemporary botanical elegance. 100% natural, fresh Sojat cones for rich midnight-mahogany stains.
            </p>

            <button
              onClick={onOpenBooking}
              className="btn btn-gold"
              style={{ fontSize: '0.92rem', padding: '0.75rem 1.6rem' }}
            >
              Book Your Appointment
            </button>
          </div>

          {/* Quick Nav Links */}
          <div>
            <h4 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.15rem',
              color: 'var(--color-gold)',
              marginBottom: '1.25rem',
              letterSpacing: '0.06em'
            }}>
              Explore Artistry
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { label: 'Bridal Couture Packages', href: '#services' },
                { label: 'Signature Portfolio Gallery', href: '#gallery' },
                { label: 'About Ayushi Sharma', href: '#about' },
                { label: 'Dark Stain Aftercare Guide', href: '#care-guide' },
                { label: 'Real Bride Reviews', href: '#reviews' },
                { label: 'Frequently Asked Questions', href: '#faq' }
              ].map(link => (
                <li key={link.label}>
                  <a 
                    href={link.href}
                    style={{
                      textDecoration: 'none',
                      color: '#d4c7c5',
                      fontSize: '0.92rem',
                      transition: 'color 0.2s ease'
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--color-gold-light)'}
                    onMouseLeave={e => e.currentTarget.style.color = '#d4c7c5'}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Studio Details */}
          <div>
            <h4 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.15rem',
              color: 'var(--color-gold)',
              marginBottom: '1.25rem',
              letterSpacing: '0.06em'
            }}>
              Studio & Destination
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.92rem', color: '#d4c7c5' }}>
                <MapPin size={18} color="var(--color-gold)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>
                  <strong>Ayushi Henna Studio:</strong><br />
                  C-Scheme, Jaipur, Rajasthan 302001<br />
                  <em>Available for Destination Travel Worldwide</em>
                </span>
              </li>

              <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.92rem', color: '#d4c7c5' }}>
                <Phone size={18} color="var(--color-gold)" style={{ flexShrink: 0 }} />
                <span>+91 98765 43210</span>
              </li>

              <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.92rem', color: '#d4c7c5' }}>
                <InstagramIcon size={18} color="var(--color-gold)" />
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noreferrer"
                  style={{ color: '#d4c7c5', textDecoration: 'none' }}
                >
                  @mehndiwithayushi
                </a>
              </li>

              <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.92rem', color: '#d4c7c5' }}>
                <MessageCircle size={18} color="var(--color-gold)" style={{ flexShrink: 0 }} />
                <span>WhatsApp: +91 98765 43210</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid rgba(212, 175, 55, 0.2)',
          paddingTop: '2rem',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          fontSize: '0.84rem',
          color: '#b0a09e'
        }}>
          <div>
            © {new Date().getFullYear()} Mehndi with Ayushi. All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            Handcrafted with <Heart size={14} color="var(--color-gold)" fill="var(--color-gold)" /> for brides worldwide.
          </div>
        </div>

      </div>

      {/* Floating Bottom WhatsApp Pill */}
      <a 
        href="https://wa.me/919876543210?text=Hello%20Ayushi!%20I%20am%20interested%20in%20booking%20an%20appointment%20for%20bridal%20mehndi."
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 890,
          background: '#25D366',
          color: '#fff',
          borderRadius: '50px',
          padding: '0.75rem 1.35rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          boxShadow: '0 8px 30px rgba(37, 211, 102, 0.45)',
          textDecoration: 'none',
          fontWeight: 700,
          fontSize: '0.95rem',
          transition: 'all 0.3s ease'
        }}
        className="floating-whatsapp-btn"
      >
        <MessageCircle size={22} />
        <span>Chat with Ayushi</span>
      </a>

      <style>{`
        .floating-whatsapp-btn:hover {
          transform: translateY(-4px) scale(1.03);
          box-shadow: 0 12px 36px rgba(37, 211, 102, 0.6);
        }
      `}</style>
    </footer>
  );
}
