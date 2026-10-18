import { Router } from 'express';
import { supabase } from '../db/supabase.js';

const router = Router();

const formatNotification = (n) => ({
  id: n.id,
  role: n.role,
  recipientRole: n.role,
  userId: n.user_id,
  recipientUserId: n.user_id,
  title: n.title,
  message: n.message,
  link: n.link || null,
  read: !!n.read,
  createdAt: n.created_at
});

// GET /api/notifications - User / Artist / Admin notifications
router.get('/', async (req, res) => {
  try {
    const { role, userId } = req.query;

    let query = supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    // Filter by role OR userId
    if (role && userId) {
      query = query.or(`role.eq.${role.toUpperCase()},user_id.eq.${userId}`);
    } else if (userId) {
      query = query.eq('user_id', userId);
    } else if (role) {
      query = query.eq('role', role.toUpperCase());
    }

    const { data, error } = await query;
    if (error) throw error;

    const list = (data || []).map(formatNotification);
    const unreadCount = list.filter(n => !n.read).length;

    res.json({
      success: true,
      unreadCount,
      count: list.length,
      data: list
    });
  } catch (err) {
    console.error('Error fetching notifications:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/notifications/:id/read - Mark single as read
router.put('/:id/read', async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ success: false, error: 'Notification not found' });
    }

    res.json({ success: true, notification: formatNotification(data) });
  } catch (err) {
    console.error('Error marking notification as read:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/notifications/read-all - Mark all as read for role/user
router.put('/read-all', async (req, res) => {
  try {
    const { role, userId } = req.body;

    let query = supabase.from('notifications').update({ read: true });

    if (role && userId) {
      query = query.or(`role.eq.${role.toUpperCase()},user_id.eq.${userId}`);
    } else if (userId) {
      query = query.eq('user_id', userId);
    } else if (role) {
      query = query.eq('role', role.toUpperCase());
    }

    const { error } = await query;
    if (error) throw error;

    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (err) {
    console.error('Error marking all notifications as read:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
