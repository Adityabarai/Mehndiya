import React from 'react';
import { servicesList } from '../data/servicesData';
import { Check, Clock, Sparkles, ArrowRight } from 'lucide-react';

export default function Services({ onSelectPackage }) {
  return (
    <section id="services" className="section" style={{ background: 'var(--color-ivory-warm)' }}>
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header">
          <span className="section-tag">
            <Sparkles size={14} />
            Bespoke Offerings
          </span>
          <h2 className="section-title">
            Curated Henna Packages & Couture Services
          </h2>
          <p className="section-desc">
            Tailored packages designed for Indian weddings, intimate celebrations, and destination brides. Every package includes premium hand-coned organic henna and personalized aftercare.
          </p>
        </div>

        {/* Packages Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '2rem',
          alignItems: 'stretch'
        }}>
          {servicesList.map((service, index) => {
            const isFeatured = service.id === 'royal-bridal';
            return (
              <div 
                key={service.id}
                className="luxury-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                  border: isFeatured ? '2px solid var(--color-gold)' : '1px solid var(--color-card-border)',
                  boxShadow: isFeatured ? '0 12px 36px rgba(107, 31, 49, 0.12)' : 'var(--shadow-sm)',
                  background: isFeatured ? 'linear-gradient(180deg, #fffdfa 0%, #fef8f0 100%)' : '#fff'
                }}
              >
                {/* Top Badge */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1.25rem'
                }}>
                  <span className="badge-gold">
                    {service.badge}
                  </span>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontSize: '0.82rem',
                    color: 'var(--color-muted)',
                    fontWeight: 500
                  }}>
                    <Clock size={14} color="var(--color-henna)" />
                    {service.duration}
                  </div>
                </div>

                {/* Title & Price */}
                <div>
                  <h3 style={{
                    fontSize: '1.45rem',
                    marginBottom: '0.5rem',
                    color: 'var(--color-maroon-dark)'
                  }}>
                    {service.title}
                  </h3>

                  <div style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.6rem',
                    fontWeight: 800,
                    color: 'var(--color-henna)',
                    marginBottom: '1rem'
                  }}>
                    {service.priceFormatted}
                  </div>

                  <p style={{
                    fontSize: '0.92rem',
                    color: 'var(--color-muted)',
                    marginBottom: '1.5rem',
                    lineHeight: 1.6
                  }}>
                    {service.description}
                  </p>

                  {/* Coverage Highlight */}
                  <div style={{
                    background: 'rgba(212, 175, 55, 0.08)',
                    padding: '0.65rem 0.95rem',
                    borderRadius: '8px',
                    fontSize: '0.84rem',
                    fontWeight: 600,
                    color: 'var(--color-maroon)',
                    marginBottom: '1.5rem',
                    borderLeft: '3px solid var(--color-gold)'
                  }}>
                    Coverage: {service.coverage}
                  </div>

                  {/* Features List */}
                  <ul style={{ listStyle: 'none', marginBottom: '2rem' }}>
                    {service.highlights.map((highlight, idx) => (
                      <li 
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '0.65rem',
                          fontSize: '0.88rem',
                          color: '#444',
                          marginBottom: '0.65rem'
                        }}
                      >
                        <div style={{
                          marginTop: '3px',
                          background: 'rgba(148, 61, 34, 0.12)',
                          color: 'var(--color-henna)',
                          borderRadius: '50%',
                          padding: '2px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <Check size={12} strokeWidth={3} />
                        </div>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom CTA */}
                <button
                  onClick={() => onSelectPackage(service)}
                  className={`btn ${isFeatured ? 'btn-primary' : 'btn-outline'}`}
                  style={{ width: '100%', justifyContent: 'space-between' }}
                >
                  <span>Book This Package</span>
                  <ArrowRight size={16} />
                </button>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
