import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Calendar, 
  Clock, 
  Layers, 
  Sparkles, 
  Star, 
  DollarSign, 
  User, 
  Bell, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export default function ArtistLayout({ currentView, onNavigate, children }) {
  const { user, artistProfile, logout, unreadNotifications } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'artist-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'artist-appointments', label: 'Appointments', icon: Calendar },
    { id: 'artist-calendar', label: 'Calendar', icon: Calendar },
    { id: 'artist-availability', label: 'Availability', icon: Clock },
    { id: 'artist-services', label: 'My Services', icon: Layers },
    { id: 'artist-designs', label: 'My Designs', icon: Sparkles },
    { id: 'artist-reviews', label: 'Reviews', icon: Star },
    { id: 'artist-earnings', label: 'Earnings', icon: DollarSign },
    { id: 'artist-profile', label: 'Profile', icon: User },
    { id: 'artist-notifications', label: 'Notifications', icon: Bell, badge: unreadNotifications }
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex">
      {/* Desktop Artist Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#143823] text-[#FAF7F2] p-5 justify-between shrink-0 shadow-xl border-r border-[#D4AF37]/30">
        <div className="space-y-6">
          {/* Artist Card */}
          <div className="flex items-center gap-3 pb-5 border-b border-white/10">
            <div className="relative">
              <img
                src={artistProfile?.profileImage || user?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80'}
                alt={user?.name}
                className="w-11 h-11 rounded-2xl object-cover ring-2 ring-[#D4AF37]"
              />
              {artistProfile?.verified && (
                <div className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-[#D4AF37] text-[#143823]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
            <div className="min-w-0">
              <h3 className="font-serif font-bold text-sm text-[#F3E5AB] truncate">
                {artistProfile?.name || user?.name}
              </h3>
              <p className="text-[10px] text-emerald-200/80 uppercase tracking-wider font-semibold">
                Artist Panel
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {menuItems.map(item => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#D4AF37] text-[#143823] font-bold shadow-md shadow-black/20'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#143823]' : 'text-[#D4AF37]'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-white/10 space-y-2">
          <button
            onClick={() => onNavigate('home')}
            className="w-full text-left px-3.5 py-2 text-xs text-white/70 hover:text-white flex items-center justify-between"
          >
            <span>Public Website</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#D4AF37]" />
          </button>
          <button
            onClick={() => { logout(); onNavigate('home'); }}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-300 hover:bg-white/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <div className="lg:hidden bg-[#143823] text-white p-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-lg text-[#F3E5AB]">Artist Panel</span>
          </div>
          <button
            onClick={() => setMobileSidebarOpen(prev => !prev)}
            className="p-2 rounded-xl text-white hover:bg-white/10"
          >
            {mobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Sidebar */}
        {mobileSidebarOpen && (
          <div className="lg:hidden bg-[#143823] text-white p-4 space-y-1 border-b border-white/10">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => { onNavigate(item.id); setMobileSidebarOpen(false); }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                  currentView === item.id ? 'bg-[#D4AF37] text-[#143823] font-bold' : 'text-white/80'
                }`}
              >
                <span>{item.label}</span>
                {item.badge > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px]">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
            <button
              onClick={() => { logout(); onNavigate('home'); }}
              className="w-full text-left px-3.5 py-2 text-xs text-rose-300 font-bold"
            >
              Logout
            </button>
          </div>
        )}

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
