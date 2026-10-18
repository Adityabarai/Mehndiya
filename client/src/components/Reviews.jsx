import React from 'react';
import { reviewsList } from '../data/reviewsData';
import { Star, Sparkles, CheckCircle2, Quote } from 'lucide-react';

export default function Reviews() {
  return (
    <section id="reviews" className="section" style={{ background: '#fff' }}>
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header">
          <span className="section-tag">
            <Sparkles size={14} />
            Bridal Testimonials
          </span>
          <h2 className="section-title">
            Words of Love from Real Brides
          </h2>
          <p className="section-desc">
            Nothing brings us more fulfillment than seeing our brides radiantly in love with their wedding henna.
          </p>
        </div>

        {/* Reviews Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem'
        }}>
          {reviewsList.map((review) => (
            <div 
              key={review.id}
              className="luxury-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative'
              }}
            >
              <div>
                {/* Star Rating */}
                <div style={{ display: 'flex', gap: '3px', marginBottom: '1.25rem' }}>
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} size={18} fill="#d4af37" color="#d4af37" />
                  ))}
                </div>

                {/* Comment */}
                <p style={{
                  fontSize: '0.96rem',
                  color: 'var(--color-charcoal)',
                  lineHeight: 1.75,
                  marginBottom: '1.75rem',
                  fontStyle: 'italic'
                }}>
                  "{review.comment}"
                </p>
              </div>

              {/* Author Info */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                paddingTop: '1.25rem',
                borderTop: '1px solid rgba(212, 175, 55, 0.2)'
              }}>
                <img 
                  src={review.avatar} 
                  alt={review.name}
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid var(--color-gold)'
                  }}
                />
                <div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    fontWeight: 700,
                    color: 'var(--color-maroon-dark)',
                    fontSize: '0.96rem'
                  }}>
                    <span>{review.name}</span>
                    <CheckCircle2 size={14} color="#2e7d32" title="Verified Bride" />
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-muted)' }}>
                    {review.role} • {review.date}
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
