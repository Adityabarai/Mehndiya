import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  Check, 
  X, 
  Eye, 
  CheckCircle2, 
  MessageSquare,
  Search,
  AlertCircle
} from 'lucide-react';
import { api } from '../../services/api';
import EmptyState from '../common/EmptyState';
import ConfirmModal from '../common/ConfirmModal';
import Modal from '../common/Modal';
import { useToast } from '../../context/ToastContext';

export default function ArtistAppointments() {
  const { user, artistProfile } = useAuth();
  const { toastSuccess, toastError } = useToast();
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState('Pending');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Modals
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [rejectModalApt, setRejectModalApt] = useState(null);
  const [cancelModalApt, setCancelModalApt] = useState(null);

  const artistId = artistProfile?.id || 'art-1';
  const tabs = ['Pending', 'Confirmed', 'Today', 'Upcoming', 'Completed', 'Rejected', 'Cancelled', 'All'];

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

  const todayStr = new Date().toISOString().split('T')[0];

  const filteredAppointments = appointments.filter(a => {
    const tabMatch = (() => {
      if (activeTab === 'All') return true;
      if (activeTab === 'Today') return a.date === todayStr && a.appointmentStatus === 'CONFIRMED';
      if (activeTab === 'Upcoming') return a.date >= todayStr && (a.appointmentStatus === 'CONFIRMED' || a.appointmentStatus === 'PENDING');
      return a.appointmentStatus.toUpperCase() === activeTab.toUpperCase();
    })();

    if (!tabMatch) return false;

    if (search) {
      const q = search.toLowerCase();
      return (
        a.bookingId.toLowerCase().includes(q) ||
        a.userName.toLowerCase().includes(q) ||
        a.serviceName.toLowerCase().includes(q) ||
        a.location.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleAccept = async (id) => {
    try {
      const res = await api.acceptAppointment(id);
      if (res.success) {
        toastSuccess('Appointment confirmed!');
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
        toastSuccess('Appointment rejected with reason.');
        fetchAppointments();
      }
    } catch (err) {
      toastError(err.message || 'Failed to reject');
    }
  };

  const handleComplete = async (id) => {
    try {
      const res = await api.completeAppointment(id);
      if (res.success) {
        toastSuccess('Appointment marked as COMPLETED! Customer invited to leave a review.');
        fetchAppointments();
      }
    } catch (err) {
      toastError(err.message || 'Failed to complete');
    }
  };

  const handleContactCustomer = (apt) => {
    const phone = apt.userPhone || '+91 98765 43210';
    const text = `Hello ${apt.userName}! I am contacting you regarding your Mehndi appointment (${apt.bookingId}) on ${apt.date}.`;
    window.open(`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">CONFIRMED</span>;
      case 'PENDING':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">PENDING</span>;
      case 'COMPLETED':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-300">COMPLETED</span>;
      case 'CANCELLED':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-700 border border-stone-300">CANCELLED</span>;
      case 'REJECTED':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">REJECTED</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-700">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#143823]">
          Appointment Management
        </h1>
        <p className="text-xs sm:text-sm text-[#6B645C]">
          Review requests, confirm schedules, view event locations, and mark sessions as completed.
        </p>
      </div>

      {/* Tabs & Search Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar border-b border-[#E8DFC8]">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 px-3.5 text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === tab
                  ? 'text-[#143823] border-b-2 border-[#D4AF37]'
                  : 'text-[#7A7369] hover:text-[#143823]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-[#8C8479] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by client name, booking ID, or venue..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#E8DFC8] bg-white text-xs text-[#143823] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40"
          />
        </div>
      </div>

      {/* List */}
      {filteredAppointments.length === 0 ? (
        <EmptyState
          title={`No ${activeTab} appointments found`}
          description="There are currently no bookings under this status tab."
          icon={Calendar}
        />
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map(apt => (
            <div
              key={apt.id}
              className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E8DFC8] shadow-sm hover:shadow-md transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5"
            >
              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="font-mono text-[11px] font-bold text-[#8C6D38] bg-[#FAF7F2] px-2 py-0.5 rounded-md border border-[#E8DFC8]">
                    {apt.bookingId}
                  </span>
                  {getStatusBadge(apt.appointmentStatus)}
                  <span className="text-xs font-semibold text-[#143823] font-sans">
                    Client: {apt.userName} ({apt.userPhone})
                  </span>
                </div>

                <h3 className="font-serif text-lg font-bold text-[#143823] truncate">
                  {apt.serviceName}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-[#6B645C] font-sans">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{apt.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{apt.timeSlot}</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                    <span className="truncate">{apt.address || apt.location}</span>
                  </div>
                </div>

                {apt.rejectionReason && (
                  <p className="text-xs text-rose-700 bg-rose-50 p-2 rounded-lg border border-rose-200">
                    <strong>Rejection Reason:</strong> {apt.rejectionReason}
                  </p>
                )}
              </div>

              {/* Amount & Actions */}
              <div className="w-full lg:w-auto flex lg:flex-col items-center lg:items-end justify-between gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-[#EFE9DC]">
                <div className="text-left lg:text-right">
                  <span className="text-[10px] text-[#8C8479] uppercase font-bold block">Amount</span>
                  <span className="font-serif text-xl font-bold text-[#143823]">
                    ₹{apt.totalAmount?.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleContactCustomer(apt)}
                    className="px-3 py-1.5 rounded-xl border border-emerald-600 text-emerald-800 text-xs font-bold hover:bg-emerald-50 transition-colors flex items-center gap-1"
                    title="WhatsApp Client"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Contact</span>
                  </button>

                  <button
                    onClick={() => setSelectedAppointment(apt)}
                    className="px-3 py-1.5 rounded-xl border border-[#D4AF37]/50 text-xs font-semibold text-[#143823] hover:bg-[#FAF7F2] transition-colors"
                  >
                    View Details
                  </button>

                  {/* Accept / Reject when PENDING */}
                  {apt.appointmentStatus === 'PENDING' && (
                    <>
                      <button
                        onClick={() => setRejectModalApt(apt)}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleAccept(apt.id)}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-[#F3E5AB] bg-[#143823] hover:bg-[#1C4B30] shadow-sm transition-all"
                      >
                        Accept
                      </button>
                    </>
                  )}

                  {/* Complete when CONFIRMED */}
                  {apt.appointmentStatus === 'CONFIRMED' && (
                    <button
                      onClick={() => handleComplete(apt.id)}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 shadow-sm transition-all flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Mark Completed</span>
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
                <span className="text-[#8C8479] font-bold uppercase text-[10px]">Client Name</span>
                <strong className="text-sm text-[#143823] block">{selectedAppointment.userName}</strong>
                <span className="text-xs text-[#7A7369]">{selectedAppointment.userPhone}</span>
              </div>
              <div>
                <span className="text-[#8C8479] font-bold uppercase text-[10px]">Package</span>
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
                <span className="text-[#8C8479] font-bold uppercase text-[10px]">Client Notes / Portrait Request</span>
                <p className="text-xs text-[#5C554E]">{selectedAppointment.specialRequirements}</p>
              </div>
            )}

            <div className="flex justify-between items-center text-sm font-bold text-[#143823] pt-2">
              <span>Payment ({selectedAppointment.paymentStatus}):</span>
              <span className="font-serif text-xl">₹{selectedAppointment.totalAmount?.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </Modal>
      )}

      {/* Reject Modal with mandatory reason (Prompt Item 14) */}
      {rejectModalApt && (
        <ConfirmModal
          isOpen={!!rejectModalApt}
          onClose={() => setRejectModalApt(null)}
          onConfirm={handleRejectConfirm}
          title={`Reject Appointment (${rejectModalApt.bookingId})`}
          message="Please state the reason for rejecting this booking request. The client will be notified immediately."
          confirmText="Confirm Reject"
          isDanger={true}
          requiresInput={true}
          inputLabel="Reason for rejection"
          inputPlaceholder="Artist unavailable on selected date..."
          inputValue="Artist unavailable on selected date"
        />
      )}
    </div>
  );
}
