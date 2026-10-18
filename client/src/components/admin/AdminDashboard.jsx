import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Palette, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Star, 
  ShieldCheck, 
  AlertCircle,
  Clock,
  ArrowUpRight,
  Eye,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { api } from '../../services/api';

export default function AdminDashboard({ onNavigate }) {
  const [stats, setStats] = useState(null);
  const [monthlyTrends, setMonthlyTrends] = useState([]);
  const [popularServices, setPopularServices] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAdminDashboard()
      .then(res => {
        if (res.success) {
          setStats(res.stats);
          setMonthlyTrends(res.monthlyTrends || []);
          setPopularServices(res.popularServices || []);
          setTopArtists(res.topArtists || []);
          setRecentBookings(res.recentBookings || []);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      {/* Admin Welcome Banner */}
      <div className="bg-gradient-to-r from-[#0F2317] via-[#143823] to-[#1C4B30] text-[#FAF7F2] p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-[#D4AF37]/40">
        <div>
          <span className="text-[#D4AF37] font-bold text-xs uppercase tracking-wider block mb-1">
            Super Administrator Overview
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#F3E5AB]">
            Mehndi Platform Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/80 mt-1 max-w-xl font-sans">
            Real-time appointment throughput, revenue settlements, and marketplace health metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('admin-artists')}
            className="px-4 py-2.5 rounded-xl border border-white/30 text-white hover:bg-white/10 text-xs font-bold transition-colors"
          >
            Review Artists ({stats?.pendingArtists || 1})
          </button>
          <button
            onClick={() => onNavigate('admin-appointments')}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#DFB96C] text-[#0F2317] font-bold text-xs shadow-md hover:brightness-110 active:scale-95 transition-all"
          >
            Manage Appointments
          </button>
        </div>
      </div>

      {/* Primary KPI Grid (Prompt Item 21) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E8DFC8] shadow-sm">
          <span className="text-[11px] font-bold uppercase text-[#8C8479] block">Total Users</span>
          <p className="font-serif text-3xl font-black text-[#143823] mt-1">{stats?.totalUsers || 10}</p>
          <span className="text-[10px] text-emerald-700 font-bold mt-1 block">+12 this week</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8DFC8] shadow-sm">
          <span className="text-[11px] font-bold uppercase text-[#8C8479] block">Total Artists</span>
          <p className="font-serif text-3xl font-black text-[#143823] mt-1">{stats?.totalArtists || 5}</p>
          <span className="text-[10px] text-amber-700 font-bold mt-1 block">
            {stats?.verifiedArtists || 4} Verified • {stats?.pendingArtists || 1} Pending
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8DFC8] shadow-sm">
          <span className="text-[11px] font-bold uppercase text-[#8C8479] block">Total Appointments</span>
          <p className="font-serif text-3xl font-black text-[#143823] mt-1">{stats?.totalAppointments || 5}</p>
          <span className="text-[10px] text-[#8C6D38] font-bold mt-1 block">
            {stats?.confirmedAppointments || 2} Confirmed • {stats?.pendingAppointments || 1} Pending
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8DFC8] shadow-sm">
          <span className="text-[11px] font-bold uppercase text-[#8C8479] block">Total Revenue</span>
          <p className="font-serif text-2xl sm:text-3xl font-black text-[#143823] mt-1">
            ₹{(stats?.totalRevenue || 11100).toLocaleString('en-IN')}
          </p>
          <span className="text-[10px] text-emerald-700 font-bold mt-1 block">Settled via Platform</span>
        </div>
      </div>

      {/* Appointment Status Breakdown Cards (Prompt Item 21) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900">
          <span className="text-[10px] uppercase font-bold text-amber-700 block">Pending Requests</span>
          <p className="font-serif text-2xl font-black mt-1">{stats?.pendingAppointments || 1}</p>
          <span className="text-[10px] text-amber-800">Awaiting artist review</span>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900">
          <span className="text-[10px] uppercase font-bold text-emerald-700 block">Confirmed</span>
          <p className="font-serif text-2xl font-black mt-1">{stats?.confirmedAppointments || 2}</p>
          <span className="text-[10px] text-emerald-800">Scheduled ceremony slots</span>
        </div>

        <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900">
          <span className="text-[10px] uppercase font-bold text-blue-700 block">Completed</span>
          <p className="font-serif text-2xl font-black mt-1">{stats?.completedAppointments || 1}</p>
          <span className="text-[10px] text-blue-800">Successfully adorned</span>
        </div>

        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900">
          <span className="text-[10px] uppercase font-bold text-rose-700 block">Cancelled / Rejected</span>
          <p className="font-serif text-2xl font-black mt-1">
            {(stats?.cancelledAppointments || 1) + (stats?.rejectedAppointments || 1)}
          </p>
          <span className="text-[10px] text-rose-800">Handled gracefully</span>
        </div>
      </div>

      {/* Visual Analytics Charts (Prompt Item 21) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Monthly Revenue & Appointments Trend Bar Chart */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-[#E8DFC8] shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#E8DFC8]">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#143823]">
                Revenue & Appointments by Month
              </h3>
              <p className="text-xs text-[#7A7369]">Performance trajectory across wedding seasons</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#143823]" />
                <span>Revenue (₹)</span>
              </div>
            </div>
          </div>

          {/* Bar Chart Simulation */}
          <div className="space-y-4 pt-2 font-sans">
            {monthlyTrends.map(item => {
              const maxRev = 250000;
              const pct = Math.min(100, Math.round((item.revenue / maxRev) * 100));
              return (
                <div key={item.month} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="font-bold text-[#143823]">{item.month}</span>
                    <span className="font-mono text-[#8C6D38] font-bold">
                      ₹{item.revenue.toLocaleString('en-IN')} • {item.appointments} Bookings
                    </span>
                  </div>
                  <div className="h-4 rounded-full bg-stone-100 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#143823] via-[#1C4B30] to-[#D4AF37] rounded-full transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Popular Services & Top Artists */}
        <div className="lg:col-span-5 space-y-6">
          {/* Most Popular Services */}
          <div className="bg-white rounded-3xl p-6 border border-[#E8DFC8] shadow-sm space-y-4">
            <h3 className="font-serif text-base font-bold text-[#143823]">
              Most Popular Services
            </h3>
            <div className="space-y-2.5 text-xs font-sans">
              {popularServices.map((service, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFC8]">
                  <span className="font-bold text-[#143823] truncate max-w-[200px]">{service.name}</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#143823] text-[#F3E5AB] font-bold text-[10px]">
                    {service.bookings} Bookings
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Rated Artists */}
          <div className="bg-white rounded-3xl p-6 border border-[#E8DFC8] shadow-sm space-y-4">
            <h3 className="font-serif text-base font-bold text-[#143823]">
              Top Performing Artists
            </h3>
            <div className="space-y-3">
              {topArtists.slice(0, 3).map(art => (
                <div key={art.id} className="flex items-center justify-between text-xs font-sans">
                  <div className="flex items-center gap-2.5">
                    <img src={art.image} alt={art.name} className="w-8 h-8 rounded-full object-cover ring-1 ring-[#D4AF37]" />
                    <div>
                      <strong className="text-[#143823] block">{art.name}</strong>
                      <span className="text-[10px] text-[#7A7369]">{art.location} • ★ {art.rating}</span>
                    </div>
                  </div>
                  <span className="font-serif font-black text-[#143823]">
                    ₹{art.earnings.toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings Feed */}
      <div className="bg-white rounded-3xl p-6 border border-[#E8DFC8] shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E8DFC8]">
          <h3 className="font-serif text-lg font-bold text-[#143823]">
            Recent Marketplace Bookings
          </h3>
          <button
            onClick={() => onNavigate('admin-appointments')}
            className="text-xs font-bold text-[#8C6D38] hover:underline"
          >
            View All ({stats?.totalAppointments || 5})
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-[#E8DFC8] text-[#8C8479] uppercase text-[10px] font-bold">
                <th className="py-2.5 px-2">Booking ID</th>
                <th className="py-2.5 px-2">Customer</th>
                <th className="py-2.5 px-2">Artist</th>
                <th className="py-2.5 px-2">Service</th>
                <th className="py-2.5 px-2">Date</th>
                <th className="py-2.5 px-2">Total</th>
                <th className="py-2.5 px-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFE9DC]">
              {recentBookings.map(apt => (
                <tr key={apt.id} className="hover:bg-[#FAF7F2]">
                  <td className="py-3 px-2 font-mono font-bold text-[#8C6D38]">{apt.bookingId}</td>
                  <td className="py-3 px-2 font-bold text-[#143823]">{apt.userName}</td>
                  <td className="py-3 px-2 text-[#5C554E]">{apt.artistName}</td>
                  <td className="py-3 px-2 text-[#7A7369]">{apt.serviceName}</td>
                  <td className="py-3 px-2">{apt.date}</td>
                  <td className="py-3 px-2 font-bold text-[#143823]">₹{apt.totalAmount?.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-stone-100 text-stone-700">
                      {apt.appointmentStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
