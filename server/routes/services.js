import { Router } from 'express';
import { supabase } from '../db/supabase.js';

const router = Router();

// Helper to format service for client
const formatService = (s) => ({
  id: s.id,
  name: s.name,
  category: s.category,
  basePrice: Number(s.base_price || 0),
  base_price: Number(s.base_price || 0),
  duration: s.duration,
  status: s.status || 'active',
  image: s.image,
  description: s.description || ''
});

// GET /api/services - Get all active services or all if query all=true
router.get('/', async (req, res) => {
  try {
    const { all, category } = req.query;

    let query = supabase.from('services').select('*').order('name', { ascending: true });

    if (all !== 'true') {
      query = query.eq('status', 'active');
    }

    if (category && category !== 'All') {
      query = query.ilike('category', category);
    }

    const { data, error } = await query;
    if (error) throw error;

    const formatted = (data || []).map(formatService);

    res.json({
      success: true,
      count: formatted.length,
      data: formatted
    });
  } catch (err) {
    console.error('Error fetching services:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/services - Admin add service
router.post('/', async (req, res) => {
  try {
    const { name, category, basePrice, duration, description, image } = req.body;

    if (!name || !basePrice || !duration) {
      return res.status(400).json({ success: false, error: 'Name, price, and duration are required' });
    }

    const newService = {
      id: `srv-${Date.now()}`,
      name,
      category: category || 'Bridal',
      base_price: Number(basePrice),
      duration,
      status: 'active',
      image: image || 'https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?auto=format&fit=crop&w=600&q=80',
      description: description || ''
    };

    const { data, error } = await supabase.from('services').insert([newService]).select().single();
    if (error) throw error;

    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: formatService(data)
    });
  } catch (err) {
    console.error('Error creating service:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/services/:id - Admin update service
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, basePrice, duration, description, image, status } = req.body;

    const updates = {};
    if (name) updates.name = name;
    if (category) updates.category = category;
    if (basePrice !== undefined) updates.base_price = Number(basePrice);
    if (duration) updates.duration = duration;
    if (description !== undefined) updates.description = description;
    if (image) updates.image = image;
    if (status) updates.status = status;

    const { data, error } = await supabase
      .from('services')
      .update(updates)
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ success: false, error: 'Service not found' });
    }

    res.json({
      success: true,
      message: 'Service updated successfully',
      data: formatService(data)
    });
  } catch (err) {
    console.error('Error updating service:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/services/:id - Delete service
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('services').delete().eq('id', id);
    if (error) throw error;

    res.json({ success: true, message: 'Service removed successfully' });
  } catch (err) {
    console.error('Error deleting service:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
