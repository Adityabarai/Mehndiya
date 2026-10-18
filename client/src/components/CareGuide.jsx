import React from 'react';
import { Sparkles, Check, X, Flame, ShieldAlert, HeartHandshake, Sun } from 'lucide-react';

export default function CareGuide() {
  const steps = [
    {
      step: '01',
      title: 'Application & Sealant',
      timing: 'Hours 0 – 2',
      desc: 'Once paste is semi-dry, our complimentary lemon-sugar or eucalyptus sealant spray is applied to lock in the henna essentials and ensure paste clings to your skin.'
    },
    {
      step: '02',
      title: 'Overnight Rest',
      timing: 'Hours 6 – 8',
      desc: 'Keep the dry paste on your skin for a minimum of 6 to 8 hours. We wrap bridal hands with breathable Hypafix medical tape so you can sleep peacefully without cracking the design.'
    },
    {
      step: '03',
      title: 'Oil Scrape Removal',
      timing: 'Hour 8',
      desc: 'Gently scrape away the dried crust using a butter knife or card edge along with warm mustard, sesame, or coconut oil. NEVER use water or soap to wash it off.'
    },
    {
      step: '04',
      title: 'Clove Steam & Oxidation',
      timing: 'Hours 24 – 48',
      desc: 'Expose your palms to aromatic clove smoke (laung bhaap) on a skillet. Natural lawsone pigment oxidizes from bright pumpkin orange to deep royal mahogany over 48 hours.'
    }
  ];

  return (
    <section id="care-guide" className="section" style={{ background: 'var(--color-ivory-warm)' }}>
      <div className="container">
        
        {/* Header */}
        <div className="section-header">
          <span className="section-tag">
            <Flame size={14} color="var(--color-henna)" />
            Dark Stain Science
          </span>
          <h2 className="section-title">
            The Secrets to a Rich, Royal Mahogany Stain
          </h2>
          <p className="section-desc">
            Natural organic henna requires proper aftercare to reach its deepest color. Follow our 4-step bridal ritual for mesmerizing wedding-day results.
          </p>
        </div>

        {/* 4 Steps Horizontal/Grid Timeline */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3.5rem'
        }}>
          {steps.map((item, idx) => (
            <div 
              key={idx}
              className="luxury-card"
              style={{
                position: 'relative',
                padding: '2rem 1.5rem',
                borderTop: '3px solid var(--color-gold)'
              }}
            >
              <div style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '2.5rem',
                fontWeight: 900,
                color: 'rgba(212, 175, 55, 0.35)',
                position: 'absolute',
                top: '12px',
                right: '18px'
              }}>
                {item.step}
              </div>

              <span style={{
                display: 'inline-block',
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                color: 'var(--color-henna)',
                letterSpacing: '0.08em',
                marginBottom: '0.5rem'
              }}>
                {item.timing}
              </span>

              <h3 style={{ fontSize: '1.25rem', color: 'var(--color-maroon-dark)', marginBottom: '0.75rem' }}>
                {item.title}
              </h3>

              <p style={{ fontSize: '0.88rem', color: 'var(--color-muted)', lineHeight: 1.65 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Do's and Don'ts Card */}
        <div style={{
          background: '#fff',
          borderRadius: '20px',
          border: '1px solid rgba(212, 175, 55, 0.3)',
          boxShadow: 'var(--shadow-md)',
          padding: '2.5rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2.5rem'
        }}>
          {/* Dos */}
          <div>
            <h4 style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#2e7d32',
              fontSize: '1.25rem',
              marginBottom: '1.25rem'
            }}>
              <Check size={22} />
              <span>Recommended Do's</span>
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {[
                'Keep hands warm—warm skin pores drink in maximum lawsone henna pigment.',
                'Apply mustard oil or coconut oil generously before showering to repel water.',
                'Get manicure, waxing, and bridal scrubs done 24–48 hours BEFORE mehndi day.',
                'Take clove fumes on a pan (heated cloves) twice a day for deeper oxidation.'
              ].map((text, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', fontSize: '0.9rem', color: '#333' }}>
                  <span style={{ color: '#2e7d32', fontWeight: 700 }}>✓</span>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Don'ts */}
          <div>
            <h4 style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#c53030',
              fontSize: '1.25rem',
              marginBottom: '1.25rem'
            }}>
              <X size={22} />
              <span>Things to Avoid</span>
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {[
                'DO NOT wash henna off with soap and water for the first 24 hours.',
                'DO NOT blow-dry with high heat—it can crack fresh delicate lines.',
                'Avoid chlorinated pools, bleaching, and chemical hand sanitizers.',
                'Avoid doing heavy chores or handling dish soap prior to your big day.'
              ].map((text, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', fontSize: '0.9rem', color: '#333' }}>
                  <span style={{ color: '#c53030', fontWeight: 700 }}>✕</span>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

      </div>
    </section>
  );
}
