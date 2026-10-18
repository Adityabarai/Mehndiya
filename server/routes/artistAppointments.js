import { Router } from 'express';
import { supabase } from '../db/supabase.js';
import { formatAppointment } from './appointments.js';
import { verifyAuthToken } from './auth.js';

const router = Router();

// GET /api/artist/appointments - Get appointments for the artist with status tabs
router.get('/', async (req, res) => {
  try {
    let { artistId, status } = req.query;

    if (!artistId) {
      const authUser = await verifyAuthToken(req);
      if (authUser) {
        artistId = authUser.id;
      }
    }

    let artist = null;
    if (artistId) {
      const { data, error: artistErr } = await supabase
        .from('artists')
        .select('id')
        .or(`id.eq.${artistId},user_id.eq.${artistId}`)
        .maybeSingle();
      if (data) artist = data;
    }

    // Fallback: pick the first artist in database if not explicitly resolved
    if (!artist) {
      const { data: firstArtist } = await supabase
        .from('artists')
        .select('id')
        .limit(1)
        .maybeSingle();
      artist = firstArtist;
    }

    if (!artist) {
      return res.status(404).json({ success: false, error: 'Artist not found' });
    }

    const todayStr = new Date().toISOString().split('T')[0];

    let query = supabase
      .from('appointments')
      .select('*')
      .eq('artist_id', artist.id);

    const lower = status ? status.toLowerCase() : '';

    if (status && status !== 'all' && status !== 'All') {
      if (lower === 'today') {
        query = query.eq('event_date', todayStr);
      } else if (lower === 'upcoming') {
        query = query.gte('event_date', todayStr).in('status', ['CONFIRMED', 'PENDING']);
      } else {
        query = query.eq('status', status.toUpperCase());
      }
    }

    query = query.order('event_date', { ascending: true });

    const { data, error } = await query;
    if (error) throw error;

    const list = (data || []).map(formatAppointment);

    res.json({
      success: true,
      count: list.length,
      data: list
    });
  } catch (err) {
    console.error('Error fetching artist appointments:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/artist/appointments/:id/accept - Artist accepts appointment -> CONFIRMED
router.put('/:id/accept', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: apt, error: fetchErr } = await supabase
      .from('appointments')
      .select('*')
      .or(`id.eq.${id},booking_id.eq.${id}`)
      .maybeSingle();

    if (fetchErr || !apt) {
      return res.status(404).json({ success: false, error: 'Appointment not found' });
    }

    if (apt.status !== 'PENDING') {
      return res.status(400).json({
        success: false,
        error: `Cannot accept appointment with status "${apt.status}". Only PENDING appointments can be accepted.`
      });
    }

    // Check for double-booking conflicts
    const { data: overlapping } = await supabase
      .from('appointments')
      .select('id, booking_id')
      .eq('artist_id', apt.artist_id)
      .eq('event_date', apt.event_date)
      .eq('time_slot', apt.time_slot)
      .eq('status', 'CONFIRMED')
      .neq('id', apt.id)
      .limit(1);

    if (overlapping && overlapping.length > 0) {
      return res.status(409).json({
        success: false,
        error: `Cannot accept: You already have another confirmed appointment (${overlapping[0].booking_id}) at ${apt.time_slot} on ${apt.event_date}.`
      });
    }

    const { data: updated, error: updateErr } = await supabase
      .from('appointments')
      .update({ status: 'CONFIRMED' })
      .eq('id', apt.id)
      .select()
      .single();

    if (updateErr) throw updateErr;

    // Notify customer
    try {
      await supabase.from('notifications').insert([{
        id: `notif-${Date.now()}`,
        role: 'USER',
        user_id: apt.customer_id,
        title: 'Appointment Confirmed! 🌸',
        message: `Great news! ${apt.artist_name} has accepted your booking for ${apt.service_name} on ${apt.event_date} (${apt.time_slot}).`,
        read: false,
        link: '/user/appointments'
      }]);
    } catch {}

    res.json({
      success: true,
      message: 'Appointment confirmed successfully!',
      data: formatAppointment(updated)
    });
  } catch (err) {
    console.error('Error accepting appointment:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/artist/appointments/:id/reject - Artist rejects appointment with mandatory reason
router.put('/:id/reject', async (req, res) => {
  try {
    const { id } = req.params;
    const { rejectionReason } = req.body;

    if (!rejectionReason || !rejectionReason.trim()) {
      return res.status(400).json({
        success: false,
        error: 'A reason for rejection is required (e.g., "Artist unavailable on selected date").'
      });
    }

    const { data: apt, error: fetchErr } = await supabase
      .from('appointments')
      .select('*')
      .or(`id.eq.${id},booking_id.eq.${id}`)
      .maybeSingle();

    if (fetchErr || !apt) {
      return res.status(404).json({ success: false, error: 'Appointment not found' });
    }

    const { data: updated, error: updateErr } = await supabase
      .from('appointments')
      .update({
        status: 'REJECTED',
        rejection_reason: rejectionReason.trim()
      })
      .eq('id', apt.id)
      .select()
      .single();

    if (updateErr) throw updateErr;

    // Notify customer
    try {
      await supabase.from('notifications').insert([{
        id: `notif-${Date.now()}`,
        role: 'USER',
        user_id: apt.customer_id,
        title: 'Appointment Request Declined 😔',
        message: `Unfortunately, ${apt.artist_name} could not accept your booking (${apt.booking_id}). Reason: ${rejectionReason.trim()}`,
        read: false,
        link: '/user/appointments'
      }]);
    } catch {}

    res.json({
      success: true,
      message: 'Appointment rejected',
      data: formatAppointment(updated)
    });
  } catch (err) {
    console.error('Error rejecting appointment:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/artist/appointments/:id/complete - Mark appointment as completed
router.put('/:id/complete', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: apt, error: fetchErr } = await supabase
      .from('appointments')
      .select('*')
      .or(`id.eq.${id},booking_id.eq.${id}`)
      .maybeSingle();

    if (fetchErr || !apt) {
      return res.status(404).json({ success: false, error: 'Appointment not found' });
    }

    const { data: updated, error: updateErr } = await supabase
      .from('appointments')
      .update({ status: 'COMPLETED' })
      .eq('id', apt.id)
      .select()
      .single();

    if (updateErr) throw updateErr;

    // Mark payment as Paid
    try {
      await supabase
        .from('payments')
        .update({ payment_status: 'Paid' })
        .eq('booking_id', apt.booking_id)
        .eq('payment_status', 'Pending');
    } catch {}

    // Notify customer to leave a review
    try {
      await supabase.from('notifications').insert([{
        id: `notif-${Date.now()}`,
        role: 'USER',
        user_id: apt.customer_id,
        title: 'How was your Mehndi experience? ⭐',
        message: `Your appointment with ${apt.artist_name} is marked complete. Please share your rating and review!`,
        read: false,
        link: `/user/artists/${apt.artist_id}`
      }]);
    } catch {}

    res.json({
      success: true,
      message: 'Appointment marked as completed!',
      data: formatAppointment(updated)
    });
  } catch (err) {
    console.error('Error completing appointment:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
