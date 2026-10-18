import React from 'react';
import { Calendar, Sparkles, Award, Heart, CheckCircle2, ChevronRight } from 'lucide-react';

export default function Hero({ onOpenBooking }) {
  return (
    <section 
      style={{ 
        position: 'relative', 
        padding: '4.5rem 0 5.5rem',
        overflow: 'hidden',
        background: 'radial-gradient(ellipse at 85% 20%, rgba(212, 175, 55, 0.12) 0%, transparent 55%), radial-gradient(ellipse at 15% 90%, rgba(77, 21, 34, 0.08) 0%, transparent 60%)'
      }}
    >
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '3.5rem',
          alignItems: 'center'
        }}>
          
          {/* Left Content */}
          <div style={{ animation: 'fadeIn 0.8s ease-out' }}>
            
            {/* Announcement Pill */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.4rem 1.1rem',
              background: 'rgba(212, 175, 55, 0.14)',
              border: '1px solid rgba(212, 175, 55, 0.35)',
              borderRadius: '9999px',
              marginBottom: '1.5rem',
              fontSize: '0.84rem',
              fontWeight: 600,
              color: 'var(--color-maroon-dark)'
            }}>
              <Sparkles size={15} color="var(--color-gold-dark)" />
              <span>2026 - 2027 Wedding Season Booking Now Open</span>
            </div>

            {/* Headline */}
            <h1 style={{
              fontSize: 'clamp(2.4rem, 4.2vw, 3.8rem)',
              lineHeight: 1.14,
              marginBottom: '1.25rem',
              fontWeight: 800,
              color: 'var(--color-maroon-dark)'
            }}>
              Heirloom Bridal Artistry <br />
              <span className="script-font" style={{ fontSize: '1.25em', display: 'inline-block', transform: 'rotate(-2deg)' }}>
                Crafted for Your Forever
              </span>
            </h1>

            {/* Subtext */}
            <p style={{
              fontSize: '1.12rem',
              color: 'var(--color-muted)',
              marginBottom: '2rem',
              maxWidth: '540px',
              lineHeight: 1.7
            }}>
              Experience bespoke bridal henna by Ayushi. Every stroke tells your unique love story, crafted with 100% organic homemade Sojat cones delivering an iconic, deep midnight-mahogany stain.
            </p>

            {/* CTAs */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem',
              marginBottom: '2.8rem'
            }}>
              <button 
                onClick={() => onOpenBooking()}
                className="btn btn-primary"
                style={{ padding: '0.95rem 2.2rem', fontSize: '1.02rem' }}
              >
                <Calendar size={18} />
                <span>Reserve Your Date</span>
              </button>

              <a 
                href="#gallery"
                className="btn btn-outline"
                style={{ padding: '0.95rem 1.8rem', fontSize: '1.02rem' }}
              >
                <span>View Portfolio</span>
                <ChevronRight size={18} />
              </a>
            </div>

            {/* Key Trust Highlights */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1.2rem',
              paddingTop: '1.8rem',
              borderTop: '1px solid rgba(212, 175, 55, 0.25)'
            }}>
              <div>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-henna)' }}>
                  500+
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--color-muted)', fontWeight: 500 }}>
                  Brides Adorned
                </div>
              </div>

              <div>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-henna)' }}>
                  100%
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--color-muted)', fontWeight: 500 }}>
                  Organic Sojat Henna
                </div>
              </div>

              <div>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-henna)' }}>
                  4.95 ★
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--color-muted)', fontWeight: 500 }}>
                  Google Bride Rating
                </div>
              </div>
            </div>

          </div>

          {/* Right Visual Image Showcase */}
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            
            {/* Decorative Gold Rings */}
            <div style={{
              position: 'absolute',
              top: '-15px',
              right: '-15px',
              width: '92%',
              height: '95%',
              border: '2px solid rgba(212, 175, 55, 0.4)',
              borderRadius: '24px',
              zIndex: 1
            }} />

            {/* Main Hero Card */}
            <div style={{
              position: 'relative',
              zIndex: 2,
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-lg)',
              border: '4px solid #fff',
              maxWidth: '480px',
              width: '100%'
            }}>
              <img 
                src="https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0?auto=format&fit=crop&w=900&q=85" 
                alt="Ayushi bridal mehndi artwork with intricate couple portraits and florals"
                style={{
                  width: '100%',
                  height: '520px',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />

              {/* Floating Floating Badge 1: Organic Guarantee */}
              <div style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                background: 'rgba(255, 255, 255, 0.92)',
                backdropFilter: 'blur(10px)',
                padding: '0.6rem 1rem',
                borderRadius: '50px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: 'var(--shadow-md)',
                border: '1px solid rgba(212, 175, 55, 0.3)'
              }}>
                <CheckCircle2 size={18} color="#2e7d32" />
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-maroon-dark)' }}>
                  Chemical-Free Organic Paste
                </span>
              </div>

              {/* Floating Badge 2: Bride Card */}
              <div style={{
                position: 'absolute',
                bottom: '20px',
                right: '20px',
                background: 'rgba(77, 21, 34, 0.9)',
                color: '#fff',
                backdropFilter: 'blur(12px)',
                padding: '0.85rem 1.25rem',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
                border: '1px solid rgba(212, 175, 55, 0.4)'
              }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'var(--color-gold)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-maroon-dark)',
                  fontWeight: 800
                }}>
                  👑
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', opacity: 0.85, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Signature Service
                  </div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 700 }}>
                    Bridal Portrait Heirlooms
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
