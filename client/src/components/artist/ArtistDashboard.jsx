import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Star, 
  DollarSign, 
  Check, 
  X, 
  Eye, 
  ShieldCheck, 
  AlertCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { api } from '../../services/api';
import EmptyState from '../common/EmptyState';
import ConfirmModal from '../common/ConfirmModal';
import Modal from '../common/Modal';
import { useToast } from '../../context/ToastContext';

export default function ArtistDashboard({ onNavigate }) {
  const { user, artistProfile } = useAuth();
  const { toastSuccess, toastError } = useToast();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [rejectModalApt, setRejectModalApt] = useState(null);

  const artistId = artistProfile?.id || 'art-1';

  const fetchAppointments = () => {
    setLoading(true);
    api.getArtistAppointments({ artistId })
      .then(res => {
        if (res.success) setAppointments(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAppointments();
  }, [artistId]);

  // Derived Metrics matching Prompt Item 13
  const todayStr = new Date().toISOString().split('T')[0];
  const todaysCount = appointments.filter(a => a.date === todayStr && a.appointmentStatus === 'CONFIRMED').length;
  const pendingRequests = appointments.filter(a => a.appointmentStatus === 'PENDING');
  const confirmedCount = appointments.filter(a => a.appointmentStatus === 'CONFIRMED').length;
  const completedCount = appointments.filter(a => a.appointmentStatus === 'COMPLETED').length;
  
  const totalEarnings = appointments
    .filter(a => a.appointmentStatus === 'COMPLETED' || a.appointmentStatus === 'CONFIRMED')
    .reduce((sum, item) => sum + (Number(item.totalAmount) || 0), 0);

  const rating = artistProfile?.rating || 4.9;

  // Actions
  const handleAccept = async (aptId) => {
    try {
      const res = await api.acceptAppointment(aptId);
      if (res.success) {
        toastSuccess('Appointment accepted and confirmed! Customer notified.');
        fetchAppointments();
      }
    } catch (err) {
      toastError(err.message || 'Failed to accept');
    }
  };

  const handleRejectConfirm = async (reason) => {
    if (!rejectModalApt) return;
    try {
      const res = await api.rejectAppointment(rejectModalApt.id, { rejectionReason: reason });
      if (res.success) {
        toastSuccess('Appointment request rejected. Customer notified.');
        fetchAppointments();
      }
    } catch (err) {
      toastError(err.message || 'Failed to reject');
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#143823] to-[#1C4B30] text-[#FAF7F2] p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-[#D4AF37]/30">
        <div>
          <span className="text-[#D4AF37] font-bold text-xs uppercase tracking-wider block mb-1">
            Artist Control Portal
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#F3E5AB]">
            Welcome, {artistProfile?.name || user?.name || 'Artist'}!
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/80 mt-1 max-w-xl font-sans">
            Review incoming bridal requests, manage your calendar availability, and monitor client earnings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('artist-availability')}
            className="px-4 py-2.5 rounded-xl border border-white/30 text-xs font-semibold text-white hover:bg-white/10 transition-colors"
          >
            Manage Availability
          </button>
          <button
            onClick={() => onNavigate('artist-appointments')}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#DFB96C] text-[#143823] text-xs font-bold shadow-md hover:brightness-110 active:scale-95 transition-all"
          >
            View All Appointments
          </button>
        </div>
      </div>

      {/* Metric Cards (Prompt Item 13) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-[#E8DFC8] shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C8479] block">
            Today's Appts
          </span>
          <p className="font-serif text-2xl font-black text-[#143823] mt-1">{todaysCount}</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-300 bg-amber-50/40 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">
            Pending Requests
          </span>
          <p className="font-serif text-2xl font-black text-amber-800 mt-1">{pendingRequests.length}</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E8DFC8] shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">
            Confirmed
          </span>
          <p className="font-serif text-2xl font-black text-emerald-800 mt-1">{confirmedCount}</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E8DFC8] shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block">
            Completed
          </span>
          <p className="font-serif text-2xl font-black text-blue-800 mt-1">{completedCount}</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E8DFC8] shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C6D38] block">
            Total Earnings
          </span>
          <p className="font-serif text-xl font-black text-[#143823] mt-1">₹{totalEarnings.toLocaleString('en-IN')}</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E8DFC8] shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C8479] block">
            Rating
          </span>
          <p className="font-serif text-xl font-black text-amber-600 mt-1 flex items-center gap-1">
            <span>{rating}</span>
            <Star className="w-4 h-4 fill-current text-amber-500" />
          </p>
        </div>
      </div>

      {/* Pending Appointment Requests Section (Prompt Item 13) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold text-[#143823] flex items-center gap-2">
            <span>Pending Appointment Requests</span>
            {pendingRequests.length > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold border border-amber-300">
                {pendingRequests.length} action required
              </span>
            )}
          </h2>
        </div>

        {pendingRequests.length === 0 ? (
          <EmptyState
            title="No pending requests right now"
            description="You're all caught up! New client booking requests will appear here for your review and acceptance."
            icon={Calendar}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {pendingRequests.map(apt => (
              <div
                key={apt.id}
                className="bg-white rounded-3xl p-6 border-2 border-amber-300/80 shadow-md flex flex-col justify-between space-y-4 relative"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] font-bold text-[#8C6D38] bg-[#FAF7F2] px-2 py-0.5 rounded-md border border-[#E8DFC8]">
                      {apt.bookingId}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold uppercase">
                      Action Required
                    </span>
                  </div>

                  {/* Customer details matching prompt item 13 */}
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#143823]">
                      {apt.serviceName}
                    </h3>
                    <p className="text-xs font-semibold text-[#143823] mt-0.5">
                      Customer: {apt.userName}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-[#5C554E] font-sans">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>{apt.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>{apt.timeSlot}</span>
                    </div>
                    <div className="flex items-center gap-1.5 col-span-2 truncate">
                      <MapPin className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                      <span className="truncate">{apt.address || apt.location}</span>
                    </div>
                  </div>

                  {apt.specialRequirements && (
                    <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFC8] text-[11px] text-[#5C554E]">
                      <strong>Note:</strong> {apt.specialRequirements}
                    </div>
                  )}
                </div>

                {/* Amount & Actions matching Prompt item 13 */}
                <div className="pt-3 border-t border-[#EFE9DC] flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-[#8C8479] uppercase font-bold block">Amount</span>
                    <span className="font-serif text-lg font-black text-[#143823]">
                      ₹{apt.totalAmount?.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedAppointment(apt)}
                      className="px-3 py-2 rounded-xl border border-[#D4AF37]/50 text-xs font-semibold text-[#143823] hover:bg-[#FAF7F2] transition-colors"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => setRejectModalApt(apt)}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleAccept(apt.id)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-[#F3E5AB] bg-[#143823] hover:bg-[#1C4B30] shadow-md shadow-[#143823]/20 transition-all flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Accept</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedAppointment && (
        <Modal
          isOpen={!!selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
          title={`Booking Details: ${selectedAppointment.bookingId}`}
          subtitle={`Status: ${selectedAppointment.appointmentStatus}`}
        >
          <div className="space-y-4 text-xs font-sans">
            <div className="grid grid-cols-2 gap-4 pb-3 border-b border-[#E8DFC8]">
              <div>
                <span className="text-[#8C8479] font-bold uppercase text-[10px]">Client Name</span>
                <strong className="text-sm text-[#143823] block">{selectedAppointment.userName}</strong>
                <span className="text-xs text-[#7A7369]">{selectedAppointment.userPhone}</span>
              </div>
              <div>
                <span className="text-[#8C8479] font-bold uppercase text-[10px]">Service</span>
                <strong className="text-sm text-[#143823] block">{selectedAppointment.serviceName}</strong>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pb-3 border-b border-[#E8DFC8]">
              <div>
                <span className="text-[#8C8479] font-bold uppercase text-[10px]">Date & Time</span>
                <p className="text-sm font-bold text-[#143823]">{selectedAppointment.date} at {selectedAppointment.timeSlot}</p>
              </div>
              <div>
                <span className="text-[#8C8479] font-bold uppercase text-[10px]">Guests & Event</span>
                <p className="text-sm text-[#143823]">{selectedAppointment.numberOfPeople} Person(s) • {selectedAppointment.eventType}</p>
              </div>
            </div>

            <div className="pb-3 border-b border-[#E8DFC8]">
              <span className="text-[#8C8479] font-bold uppercase text-[10px]">Full Venue Address</span>
              <p className="text-sm text-[#143823] font-medium">{selectedAppointment.address}</p>
            </div>

            {selectedAppointment.specialRequirements && (
              <div className="pb-3 border-b border-[#E8DFC8]">
                <span className="text-[#8C8479] font-bold uppercase text-[10px]">Special Client Notes</span>
                <p className="text-xs text-[#5C554E]">{selectedAppointment.specialRequirements}</p>
              </div>
            )}

            <div className="flex justify-between items-center text-sm font-bold text-[#143823] pt-2">
              <span>Total Booking Amount:</span>
              <span className="font-serif text-xl">₹{selectedAppointment.totalAmount?.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </Modal>
      )}

      {/* Reject Modal with Mandatory Reason (Prompt Item 14) */}
      {rejectModalApt && (
        <ConfirmModal
          isOpen={!!rejectModalApt}
          onClose={() => setRejectModalApt(null)}
          onConfirm={handleRejectConfirm}
          title={`Reject Appointment Request (${rejectModalApt.bookingId})`}
          message="Please state the reason for rejecting this client's booking request. The client will be notified immediately."
          confirmText="Confirm Reject"
          isDanger={true}
          requiresInput={true}
          inputLabel="Reason for rejection"
          inputPlaceholder="Artist unavailable on selected date / Prior personal commitment..."
          inputValue="Artist unavailable on selected date"
        />
      )}
    </div>
  );
}
