import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, MapPin, Users, Sparkles, MessageCircle, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { servicesList } from '../data/servicesData';
import { createBooking } from '../utils/api';

export default function BookingModal({ isOpen, onClose, preselectedService, onBookingCreated }) {
  const [formData, setFormData] = useState({
    customer_name: '',
    phone: '',
    email: '',
    service_id: 'royal-bridal',
    service_name: 'Royal Bridal Couture',
    total_price: 21000,
    event_date: '',
    event_time: '11:00 AM',
    event_type: 'Bridal',
    location_type: 'venue',
    venue_address: '',
    guest_count: 1,
    special_notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successData, setSuccessData] = useState(null);

  // Sync preselected service when opened
  useEffect(() => {
    if (preselectedService) {
      setFormData(prev => ({
        ...prev,
        service_id: preselectedService.id,
        service_name: preselectedService.title,
        total_price: preselectedService.price
      }));
    }
  }, [preselectedService]);

  // Handle ESC key dismiss
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleServiceChange = (e) => {
    const sId = e.target.value;
    const selected = servicesList.find(s => s.id === sId);
    if (selected) {
      setFormData(prev => ({
        ...prev,
        service_id: selected.id,
        service_name: selected.title,
        total_price: selected.price
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic client validation
    if (!formData.customer_name.trim() || !formData.phone.trim() || !formData.event_date) {
      setError('Please fill in your name, contact phone, and event date.');
      return;
    }

    setLoading(true);
    try {
      const response = await createBooking(formData);
      setSuccessData(response);
      if (onBookingCreated) {
        onBookingCreated(response.booking);
      }
    } catch (err) {
      setError(err.message || 'Something went wrong while reserving your appointment.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetAndClose = () => {
    setSuccessData(null);
    setError('');
    onClose();
  };

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        backgroundColor: 'rgba(35, 14, 20, 0.72)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleResetAndClose();
      }}
    >
      <div 
        style={{
          background: '#fff',
          width: '100%',
          maxWidth: '680px',
          maxHeight: '92vh',
          overflowY: 'auto',
          borderRadius: '24px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
          border: '1px solid rgba(212, 175, 55, 0.4)',
          position: 'relative',
          padding: '2.5rem 2rem'
        }}
      >
        {/* Close Button */}
        <button
          onClick={handleResetAndClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(107, 31, 49, 0.08)',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-maroon-dark)',
            transition: 'background 0.2s ease'
          }}
          aria-label="Close booking modal"
        >
          <X size={20} />
        </button>

        {/* Success Screen */}
        {successData ? (
          <div style={{ textAlign: 'center', padding: '1.5rem 0.5rem' }}>
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: '#e6fffa',
              color: '#234e52',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              boxShadow: '0 8px 24px rgba(35, 78, 82, 0.15)'
            }}>
              <CheckCircle size={40} color="#2c7a7b" />
            </div>

            <h3 style={{ fontSize: '1.85rem', color: 'var(--color-maroon-dark)', marginBottom: '0.5rem' }}>
              Appointment Request Received!
            </h3>
            <p style={{ color: 'var(--color-muted)', marginBottom: '1.75rem', fontSize: '1.02rem', maxWidth: '480px', margin: '0 auto 1.75rem' }}>
              Thank you, <strong>{successData.booking.customer_name}</strong>. Your request for <strong>{successData.booking.service_name}</strong> on <strong>{successData.booking.event_date}</strong> has been logged.
            </p>

            {/* Supabase Status Pill */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.4rem 1rem',
              background: successData.isUsingSupabase ? '#f0fff4' : '#fffaf0',
              color: successData.isUsingSupabase ? '#22543d' : '#744210',
              borderRadius: '20px',
              fontSize: '0.82rem',
              fontWeight: 600,
              marginBottom: '2rem',
              border: '1px solid rgba(0,0,0,0.06)'
            }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: successData.isUsingSupabase ? '#38a169' : '#dd6b20' }} />
              {successData.isUsingSupabase ? 'Synced with Supabase PostgreSQL Database' : 'Saved to Local Store (Ready for Supabase sync)'}
            </div>

            {/* Instant WhatsApp Confirmation */}
            <div style={{
              background: 'var(--color-ivory-warm)',
              padding: '1.5rem',
              borderRadius: '16px',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              marginBottom: '2rem'
            }}>
              <h4 style={{ fontSize: '1.05rem', color: 'var(--color-maroon-dark)', marginBottom: '0.5rem' }}>
                Instant WhatsApp Confirmation
              </h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-muted)', marginBottom: '1.25rem' }}>
                Send your booking summary directly to Ayushi’s personal WhatsApp to guarantee priority slot reservation!
              </p>

              <a 
                href={successData.whatsappUrl}
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-whatsapp"
                style={{ width: '100%', padding: '0.9rem 1.5rem', fontSize: '1rem' }}
              >
                <MessageCircle size={20} />
                <span>Confirm on WhatsApp Now</span>
              </a>
            </div>

            <button
              onClick={handleResetAndClose}
              className="btn btn-outline"
              style={{ width: '100%' }}
            >
              Done / Return to Website
            </button>
          </div>
        ) : (
          /* Booking Form */
          <div>
            <div style={{ marginBottom: '1.8rem' }}>
              <span className="section-tag" style={{ marginBottom: '0.5rem' }}>
                <Sparkles size={14} />
                Reserve Your Date
              </span>
              <h3 style={{ fontSize: '1.75rem', color: 'var(--color-maroon-dark)', marginBottom: '0.35rem' }}>
                Book Your Mehndi Appointment
              </h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--color-muted)' }}>
                Lock in your special wedding or celebration date with artist Ayushi.
              </p>
            </div>

            {error && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                background: 'var(--status-cancelled-bg)',
                color: 'var(--status-cancelled-text)',
                padding: '0.85rem 1rem',
                borderRadius: '8px',
                fontSize: '0.88rem',
                marginBottom: '1.5rem',
                border: '1px solid rgba(197, 48, 48, 0.2)'
              }}>
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              
              {/* Service Selection */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-maroon-dark)', marginBottom: '0.4rem' }}>
                  Select Service Package *
                </label>
                <select
                  name="service_id"
                  value={formData.service_id}
                  onChange={handleServiceChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: '10px',
                    border: '1.5px solid rgba(212, 175, 55, 0.35)',
                    fontSize: '0.95rem',
                    background: '#fff',
                    outline: 'none',
                    fontFamily: 'var(--font-sans)'
                  }}
                  required
                >
                  {servicesList.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.title} ({s.priceFormatted})
                    </option>
                  ))}
                </select>
              </div>

              {/* Name & Phone */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1rem',
                marginBottom: '1.25rem'
              }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-maroon-dark)', marginBottom: '0.4rem' }}>
                    Your Full Name *
                  </label>
                  <input 
                    type="text"
                    name="customer_name"
                    value={formData.customer_name}
                    onChange={handleChange}
                    placeholder="e.g. Pooja Sharma"
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: '10px',
                      border: '1.5px solid #e2e8f0',
                      fontSize: '0.95rem',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-maroon-dark)', marginBottom: '0.4rem' }}>
                    Phone / WhatsApp Number *
                  </label>
                  <input 
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g. +91 98765 43210"
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: '10px',
                      border: '1.5px solid #e2e8f0',
                      fontSize: '0.95rem',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Email & Event Type */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1rem',
                marginBottom: '1.25rem'
              }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-maroon-dark)', marginBottom: '0.4rem' }}>
                    Email Address (Optional)
                  </label>
                  <input 
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="pooja@example.com"
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: '10px',
                      border: '1.5px solid #e2e8f0',
                      fontSize: '0.95rem',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-maroon-dark)', marginBottom: '0.4rem' }}>
                    Occasion / Event Type
                  </label>
                  <select
                    name="event_type"
                    value={formData.event_type}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: '10px',
                      border: '1.5px solid #e2e8f0',
                      fontSize: '0.95rem',
                      background: '#fff',
                      outline: 'none'
                    }}
                  >
                    <option value="Bridal">Bridal Wedding</option>
                    <option value="Sangeet">Sangeet / Mehendi Night</option>
                    <option value="Engagement">Engagement / Roka</option>
                    <option value="Festival">Festival (Karwa Chauth/Teej/Eid)</option>
                    <option value="Baby Shower">Baby Shower / Godh Bharai</option>
                    <option value="Other">Other Celebration</option>
                  </select>
                </div>
              </div>

              {/* Event Date & Time */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1rem',
                marginBottom: '1.25rem'
              }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-maroon-dark)', marginBottom: '0.4rem' }}>
                    Event Date *
                  </label>
                  <input 
                    type="date"
                    name="event_date"
                    value={formData.event_date}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: '10px',
                      border: '1.5px solid #e2e8f0',
                      fontSize: '0.95rem',
                      outline: 'none',
                      fontFamily: 'var(--font-sans)'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-maroon-dark)', marginBottom: '0.4rem' }}>
                    Preferred Time Slot
                  </label>
                  <select
                    name="event_time"
                    value={formData.event_time}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: '10px',
                      border: '1.5px solid #e2e8f0',
                      fontSize: '0.95rem',
                      background: '#fff',
                      outline: 'none'
                    }}
                  >
                    <option value="10:00 AM">Morning (10:00 AM)</option>
                    <option value="12:00 PM">Noon (12:00 PM)</option>
                    <option value="02:30 PM">Afternoon (02:30 PM)</option>
                    <option value="04:30 PM">Late Afternoon (04:30 PM)</option>
                    <option value="06:30 PM">Evening (06:30 PM)</option>
                    <option value="08:00 PM">Night (08:00 PM)</option>
                  </select>
                </div>
              </div>

              {/* Location Preference */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-maroon-dark)', marginBottom: '0.4rem' }}>
                  Service Location
                </label>
                <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '0.6rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.92rem' }}>
                    <input 
                      type="radio" 
                      name="location_type" 
                      value="venue"
                      checked={formData.location_type === 'venue'}
                      onChange={handleChange}
                    />
                    Travel to my Venue / Home
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.92rem' }}>
                    <input 
                      type="radio" 
                      name="location_type" 
                      value="studio"
                      checked={formData.location_type === 'studio'}
                      onChange={handleChange}
                    />
                    Visit Ayushi's Studio (Jaipur)
                  </label>
                </div>

                {formData.location_type === 'venue' && (
                  <input 
                    type="text"
                    name="venue_address"
                    value={formData.venue_address}
                    onChange={handleChange}
                    placeholder="Venue / Hotel name and City (e.g. ITC Rajputana, Jaipur)"
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: '10px',
                      border: '1.5px solid #e2e8f0',
                      fontSize: '0.95rem',
                      outline: 'none'
                    }}
                  />
                )}
              </div>

              {/* Guest Count & Special Notes */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <label style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-maroon-dark)' }}>
                    Special Design Story / Personalization Notes
                  </label>
                  <span style={{ fontSize: '0.78rem', color: 'var(--color-muted)' }}>Optional</span>
                </div>
                <textarea
                  name="special_notes"
                  value={formData.special_notes}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Mention personalized bride & groom portrait requests, wedding hashtag, skyline elements, or skin sensitivity details..."
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: '10px',
                    border: '1.5px solid #e2e8f0',
                    fontSize: '0.92rem',
                    outline: 'none',
                    fontFamily: 'var(--font-sans)',
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{
                  width: '100%',
                  padding: '1rem',
                  fontSize: '1.05rem'
                }}
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Reserving Slot...</span>
                  </>
                ) : (
                  <>
                    <Calendar size={18} />
                    <span>Submit Appointment Request</span>
                  </>
                )}
              </button>

              <p style={{
                textAlign: 'center',
                fontSize: '0.78rem',
                color: 'var(--color-muted)',
                marginTop: '0.85rem'
              }}>
                🔒 No upfront payment required on this form. Ayushi will review date availability and contact you directly.
              </p>

            </form>
          </div>
        )}

      </div>
    </div>
  );
}
