import React, { useState, useEffect } from 'react';
import { 
  fetchBookings, 
  fetchBookingStats, 
  updateBookingStatus 
} from '../utils/api';
import { 
  ShieldCheck, 
  RefreshCw, 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  Phone, 
  MapPin, 
  MessageCircle, 
  Check, 
  X, 
  Database,
  Users,
  IndianRupee,
  Loader2
} from 'lucide-react';

export default function AdminDashboard({ onClose }) {
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [bookingsRes, statsRes] = await Promise.all([
        fetchBookings({ status: statusFilter, search: searchQuery }),
        fetchBookingStats()
      ]);
      setBookings(bookingsRes.data || []);
      setStats(statsRes);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadData();
  };

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      await updateBookingStatus(id, newStatus);
      // Update local state
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
      // Refresh stats
      const updatedStats = await fetchBookingStats();
      if (updatedStats) setStats(updatedStats);
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status) => {
    const map = {
      pending: { bg: 'var(--status-pending-bg)', color: 'var(--status-pending-text)', label: 'Pending Review' },
      confirmed: { bg: 'var(--status-confirmed-bg)', color: 'var(--status-confirmed-text)', label: 'Confirmed' },
      completed: { bg: 'var(--status-completed-bg)', color: 'var(--status-completed-text)', label: 'Completed' },
      cancelled: { bg: 'var(--status-cancelled-bg)', color: 'var(--status-cancelled-text)', label: 'Cancelled' }
    };
    const s = map[status] || map.pending;
    return (
      <span style={{
        background: s.bg,
        color: s.color,
        fontSize: '0.78rem',
        fontWeight: 700,
        padding: '0.3rem 0.75rem',
        borderRadius: '20px',
        textTransform: 'uppercase',
        letterSpacing: '0.04em'
      }}>
        {s.label}
      </span>
    );
  };

  return (
    <div style={{
      background: 'var(--color-ivory)',
      borderBottom: '2px solid rgba(212, 175, 55, 0.4)',
      boxShadow: 'var(--shadow-lg)',
      padding: '3rem 0',
      position: 'relative'
    }}>
      <div className="container">
        
        {/* Top Header */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
              <ShieldCheck size={26} color="var(--color-maroon)" />
              <h2 style={{ fontSize: '1.75rem', color: 'var(--color-maroon-dark)', margin: 0 }}>
                Ayushi's Booking & Appointment Portal
              </h2>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--color-muted)', margin: 0 }}>
              Live appointment requests from your website synced with Supabase PostgreSQL.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Supabase Status Pill */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.45rem 0.95rem',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: 600,
              background: stats?.isUsingSupabase ? '#ebfbee' : '#fff9db',
              color: stats?.isUsingSupabase ? '#2b8a3e' : '#e67700',
              border: '1px solid rgba(0,0,0,0.08)'
            }}>
              <Database size={15} />
              <span>{stats?.isUsingSupabase ? 'Supabase Connected' : 'Local DB Mode'}</span>
            </div>

            <button 
              onClick={loadData}
              className="btn btn-outline"
              style={{ padding: '0.5rem 0.95rem', fontSize: '0.85rem' }}
              title="Refresh bookings"
            >
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>

            <button 
              onClick={onClose}
              className="btn"
              style={{
                padding: '0.5rem 0.95rem',
                fontSize: '0.85rem',
                background: 'rgba(107, 31, 49, 0.1)',
                color: 'var(--color-maroon-dark)'
              }}
            >
              Close Portal
            </button>
          </div>
        </div>

        {/* Analytics Stat Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem'
        }}>
          <div className="luxury-card" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.35rem' }}>
              Total Appointments
            </div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 800, color: 'var(--color-maroon-dark)' }}>
              {stats?.total ?? 0}
            </div>
          </div>

          <div className="luxury-card" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '0.8rem', color: '#b7791f', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.35rem' }}>
              Pending Review
            </div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 800, color: '#b7791f' }}>
              {stats?.pending ?? 0}
            </div>
          </div>

          <div className="luxury-card" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '0.8rem', color: '#234e52', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.35rem' }}>
              Confirmed
            </div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 800, color: '#234e52' }}>
              {stats?.confirmed ?? 0}
            </div>
          </div>

          <div className="luxury-card" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-henna)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.35rem' }}>
              Pipeline Value
            </div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-henna)' }}>
              ₹{(stats?.estimatedRevenue ?? 0).toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        {/* Filters & Search Row */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '1.75rem',
          background: '#fff',
          padding: '1rem 1.5rem',
          borderRadius: '16px',
          border: '1px solid rgba(212, 175, 55, 0.25)'
        }}>
          {/* Status Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(tab => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                style={{
                  padding: '0.4rem 0.95rem',
                  borderRadius: '20px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: 'none',
                  background: statusFilter === tab ? 'var(--color-maroon-dark)' : 'rgba(0,0,0,0.05)',
                  color: statusFilter === tab ? '#fff' : 'var(--color-charcoal)',
                  textTransform: 'capitalize'
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '10px', top: '10px', color: '#999' }} />
              <input 
                type="text" 
                placeholder="Search name, phone..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  padding: '0.5rem 1rem 0.5rem 2.2rem',
                  borderRadius: '20px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.85rem',
                  outline: 'none',
                  width: '210px'
                }}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ padding: '0.45rem 1rem', fontSize: '0.82rem' }}>
              Search
            </button>
          </form>
        </div>

        {/* Bookings List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <Loader2 size={32} className="animate-spin" color="var(--color-maroon)" style={{ margin: '0 auto 1rem' }} />
            <p style={{ color: 'var(--color-muted)' }}>Loading appointments from database...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3.5rem', background: '#fff', borderRadius: '16px', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
            <Calendar size={42} color="var(--color-gold)" style={{ margin: '0 auto 1rem' }} />
            <h4 style={{ fontSize: '1.25rem', color: 'var(--color-maroon-dark)', marginBottom: '0.35rem' }}>
              No Appointments Found
            </h4>
            <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem' }}>
              There are currently no bookings matching your selected filter.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {bookings.map(b => {
              const cleanPhone = b.phone ? b.phone.replace(/[^0-9]/g, '') : '';
              const clientWhatsAppUrl = `https://wa.me/${cleanPhone}?text=Hello%20${encodeURIComponent(b.customer_name)}!%20This%20is%20Ayushi%20regarding%20your%20${encodeURIComponent(b.service_name)}%20booking.`;

              return (
                <div 
                  key={b.id}
                  className="luxury-card"
                  style={{
                    padding: '1.5rem',
                    background: '#fff',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                  }}
                >
                  {/* Card Header */}
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '0.75rem',
                    borderBottom: '1px solid rgba(0,0,0,0.06)',
                    paddingBottom: '0.85rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <h4 style={{ fontSize: '1.18rem', margin: 0, color: 'var(--color-maroon-dark)' }}>
                        {b.customer_name}
                      </h4>
                      <span style={{ fontSize: '0.8rem', color: 'var(--color-muted)' }}>
                        • {b.event_type}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      {getStatusBadge(b.status)}
                      <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 800, color: 'var(--color-henna)', fontSize: '1.1rem' }}>
                        ₹{Number(b.total_price || 0).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Booking Details Grid */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
                    gap: '0.85rem',
                    fontSize: '0.88rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#444' }}>
                      <Calendar size={15} color="var(--color-henna)" />
                      <span><strong>Date:</strong> {b.event_date}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#444' }}>
                      <Clock size={15} color="var(--color-henna)" />
                      <span><strong>Time:</strong> {b.event_time}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#444' }}>
                      <Phone size={15} color="var(--color-henna)" />
                      <span><strong>Phone:</strong> {b.phone}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#444' }}>
                      <MapPin size={15} color="var(--color-henna)" />
                      <span><strong>Location:</strong> {b.location_type === 'studio' ? 'At Studio' : (b.venue_address || 'Venue Travel')}</span>
                    </div>
                  </div>

                  {/* Notes if any */}
                  {b.special_notes && (
                    <div style={{
                      background: 'var(--color-ivory-warm)',
                      padding: '0.75rem 1rem',
                      borderRadius: '8px',
                      fontSize: '0.84rem',
                      color: 'var(--color-charcoal)',
                      borderLeft: '3px solid var(--color-gold)'
                    }}>
                      <strong>Client Note:</strong> {b.special_notes}
                    </div>
                  )}

                  {/* Action Bar */}
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '0.75rem',
                    paddingTop: '0.65rem'
                  }}>
                    {/* Status Action Buttons */}
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--color-muted)' }}>Status:</span>
                      
                      {b.status !== 'confirmed' && (
                        <button
                          onClick={() => handleStatusChange(b.id, 'confirmed')}
                          disabled={updatingId === b.id}
                          className="btn"
                          style={{
                            padding: '0.35rem 0.75rem',
                            fontSize: '0.78rem',
                            background: '#e6fffa',
                            color: '#234e52',
                            border: '1px solid #b2f5ea'
                          }}
                        >
                          <Check size={13} /> Confirm
                        </button>
                      )}

                      {b.status !== 'completed' && (
                        <button
                          onClick={() => handleStatusChange(b.id, 'completed')}
                          disabled={updatingId === b.id}
                          className="btn"
                          style={{
                            padding: '0.35rem 0.75rem',
                            fontSize: '0.78rem',
                            background: '#ebf8ff',
                            color: '#2b6cb0',
                            border: '1px solid #bee3f8'
                          }}
                        >
                          Complete
                        </button>
                      )}

                      {b.status !== 'cancelled' && (
                        <button
                          onClick={() => handleStatusChange(b.id, 'cancelled')}
                          disabled={updatingId === b.id}
                          className="btn"
                          style={{
                            padding: '0.35rem 0.75rem',
                            fontSize: '0.78rem',
                            background: '#fff5f5',
                            color: '#c53030',
                            border: '1px solid #fed7d7'
                          }}
                        >
                          Cancel
                        </button>
                      )}
                    </div>

                    {/* WhatsApp Client Direct */}
                    <a
                      href={clientWhatsAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-whatsapp"
                      style={{ padding: '0.45rem 1rem', fontSize: '0.82rem' }}
                    >
                      <MessageCircle size={15} />
                      <span>Message Client on WhatsApp</span>
                    </a>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
