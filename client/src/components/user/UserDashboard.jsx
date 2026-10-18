import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Search, 
  ArrowRight,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { api } from '../../services/api';
import EmptyState from '../common/EmptyState';
import ConfirmModal from '../common/ConfirmModal';
import Modal from '../common/Modal';
import { useToast } from '../../context/ToastContext';

export default function UserDashboard({ onNavigate, onOpenBooking }) {
  const { user } = useAuth();
  const { toastSuccess, toastError } = useToast();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [cancelModalApt, setCancelModalApt] = useState(null);

  const fetchAppointments = () => {
    if (!user) return;
    setLoading(true);
    api.getMyAppointments({ userId: user.id, userEmail: user.email })
      .then(res => {
        if (res.success) setAppointments(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAppointments();
  }, [user]);

  // Upcoming appointment (soonest confirmed or pending)
  const upcomingAppointment = appointments.find(a => 
    a.appointmentStatus === 'CONFIRMED' || a.appointmentStatus === 'PENDING'
  );

  // Stats
  const total = appointments.length;
  const completed = appointments.filter(a => a.appointmentStatus === 'COMPLETED').length;
  const pending = appointments.filter(a => a.appointmentStatus === 'PENDING').length;
  const cancelled = appointments.filter(a => a.appointmentStatus === 'CANCELLED').length;

  const handleCancelConfirm = async (reason) => {
    if (!cancelModalApt) return;
    try {
      const res = await api.cancelAppointment(cancelModalApt.id, { cancellationReason: reason });
      if (res.success) {
        toastSuccess('Appointment cancelled');
        fetchAppointments();
      }
    } catch (err) {
      toastError(err.message || 'Failed to cancel');
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#143823] to-[#1C4B30] text-[#FAF7F2] p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-[#D4AF37] font-bold text-xs uppercase tracking-wider block mb-1">
            Customer Dashboard
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#F3E5AB]">
            Welcome, {user?.name || 'Customer'}!
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/80 mt-1 max-w-xl font-sans">
            Manage your mehndi bookings, track artist status, and browse heirloom designs.
          </p>
        </div>

        <button
          onClick={() => onOpenBooking()}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#DFB96C] text-[#143823] font-bold text-xs shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 shrink-0"
        >
          <Sparkles className="w-4 h-4 text-[#143823]" />
          <span>Book New Appointment</span>
        </button>
      </div>

      {/* Summary Stats Cards (Prompt Item 5) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E8DFC8] shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C8479]">
            Total Appointments
          </span>
          <p className="font-serif text-2xl font-black text-[#143823] mt-1">{total}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8DFC8] shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
            Completed
          </span>
          <p className="font-serif text-2xl font-black text-emerald-800 mt-1">{completed}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8DFC8] shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
            Pending Approval
          </span>
          <p className="font-serif text-2xl font-black text-amber-800 mt-1">{pending}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8DFC8] shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700">
            Cancelled / Rejected
          </span>
          <p className="font-serif text-2xl font-black text-rose-800 mt-1">{cancelled}</p>
        </div>
      </div>

      {/* Upcoming / Next Appointment Card (Prompt Item 5) */}
      <div className="space-y-3">
        <h2 className="font-serif text-xl font-bold text-[#143823]">
          Upcoming Appointment
        </h2>

        {upcomingAppointment ? (
          <div className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-[#D4AF37]/50 shadow-md space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-[#E8DFC8]">
              <div>
                <span className="text-[10px] font-mono text-[#8C6D38] font-bold tracking-wider">
                  Booking ID: {upcomingAppointment.bookingId}
                </span>
                <h3 className="font-serif text-xl font-bold text-[#143823] mt-0.5">
                  {upcomingAppointment.serviceName}
                </h3>
              </div>

              {/* Status Badge */}
              <span
                className={`px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  upcomingAppointment.appointmentStatus === 'CONFIRMED'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-amber-100 text-amber-800 border border-amber-300'
                }`}
              >
                Status: {upcomingAppointment.appointmentStatus}
              </span>
            </div>

            {/* Appointment Details Grid matching prompt example */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-sans">
              <div className="space-y-1">
                <span className="text-[#8C8479] font-bold block uppercase text-[10px]">Artist</span>
                <span className="font-bold text-[#143823] text-sm">{upcomingAppointment.artistName}</span>
              </div>

              <div className="space-y-1">
                <span className="text-[#8C8479] font-bold block uppercase text-[10px]">Date & Time</span>
                <span className="font-bold text-[#143823] text-sm">
                  {upcomingAppointment.date} at {upcomingAppointment.timeSlot}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[#8C8479] font-bold block uppercase text-[10px]">Location</span>
                <span className="font-bold text-[#143823] text-sm">{upcomingAppointment.location}</span>
                <p className="text-[11px] text-[#7A7369] truncate">{upcomingAppointment.address}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[#8C8479] font-bold block uppercase text-[10px]">Amount</span>
                <span className="font-serif font-black text-[#143823] text-base">
                  ₹{upcomingAppointment.totalAmount?.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Actions matching prompt */}
            <div className="pt-4 border-t border-[#EFE9DC] flex flex-wrap items-center justify-end gap-3">
              <button
                onClick={() => setCancelModalApt(upcomingAppointment)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-rose-600 border border-rose-200 hover:bg-rose-50 transition-colors"
              >
                Cancel Appointment
              </button>
              <button
                onClick={() => setSelectedAppointment(upcomingAppointment)}
                className="px-5 py-2 rounded-xl bg-[#143823] hover:bg-[#1C4B30] text-[#F3E5AB] text-xs font-bold shadow-md shadow-[#143823]/20 transition-all"
              >
                View Appointment
              </button>
            </div>
          </div>
        ) : (
          <EmptyState
            title="No upcoming appointments"
            description="You don't have any pending or confirmed bookings at the moment. Explore our verified mehndi artists to reserve your wedding or celebration date."
            icon={Calendar}
            actionText="Find an Artist"
            onAction={() => onNavigate('user-artists')}
          />
        )}
      </div>

      {/* Quick Links Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
        <div
          onClick={() => onNavigate('user-artists')}
          className="bg-white p-5 rounded-2xl border border-[#E8DFC8] hover:border-[#D4AF37] cursor-pointer shadow-sm hover:shadow-md transition-all group"
        >
          <Search className="w-6 h-6 text-[#143823] group-hover:text-[#8C6D38] mb-2" />
          <h4 className="font-serif font-bold text-sm text-[#143823]">Browse Top Artists</h4>
          <p className="text-xs text-[#7A7369] mt-1">Filter by city, pricing, and bridal specializations.</p>
        </div>

        <div
          onClick={() => onNavigate('user-designs')}
          className="bg-white p-5 rounded-2xl border border-[#E8DFC8] hover:border-[#D4AF37] cursor-pointer shadow-sm hover:shadow-md transition-all group"
        >
          <Sparkles className="w-6 h-6 text-[#143823] group-hover:text-[#8C6D38] mb-2" />
          <h4 className="font-serif font-bold text-sm text-[#143823]">Explore Designs</h4>
          <p className="text-xs text-[#7A7369] mt-1">Discover 9 categories of couture and contemporary mehndi.</p>
        </div>

        <div
          onClick={() => onNavigate('user-appointments')}
          className="bg-white p-5 rounded-2xl border border-[#E8DFC8] hover:border-[#D4AF37] cursor-pointer shadow-sm hover:shadow-md transition-all group"
        >
          <Calendar className="w-6 h-6 text-[#143823] group-hover:text-[#8C6D38] mb-2" />
          <h4 className="font-serif font-bold text-sm text-[#143823]">Appointment History</h4>
          <p className="text-xs text-[#7A7369] mt-1">Check past receipts, invoices, and completed sessions.</p>
        </div>
      </div>

      {/* View Appointment Modal */}
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
                <span className="text-[#8C8479] font-bold block uppercase text-[10px]">Service</span>
                <strong className="text-sm text-[#143823]">{selectedAppointment.serviceName}</strong>
              </div>
              <div>
                <span className="text-[#8C8479] font-bold block uppercase text-[10px]">Artist</span>
                <strong className="text-sm text-[#143823]">{selectedAppointment.artistName}</strong>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pb-3 border-b border-[#E8DFC8]">
              <div>
                <span className="text-[#8C8479] font-bold block uppercase text-[10px]">Date & Slot</span>
                <p className="text-sm font-bold text-[#143823]">{selectedAppointment.date} ({selectedAppointment.timeSlot})</p>
              </div>
              <div>
                <span className="text-[#8C8479] font-bold block uppercase text-[10px]">Guests & Event</span>
                <p className="text-sm text-[#143823]">{selectedAppointment.numberOfPeople} Person(s) • {selectedAppointment.eventType}</p>
              </div>
            </div>

            <div className="pb-3 border-b border-[#E8DFC8]">
              <span className="text-[#8C8479] font-bold block uppercase text-[10px]">Venue Address</span>
              <p className="text-sm text-[#143823]">{selectedAppointment.address}</p>
            </div>

            {selectedAppointment.specialRequirements && (
              <div className="pb-3 border-b border-[#E8DFC8]">
                <span className="text-[#8C8479] font-bold block uppercase text-[10px]">Custom Requests</span>
                <p className="text-xs text-[#5C554E]">{selectedAppointment.specialRequirements}</p>
              </div>
            )}

            <div className="pt-2 flex justify-between items-center text-sm font-bold text-[#143823]">
              <span>Total Price:</span>
              <span className="font-serif text-lg">₹{selectedAppointment.totalAmount?.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </Modal>
      )}

      {/* Cancel Confirmation Modal */}
      {cancelModalApt && (
        <ConfirmModal
          isOpen={!!cancelModalApt}
          onClose={() => setCancelModalApt(null)}
          onConfirm={handleCancelConfirm}
          title={`Cancel Booking ${cancelModalApt.bookingId}`}
          message="Are you sure you want to cancel this appointment request? Please provide a brief cancellation reason for the artist."
          confirmText="Confirm Cancellation"
          isDanger={true}
          requiresInput={true}
          inputLabel="Reason for Cancellation"
          inputPlaceholder="e.g. Schedule conflict, family travel change..."
        />
      )}
    </div>
  );
}
