import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Search, 
  Filter, 
  AlertCircle, 
  CheckCircle2, 
  XCircle,
  FileText,
  RotateCcw
} from 'lucide-react';
import { api } from '../../services/api';
import EmptyState from '../common/EmptyState';
import ConfirmModal from '../common/ConfirmModal';
import Modal from '../common/Modal';
import { useToast } from '../../context/ToastContext';

export default function UserAppointments({ onNavigate, onOpenBooking }) {
  const { user } = useAuth();
  const { toastSuccess, toastError } = useToast();
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [loading, setLoading] = useState(true);

  // Modals
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [cancelModalApt, setCancelModalApt] = useState(null);
  const [rescheduleModalApt, setRescheduleModalApt] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [newTimeSlot, setNewTimeSlot] = useState('11:30 AM');

  const tabs = ['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled', 'Rejected'];

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

  const filteredAppointments = appointments.filter(a => {
    if (activeTab === 'All') return true;
    return a.appointmentStatus.toUpperCase() === activeTab.toUpperCase();
  });

  const handleCancelConfirm = async (reason) => {
    if (!cancelModalApt) return;
    try {
      const res = await api.cancelAppointment(cancelModalApt.id, { cancellationReason: reason });
      if (res.success) {
        toastSuccess('Appointment cancelled successfully');
        fetchAppointments();
      }
    } catch (err) {
      toastError(err.message || 'Failed to cancel');
    }
  };

  const handleRescheduleSubmit = async (e) => {
    e.preventDefault();
    if (!rescheduleModalApt || !newDate || !newTimeSlot) return;
    try {
      const res = await api.rescheduleAppointment(rescheduleModalApt.id, { newDate, newTimeSlot });
      if (res.success) {
        toastSuccess('Appointment rescheduled! Status is now PENDING awaiting artist confirmation.');
        setRescheduleModalApt(null);
        fetchAppointments();
      }
    } catch (err) {
      toastError(err.message || 'Rescheduling conflict');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">CONFIRMED</span>;
      case 'PENDING':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">PENDING</span>;
      case 'COMPLETED':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-300">COMPLETED</span>;
      case 'CANCELLED':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-stone-100 text-stone-700 border border-stone-300">CANCELLED</span>;
      case 'REJECTED':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300">REJECTED</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-stone-100 text-stone-700">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#143823]">
            My Appointments
          </h1>
          <p className="text-xs sm:text-sm text-[#6B645C] font-sans">
            Track appointment requests, upcoming bridal sessions, and past receipts.
          </p>
        </div>

        <button
          onClick={() => onOpenBooking()}
          className="px-5 py-2.5 rounded-xl bg-[#143823] hover:bg-[#1C4B30] text-[#F3E5AB] text-xs font-bold shadow-md shadow-[#143823]/20 flex items-center gap-1.5 transition-all"
        >
          <span>Book Another Service</span>
        </button>
      </div>

      {/* Status Tabs (Prompt Item 11) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar border-b border-[#E8DFC8]">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 px-4 text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === tab
                ? 'text-[#143823] border-b-2 border-[#D4AF37]'
                : 'text-[#7A7369] hover:text-[#143823]'
            }`}
          >
            {tab}
            <span className="ml-1.5 text-[10px] px-1.5 py-0.2 rounded-full bg-stone-100 text-stone-600">
              {tab === 'All' ? appointments.length : appointments.filter(a => a.appointmentStatus.toUpperCase() === tab.toUpperCase()).length}
            </span>
          </button>
        ))}
      </div>

      {/* Appointments List */}
      {filteredAppointments.length === 0 ? (
        <EmptyState
          title={`No ${activeTab === 'All' ? '' : activeTab} Appointments`}
          description="You don't have any bookings matching this status category."
          icon={Calendar}
          actionText="Find an Artist & Book"
          onAction={() => onNavigate('user-artists')}
        />
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map(apt => (
            <div
              key={apt.id}
              className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E8DFC8] shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
            >
              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-xs font-bold text-[#8C6D38] bg-[#FAF7F2] px-2 py-0.5 rounded-md border border-[#E8DFC8]">
                    {apt.bookingId}
                  </span>
                  {getStatusBadge(apt.appointmentStatus)}
                </div>

                <h3 className="font-serif text-lg font-bold text-[#143823] truncate">
                  {apt.serviceName}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-[#6B645C] font-sans">
                  <div>
                    <span className="font-semibold text-[#143823]">Artist:</span> {apt.artistName}
                  </div>
                  <div>
                    <span className="font-semibold text-[#143823]">Date:</span> {apt.date} ({apt.timeSlot})
                  </div>
                  <div className="truncate">
                    <span className="font-semibold text-[#143823]">Location:</span> {apt.location}
                  </div>
                </div>

                {apt.rejectionReason && (
                  <p className="text-xs text-rose-700 bg-rose-50 p-2 rounded-lg border border-rose-200">
                    <strong>Rejection Reason:</strong> {apt.rejectionReason}
                  </p>
                )}

                {apt.cancellationReason && (
                  <p className="text-xs text-stone-600 bg-stone-50 p-2 rounded-lg border border-stone-200">
                    <strong>Cancellation Note:</strong> {apt.cancellationReason}
                  </p>
                )}
              </div>

              {/* Amount & Actions */}
              <div className="w-full md:w-auto flex md:flex-col items-center md:items-end justify-between gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-[#EFE9DC]">
                <div className="text-left md:text-right">
                  <span className="text-[10px] text-[#8C8479] uppercase font-bold block">Total Amount</span>
                  <span className="font-serif text-xl font-bold text-[#143823]">
                    ₹{apt.totalAmount?.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedAppointment(apt)}
                    className="px-3 py-1.5 rounded-xl border border-[#D4AF37]/50 text-xs font-semibold text-[#143823] hover:bg-[#FAF7F2] transition-colors"
                  >
                    View Details
                  </button>

                  {/* Reschedule Button */}
                  {(apt.appointmentStatus === 'PENDING' || apt.appointmentStatus === 'CONFIRMED') && (
                    <button
                      onClick={() => {
                        setRescheduleModalApt(apt);
                        setNewDate(apt.date);
                        setNewTimeSlot(apt.timeSlot);
                      }}
                      className="px-3 py-1.5 rounded-xl border border-blue-300 text-xs font-semibold text-blue-700 hover:bg-blue-50 transition-colors"
                      title="Reschedule Appointment"
                    >
                      Reschedule
                    </button>
                  )}

                  {/* Cancel Button */}
                  {(apt.appointmentStatus === 'PENDING' || apt.appointmentStatus === 'CONFIRMED') && (
                    <button
                      onClick={() => setCancelModalApt(apt)}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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
                <span className="text-[#8C8479] font-bold uppercase text-[10px]">Service</span>
                <strong className="text-sm text-[#143823] block">{selectedAppointment.serviceName}</strong>
              </div>
              <div>
                <span className="text-[#8C8479] font-bold uppercase text-[10px]">Artist</span>
                <strong className="text-sm text-[#143823] block">{selectedAppointment.artistName}</strong>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pb-3 border-b border-[#E8DFC8]">
              <div>
                <span className="text-[#8C8479] font-bold uppercase text-[10px]">Date & Slot</span>
                <p className="text-sm font-bold text-[#143823]">{selectedAppointment.date} at {selectedAppointment.timeSlot}</p>
              </div>
              <div>
                <span className="text-[#8C8479] font-bold uppercase text-[10px]">Event & Guests</span>
                <p className="text-sm text-[#143823]">{selectedAppointment.eventType} • {selectedAppointment.numberOfPeople} Person(s)</p>
              </div>
            </div>

            <div className="pb-3 border-b border-[#E8DFC8]">
              <span className="text-[#8C8479] font-bold uppercase text-[10px]">Venue Address</span>
              <p className="text-sm text-[#143823] font-medium">{selectedAppointment.address}</p>
            </div>

            {selectedAppointment.specialRequirements && (
              <div className="pb-3 border-b border-[#E8DFC8]">
                <span className="text-[#8C8479] font-bold uppercase text-[10px]">Special Instructions</span>
                <p className="text-xs text-[#5C554E]">{selectedAppointment.specialRequirements}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <span className="text-[#8C8479] font-bold uppercase text-[10px]">Payment Status</span>
                <p className="text-sm font-bold text-emerald-800">{selectedAppointment.paymentStatus} ({selectedAppointment.paymentMethod})</p>
              </div>
              <div className="text-right">
                <span className="text-[#8C8479] font-bold uppercase text-[10px]">Total Amount</span>
                <p className="font-serif text-xl font-black text-[#143823]">₹{selectedAppointment.totalAmount?.toLocaleString('en-IN')}</p>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Reschedule Modal */}
      {rescheduleModalApt && (
        <Modal
          isOpen={!!rescheduleModalApt}
          onClose={() => setRescheduleModalApt(null)}
          title={`Reschedule Booking ${rescheduleModalApt.bookingId}`}
          subtitle={`Current: ${rescheduleModalApt.date} (${rescheduleModalApt.timeSlot})`}
        >
          <form onSubmit={handleRescheduleSubmit} className="space-y-4 text-xs font-sans">
            <div>
              <label className="block text-xs font-bold text-[#143823] uppercase tracking-wider mb-1">
                Select New Date *
              </label>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={newDate}
                onChange={e => setNewDate(e.target.value)}
                required
                className="w-full p-3 rounded-xl border border-[#E8DFC8] bg-white text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#143823] uppercase tracking-wider mb-1">
                Select New Time Slot *
              </label>
              <select
                value={newTimeSlot}
                onChange={e => setNewTimeSlot(e.target.value)}
                className="w-full p-3 rounded-xl border border-[#E8DFC8] bg-white text-sm"
              >
                <option value="10:00 AM">10:00 AM</option>
                <option value="11:30 AM">11:30 AM</option>
                <option value="01:00 PM">01:00 PM</option>
                <option value="03:00 PM">03:00 PM</option>
                <option value="05:00 PM">05:00 PM</option>
                <option value="07:00 PM">07:00 PM</option>
              </select>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
              ⚠️ Rescheduling will reset this appointment's status to <strong>PENDING</strong> for the artist to re-verify the new slot.
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E8DFC8]">
              <button
                type="button"
                onClick={() => setRescheduleModalApt(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#5C554E]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#143823] text-[#F3E5AB] text-xs font-bold shadow-md hover:bg-[#1C4B30]"
              >
                Confirm Reschedule
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Cancel Confirmation Modal */}
      {cancelModalApt && (
        <ConfirmModal
          isOpen={!!cancelModalApt}
          onClose={() => setCancelModalApt(null)}
          onConfirm={handleCancelConfirm}
          title={`Cancel Booking ${cancelModalApt.bookingId}`}
          message="Are you sure you want to cancel this appointment request? Please provide a cancellation reason for the artist."
          confirmText="Confirm Cancellation"
          isDanger={true}
          requiresInput={true}
          inputLabel="Reason for Cancellation"
          inputPlaceholder="e.g. Ceremony shifted, family emergency..."
        />
      )}
    </div>
  );
}
