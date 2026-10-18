import React, { useState, useEffect } from 'react';
import { Sparkles, Calendar, MessageCircle, Menu, X, ShieldCheck } from 'lucide-react';

export default function Navbar({ onOpenBooking, onToggleAdmin, isAdminOpen }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Services', href: '#services' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Artists', href: '#artists' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Contact', href: '#contact' }
  ];

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 900,
      background: isScrolled ? 'rgba(255,253,249,0.96)' : 'rgba(255,253,249,0.85)',
      backdropFilter: 'blur(18px)',
      borderBottom: isScrolled ? '1px solid rgba(212,175,55,0.3)' : '1px solid transparent',
      boxShadow: isScrolled ? '0 4px 20px rgba(59,14,24,0.07)' : 'none',
      transition: 'all 0.3s ease'
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '76px' }}>

        {/* Brand */}
        <a href="#home" style={{ textDecoration: 'none' }}>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-maroon-dark)', display: 'flex', alignItems: 'center', gap: '0.35rem', letterSpacing: '0.03em' }}>
            Mehndi with Ayushi <Sparkles size={15} color="var(--color-gold)" />
          </div>
          <div style={{ fontSize: '0.68rem', color: 'var(--color-henna)', letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 600 }}>
            Luxury Bridal Henna Studio
          </div>
        </a>

        {/* Desktop Nav */}
        <nav style={{ display: 'flex', gap: '1.75rem', alignItems: 'center' }} className="desktop-nav">
          {navLinks.map(link => (
            <a key={link.label} href={link.href} style={{ textDecoration: 'none', color: 'var(--color-charcoal)', fontWeight: 500, fontSize: '0.9rem', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--color-henna-warm)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--color-charcoal)'}>
              {link.label}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <button onClick={onToggleAdmin} className="btn" style={{ padding: '0.5rem 0.85rem', fontSize: '0.78rem', background: isAdminOpen ? 'var(--color-maroon-dark)' : 'rgba(212,175,55,0.12)', color: isAdminOpen ? '#fff' : 'var(--color-maroon)', border: '1px solid rgba(212,175,55,0.4)' }} title="Admin Portal">
            <ShieldCheck size={15} />
            <span className="admin-label">Admin</span>
          </button>
          <button onClick={() => onOpenBooking()} className="btn btn-primary" style={{ padding: '0.65rem 1.4rem', fontSize: '0.88rem' }}>
            <Calendar size={15} />
            <span>Book Now</span>
          </button>
          <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="btn btn-whatsapp" style={{ padding: '0.65rem', borderRadius: '50%' }} title="WhatsApp">
            <MessageCircle size={17} />
          </a>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-maroon-dark)', display: 'none' }} className="hamburger" aria-label="Menu">
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div style={{ background: '#fff', padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(212,175,55,0.3)', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          {navLinks.map(link => (
            <a key={link.label} href={link.href} onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', color: 'var(--color-maroon-dark)', fontWeight: 600, fontSize: '1.02rem' }}>
              {link.label}
            </a>
          ))}
          <button onClick={() => { setMobileMenuOpen(false); onOpenBooking(); }} className="btn btn-primary" style={{ width: '100%' }}>
            <Calendar size={16} /> Book Appointment
          </button>
        </div>
      )}

      <style>{`
        @media (min-width: 900px) { .desktop-nav { display: flex !important; } .hamburger { display: none !important; } }
        @media (max-width: 899px) { .desktop-nav { display: none !important; } .hamburger { display: block !important; } .admin-label { display: none; } }
      `}</style>
    </header>
  );
}
