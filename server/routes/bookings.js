import { Router } from 'express';
import { supabase, isUsingSupabase } from '../db/supabase.js';

const router = Router();

// Helper to generate a pre-formatted WhatsApp chat link
const generateWhatsAppLink = (booking) => {
  const artistPhone = process.env.ARTIST_WHATSAPP || '919876543210';
  const text = `✨ *New Appointment Request - Mehndi with Ayushi* ✨\n\n` +
    `👤 *Client Name:* ${booking.customer_name}\n` +
    `📞 *Phone:* ${booking.phone}\n` +
    `💍 *Service:* ${booking.service_name}\n` +
    `📅 *Event Date:* ${booking.event_date} (${booking.event_time})\n` +
    `🎉 *Event Type:* ${booking.event_type}\n` +
    `📍 *Location:* ${booking.location_type === 'studio' ? 'At Studio (Jaipur)' : `Venue - ${booking.venue_address || 'To be shared'}`}\n` +
    `👥 *Guests:* ${booking.guest_count}\n` +
    (booking.special_notes ? `📝 *Notes:* ${booking.special_notes}\n` : '') +
    `\nHello Ayushi! I just submitted an appointment request on your website. Looking forward to your confirmation!`;

  return `https://wa.me/${artistPhone}?text=${encodeURIComponent(text)}`;
};

// GET /api/bookings - Fetch list of bookings with optional query filters
router.get('/', async (req, res) => {
  try {
    const { status, search } = req.query;

    let query = supabase.from('bookings').select('*').order('created_at', { ascending: false });

    if (status && status !== 'all') {
      query = query.ilike('status', status);
    }

    const { data, error } = await query;
    if (error) throw error;

    let bookings = (data || []).map(b => ({
      ...b,
      booking_id: b.booking_id || `BKG-${b.id.slice(0, 8).toUpperCase()}`,
      amount: b.total_price || 0
    }));

    if (search) {
      const q = search.toLowerCase();
      bookings = bookings.filter(b =>
        (b.customer_name || '').toLowerCase().includes(q) ||
        (b.phone || '').toLowerCase().includes(q) ||
        (b.booking_id || '').toLowerCase().includes(q) ||
        (b.service_name || '').toLowerCase().includes(q)
      );
    }

    res.json({
      success: true,
      count: bookings.length,
      isUsingSupabase: isUsingSupabase(),
      data: bookings
    });
  } catch (err) {
    console.error('Error fetching bookings:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/bookings/stats - Summary numbers for dashboard
router.get('/stats', async (req, res) => {
  try {
    const [
      { count: total },
      { count: pending },
      { count: confirmed },
      { count: completed }
    ] = await Promise.all([
      supabase.from('bookings').select('*', { count: 'exact', head: true }),
      supabase.from('bookings').select('*', { count: 'exact', head: true }).ilike('status', 'pending'),
      supabase.from('bookings').select('*', { count: 'exact', head: true }).ilike('status', 'confirmed'),
      supabase.from('bookings').select('*', { count: 'exact', head: true }).ilike('status', 'completed')
    ]);

    res.json({
      success: true,
      data: { total: total || 0, pending: pending || 0, confirmed: confirmed || 0, completed: completed || 0 }
    });
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/bookings - Create new appointment booking
router.post('/', async (req, res) => {
  try {
    const {
      customer_name,
      phone,
      email,
      service_id,
      service_name,
      event_date,
      event_time,
      event_type,
      location_type,
      venue_address,
      guest_count,
      special_notes,
      total_price
    } = req.body;

    // Basic Validation
    if (!customer_name || !phone || !service_name || !event_date || !event_time) {
      return res.status(400).json({
        success: false,
        error: 'Please provide customer name, phone, service, event date, and time slot.'
      });
    }

    const newBooking = {
      customer_name,
      phone,
      email: email || null,
      service_id: service_id || 'srv-1',
      service_name,
      event_date,
      event_time,
      event_type: event_type || 'Bridal',
      location_type: location_type || 'venue',
      venue_address: venue_address || null,
      guest_count: Number(guest_count) || 1,
      special_notes: special_notes || null,
      total_price: Number(total_price) || 0,
      status: 'pending'
    };

    const { data: savedBooking, error } = await supabase
      .from('bookings')
      .insert([newBooking])
      .select()
      .single();

    if (error) throw error;

    const formattedBooking = {
      ...savedBooking,
      booking_id: `BKG-${savedBooking.id.slice(0, 8).toUpperCase()}`,
      amount: savedBooking.total_price || 0
    };

    const whatsappUrl = generateWhatsAppLink(formattedBooking);

    res.status(201).json({
      success: true,
      message: 'Appointment booking request received successfully!',
      booking: formattedBooking,
      whatsappUrl,
      isUsingSupabase: isUsingSupabase()
    });
  } catch (err) {
    console.error('Error creating booking:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/bookings/:id/status - Update booking status
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, error: 'Status is required' });
    }

    const { data: updated, error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      message: `Booking status updated to ${status}`,
      booking: updated
    });
  } catch (err) {
    console.error('Error updating status:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
