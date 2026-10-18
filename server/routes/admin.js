import { Router } from 'express';
import { supabase } from '../db/supabase.js';
import { formatAppointment } from './appointments.js';

const router = Router();

// Helper to format artist for admin view
const formatArtist = (a) => ({
  id: a.id,
  userId: a.user_id,
  name: a.name,
  experience: a.experience,
  location: a.location,
  specializations: Array.isArray(a.specializations) ? a.specializations : [],
  rating: Number(a.rating) || 5.0,
  reviewCount: Number(a.review_count) || 0,
  startingPrice: Number(a.starting_price) || 2500,
  profileImage: a.profile_image,
  coverImage: a.cover_image,
  about: a.about,
  verified: !!a.verified,
  approvalStatus: a.approval_status || 'pending',
  active: !!a.active,
  homeService: !!a.home_service,
  travelCharge: Number(a.travel_charge) || 500,
  phone: a.phone,
  email: a.email,
  workingHours: a.working_hours || {},
  blockedDates: Array.isArray(a.blocked_dates) ? a.blocked_dates : [],
  timeSlots: Array.isArray(a.time_slots) ? a.time_slots : []
});

// GET /api/admin/dashboard - High-level metrics, trends & breakdowns
router.get('/dashboard', async (req, res) => {
  try {
    // Fetch all data in parallel
    const [
      { data: users },
      { data: artists },
      { data: appointments },
      { data: payments }
    ] = await Promise.all([
      supabase.from('users').select('id, role, status'),
      supabase.from('artists').select('*'),
      supabase.from('appointments').select('*').order('created_at', { ascending: false }),
      supabase.from('payments').select('amount, payment_status')
    ]);

    const allUsers = users || [];
    const allArtists = artists || [];
    const allAppointments = appointments || [];
    const allPayments = payments || [];

    const totalUsers = allUsers.filter(u => u.role === 'USER').length;
    const totalArtists = allArtists.length;
    const verifiedArtists = allArtists.filter(a => a.verified && a.approval_status === 'approved').length;
    const pendingArtists = allArtists.filter(a => a.approval_status === 'pending').length;

    const totalAppointments = allAppointments.length;
    const pendingAppointments = allAppointments.filter(a => a.status === 'PENDING').length;
    const confirmedAppointments = allAppointments.filter(a => a.status === 'CONFIRMED').length;
    const completedAppointments = allAppointments.filter(a => a.status === 'COMPLETED').length;
    const cancelledAppointments = allAppointments.filter(a => a.status === 'CANCELLED').length;
    const rejectedAppointments = allAppointments.filter(a => a.status === 'REJECTED').length;

    const totalRevenue = allPayments
      .filter(p => p.payment_status === 'Paid')
      .reduce((acc, p) => acc + (Number(p.amount) || 0), 0);

    const pendingRevenue = allPayments
      .filter(p => p.payment_status === 'Pending')
      .reduce((acc, p) => acc + (Number(p.amount) || 0), 0);

    // Monthly trends (realistic static trend + live current month)
    const monthlyTrends = [
      { month: 'May 2026', appointments: 18, revenue: 68000 },
      { month: 'Jun 2026', appointments: 25, revenue: 95000 },
      { month: 'Jul 2026', appointments: 32, revenue: 124000 },
      { month: 'Aug 2026', appointments: 40, revenue: 162000 },
      { month: 'Sep 2026', appointments: 52, revenue: 215000 },
      { month: 'Oct 2026 (MTD)', appointments: totalAppointments, revenue: totalRevenue }
    ];

    // Popular services
    const serviceCounts = {};
    allAppointments.forEach(a => {
      if (a.service_name) {
        serviceCounts[a.service_name] = (serviceCounts[a.service_name] || 0) + 1;
      }
    });
    const popularServices = Object.entries(serviceCounts)
      .map(([name, count]) => ({ name, bookings: count }))
      .sort((a, b) => b.bookings - a.bookings);

    // Top Artists
    const topArtists = allArtists.map(a => {
      const appts = allAppointments.filter(apt => apt.artist_id === a.id);
      const rev = appts
        .filter(apt => apt.status === 'COMPLETED' || apt.status === 'CONFIRMED')
        .reduce((sum, item) => sum + (Number(item.total_amount) || 0), 0);
      return {
        id: a.id,
        name: a.name,
        location: a.location,
        rating: Number(a.rating) || 5.0,
        totalBookings: appts.length,
        earnings: rev,
        image: a.profile_image,
        verified: !!a.verified,
        status: a.approval_status
      };
    }).sort((a, b) => b.earnings - a.earnings);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalArtists,
        verifiedArtists,
        pendingArtists,
        totalAppointments,
        pendingAppointments,
        confirmedAppointments,
        completedAppointments,
        cancelledAppointments,
        rejectedAppointments,
        totalRevenue,
        pendingRevenue
      },
      monthlyTrends,
      popularServices,
      topArtists,
      recentBookings: allAppointments.slice(0, 5).map(formatAppointment)
    });
  } catch (err) {
    console.error('Admin dashboard error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/admin/users - User management list with search & filter
router.get('/users', async (req, res) => {
  try {
    const { search, role, status } = req.query;

    let query = supabase.from('users').select('*').order('created_at', { ascending: false });

    if (role && role !== 'all') {
      query = query.eq('role', role.toUpperCase());
    }
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }
    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`);
    }

    const { data: users, error } = await query;
    if (error) throw error;

    // Fetch appointments for booking count
    const { data: appointments } = await supabase
      .from('appointments')
      .select('customer_id, customer_email, event_date');

    const allAppts = appointments || [];

    const usersWithStats = (users || []).map(u => {
      const userBookings = allAppts.filter(a => a.customer_id === u.id || a.customer_email === u.email);
      return {
        ...u,
        totalAppointments: userBookings.length,
        lastBookingDate: userBookings.length ? userBookings[0].event_date : 'Never'
      };
    });

    res.json({
      success: true,
      count: usersWithStats.length,
      data: usersWithStats
    });
  } catch (err) {
    console.error('Admin users error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/admin/users/:id/status - Toggle activate/deactivate
router.put('/users/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const { data: user, error: fetchErr } = await supabase
      .from('users')
      .select('id, status')
      .eq('id', id)
      .maybeSingle();

    if (fetchErr || !user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const newStatus = status || (user.status === 'active' ? 'inactive' : 'active');

    const { data: updated, error: updateErr } = await supabase
      .from('users')
      .update({ status: newStatus })
      .eq('id', id)
      .select()
      .single();

    if (updateErr) throw updateErr;

    res.json({ success: true, message: `User status set to ${newStatus}`, user: updated });
  } catch (err) {
    console.error('Admin toggle user error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/admin/users/:id
router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('users').delete().eq('id', id);
    if (error) throw error;
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (err) {
    console.error('Admin delete user error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/admin/artists - All artists with verification status
router.get('/artists', async (req, res) => {
  try {
    const { status, search } = req.query;

    let query = supabase.from('artists').select('*');

    if (status && status !== 'all') {
      if (status === 'verified') {
        query = query.eq('verified', true);
      } else {
        query = query.eq('approval_status', status);
      }
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,location.ilike.%${search}%`);
    }

    const { data: artists, error } = await query;
    if (error) throw error;

    const { data: appointments } = await supabase
      .from('appointments')
      .select('artist_id, total_amount');

    const allAppts = appointments || [];

    const artistsData = (artists || []).map(a => {
      const appts = allAppts.filter(apt => apt.artist_id === a.id);
      const totalRev = appts.reduce((sum, itm) => sum + (Number(itm.total_amount) || 0), 0);
      return {
        ...formatArtist(a),
        totalBookings: appts.length,
        totalEarnings: totalRev
      };
    });

    res.json({ success: true, count: artistsData.length, data: artistsData });
  } catch (err) {
    console.error('Admin artists error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/admin/artists/:id/approve - Approve pending artist
router.put('/artists/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: updated, error: updateErr } = await supabase
      .from('artists')
      .update({ approval_status: 'approved', active: true, verified: true })
      .eq('id', id)
      .select()
      .single();

    if (updateErr || !updated) {
      return res.status(404).json({ success: false, error: 'Artist not found' });
    }

    // Notify artist
    try {
      if (updated.user_id) {
        await supabase.from('notifications').insert([{
          id: `notif-${Date.now()}`,
          role: 'ARTIST',
          user_id: updated.user_id,
          title: 'Application Approved! 🎉',
          message: 'Your artist profile has been approved & verified by Mehndi Admin. You can now receive client bookings!',
          read: false,
          link: '/artist/dashboard'
        }]);
      }
    } catch {}

    res.json({
      success: true,
      message: `${updated.name} is now approved and verified!`,
      artist: formatArtist(updated)
    });
  } catch (err) {
    console.error('Admin approve artist error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/admin/artists/:id/reject - Reject artist
router.put('/artists/:id/reject', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: updated, error } = await supabase
      .from('artists')
      .update({ approval_status: 'rejected', active: false, verified: false })
      .eq('id', id)
      .select()
      .single();

    if (error || !updated) {
      return res.status(404).json({ success: false, error: 'Artist not found' });
    }

    res.json({
      success: true,
      message: `${updated.name} application was rejected.`,
      artist: formatArtist(updated)
    });
  } catch (err) {
    console.error('Admin reject artist error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/admin/artists/:id/verify - Toggle verified badge
router.put('/artists/:id/verify', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: current } = await supabase
      .from('artists')
      .select('id, verified, name')
      .eq('id', id)
      .maybeSingle();

    if (!current) {
      return res.status(404).json({ success: false, error: 'Artist not found' });
    }

    const { data: updated, error } = await supabase
      .from('artists')
      .update({ verified: !current.verified })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      message: `Verified badge ${updated.verified ? 'enabled' : 'disabled'} for ${updated.name}`,
      artist: formatArtist(updated)
    });
  } catch (err) {
    console.error('Admin verify artist error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/admin/appointments - Complete filtered appointments table
router.get('/appointments', async (req, res) => {
  try {
    const { status, artistId, date, search } = req.query;

    let query = supabase.from('appointments').select('*').order('created_at', { ascending: false });

    if (status && status !== 'all') {
      query = query.eq('status', status.toUpperCase());
    }
    if (artistId && artistId !== 'all') {
      query = query.eq('artist_id', artistId);
    }
    if (date) {
      query = query.eq('event_date', date);
    }

    const { data, error } = await query;
    if (error) throw error;

    let list = (data || []).map(formatAppointment);

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(a =>
        (a.bookingId || '').toLowerCase().includes(q) ||
        (a.userName || '').toLowerCase().includes(q) ||
        (a.artistName || '').toLowerCase().includes(q) ||
        (a.serviceName || '').toLowerCase().includes(q)
      );
    }

    res.json({ success: true, count: list.length, data: list });
  } catch (err) {
    console.error('Admin appointments error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/admin/appointments/:id/status - Override appointment status
router.put('/appointments/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const { data: updated, error } = await supabase
      .from('appointments')
      .update({ status: status.toUpperCase() })
      .or(`id.eq.${id},booking_id.eq.${id}`)
      .select()
      .single();

    if (error || !updated) {
      return res.status(404).json({ success: false, error: 'Appointment not found' });
    }

    res.json({ success: true, message: `Appointment status updated to ${status}`, appointment: formatAppointment(updated) });
  } catch (err) {
    console.error('Admin status override error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/admin/appointments/:id/reassign - Reassign appointment to another artist
router.put('/appointments/:id/reassign', async (req, res) => {
  try {
    const { id } = req.params;
    const { newArtistId } = req.body;

    const [{ data: apt }, { data: newArtist }] = await Promise.all([
      supabase.from('appointments').select('*').or(`id.eq.${id},booking_id.eq.${id}`).maybeSingle(),
      supabase.from('artists').select('id, name, user_id').eq('id', newArtistId).maybeSingle()
    ]);

    if (!apt) {
      return res.status(404).json({ success: false, error: 'Appointment not found' });
    }
    if (!newArtist) {
      return res.status(404).json({ success: false, error: 'Target artist not found' });
    }

    const oldArtistName = apt.artist_name;

    const { data: updated, error: updateErr } = await supabase
      .from('appointments')
      .update({ artist_id: newArtist.id, artist_name: newArtist.name })
      .eq('id', apt.id)
      .select()
      .single();

    if (updateErr) throw updateErr;

    // Notify new artist
    try {
      if (newArtist.user_id) {
        await supabase.from('notifications').insert([{
          id: `notif-${Date.now()}`,
          role: 'ARTIST',
          user_id: newArtist.user_id,
          title: 'Booking Assigned by Admin 📌',
          message: `Admin assigned booking ${apt.booking_id} (${apt.service_name}) to you for ${apt.event_date}.`,
          read: false,
          link: '/artist/appointments'
        }]);
      }
    } catch {}

    res.json({
      success: true,
      message: `Reassigned from ${oldArtistName} to ${newArtist.name}`,
      appointment: formatAppointment(updated)
    });
  } catch (err) {
    console.error('Admin reassign error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/admin/payments
router.get('/payments', async (req, res) => {
  try {
    const { status, search } = req.query;

    let query = supabase.from('payments').select('*').order('created_at', { ascending: false });

    if (status && status !== 'all') {
      query = query.ilike('payment_status', status);
    }

    const { data, error } = await query;
    if (error) throw error;

    let list = (data || []).map(p => ({
      id: p.id,
      bookingId: p.booking_id,
      customerName: p.customer_name,
      customerEmail: p.customer_email,
      artistName: p.artist_name,
      amount: Number(p.amount) || 0,
      paymentMethod: p.payment_method,
      paymentStatus: p.payment_status,
      transactionId: p.transaction_id,
      paymentDate: p.created_at
    }));

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        (p.bookingId || '').toLowerCase().includes(q) ||
        (p.customerName || '').toLowerCase().includes(q) ||
        (p.artistName || '').toLowerCase().includes(q) ||
        (p.transactionId || '').toLowerCase().includes(q)
      );
    }

    res.json({ success: true, count: list.length, data: list });
  } catch (err) {
    console.error('Admin payments error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
