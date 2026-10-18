import React, { useState } from 'react';
import { faqList } from '../data/reviewsData';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';

export default function Faq() {
  const [openId, setOpenId] = useState(1);

  const toggleItem = (id) => {
    setOpenId(prev => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="section" style={{ background: 'var(--color-ivory-warm)' }}>
      <div className="container" style={{ maxWidth: '860px' }}>
        
        {/* Header */}
        <div className="section-header">
          <span className="section-tag">
            <HelpCircle size={14} />
            Common Questions
          </span>
          <h2 className="section-title">
            Frequently Asked Questions
          </h2>
          <p className="section-desc">
            Everything you need to know about booking, our organic formula, timings, and destination weddings.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {faqList.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div 
                key={item.id}
                style={{
                  background: '#fff',
                  borderRadius: '16px',
                  border: isOpen ? '1.5px solid var(--color-gold)' : '1px solid rgba(212, 175, 55, 0.25)',
                  overflow: 'hidden',
                  transition: 'all 0.25s ease',
                  boxShadow: isOpen ? 'var(--shadow-md)' : 'var(--shadow-sm)'
                }}
              >
                <button
                  onClick={() => toggleItem(item.id)}
                  style={{
                    width: '100%',
                    padding: '1.4rem 1.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    background: 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    outline: 'none'
                  }}
                  aria-expanded={isOpen}
                >
                  <span style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    color: isOpen ? 'var(--color-henna)' : 'var(--color-maroon-dark)',
                    transition: 'color 0.2s ease'
                  }}>
                    {item.question}
                  </span>
                  <div style={{
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease',
                    color: 'var(--color-gold-dark)',
                    flexShrink: 0
                  }}>
                    <ChevronDown size={20} />
                  </div>
                </button>

                {isOpen && (
                  <div style={{
                    padding: '0 1.75rem 1.4rem',
                    fontSize: '0.94rem',
                    color: 'var(--color-muted)',
                    lineHeight: 1.75,
                    borderTop: '1px solid rgba(212, 175, 55, 0.15)',
                    paddingTop: '1rem'
                  }}>
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
