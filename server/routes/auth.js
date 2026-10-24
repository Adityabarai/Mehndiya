import { Router } from 'express';
import { supabase } from '../db/supabase.js';

const router = Router();

// Simple lightweight token helper
const createToken = (user) => {
  return Buffer.from(JSON.stringify({ 
    id: user.id, 
    role: user.role, 
    email: user.email, 
    exp: Date.now() + 86400000 * 7 
  })).toString('base64');
};

export const verifyAuthToken = async (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;
  try {
    const token = authHeader.replace('Bearer ', '');
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf8'));
    if (decoded.exp && decoded.exp < Date.now()) return null;

    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('id', decoded.id)
      .maybeSingle();

    return user || null;
  } catch {
    return null;
  }
};

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, role, location, experience, specializations, startingPrice, homeService, about } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'Name, email, and password are required' });
    }

    // Check existing in Supabase
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .ilike('email', email)
      .maybeSingle();

    if (existingUser) {
      return res.status(400).json({ success: false, error: 'An account with this email already exists' });
    }

    const targetRole = role === 'ARTIST' ? 'ARTIST' : 'USER';
    const newUserId = `usr-${targetRole.toLowerCase()}-${Date.now()}`;

    const newUser = {
      id: newUserId,
      name,
      email,
      password,
      role: targetRole,
      phone: phone || '',
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
    };

    const { error: userErr } = await supabase
      .from('users')
      .insert([newUser]);

    if (userErr) throw userErr;

    let artistProfile = null;
    if (targetRole === 'ARTIST') {
      const newArtistId = `art-${Date.now()}`;
      artistProfile = {
        id: newArtistId,
        user_id: newUserId,
        name,
        experience: experience || '1 Year',
        location: location || 'Studio & Doorstep Service',
        specializations: specializations || ['Traditional Mehndi'],
        rating: 5.0,
        review_count: 0,
        starting_price: Number(startingPrice) || 2000,
        profile_image: newUser.avatar,
        cover_image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1200&q=80',
        about: about || `Talented professional henna artist serving bridal and festive celebrations.`,
        verified: false,
        approval_status: 'pending',
        active: false,
        home_service: Boolean(homeService),
        travel_charge: 500,
        phone: phone || '',
        email,
        working_hours: {
          monday: { open: '09:00 AM', close: '07:00 PM', available: true },
          tuesday: { open: '09:00 AM', close: '07:00 PM', available: true },
          wednesday: { open: '09:00 AM', close: '07:00 PM', available: true },
          thursday: { open: '09:00 AM', close: '07:00 PM', available: true },
          friday: { open: '09:00 AM', close: '07:00 PM', available: true },
          saturday: { open: '09:00 AM', close: '08:00 PM', available: true },
          sunday: { open: '09:00 AM', close: '08:00 PM', available: true }
        },
        blocked_dates: [],
        time_slots: ['10:00 AM', '11:30 AM', '01:00 PM', '03:00 PM', '05:00 PM', '07:00 PM']
      };

      await supabase.from('artists').insert([artistProfile]);

      // Add Admin notification
      await supabase.from('notifications').insert([{
        id: `notif-${Date.now()}`,
        role: 'ADMIN',
        title: 'New Artist Registration! 🌸',
        message: `${name} has registered as an artist and is pending verification.`,
        read: false,
        link: '/admin/artists'
      }]);
    }

    const token = createToken(newUser);
    return res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        avatar: newUser.avatar,
        phone: newUser.phone
      },
      artistProfile
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ success: false, error: 'Registration failed: ' + err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }

    // Query user directly from Supabase
    const { data: user, error: userErr } = await supabase
      .from('users')
      .select('*')
      .ilike('email', email)
      .maybeSingle();

    if (userErr || !user) {
      return res.status(401).json({ success: false, error: 'User is not registered. Please create an account / register first to login.' });
    }

    if (user.password !== password) {
      return res.status(401).json({ success: false, error: 'Incorrect password. Please verify and try again.' });
    }

    if (user.status === 'inactive' || user.status === 'suspended') {
      return res.status(403).json({ success: false, error: 'Your account is deactivated. Please contact support.' });
    }

    const token = createToken(user);

    // If artist, query artist profile from Supabase
    let artistProfile = null;
    if (user.role === 'ARTIST') {
      const { data: artist } = await supabase
        .from('artists')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (artist) {
        artistProfile = {
          id: artist.id,
          userId: artist.user_id,
          name: artist.name,
          experience: artist.experience,
          location: artist.location,
          specializations: artist.specializations || [],
          rating: Number(artist.rating) || 5.0,
          reviewCount: Number(artist.review_count) || 0,
          startingPrice: Number(artist.starting_price) || 2500,
          profileImage: artist.profile_image,
          coverImage: artist.cover_image,
          about: artist.about,
          verified: !!artist.verified,
          approvalStatus: artist.approval_status || 'approved',
          active: artist.active !== false,
          homeService: artist.home_service !== false,
          travelCharge: Number(artist.travel_charge) || 500,
          phone: artist.phone,
          email: artist.email,
          workingHours: artist.working_hours || {},
          blockedDates: artist.blocked_dates || [],
          timeSlots: artist.time_slots || []
        };
      }
    }

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone
      },
      artistProfile
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, error: 'Login failed: ' + err.message });
  }
});

// GET /api/auth/me
router.get('/me', async (req, res) => {
  try {
    const user = await verifyAuthToken(req);
    if (!user) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    let artistProfile = null;
    if (user.role === 'ARTIST') {
      const { data: artist } = await supabase
        .from('artists')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      artistProfile = artist;
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone
      },
      artistProfile
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
