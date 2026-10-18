import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Clock, Calendar, Plus, Trash2, Check, AlertCircle, Save } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export default function ArtistAvailability() {
  const { artistProfile } = useAuth();
  const { toastSuccess, toastError } = useToast();
  const artistId = artistProfile?.id || 'art-1';

  const [workingHours, setWorkingHours] = useState({
    monday: { open: '09:00 AM', close: '07:00 PM', available: true },
    tuesday: { open: '09:00 AM', close: '07:00 PM', available: true },
    wednesday: { open: '09:00 AM', close: '07:00 PM', available: false },
    thursday: { open: '09:00 AM', close: '07:00 PM', available: true },
    friday: { open: '09:00 AM', close: '08:00 PM', available: true },
    saturday: { open: '08:00 AM', close: '09:00 PM', available: true },
    sunday: { open: '08:00 AM', close: '09:00 PM', available: true }
  });

  const [blockedDates, setBlockedDates] = useState([]);
  const [newBlockDate, setNewBlockDate] = useState('');
  const [newBlockReason, setNewBlockReason] = useState('');
  const [savingHours, setSavingHours] = useState(false);

  useEffect(() => {
    api.getArtistAvailability(artistId)
      .then(res => {
        if (res.success) {
          if (res.workingHours) setWorkingHours(res.workingHours);
          if (res.blockedDates) setBlockedDates(res.blockedDates);
        }
      })
      .catch(console.error);
  }, [artistId]);

  const handleDayToggle = (day) => {
    setWorkingHours(prev => ({
      ...prev,
      [day]: { ...prev[day], available: !prev[day].available }
    }));
  };

  const handleTimeChange = (day, field, val) => {
    setWorkingHours(prev => ({
      ...prev,
      [day]: { ...prev[day], [field]: val }
    }));
  };

  const handleSaveWorkingHours = async () => {
    setSavingHours(true);
    try {
      const res = await api.updateArtistAvailability(artistId, { workingHours });
      if (res.success) {
        toastSuccess('Working hours updated successfully!');
      }
    } catch (err) {
      toastError(err.message || 'Failed to update schedule');
    } finally {
      setSavingHours(false);
    }
  };

  const handleAddBlockedDate = async (e) => {
    e.preventDefault();
    if (!newBlockDate) return;
    try {
      const res = await api.blockArtistDate(artistId, { date: newBlockDate, reason: newBlockReason || 'Personal Event' });
      if (res.success) {
        toastSuccess(`Date ${newBlockDate} blocked`);
        setBlockedDates(res.blockedDates);
        setNewBlockDate('');
        setNewBlockReason('');
      }
    } catch (err) {
      toastError(err.message || 'Failed to block date');
    }
  };

  const handleUnblockDate = async (date) => {
    try {
      const res = await api.unblockArtistDate(artistId, date);
      if (res.success) {
        toastSuccess(`Date ${date} unblocked`);
        setBlockedDates(res.blockedDates);
      }
    } catch (err) {
      toastError(err.message || 'Failed to unblock');
    }
  };

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#143823]">
          Artist Availability & Blocked Leaves
        </h1>
        <p className="text-xs sm:text-sm text-[#6B645C]">
          Configure your weekly operating hours and block specific dates to prevent booking conflicts automatically.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Weekly Working Hours (Prompt Item 16) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-[#E8DFC8] shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#E8DFC8]">
            <div>
              <h2 className="font-serif text-lg font-bold text-[#143823] flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#D4AF37]" />
                <span>Weekly Schedule</span>
              </h2>
              <p className="text-xs text-[#7A7369]">Set operating hours or mark specific days as unavailable.</p>
            </div>
            <button
              onClick={handleSaveWorkingHours}
              disabled={savingHours}
              className="px-4 py-2 rounded-xl bg-[#143823] text-[#F3E5AB] font-bold text-xs shadow-md hover:bg-[#1C4B30] flex items-center gap-1.5 transition-all"
            >
              <Save className="w-4 h-4 text-[#D4AF37]" />
              <span>{savingHours ? 'Saving...' : 'Save Schedule'}</span>
            </button>
          </div>

          <div className="space-y-3 font-sans">
            {days.map(day => {
              const schedule = workingHours[day] || { open: '09:00 AM', close: '07:00 PM', available: true };
              return (
                <div
                  key={day}
                  className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                    schedule.available
                      ? 'border-[#E8DFC8] bg-white'
                      : 'border-stone-200 bg-stone-50/70 text-stone-400'
                  }`}
                >
                  <div className="flex items-center gap-3 w-36">
                    <input
                      type="checkbox"
                      id={`day-${day}`}
                      checked={schedule.available}
                      onChange={() => handleDayToggle(day)}
                      className="rounded text-[#143823] focus:ring-[#D4AF37] w-4 h-4"
                    />
                    <label htmlFor={`day-${day}`} className={`font-bold capitalize text-sm cursor-pointer ${schedule.available ? 'text-[#143823]' : 'text-stone-400'}`}>
                      {day}
                    </label>
                  </div>

                  {schedule.available ? (
                    <div className="flex items-center gap-2 text-xs">
                      <input
                        type="text"
                        value={schedule.open}
                        onChange={e => handleTimeChange(day, 'open', e.target.value)}
                        placeholder="09:00 AM"
                        className="w-24 px-2.5 py-1.5 rounded-lg border border-[#E8DFC8] bg-[#FAF7F2] text-center font-bold text-[#143823]"
                      />
                      <span className="text-[#8C8479]">to</span>
                      <input
                        type="text"
                        value={schedule.close}
                        onChange={e => handleTimeChange(day, 'close', e.target.value)}
                        placeholder="07:00 PM"
                        className="w-24 px-2.5 py-1.5 rounded-lg border border-[#E8DFC8] bg-[#FAF7F2] text-center font-bold text-[#143823]"
                      />
                    </div>
                  ) : (
                    <span className="text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
                      Unavailable (Weekly Off)
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Blocked Dates Manager (Prompt Item 16) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Add Block Date Card */}
          <div className="bg-white rounded-3xl p-6 border border-[#E8DFC8] shadow-sm space-y-4">
            <h2 className="font-serif text-lg font-bold text-[#143823] flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#D4AF37]" />
              <span>Block a Specific Date</span>
            </h2>
            <p className="text-xs text-[#7A7369]">
              Block individual dates for personal commitments, workshops, or travel leaves.
            </p>

            <form onSubmit={handleAddBlockedDate} className="space-y-3 font-sans text-xs">
              <div>
                <label className="block text-[11px] font-bold text-[#143823] uppercase mb-1">
                  Select Date *
                </label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={newBlockDate}
                  onChange={e => setNewBlockDate(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl border border-[#E8DFC8] bg-[#FAF7F2] text-sm text-[#143823]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#143823] uppercase mb-1">
                  Reason for Unavailability *
                </label>
                <input
                  type="text"
                  value={newBlockReason}
                  onChange={e => setNewBlockReason(e.target.value)}
                  placeholder="e.g. Personal Event / Destination Travel"
                  required
                  className="w-full p-2.5 rounded-xl border border-[#E8DFC8] bg-[#FAF7F2] text-sm text-[#143823]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#143823] text-[#F3E5AB] font-bold text-xs shadow-md hover:bg-[#1C4B30] flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4 text-[#D4AF37]" />
                <span>Mark Date as Unavailable</span>
              </button>
            </form>
          </div>

          {/* Currently Blocked Dates List */}
          <div className="bg-white rounded-3xl p-6 border border-[#E8DFC8] shadow-sm space-y-3">
            <h3 className="font-serif text-base font-bold text-[#143823]">
              Currently Blocked Dates ({blockedDates.length})
            </h3>

            {blockedDates.length === 0 ? (
              <p className="text-xs text-[#8C8479]">No dates currently blocked.</p>
            ) : (
              <div className="space-y-2">
                {blockedDates.map(b => (
                  <div
                    key={b.date}
                    className="p-3 rounded-xl border border-rose-200 bg-rose-50/50 flex items-center justify-between text-xs font-sans"
                  >
                    <div>
                      <strong className="text-rose-900 block font-bold">{b.date}</strong>
                      <span className="text-[11px] text-rose-700">{b.reason || 'Personal Leave'}</span>
                    </div>

                    <button
                      onClick={() => handleUnblockDate(b.date)}
                      className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-100 transition-colors"
                      title="Unblock this date"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
