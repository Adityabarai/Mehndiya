import React, { useState } from 'react';
import { galleryCategories, galleryItems } from '../data/galleryData';
import { Sparkles, ZoomIn, X, Calendar } from 'lucide-react';

export default function Gallery({ onOpenBooking }) {
  const [activeCategory, setActiveCategory] = useState('All Designs');
  const [activeLightboxImage, setActiveLightboxImage] = useState(null);

  const filteredItems = activeCategory === 'All Designs'
    ? galleryItems
    : galleryItems.filter(item => item.category === activeCategory);

  return (
    <section id="gallery" className="section" style={{ background: '#fff' }}>
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header">
          <span className="section-tag">
            <Sparkles size={14} />
            Artisan Portfolio
          </span>
          <h2 className="section-title">
            Our Signature Bridal & Henna Creations
          </h2>
          <p className="section-desc">
            Explore bespoke works crafted by Ayushi. From majestic bridal portraits to dark midnight mahogany stains captured on real brides.
          </p>
        </div>

        {/* Filter Pills */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: '0.65rem',
          marginBottom: '3rem'
        }}>
          {galleryCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '0.55rem 1.25rem',
                borderRadius: '50px',
                fontSize: '0.88rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                border: activeCategory === cat ? '1.5px solid var(--color-maroon-dark)' : '1px solid rgba(212, 175, 55, 0.3)',
                background: activeCategory === cat ? 'var(--color-maroon-dark)' : 'rgba(255, 253, 249, 0.9)',
                color: activeCategory === cat ? 'var(--color-ivory)' : 'var(--color-charcoal)',
                boxShadow: activeCategory === cat ? '0 4px 15px rgba(59, 14, 24, 0.2)' : 'none'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.75rem'
        }}>
          {filteredItems.map(item => (
            <div
              key={item.id}
              onClick={() => setActiveLightboxImage(item)}
              style={{
                borderRadius: '16px',
                overflow: 'hidden',
                position: 'relative',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)',
                border: '1px solid rgba(212, 175, 55, 0.2)',
                background: '#faf7f2',
                aspectRatio: '4 / 5'
              }}
              className="gallery-card"
            >
              <img 
                src={item.image} 
                alt={item.title}
                loading="lazy"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                  transition: 'transform 0.45s ease'
                }}
              />

              {/* Tag Badge */}
              <span style={{
                position: 'absolute',
                top: '14px',
                left: '14px',
                background: 'rgba(59, 14, 24, 0.85)',
                backdropFilter: 'blur(8px)',
                color: '#fff',
                fontSize: '0.75rem',
                fontWeight: 600,
                padding: '0.3rem 0.75rem',
                borderRadius: '30px',
                border: '1px solid rgba(212, 175, 55, 0.4)'
              }}>
                {item.tag}
              </span>

              {/* Hover Overlay */}
              <div 
                className="gallery-overlay"
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(35, 14, 20, 0.92) 0%, rgba(35, 14, 20, 0.3) 60%, transparent 100%)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: '1.5rem',
                  opacity: 0,
                  transition: 'opacity 0.3s ease'
                }}
              >
                <h4 style={{ color: '#fff', fontSize: '1.15rem', marginBottom: '0.3rem' }}>
                  {item.title}
                </h4>
                <p style={{ color: '#e2d9d2', fontSize: '0.82rem', marginBottom: '0.85rem' }}>
                  {item.description}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-gold-light)', fontSize: '0.82rem', fontWeight: 600 }}>
                  <ZoomIn size={16} />
                  <span>Click to expand high-res</span>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {activeLightboxImage && (
          <div 
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 1100,
              backgroundColor: 'rgba(20, 8, 12, 0.88)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.5rem'
            }}
            onClick={() => setActiveLightboxImage(null)}
          >
            <div 
              style={{
                position: 'relative',
                maxWidth: '850px',
                width: '100%',
                background: '#fff',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 25px 60px rgba(0,0,0,0.5)'
              }}
              onClick={e => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveLightboxImage(null)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  zIndex: 10,
                  background: 'rgba(0,0,0,0.6)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '50%',
                  width: '38px',
                  height: '38px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={20} />
              </button>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                <div style={{ maxHeight: '550px', overflow: 'hidden' }}>
                  <img 
                    src={activeLightboxImage.image} 
                    alt={activeLightboxImage.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <span className="badge-gold" style={{ marginBottom: '0.75rem', display: 'inline-block' }}>
                      {activeLightboxImage.category}
                    </span>
                    <h3 style={{ fontSize: '1.6rem', color: 'var(--color-maroon-dark)', marginBottom: '0.75rem' }}>
                      {activeLightboxImage.title}
                    </h3>
                    <p style={{ color: 'var(--color-muted)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                      {activeLightboxImage.description}
                    </p>

                    <div style={{
                      background: 'var(--color-ivory-warm)',
                      padding: '1rem',
                      borderRadius: '12px',
                      border: '1px solid rgba(212, 175, 55, 0.3)',
                      fontSize: '0.85rem',
                      color: 'var(--color-henna-warm)',
                      marginBottom: '1.5rem'
                    }}>
                      🌿 Handcrafted with 100% natural triple-sifted organic henna leaves and eucalyptus essential oil.
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setActiveLightboxImage(null);
                      onOpenBooking();
                    }}
                    className="btn btn-primary"
                    style={{ width: '100%' }}
                  >
                    <Calendar size={18} />
                    <span>Inquire / Book This Style</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>

      <style>{`
        .gallery-card:hover img {
          transform: scale(1.06);
        }
        .gallery-card:hover .gallery-overlay {
          opacity: 1 !important;
        }
      `}</style>
    </section>
  );
}
