import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Sparkles, 
  Bell, 
  User, 
  LogOut, 
  LayoutDashboard, 
  Calendar, 
  Menu, 
  X, 
  ChevronDown,
  ShieldCheck,
  Check,
  ExternalLink
} from 'lucide-react';
import { api } from '../../services/api';

export default function Navbar({ onNavigate, currentView, onOpenBooking }) {
  const { user, isAuthenticated, isAdmin, isArtist, isUser, logout, loginAsAdmin, loginAsArtist, loginAsUser, unreadNotifications, fetchUnreadCount } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [demoDropdownOpen, setDemoDropdownOpen] = useState(false);
  const [recentNotifications, setRecentNotifications] = useState([]);
  const notifRef = useRef(null);
  const userRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifDropdownOpen(false);
      }
      if (userRef.current && !userRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch notifications when dropdown opens
  const handleOpenNotifications = async () => {
    setNotifDropdownOpen(prev => !prev);
    if (!notifDropdownOpen && user) {
      try {
        const res = await api.getNotifications({ role: user.role, userId: user.id });
        if (res.success) {
          setRecentNotifications(res.data.slice(0, 6));
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleMarkAllRead = async () => {
    if (!user) return;
    try {
      await api.markAllNotificationsRead({ role: user.role, userId: user.id });
      setRecentNotifications(prev => prev.map(n => ({ ...n, read: true })));
      fetchUnreadCount();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDashboardRedirect = () => {
    if (isAdmin) onNavigate('admin-dashboard');
    else if (isArtist) onNavigate('artist-dashboard');
    else onNavigate('user-dashboard');
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const handleProfileRedirect = () => {
    if (isAdmin) onNavigate('admin-profile');
    else if (isArtist) onNavigate('artist-profile');
    else onNavigate('user-profile');
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8DFC8] shadow-sm">
      {/* Top Small Business Announcement Bar */}
      <div className="bg-[#143823] text-[#FAF7F2] px-4 py-2 text-xs font-sans flex flex-wrap items-center justify-between border-b border-[#D4AF37]/30">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse"></span>
          <span className="text-[#F3E5AB] font-medium text-xs sm:text-sm">✨ mehndiya — Handcrafted Organic Bridal & Festive Henna</span>
        </div>
        
        <div className="hidden sm:flex items-center gap-4 text-[#F3E5AB]/90 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="text-[#D4AF37]">🌿</span> 100% Organic Sojat Cones
          </span>
          <span className="text-white/40">•</span>
          <span>Studio & Doorstep Service</span>
          <span className="text-white/40">•</span>
          <a href="tel:+919811234567" className="font-semibold text-[#D4AF37] hover:underline flex items-center gap-1">
            📞 +91 98112 34567
          </a>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#143823] via-[#1C4B30] to-[#D4AF37] p-[1.5px] shadow-md group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#FAF7F2] rounded-[14px] flex items-center justify-center">
              <span className="font-serif font-black text-2xl text-[#143823] tracking-tighter">M</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#143823]">
                mehndiya
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></span>
            </div>
            <p className="text-[10px] tracking-widest uppercase font-semibold text-[#8C6D38] -mt-0.5 font-sans">
              Boutique Bridal Henna Studio
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8 font-sans text-sm font-medium">
          <button
            onClick={() => onNavigate('home')}
            className={`transition-colors ${currentView === 'home' ? 'text-[#143823] font-bold border-b-2 border-[#D4AF37] pb-1' : 'text-[#5C554E] hover:text-[#143823]'}`}
          >
            Home
          </button>
          <button
            onClick={() => onNavigate('services')}
            className={`transition-colors ${currentView === 'services' ? 'text-[#143823] font-bold border-b-2 border-[#D4AF37] pb-1' : 'text-[#5C554E] hover:text-[#143823]'}`}
          >
            Services & Packages
          </button>
          <button
            onClick={() => onNavigate('designs')}
            className={`transition-colors ${currentView === 'designs' ? 'text-[#143823] font-bold border-b-2 border-[#D4AF37] pb-1' : 'text-[#5C554E] hover:text-[#143823]'}`}
          >
            Design Gallery
          </button>
          <button
            onClick={() => onNavigate('artists')}
            className={`transition-colors ${currentView === 'artists' ? 'text-[#143823] font-bold border-b-2 border-[#D4AF37] pb-1' : 'text-[#5C554E] hover:text-[#143823]'}`}
          >
            Our Artists
          </button>
          <button
            onClick={() => onNavigate('about')}
            className={`transition-colors ${currentView === 'about' ? 'text-[#143823] font-bold border-b-2 border-[#D4AF37] pb-1' : 'text-[#5C554E] hover:text-[#143823]'}`}
          >
            About Ayushi
          </button>
          <button
            onClick={() => onNavigate('contact')}
            className={`transition-colors ${currentView === 'contact' ? 'text-[#143823] font-bold border-b-2 border-[#D4AF37] pb-1' : 'text-[#5C554E] hover:text-[#143823]'}`}
          >
            Contact
          </button>
        </nav>

        {/* Right Section Actions */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              {/* In-App Notifications Bell */}
              <div className="relative" ref={notifRef}>
                <button
                  onClick={handleOpenNotifications}
                  className="relative p-2.5 rounded-full hover:bg-[#EFE9DC] text-[#143823] transition-colors"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadNotifications > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
                      {unreadNotifications > 9 ? '9+' : unreadNotifications}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {notifDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#FAF7F2] rounded-2xl shadow-2xl border border-[#D4AF37]/30 overflow-hidden z-50 animate-scale-in">
                    <div className="p-3.5 bg-gradient-to-r from-[#143823] to-[#1C4B30] text-[#FAF7F2] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-[#D4AF37]" />
                        <span className="font-serif font-semibold text-sm text-[#F3E5AB]">Notifications</span>
                      </div>
                      {unreadNotifications > 0 && (
                        <button
                          onClick={handleMarkAllRead}
                          className="text-[11px] text-emerald-200 hover:text-white underline"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto divide-y divide-[#EFE9DC]">
                      {recentNotifications.length === 0 ? (
                        <div className="p-6 text-center text-xs text-[#8C8479]">
                          No notifications yet.
                        </div>
                      ) : (
                        recentNotifications.map(n => (
                          <div 
                            key={n.id} 
                            onClick={() => {
                              if (n.link) {
                                if (n.link.includes('artist')) onNavigate('artist-appointments');
                                else if (n.link.includes('admin')) onNavigate('admin-appointments');
                                else onNavigate('user-appointments');
                              }
                              setNotifDropdownOpen(false);
                            }}
                            className={`p-3.5 hover:bg-[#F3EDE2] cursor-pointer transition-colors text-left ${!n.read ? 'bg-amber-50/70 border-l-4 border-[#D4AF37]' : ''}`}
                          >
                            <div className="flex items-center justify-between text-xs font-semibold text-[#143823] mb-1">
                              <span>{n.title}</span>
                              <span className="text-[10px] font-normal text-[#8C8479]">
                                {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-xs text-[#5C554E] leading-relaxed line-clamp-2">
                              {n.message}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Dropdown */}
              <div className="relative" ref={userRef}>
                <button
                  onClick={() => setUserDropdownOpen(prev => !prev)}
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-full border border-[#D4AF37]/40 hover:bg-[#EFE9DC] transition-colors"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-[#D4AF37]/50"
                  />
                  <div className="text-left hidden sm:block">
                    <span className="block text-xs font-bold text-[#143823] leading-tight truncate max-w-[100px]">
                      {user.name.split(' ')[0]}
                    </span>
                    <span className="block text-[10px] text-[#8C6D38] font-semibold tracking-wider uppercase">
                      {user.role}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-[#5C554E]" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#FAF7F2] rounded-2xl shadow-2xl border border-[#D4AF37]/30 overflow-hidden z-50">
                    <div className="p-3 border-b border-[#E8DFC8] bg-[#F7F2E7]">
                      <p className="text-xs font-bold text-[#143823]">{user.name}</p>
                      <p className="text-[11px] text-[#6B645C] truncate">{user.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#143823] text-[#F3E5AB]">
                        {user.role} PANEL
                      </span>
                    </div>

                    <div className="p-1 text-sm font-sans">
                      <button
                        onClick={handleDashboardRedirect}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-left rounded-xl hover:bg-[#EFE9DC] text-[#143823] transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-[#D4AF37]" />
                        <span>Dashboard</span>
                      </button>

                      <button
                        onClick={handleProfileRedirect}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-left rounded-xl hover:bg-[#EFE9DC] text-[#143823] transition-colors"
                      >
                        <User className="w-4 h-4 text-[#D4AF37]" />
                        <span>Profile</span>
                      </button>

                      <div className="my-1 border-t border-[#E8DFC8]"></div>

                      <button
                        onClick={() => { logout(); setUserDropdownOpen(false); onNavigate('home'); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-left rounded-xl hover:bg-rose-50 text-rose-600 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Book Appointment CTA */}
              <button
                onClick={() => onOpenBooking()}
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#143823] to-[#1E4D32] text-[#F3E5AB] text-xs font-semibold shadow-md shadow-[#143823]/20 hover:brightness-110 active:scale-95 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                Book Now
              </button>
            </>
          ) : (
            <>
              {/* Not Logged In State */}
              <button
                onClick={() => onNavigate('login')}
                className="text-xs font-semibold text-[#143823] hover:text-[#D4AF37] px-3 py-2 transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => onNavigate('register')}
                className="hidden sm:inline-block text-xs font-semibold text-[#143823] border border-[#143823]/30 px-3.5 py-1.5 rounded-xl hover:bg-[#143823] hover:text-[#F3E5AB] transition-all"
              >
                Register
              </button>
              <button
                onClick={() => onOpenBooking()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#143823] to-[#1E4D32] text-[#F3E5AB] text-xs font-semibold shadow-md shadow-[#143823]/20 hover:brightness-110 active:scale-95 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                Book Appointment
              </button>
            </>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(prev => !prev)}
            className="lg:hidden p-2 rounded-xl text-[#143823] hover:bg-[#EFE9DC] transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E8DFC8] bg-[#FAF7F2] px-4 pt-3 pb-6 space-y-2 animate-slide-down">
          <button
            onClick={() => { onNavigate('home'); setMobileMenuOpen(false); }}
            className="w-full text-left py-2 px-3 text-sm font-semibold text-[#143823] hover:bg-[#EFE9DC] rounded-xl"
          >
            Home
          </button>
          <button
            onClick={() => { onNavigate('artists'); setMobileMenuOpen(false); }}
            className="w-full text-left py-2 px-3 text-sm font-semibold text-[#143823] hover:bg-[#EFE9DC] rounded-xl"
          >
            Find Artists
          </button>
          <button
            onClick={() => { onNavigate('designs'); setMobileMenuOpen(false); }}
            className="w-full text-left py-2 px-3 text-sm font-semibold text-[#143823] hover:bg-[#EFE9DC] rounded-xl"
          >
            Mehndi Designs
          </button>
          <button
            onClick={() => { onNavigate('services'); setMobileMenuOpen(false); }}
            className="w-full text-left py-2 px-3 text-sm font-semibold text-[#143823] hover:bg-[#EFE9DC] rounded-xl"
          >
            Services & Packages
          </button>
          <button
            onClick={() => { onNavigate('about'); setMobileMenuOpen(false); }}
            className="w-full text-left py-2 px-3 text-sm font-semibold text-[#143823] hover:bg-[#EFE9DC] rounded-xl"
          >
            About Us
          </button>
          <button
            onClick={() => { onNavigate('contact'); setMobileMenuOpen(false); }}
            className="w-full text-left py-2 px-3 text-sm font-semibold text-[#143823] hover:bg-[#EFE9DC] rounded-xl"
          >
            Contact
          </button>

          <div className="pt-2 border-t border-[#E8DFC8] space-y-2">
            {isAuthenticated ? (
              <>
                <button
                  onClick={handleDashboardRedirect}
                  className="w-full flex items-center gap-2 py-2 px-3 text-sm font-bold text-[#143823] bg-[#EFE9DC] rounded-xl"
                >
                  <LayoutDashboard className="w-4 h-4 text-[#D4AF37]" />
                  <span>Go to {user.role} Dashboard</span>
                </button>
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); onNavigate('home'); }}
                  className="w-full text-left py-2 px-3 text-sm font-semibold text-rose-600 rounded-xl"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => { onNavigate('login'); setMobileMenuOpen(false); }}
                  className="py-2.5 text-center text-xs font-bold text-[#143823] bg-[#EFE9DC] rounded-xl"
                >
                  Login
                </button>
                <button
                  onClick={() => { onNavigate('register'); setMobileMenuOpen(false); }}
                  className="py-2.5 text-center text-xs font-bold text-[#F3E5AB] bg-[#143823] rounded-xl"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
