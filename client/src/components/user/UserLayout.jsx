import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Search, 
  Sparkles, 
  Calendar, 
  Heart, 
  User, 
  Bell, 
  LogOut, 
  Menu, 
  X,
  Package,
  ChevronRight
} from 'lucide-react';

export default function UserLayout({ currentView, onNavigate, children }) {
  const { user, logout, unreadNotifications } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'user-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'user-artists', label: 'Find Artists', icon: Search },
    { id: 'user-designs', label: 'Browse Designs', icon: Sparkles },
    { id: 'user-services', label: 'Services', icon: Package },
    { id: 'user-appointments', label: 'My Appointments', icon: Calendar },
    { id: 'user-favorites', label: 'Favorites', icon: Heart },
    { id: 'user-profile', label: 'Profile', icon: User },
    { id: 'user-notifications', label: 'Notifications', icon: Bell, badge: unreadNotifications }
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex">
      {/* Desktop Customer Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-[#E8DFC8] p-5 justify-between shrink-0 shadow-sm">
        <div className="space-y-6">
          {/* Customer Badge */}
          <div className="flex items-center gap-3 pb-4 border-b border-[#E8DFC8]">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80'}
              alt={user?.name}
              className="w-11 h-11 rounded-2xl object-cover ring-2 ring-[#D4AF37]/50"
            />
            <div className="min-w-0">
              <h3 className="font-serif font-bold text-sm text-[#143823] truncate">
                {user?.name}
              </h3>
              <span className="inline-block px-2 py-0.5 rounded-full bg-[#143823]/10 text-[10px] font-bold text-[#143823] uppercase">
                Customer Panel
              </span>
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
                      ? 'bg-[#143823] text-[#F3E5AB] shadow-md shadow-[#143823]/20 font-bold'
                      : 'text-[#5C554E] hover:bg-[#FAF7F2] hover:text-[#143823]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#D4AF37]' : 'text-[#8C8479]'}`} />
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
        <div className="pt-4 border-t border-[#E8DFC8] space-y-2">
          <button
            onClick={() => onNavigate('home')}
            className="w-full text-left px-3.5 py-2 text-xs text-[#5C554E] hover:text-[#143823] flex items-center justify-between"
          >
            <span>Back to Public Website</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#D4AF37]" />
          </button>
          <button
            onClick={() => { logout(); onNavigate('home'); }}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Customer Top Bar */}
        <div className="lg:hidden bg-white border-b border-[#E8DFC8] p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-lg text-[#143823]">Customer Panel</span>
          </div>
          <button
            onClick={() => setMobileSidebarOpen(prev => !prev)}
            className="p-2 rounded-xl text-[#143823] hover:bg-[#FAF7F2]"
          >
            {mobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Sidebar Dropdown */}
        {mobileSidebarOpen && (
          <div className="lg:hidden bg-white border-b border-[#E8DFC8] p-4 space-y-1">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => { onNavigate(item.id); setMobileSidebarOpen(false); }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                  currentView === item.id ? 'bg-[#143823] text-[#F3E5AB]' : 'text-[#5C554E]'
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
              className="w-full text-left px-3.5 py-2.5 text-xs text-rose-600 font-bold"
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
