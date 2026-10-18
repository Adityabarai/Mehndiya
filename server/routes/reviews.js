import { Router } from 'express';
import { supabase } from '../db/supabase.js';

const router = Router();

// Helper to format review
const formatReview = (r) => ({
  id: r.id,
  appointmentId: r.appointment_id,
  artistId: r.artist_id,
  userId: r.customer_id,
  customerId: r.customer_id,
  userName: r.customer_name,
  customerName: r.customer_name,
  userAvatar: r.customer_avatar,
  customerAvatar: r.customer_avatar,
  rating: Number(r.rating) || 5,
  comment: r.comment,
  date: r.event_date ? (typeof r.event_date === 'string' ? r.event_date.split('T')[0] : r.event_date) : '',
  service: r.service || 'Bridal Henna'
});

// GET /api/reviews - Reviews for all or specific artist
router.get('/', async (req, res) => {
  try {
    const { artistId } = req.query;

    let query = supabase.from('reviews').select('*').order('created_at', { ascending: false });
    if (artistId) {
      query = query.eq('artist_id', artistId);
    }

    const { data, error } = await query;
    if (error) throw error;

    const list = (data || []).map(formatReview);

    // Rating breakdown
    const ratingBreakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    list.forEach(r => {
      const star = Math.min(5, Math.max(1, Math.round(r.rating)));
      ratingBreakdown[star] = (ratingBreakdown[star] || 0) + 1;
    });

    const avgRating = list.length
      ? (list.reduce((sum, r) => sum + r.rating, 0) / list.length).toFixed(1)
      : '5.0';

    res.json({
      success: true,
      count: list.length,
      avgRating: Number(avgRating),
      ratingBreakdown,
      data: list
    });
  } catch (err) {
    console.error('Error fetching reviews:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/reviews - Add customer review
router.post('/', async (req, res) => {
  try {
    const { artistId, userId, userName, userAvatar, rating, comment, service } = req.body;

    if (!artistId || !userName || !rating || !comment) {
      return res.status(400).json({
        success: false,
        error: 'Artist, reviewer name, rating, and comment are required'
      });
    }

    const { data: artist } = await supabase
      .from('artists')
      .select('id, name, rating, review_count')
      .eq('id', artistId)
      .maybeSingle();

    const newReview = {
      id: `rev-${Date.now()}`,
      artist_id: artistId,
      customer_id: userId || `usr-${Date.now()}`,
      customer_name: userName,
      customer_avatar: userAvatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      rating: Number(rating),
      event_date: new Date().toISOString().split('T')[0],
      comment,
      service: service || 'Bridal Henna'
    };

    const { data: inserted, error: insertErr } = await supabase
      .from('reviews')
      .insert([newReview])
      .select()
      .single();

    if (insertErr) throw insertErr;

    // Recalculate & update artist rating
    if (artist) {
      try {
        const { data: allReviews } = await supabase
          .from('reviews')
          .select('rating')
          .eq('artist_id', artistId);

        const totalRatings = (allReviews || []);
        const newAvg = totalRatings.length
          ? (totalRatings.reduce((sum, r) => sum + Number(r.rating), 0) / totalRatings.length)
          : Number(rating);

        await supabase.from('artists').update({
          rating: Number(newAvg.toFixed(2)),
          review_count: totalRatings.length
        }).eq('id', artistId);
      } catch {}
    }

    res.status(201).json({
      success: true,
      message: 'Review posted successfully!',
      data: formatReview(inserted)
    });
  } catch (err) {
    console.error('Error posting review:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
