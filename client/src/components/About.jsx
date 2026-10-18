import React from 'react';
import { Sparkles, Leaf, Shield, Award, Heart, CheckCircle2 } from 'lucide-react';

export default function About() {
  const pillars = [
    {
      icon: <Leaf size={24} color="#2e7d32" />,
      title: '100% Organic Sojat Cones',
      desc: 'Hand-prepared with fresh Rajasthani henna leaves and therapeutic grade essential oils. Zero chemicals, zero PPD.'
    },
    {
      icon: <Award size={24} color="var(--color-henna)" />,
      title: 'Heirloom Storytelling',
      desc: 'Each bridal design is an original canvas translating your journey, from first dates to royal heritage jharokhas.'
    },
    {
      icon: <Heart size={24} color="var(--color-maroon)" />,
      title: 'Gentle Bride-First Care',
      desc: 'Relaxed, patient application designed to keep you comfortable, hydrated, and smiling throughout your ceremony.'
    },
    {
      icon: <Shield size={24} color="var(--color-gold-dark)" />,
      title: 'Guaranteed Dark Stain',
      desc: 'Formulated to develop a rich, captivating mahogany hue that peaks precisely on your wedding day.'
    }
  ];

  return (
    <section id="about" className="section" style={{ background: 'var(--color-ivory)' }}>
      <div className="container">
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '4rem',
          alignItems: 'center'
        }}>

          {/* Left: Ayushi's Visual Portrait Banner */}
          <div style={{ position: 'relative' }}>
            <div style={{
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-lg)',
              border: '4px solid #fff',
              position: 'relative',
              maxWidth: '480px',
              margin: '0 auto'
            }}>
              <img 
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=900&q=80" 
                alt="Ayushi - Lead Henna Artist"
                style={{ width: '100%', height: '540px', objectFit: 'cover' }}
              />

              {/* Artist Badge */}
              <div style={{
                position: 'absolute',
                bottom: '24px',
                left: '24px',
                right: '24px',
                background: 'rgba(255, 255, 255, 0.94)',
                backdropFilter: 'blur(12px)',
                padding: '1.2rem 1.5rem',
                borderRadius: '16px',
                boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                border: '1px solid rgba(212, 175, 55, 0.35)'
              }}>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-maroon-dark)' }}>
                  Ayushi Sharma
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--color-henna)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Founder & Master Henna Couturier
                </div>
              </div>
            </div>
          </div>

          {/* Right: The Artisan Story */}
          <div>
            <span className="section-tag">
              <Sparkles size={14} />
              About The Artist
            </span>

            <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '1.25rem' }}>
              Weaving Ancient Tradition with Modern Bridal Couture
            </h2>

            <p style={{ fontSize: '1.05rem', color: 'var(--color-charcoal)', lineHeight: 1.8, marginBottom: '1.25rem' }}>
              Hello, I’m <strong>Ayushi</strong>. For over 7 years, I’ve had the sacred honor of adorning brides on the most joyous day of their lives. What began as a childhood passion for fine arts and symmetry in Rajasthan has evolved into a dedicated luxury bridal studio.
            </p>

            <p style={{ fontSize: '0.98rem', color: 'var(--color-muted)', lineHeight: 1.75, marginBottom: '2rem' }}>
              Unlike mass commercial cones laden with harmful dyes and chemicals, I handcraft every batch of henna fresh in small batches using triple-sifted organic Sojat leaves, distilled water, and pure therapeutic essential oils. The result is pure, soothing aroma and an unmistakable, deep mahogany stain that speaks of royal elegance.
            </p>

            {/* 4 Pillars Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.25rem'
            }}>
              {pillars.map((p, idx) => (
                <div 
                  key={idx}
                  style={{
                    background: '#fff',
                    padding: '1.25rem',
                    borderRadius: '14px',
                    border: '1px solid rgba(212, 175, 55, 0.22)',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <div style={{ marginBottom: '0.65rem' }}>{p.icon}</div>
                  <h4 style={{ fontSize: '0.98rem', color: 'var(--color-maroon-dark)', marginBottom: '0.35rem' }}>
                    {p.title}
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--color-muted)', lineHeight: 1.5 }}>
                    {p.desc}
                  </p>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
