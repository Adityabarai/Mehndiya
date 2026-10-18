import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, MapPin, User, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api';

export default function ArtistCalendar() {
  const { artistProfile } = useAuth();
  const artistId = artistProfile?.id || 'art-1';

  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [blockedDates, setBlockedDates] = useState([]);
  const [selectedDateStr, setSelectedDateStr] = useState(() => new Date().toISOString().split('T')[0]);

  useEffect(() => {
    api.getArtistAppointments({ artistId })
      .then(res => {
        if (res.success) setAppointments(res.data);
      })
      .catch(console.error);

    api.getArtistAvailability(artistId)
      .then(res => {
        if (res.success) setBlockedDates(res.blockedDates || []);
      })
      .catch(console.error);
  }, [artistId]);

  // Calendar month math
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Helper to format date string YYYY-MM-DD
  const formatDateKey = (d) => {
    const mm = String(month + 1).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    return `${year}-${mm}-${dd}`;
  };

  const selectedDateAppointments = appointments.filter(a => a.date === selectedDateStr);
  const selectedDateBlocked = blockedDates.find(b => b.date === selectedDateStr);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#143823]">
          Artist Schedule Calendar
        </h1>
        <p className="text-xs sm:text-sm text-[#6B645C]">
          Inspect your daily ceremony schedule with real-time status dots and blocked leave indicators.
        </p>
      </div>

      {/* Status Legend Matching Prompt Item 15 */}
      <div className="flex flex-wrap items-center gap-4 text-xs font-sans p-4 rounded-2xl bg-white border border-[#E8DFC8]">
        <span className="font-bold text-[#143823]">Status Indicators:</span>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-amber-500"></span>
          <span>Pending</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
          <span>Confirmed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-blue-500"></span>
          <span>Completed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-rose-500"></span>
          <span>Blocked Leave</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Calendar Grid (lg:col-span-7) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-[#E8DFC8] shadow-sm space-y-4">
          {/* Header Month / Navigation */}
          <div className="flex items-center justify-between pb-4 border-b border-[#E8DFC8]">
            <h2 className="font-serif text-xl font-bold text-[#143823]">
              {monthNames[month]} {year}
            </h2>
            <div className="flex items-center gap-1.5">
              <button
                onClick={prevMonth}
                className="p-2 rounded-xl hover:bg-[#FAF7F2] text-[#143823]"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextMonth}
                className="p-2 rounded-xl hover:bg-[#FAF7F2] text-[#143823]"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Weekday Names */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-[#8C8479] uppercase">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1.5">
            {/* Empty cells before first day */}
            {[...Array(firstDayOfMonth)].map((_, i) => (
              <div key={`empty-${i}`} className="h-16 sm:h-20 rounded-xl bg-stone-50/50" />
            ))}

            {/* Days of current month */}
            {[...Array(daysInMonth)].map((_, i) => {
              const day = i + 1;
              const dateKey = formatDateKey(day);
              const dayAppts = appointments.filter(a => a.date === dateKey);
              const isBlocked = blockedDates.some(b => b.date === dateKey);
              const isSelected = selectedDateStr === dateKey;

              const hasPending = dayAppts.some(a => a.appointmentStatus === 'PENDING');
              const hasConfirmed = dayAppts.some(a => a.appointmentStatus === 'CONFIRMED');
              const hasCompleted = dayAppts.some(a => a.appointmentStatus === 'COMPLETED');

              return (
                <div
                  key={day}
                  onClick={() => setSelectedDateStr(dateKey)}
                  className={`h-16 sm:h-20 p-1.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#143823] bg-[#143823]/5 ring-2 ring-[#D4AF37]/50 shadow-sm'
                      : 'border-[#E8DFC8] bg-white hover:border-[#D4AF37] hover:bg-[#FAF7F2]'
                  }`}
                >
                  <span className={`text-xs font-bold ${isSelected ? 'text-[#143823]' : 'text-[#5C554E]'}`}>
                    {day}
                  </span>

                  {/* Status Dots */}
                  <div className="flex flex-wrap items-center gap-1 mt-auto">
                    {hasPending && <span className="w-2 h-2 rounded-full bg-amber-500" title="Pending" />}
                    {hasConfirmed && <span className="w-2 h-2 rounded-full bg-emerald-500" title="Confirmed" />}
                    {hasCompleted && <span className="w-2 h-2 rounded-full bg-blue-500" title="Completed" />}
                    {isBlocked && <span className="w-2 h-2 rounded-full bg-rose-500" title="Blocked" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Date Details Panel (lg:col-span-5) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-[#E8DFC8] shadow-sm space-y-4">
          <div className="pb-4 border-b border-[#E8DFC8]">
            <span className="text-[10px] uppercase font-bold text-[#8C8479]">Day Schedule</span>
            <h3 className="font-serif text-xl font-bold text-[#143823] mt-0.5">
              {new Date(selectedDateStr + 'T12:00:00').toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </h3>
          </div>

          {selectedDateBlocked && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
              <strong className="block font-bold">⛔ Date Blocked (Leave)</strong>
              <span>Reason: {selectedDateBlocked.reason || 'Personal Commitment'}</span>
            </div>
          )}

          {selectedDateAppointments.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#7A7369]">
              <CalendarIcon className="w-8 h-8 text-stone-300 mx-auto mb-2" />
              <p>No appointments booked on this date.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedDateAppointments.map(apt => (
                <div
                  key={apt.id}
                  className={`p-4 rounded-2xl border text-xs font-sans space-y-2 ${
                    apt.appointmentStatus === 'CONFIRMED'
                      ? 'border-emerald-300 bg-emerald-50/50'
                      : apt.appointmentStatus === 'PENDING'
                      ? 'border-amber-300 bg-amber-50/50'
                      : 'border-blue-300 bg-blue-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs font-serif text-[#143823]">{apt.serviceName}</span>
                    <span className="font-bold uppercase text-[10px] px-2 py-0.5 rounded-full bg-white shadow-xs">
                      {apt.appointmentStatus}
                    </span>
                  </div>

                  <div className="space-y-1 text-[#5C554E]">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>{apt.timeSlot}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>{apt.userName} ({apt.userPhone})</span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <MapPin className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                      <span className="truncate">{apt.address}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-black/5 flex justify-between font-bold text-[#143823]">
                    <span>Amount: ₹{apt.totalAmount?.toLocaleString('en-IN')}</span>
                    <span className="font-mono text-[10px] text-[#8C6D38]">{apt.bookingId}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
