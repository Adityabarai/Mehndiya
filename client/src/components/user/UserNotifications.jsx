import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bell, Check, Clock } from 'lucide-react';
import { api } from '../../services/api';
import EmptyState from '../common/EmptyState';

export default function UserNotifications({ onNavigate }) {
  const { user, fetchUnreadCount } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifs = () => {
    if (!user) return;
    setLoading(true);
    api.getNotifications({ role: user.role, userId: user.id })
      .then(res => {
        if (res.success) setNotifications(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchNotifs();
  }, [user]);

  const handleMarkAllRead = async () => {
    if (!user) return;
    try {
      await api.markAllNotificationsRead({ role: user.role, userId: user.id });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      fetchUnreadCount();
    } catch (err) {
      console.error(err);
    }
  };

  const handleItemClick = async (notif) => {
    if (!notif.read) {
      try {
        await api.markNotificationRead(notif.id);
        setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
        fetchUnreadCount();
      } catch (err) {
        console.error(err);
      }
    }
    if (notif.link) {
      if (notif.link.includes('artist')) onNavigate('artist-appointments');
      else if (notif.link.includes('admin')) onNavigate('admin-appointments');
      else onNavigate('user-appointments');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#143823]">
            In-App Notifications
          </h1>
          <p className="text-xs sm:text-sm text-[#6B645C]">
            Real-time updates regarding appointment requests, confirmations, and reminders.
          </p>
        </div>

        {notifications.some(n => !n.read) && (
          <button
            onClick={handleMarkAllRead}
            className="text-xs font-semibold text-[#8C6D38] hover:underline"
          >
            Mark all read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <EmptyState
          title="No notifications"
          description="You are completely caught up! New status changes will appear here."
          icon={Bell}
        />
      ) : (
        <div className="bg-white rounded-3xl border border-[#E8DFC8] overflow-hidden shadow-sm divide-y divide-[#EFE9DC]">
          {notifications.map(notif => (
            <div
              key={notif.id}
              onClick={() => handleItemClick(notif)}
              className={`p-5 hover:bg-[#FAF7F2] transition-colors cursor-pointer flex items-start gap-4 ${
                !notif.read ? 'bg-amber-50/60 border-l-4 border-[#D4AF37]' : ''
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-[#143823]/10 text-[#143823] flex items-center justify-center shrink-0 mt-0.5">
                <Bell className="w-4 h-4 text-[#D4AF37]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bold text-sm text-[#143823] truncate">{notif.title}</h4>
                  <span className="text-[10px] text-[#7A7369] font-mono shrink-0">
                    {new Date(notif.createdAt).toLocaleDateString()} {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-xs text-[#5C554E] leading-relaxed">{notif.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
