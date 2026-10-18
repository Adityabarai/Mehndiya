import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { DollarSign, TrendingUp, Calendar, CheckCircle2, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { api } from '../../services/api';

export default function ArtistEarnings() {
  const { artistProfile } = useAuth();
  const artistId = artistProfile?.id || 'art-1';
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    api.getArtistAppointments({ artistId })
      .then(res => {
        if (res.success) setAppointments(res.data);
      })
      .catch(console.error);
  }, [artistId]);

  const paidAppts = appointments.filter(a => a.appointmentStatus === 'COMPLETED' || a.appointmentStatus === 'CONFIRMED');
  const totalEarned = paidAppts.reduce((sum, a) => sum + (Number(a.totalAmount) || 0), 0);
  const pendingPayout = appointments.filter(a => a.appointmentStatus === 'PENDING').reduce((sum, a) => sum + (Number(a.totalAmount) || 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#143823]">
          Earnings & Payout Ledger
        </h1>
        <p className="text-xs sm:text-sm text-[#6B645C]">
          Summary of confirmed ceremony revenues, platform settlements, and recent invoices.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-3xl border border-[#E8DFC8] shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-[#8C8479]">Total Revenue</span>
          <p className="font-serif text-3xl font-black text-[#143823] mt-2">
            ₹{totalEarned.toLocaleString('en-IN')}
          </p>
          <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1 mt-2">
            <ArrowUpRight className="w-3.5 h-3.5" />
            +18% from last month
          </span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#E8DFC8] shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-[#8C8479]">Pending Settlement</span>
          <p className="font-serif text-3xl font-black text-amber-700 mt-2">
            ₹{pendingPayout.toLocaleString('en-IN')}
          </p>
          <span className="text-[11px] text-[#7A7369] mt-2 block">
            Awaiting ceremony completion
          </span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#E8DFC8] shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-[#8C8479]">Completed Bookings</span>
          <p className="font-serif text-3xl font-black text-blue-800 mt-2">
            {paidAppts.length}
          </p>
          <span className="text-[11px] text-blue-700 font-bold mt-2 block">
            Average ticket: ₹{paidAppts.length ? Math.round(totalEarned / paidAppts.length).toLocaleString('en-IN') : 0}
          </span>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-3xl p-6 border border-[#E8DFC8] shadow-sm space-y-4">
        <h3 className="font-serif text-lg font-bold text-[#143823]">
          Recent Booking Transactions
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-[#E8DFC8] text-[#8C8479] uppercase text-[10px] font-bold">
                <th className="py-3 px-2">Booking ID</th>
                <th className="py-3 px-2">Client</th>
                <th className="py-3 px-2">Package</th>
                <th className="py-3 px-2">Date</th>
                <th className="py-3 px-2">Amount</th>
                <th className="py-3 px-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFE9DC]">
              {appointments.map(apt => (
                <tr key={apt.id} className="hover:bg-[#FAF7F2]">
                  <td className="py-3 px-2 font-mono font-bold text-[#8C6D38]">{apt.bookingId}</td>
                  <td className="py-3 px-2 font-bold text-[#143823]">{apt.userName}</td>
                  <td className="py-3 px-2 text-[#5C554E]">{apt.serviceName}</td>
                  <td className="py-3 px-2 text-[#7A7369]">{apt.date}</td>
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
