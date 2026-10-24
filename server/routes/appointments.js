import { Router } from 'express';
import { supabase, generateBookingId, checkBookingConflict } from '../db/supabase.js';

const router = Router();

// Helper to normalize Supabase appointment row for client
export const formatAppointment = (row) => ({
  id: row.id,
  bookingId: row.booking_id,
  userId: row.customer_id,
  customerId: row.customer_id,
  userName: row.customer_name,
  customerName: row.customer_name,
  userEmail: row.customer_email,
  customerEmail: row.customer_email,
  userPhone: row.customer_phone,
  customerPhone: row.customer_phone,
  artistId: row.artist_id,
  artistName: row.artist_name,
  serviceId: row.service_id,
  serviceName: row.service_name,
  date: row.event_date ? (typeof row.event_date === 'string' ? row.event_date.split('T')[0] : row.event_date) : '',
  timeSlot: row.time_slot,
  startTime: row.time_slot,
  endTime: '',
  eventType: row.event_type || 'Bridal Ceremony',
  numberOfPeople: Number(row.number_of_people) || 1,
  location: row.location_type || 'Studio / Doorstep',
  address: row.venue_address || '',
  totalAmount: Number(row.total_amount) || 0,
  appointmentStatus: row.status || 'PENDING',
  status: row.status || 'PENDING',
  paymentStatus: 'Paid',
  paymentMethod: 'Online / UPI',
  rejectionReason: row.rejection_reason || '',
  cancellationReason: row.rejection_reason || '',
  createdAt: row.created_at,
  updatedAt: row.created_at
});

// POST /api/appointments - Create new booking request with conflict prevention
router.post('/', async (req, res) => {
  try {
    const {
      userId,
      userName,
      userEmail,
      userPhone,
      artistId,
      serviceId,
      date,
      timeSlot,
      eventType,
      numberOfPeople,
      location,
      address,
      specialRequirements,
      referenceImage,
      paymentMethod
    } = req.body;

    // Authentication required - only logged-in users can send booking requests
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required. Please sign in or create an account to send a booking request.'
      });
    }

    // Validate Required Fields
    if (!userName || !userPhone || !artistId || !serviceId || !date || !timeSlot) {
      return res.status(400).json({
        success: false,
        error: 'Please fill in all required fields (Name, Phone, Artist, Service, Date, and Time Slot).'
      });
    }

    // Conflict Prevention Check directly on Supabase!
    const conflictCheck = await checkBookingConflict({ artistId, date, timeSlot });
    if (conflictCheck.conflict) {
      return res.status(409).json({
        success: false,
        error: conflictCheck.reason
      });
    }

    // Fetch Artist and Service from Supabase
    const [{ data: artist }, { data: service }] = await Promise.all([
      supabase.from('artists').select('*').eq('id', artistId).maybeSingle(),
      supabase.from('services').select('*').eq('id', serviceId).maybeSingle()
    ]);

    const bookingId = generateBookingId(date);
    const servicePrice = Number(service?.base_price) || 2500;
    const travelCharge = artist ? Number(artist.travel_charge || 0) : 0;
    const totalAmount = servicePrice + travelCharge;
    const aptId = `apt-${Date.now()}`;

    const newAppointmentRow = {
      id: aptId,
      booking_id: bookingId,
      customer_id: userId || `usr-guest-${Date.now()}`,
      customer_name: userName,
      customer_email: userEmail || '',
      customer_phone: userPhone,
      artist_id: artistId,
      artist_name: artist ? artist.name : 'Ayushi Verma',
      service_id: serviceId,
      service_name: service ? service.name : 'Royal Bridal Couture',
      event_date: date,
      time_slot: timeSlot,
      event_type: eventType || 'Bridal Ceremony',
      number_of_people: Number(numberOfPeople) || 1,
      location_type: location || 'Studio / Doorstep Visit',
      venue_address: address || '',
      total_amount: totalAmount,
      status: 'PENDING'
    };

    const { data: createdApt, error: insertAptErr } = await supabase
      .from('appointments')
      .insert([newAppointmentRow])
      .select()
      .single();

    if (insertAptErr) throw insertAptErr;

    // Also record in bookings table
    try {
      await supabase.from('bookings').insert([{
        id: `bkg-${Date.now()}`,
        booking_id: bookingId,
        user_id: newAppointmentRow.customer_id,
        artist_id: artistId,
        service_id: serviceId,
        event_date: date,
        time_slot: timeSlot,
        amount: totalAmount,
        status: 'PENDING'
      }]);
    } catch (bkgErr) {
      console.warn('Booking record note:', bkgErr.message);
    }

    // Record in payments table
    try {
      await supabase.from('payments').insert([{
        id: `pay-${Date.now()}`,
        booking_id: bookingId,
        customer_name: userName,
        customer_email: userEmail || '',
        artist_name: newAppointmentRow.artist_name,
        amount: totalAmount,
        payment_method: paymentMethod || 'Online / UPI',
        payment_status: paymentMethod === 'Online' ? 'Paid' : 'Pending',
        transaction_id: `TXN-${Math.floor(1000000000 + Math.random() * 9000000000)}`
      }]);
    } catch (payErr) {
      console.warn('Payment record note:', payErr.message);
    }

    // Create In-App Notifications
    try {
      const notifs = [
        {
          id: `notif-${Date.now()}-1`,
          role: 'ARTIST',
          user_id: artist?.user_id || null,
          title: 'New Appointment Request! 💍',
          message: `${userName} sent a booking request for ${newAppointmentRow.service_name} on ${date} at ${timeSlot}.`,
          read: false,
          link: '/artist/appointments'
        },
        {
          id: `notif-${Date.now()}-2`,
          role: 'USER',
          user_id: newAppointmentRow.customer_id,
          title: 'Booking Request Submitted 🌸',
          message: `Your appointment request ${bookingId} with ${newAppointmentRow.artist_name} has been submitted and is pending review.`,
          read: false,
          link: '/user/appointments'
        },
        {
          id: `notif-${Date.now()}-3`,
          role: 'ADMIN',
          user_id: 'usr-admin-1',
          title: 'New Booking Created 📋',
          message: `${userName} booked ${newAppointmentRow.artist_name} (${bookingId}) - ₹${totalAmount}.`,
          read: false,
          link: '/admin/appointments'
        }
      ];

      await supabase.from('notifications').insert(notifs);
    } catch (notifErr) {
      console.warn('Notification note:', notifErr.message);
    }

    res.status(201).json({
      success: true,
      message: 'Booking request placed successfully! Awaiting artist confirmation.',
      appointment: formatAppointment(createdApt)
    });
  } catch (err) {
    console.error('Error creating appointment:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/appointments/my - Get user appointments with status tab filtering
router.get('/my', async (req, res) => {
  try {
    const { userId, userEmail, status } = req.query;

    let query = supabase.from('appointments').select('*').order('created_at', { ascending: false });

    if (userId) {
      query = query.eq('customer_id', userId);
    } else if (userEmail) {
      query = query.ilike('customer_email', userEmail);
    }

    if (status && status !== 'all' && status !== 'All') {
      query = query.eq('status', status.toUpperCase());
    }

    const { data, error } = await query;
    if (error) throw error;

    const list = (data || []).map(formatAppointment);

    res.json({
      success: true,
      count: list.length,
      data: list
    });
  } catch (err) {
    console.error('Error fetching my appointments:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/appointments/:id - Single appointment details
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .or(`id.eq.${id},booking_id.eq.${id}`)
      .maybeSingle();

    if (error || !data) {
      return res.status(404).json({ success: false, error: 'Appointment not found' });
    }

    res.json({ success: true, data: formatAppointment(data) });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/appointments/:id/cancel - User cancels appointment
router.put('/:id/cancel', async (req, res) => {
  try {
    const { id } = req.params;
    const { cancellationReason } = req.body;

    const { data: apt, error: fetchErr } = await supabase
      .from('appointments')
      .select('*')
      .or(`id.eq.${id},booking_id.eq.${id}`)
      .maybeSingle();

    if (fetchErr || !apt) {
      return res.status(404).json({ success: false, error: 'Appointment not found' });
    }

    if (apt.status === 'COMPLETED') {
      return res.status(400).json({ success: false, error: 'Completed appointments cannot be cancelled' });
    }

    const { data: updated, error: updateErr } = await supabase
      .from('appointments')
      .update({
        status: 'CANCELLED',
        rejection_reason: cancellationReason || 'Cancelled by customer'
      })
      .eq('id', apt.id)
      .select()
      .single();

    if (updateErr) throw updateErr;

    // Notify artist
    try {
      const { data: artist } = await supabase.from('artists').select('user_id').eq('id', apt.artist_id).maybeSingle();
      if (artist?.user_id) {
        await supabase.from('notifications').insert([{
          id: `notif-${Date.now()}`,
          role: 'ARTIST',
          user_id: artist.user_id,
          title: 'Appointment Cancelled ⚠️',
          message: `${apt.customer_name} cancelled booking ${apt.booking_id} (${cancellationReason || 'Cancelled by customer'}).`,
          read: false,
          link: '/artist/appointments'
        }]);
      }
    } catch {}

    res.json({
      success: true,
      message: 'Appointment cancelled successfully',
      data: formatAppointment(updated)
    });
  } catch (err) {
    console.error('Error cancelling appointment:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/appointments/:id/reschedule - Reschedule appointment
router.put('/:id/reschedule', async (req, res) => {
  try {
    const { id } = req.params;
    const { newDate, newTimeSlot } = req.body;

    const { data: apt, error: fetchErr } = await supabase
      .from('appointments')
      .select('*')
      .or(`id.eq.${id},booking_id.eq.${id}`)
      .maybeSingle();

    if (fetchErr || !apt) {
      return res.status(404).json({ success: false, error: 'Appointment not found' });
    }

    // Check conflict on new slot
    const conflictCheck = await checkBookingConflict({ artistId: apt.artist_id, date: newDate, timeSlot: newTimeSlot });
    if (conflictCheck.conflict) {
      return res.status(409).json({ success: false, error: conflictCheck.reason });
    }

    const { data: updated, error: updateErr } = await supabase
      .from('appointments')
      .update({
        event_date: newDate,
        time_slot: newTimeSlot,
        status: 'PENDING'
      })
      .eq('id', apt.id)
      .select()
      .single();

    if (updateErr) throw updateErr;

    res.json({
      success: true,
      message: 'Appointment rescheduled. Awaiting artist confirmation for the new time.',
      data: formatAppointment(updated)
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
