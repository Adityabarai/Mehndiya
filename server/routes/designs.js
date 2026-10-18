import { Router } from 'express';
import { supabase } from '../db/supabase.js';

const router = Router();

const DEFAULT_CATEGORIES = [
  'Bridal',
  'Arabic',
  'Indo-Arabic',
  'Traditional Rajasthani',
  'Mandala & Floral',
  'Minimalist & Modern',
  'Engagement',
  'Party'
];

// In-memory favorites store per user session
const userFavoritesMap = new Map();

// Helper to normalize design for client
const formatDesign = (d) => ({
  id: d.id,
  title: d.title,
  category: d.category,
  price: Number(d.price || 2000),
  duration: d.duration || '2 Hours',
  tags: Array.isArray(d.tags) ? d.tags : [],
  imageUrl: d.image || d.imageUrl || '',
  image: d.image || d.imageUrl || '',
  likes: Number(d.likes_count !== undefined ? d.likes_count : (d.likes || 0)),
  likes_count: Number(d.likes_count !== undefined ? d.likes_count : (d.likes || 0)),
  description: d.description || '',
  featured: !!d.featured,
  artistId: d.artist_id || d.artistId || 'art-2',
  artistName: d.artist_name || d.artistName || 'Ayushi Verma'
});

// GET /api/designs - All designs with category and search filter
router.get('/', async (req, res) => {
  try {
    const { category, search, featured, artistId } = req.query;

    let query = supabase.from('designs').select('*').order('created_at', { ascending: false });

    if (category && category !== 'All' && category !== 'all') {
      query = query.ilike('category', category);
    }

    if (featured === 'true') {
      query = query.eq('featured', true);
    }

    const { data, error } = await query;
    if (error) throw error;

    let list = (data || []).map(formatDesign);

    if (artistId) {
      list = list.filter(d => d.artistId === artistId);
    }

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(d =>
        d.title.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q) ||
        d.artistName.toLowerCase().includes(q)
      );
    }

    res.json({
      success: true,
      count: list.length,
      categories: DEFAULT_CATEGORIES,
      data: list
    });
  } catch (err) {
    console.error('Error fetching designs:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/designs/categories - List of categories
router.get('/categories', (req, res) => {
  res.json({
    success: true,
    data: DEFAULT_CATEGORIES
  });
});

// POST /api/designs/:id/like - Like or unlike a design
router.post('/:id/like', async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch existing likes
    const { data: design, error: fetchErr } = await supabase
      .from('designs')
      .select('likes_count')
      .eq('id', id)
      .maybeSingle();

    if (fetchErr || !design) {
      return res.status(404).json({ success: false, error: 'Design not found' });
    }

    const newLikes = (Number(design.likes_count) || 0) + 1;

    const { error: updateErr } = await supabase
      .from('designs')
      .update({ likes_count: newLikes })
      .eq('id', id);

    if (updateErr) throw updateErr;

    res.json({ success: true, likes: newLikes });
  } catch (err) {
    console.error('Error liking design:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/designs - Upload / add new design (Artist or Admin)
router.post('/', async (req, res) => {
  try {
    const { title, category, imageUrl, image, description, price, duration, tags, artistId, artistName } = req.body;

    const finalImage = imageUrl || image;
    if (!title || !category || !finalImage) {
      return res.status(400).json({
        success: false,
        error: 'Title, category, and image URL are required'
      });
    }

    const newDesign = {
      id: `des-${Date.now()}`,
      title,
      category,
      price: Number(price) || 2500,
      duration: duration || '2 Hours',
      tags: Array.isArray(tags) ? tags : [category],
      image: finalImage,
      likes_count: 0,
      description: description || ''
    };

    const { data, error } = await supabase
      .from('designs')
      .insert([newDesign])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: 'Design added to gallery!',
      data: formatDesign(data)
    });
  } catch (err) {
    console.error('Error adding design:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/designs/:id - Remove design
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('designs').delete().eq('id', id);
    if (error) throw error;

    res.json({ success: true, message: 'Design deleted successfully' });
  } catch (err) {
    console.error('Error deleting design:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Favorites management
router.get('/favorites/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const favSet = userFavoritesMap.get(userId) || new Set();

    if (favSet.size === 0) {
      return res.json({ success: true, data: [] });
    }

    const { data, error } = await supabase
      .from('designs')
      .select('*')
      .in('id', Array.from(favSet));

    if (error) throw error;
    res.json({ success: true, data: (data || []).map(formatDesign) });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/favorites/toggle', (req, res) => {
  const { userId, designId } = req.body;
  if (!userId || !designId) {
    return res.status(400).json({ success: false, error: 'userId and designId are required' });
  }

  if (!userFavoritesMap.has(userId)) {
    userFavoritesMap.set(userId, new Set());
  }
  const favSet = userFavoritesMap.get(userId);

  let favorited = false;
  if (favSet.has(designId)) {
    favSet.delete(designId);
    favorited = false;
  } else {
    favSet.add(designId);
    favorited = true;
  }

  res.json({ success: true, favorited });
});

export default router;
