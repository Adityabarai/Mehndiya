import { Router } from 'express';
import { supabase } from '../db/supabase.js';

const router = Router();

// Helper to format artist for client
const formatArtist = (a) => ({
  id: a.id,
  userId: a.user_id,
  user_id: a.user_id,
  name: a.name,
  experience: a.experience,
  location: a.location,
  specializations: Array.isArray(a.specializations) ? a.specializations : [],
  rating: Number(a.rating) || 5.0,
  reviewCount: Number(a.review_count) || 0,
  startingPrice: Number(a.starting_price) || 2500,
  starting_price: Number(a.starting_price) || 2500,
  profileImage: a.profile_image,
  coverImage: a.cover_image,
  about: a.about,
  verified: !!a.verified,
  approvalStatus: a.approval_status || 'approved',
  active: a.active !== false,
  homeService: a.home_service !== false,
  travelCharge: Number(a.travel_charge) || 500,
  phone: a.phone,
  email: a.email,
  workingHours: a.working_hours || {},
  blockedDates: Array.isArray(a.blocked_dates) ? a.blocked_dates : [],
  timeSlots: Array.isArray(a.time_slots) ? a.time_slots : []
});

// GET /api/artists - List all public approved artists with search & filter
router.get('/', async (req, res) => {
  try {
    const { 
      search, 
      location, 
      minRating, 
      specialization, 
      maxPrice, 
      availability,
      all // if admin wants all artists including pending
    } = req.query;

    let query = supabase.from('artists').select('*');

    if (all !== 'true') {
      query = query.eq('approval_status', 'approved').eq('active', true);
    }

    const { data, error } = await query;
    if (error) throw error;

    let artists = (data || []).map(formatArtist);

    if (search) {
      const q = search.toLowerCase();
      artists = artists.filter(a => 
        a.name.toLowerCase().includes(q) ||
        a.location.toLowerCase().includes(q) ||
        a.specializations.some(s => s.toLowerCase().includes(q))
      );
    }

    if (location && location !== 'All Locations') {
      artists = artists.filter(a => a.location.toLowerCase().includes(location.toLowerCase()));
    }

    if (minRating) {
      artists = artists.filter(a => a.rating >= Number(minRating));
    }

    if (specialization && specialization !== 'All Specializations') {
      artists = artists.filter(a => a.specializations.some(s => s.toLowerCase().includes(specialization.toLowerCase())));
    }

    if (maxPrice) {
      artists = artists.filter(a => a.startingPrice <= Number(maxPrice));
    }

    if (availability === 'homeService') {
      artists = artists.filter(a => a.homeService);
    }

    res.json({
      success: true,
      count: artists.length,
      data: artists
    });
  } catch (err) {
    console.error('Error fetching artists:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/artists/:id - Get specific artist profile with their gallery designs, reviews, services & availability
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: artist, error: artistErr } = await supabase
      .from('artists')
      .select('*')
      .or(`id.eq.${id},user_id.eq.${id}`)
      .maybeSingle();

    if (artistErr || !artist) {
      return res.status(404).json({ success: false, error: 'Artist not found' });
    }

    // Fetch designs, reviews, services from Supabase
    const [{ data: designs }, { data: reviews }, { data: services }] = await Promise.all([
      supabase.from('designs').select('*'),
      supabase.from('reviews').select('*').eq('artist_id', artist.id),
      supabase.from('services').select('*').eq('status', 'active')
    ]);

    const formattedDesigns = (designs || []).map(d => ({
      id: d.id,
      title: d.title,
      category: d.category,
      price: Number(d.price || 2000),
      duration: d.duration || '2 Hours',
      tags: Array.isArray(d.tags) ? d.tags : [],
      imageUrl: d.image || d.imageUrl || '',
      image: d.image || d.imageUrl || '',
      likes: Number(d.likes_count || 0),
      description: d.description || '',
      artistId: artist.id,
      artistName: artist.name
    }));

    const formattedReviews = (reviews || []).map(r => ({
      id: r.id,
      appointmentId: r.appointment_id,
      customerId: r.customer_id,
      customerName: r.customer_name,
      customerAvatar: r.customer_avatar,
      artistId: r.artist_id,
      rating: Number(r.rating) || 5,
      comment: r.comment,
      date: r.event_date ? r.event_date.split('T')[0] : ''
    }));

    const formattedServices = (services || []).map(s => ({
      id: s.id,
      name: s.name,
      category: s.category,
      basePrice: Number(s.base_price || 0),
      duration: s.duration,
      status: s.status,
      image: s.image,
      description: s.description
    }));

    // Calculate rating distribution
    const ratingBreakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    formattedReviews.forEach(r => {
      const star = Math.min(5, Math.max(1, Math.round(r.rating)));
      ratingBreakdown[star] = (ratingBreakdown[star] || 0) + 1;
    });

    res.json({
      success: true,
      data: {
        ...formatArtist(artist),
        designs: formattedDesigns,
        reviews: formattedReviews,
        ratingBreakdown,
        services: formattedServices
      }
    });
  } catch (err) {
    console.error('Error fetching artist details:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/artists/:id - Update artist profile info
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      about,
      location,
      experience,
      startingPrice,
      homeService,
      travelCharge,
      specializations,
      phone
    } = req.body;

    const updates = {};
    if (name) updates.name = name;
    if (about !== undefined) updates.about = about;
    if (location) updates.location = location;
    if (experience) updates.experience = experience;
    if (startingPrice !== undefined) updates.starting_price = Number(startingPrice);
    if (homeService !== undefined) updates.home_service = Boolean(homeService);
    if (travelCharge !== undefined) updates.travel_charge = Number(travelCharge);
    if (specializations) updates.specializations = specializations;
    if (phone) updates.phone = phone;

    const { data: updatedArtist, error: updateErr } = await supabase
      .from('artists')
      .update(updates)
      .or(`id.eq.${id},user_id.eq.${id}`)
      .select()
      .maybeSingle();

    if (updateErr) throw updateErr;
    if (!updatedArtist) {
      return res.status(404).json({ success: false, error: 'Artist not found' });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: formatArtist(updatedArtist)
    });
  } catch (err) {
    console.error('Error updating artist:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/artists/:id/availability - Get working hours & blocked dates
router.get('/:id/availability', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: artist, error } = await supabase
      .from('artists')
      .select('working_hours, blocked_dates, time_slots')
      .or(`id.eq.${id},user_id.eq.${id}`)
      .maybeSingle();

    if (error || !artist) {
      return res.status(404).json({ success: false, error: 'Artist not found' });
    }

    res.json({
      success: true,
      workingHours: artist.working_hours || {},
      blockedDates: Array.isArray(artist.blocked_dates) ? artist.blocked_dates : [],
      timeSlots: Array.isArray(artist.time_slots) ? artist.time_slots : []
    });
  } catch (err) {
    console.error('Error fetching availability:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/artists/:id/availability - Update weekly working hours
router.put('/:id/availability', async (req, res) => {
  try {
    const { id } = req.params;
    const { workingHours, timeSlots } = req.body;

    const updates = {};
    if (workingHours) updates.working_hours = workingHours;
    if (timeSlots) updates.time_slots = timeSlots;

    const { data: artist, error } = await supabase
      .from('artists')
      .update(updates)
      .or(`id.eq.${id},user_id.eq.${id}`)
      .select()
      .maybeSingle();

    if (error) throw error;
    if (!artist) {
      return res.status(404).json({ success: false, error: 'Artist not found' });
    }

    res.json({
      success: true,
      message: 'Availability updated successfully',
      workingHours: artist.working_hours,
      timeSlots: artist.time_slots
    });
  } catch (err) {
    console.error('Error updating availability:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/artists/:id/blocked-dates - Block a date with reason
router.post('/:id/blocked-dates', async (req, res) => {
  try {
    const { id } = req.params;
    const { date, reason } = req.body;

    if (!date) {
      return res.status(400).json({ success: false, error: 'Date is required' });
    }

    const { data: artist, error: fetchErr } = await supabase
      .from('artists')
      .select('id, blocked_dates')
      .or(`id.eq.${id},user_id.eq.${id}`)
      .maybeSingle();

    if (fetchErr || !artist) {
      return res.status(404).json({ success: false, error: 'Artist not found' });
    }

    let blockedDates = Array.isArray(artist.blocked_dates) ? [...artist.blocked_dates] : [];
    const existingIndex = blockedDates.findIndex(b => b.date === date);

    if (existingIndex >= 0) {
      blockedDates[existingIndex].reason = reason || 'Unavailable';
    } else {
      blockedDates.push({ date, reason: reason || 'Unavailable' });
    }

    const { data: updated, error: updateErr } = await supabase
      .from('artists')
      .update({ blocked_dates: blockedDates })
      .eq('id', artist.id)
      .select()
      .single();

    if (updateErr) throw updateErr;

    res.json({
      success: true,
      message: `Date ${date} marked as blocked`,
      blockedDates: updated.blocked_dates
    });
  } catch (err) {
    console.error('Error blocking date:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/artists/:id/blocked-dates/:date - Remove blocked date
router.delete('/:id/blocked-dates/:date', async (req, res) => {
  try {
    const { id, date } = req.params;

    const { data: artist, error: fetchErr } = await supabase
      .from('artists')
      .select('id, blocked_dates')
      .or(`id.eq.${id},user_id.eq.${id}`)
      .maybeSingle();

    if (fetchErr || !artist) {
      return res.status(404).json({ success: false, error: 'Artist not found' });
    }

    const blockedDates = (artist.blocked_dates || []).filter(b => b.date !== date);

    const { data: updated, error: updateErr } = await supabase
      .from('artists')
      .update({ blocked_dates: blockedDates })
      .eq('id', artist.id)
      .select()
      .single();

    if (updateErr) throw updateErr;

    res.json({
      success: true,
      message: `Date ${date} unblocked successfully`,
      blockedDates: updated.blocked_dates
    });
  } catch (err) {
    console.error('Error unblocking date:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
