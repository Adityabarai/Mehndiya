import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Search, 
  Filter, 
  User, 
  Palette, 
  Check, 
  X, 
  Eye, 
  UserCheck,
  AlertCircle
} from 'lucide-react';
import { api } from '../../services/api';
import Modal from '../common/Modal';
import ConfirmModal from '../common/ConfirmModal';
import { useToast } from '../../context/ToastContext';

export default function AdminAppointments() {
  const { toastSuccess, toastError } = useToast();
  const [appointments, setAppointments] = useState([]);
  const [artists, setArtists] = useState([]);
  
  // Filters matching Prompt Item 25
  const [statusFilter, setStatusFilter] = useState('all');
  const [artistFilter, setArtistFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Modals
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [reassignModalApt, setReassignModalApt] = useState(null);
  const [newArtistId, setNewArtistId] = useState('');
  const [statusChangeModalApt, setStatusChangeModalApt] = useState(null);
  const [newStatus, setNewStatus] = useState('CONFIRMED');

  const fetchAppointments = () => {
    setLoading(true);
    const params = {};
    if (statusFilter !== 'all') params.status = statusFilter;
    if (artistFilter !== 'all') params.artistId = artistFilter;
    if (dateFilter) params.date = dateFilter;
    if (locationFilter !== 'all') params.location = locationFilter;
    if (search) params.search = search;

    api.getAdminAppointments(params)
      .then(res => {
        if (res.success) setAppointments(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    api.getAdminArtists().then(res => {
      if (res.success) setArtists(res.data);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [statusFilter, artistFilter, dateFilter, locationFilter, search]);

  const handleStatusChangeSubmit = async () => {
    if (!statusChangeModalApt) return;
    try {
      const res = await api.updateAppointmentStatus(statusChangeModalApt.id, newStatus);
      if (res.success) {
        toastSuccess(`Appointment status overridden to ${newStatus}`);
        setStatusChangeModalApt(null);
        fetchAppointments();
      }
    } catch (err) {
      toastError(err.message || 'Status override failed');
    }
  };

  const handleReassignSubmit = async (e) => {
    e.preventDefault();
    if (!reassignModalApt || !newArtistId) return;
    try {
      const res = await api.reassignAppointment(reassignModalApt.id, newArtistId);
      if (res.success) {
        toastSuccess(res.message);
        setReassignModalApt(null);
        fetchAppointments();
      }
    } catch (err) {
      toastError(err.message || 'Reassign failed');
    }
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#143823]">
            Global Appointments Control
          </h1>
          <p className="text-xs sm:text-sm text-[#6B645C]">
            Filter, inspect, reassign artists, and manage lifecycle statuses across all platform bookings.
          </p>
        </div>
      </div>

      {/* Multi-Filter Toolbar (Prompt Item 25) */}
      <div className="bg-white p-5 rounded-3xl border border-[#E8DFC8] shadow-sm space-y-4 text-xs font-sans">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#8C8479] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search ID, customer, artist..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E8DFC8] bg-[#FAF7F2] text-[#143823]"
            />
          </div>

          {/* Status filter */}
          <div>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#E8DFC8] bg-[#FAF7F2] text-[#143823]"
            >
              <option value="all">All Statuses</option>
              <option value="PENDING">PENDING</option>
              <option value="CONFIRMED">CONFIRMED</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="CANCELLED">CANCELLED</option>
              <option value="REJECTED">REJECTED</option>
            </select>
          </div>

          {/* Artist filter */}
          <div>
            <select
              value={artistFilter}
              onChange={e => setArtistFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#E8DFC8] bg-[#FAF7F2] text-[#143823]"
            >
              <option value="all">All Artists</option>
              {artists.map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>

          {/* City Location filter */}
          <div>
            <select
              value={locationFilter}
              onChange={e => setLocationFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#E8DFC8] bg-[#FAF7F2] text-[#143823]"
            >
              <option value="all">All Locations</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Jaipur">Jaipur</option>
              <option value="Delhi NCR">Delhi NCR</option>
              <option value="Bengaluru">Bengaluru</option>
              <option value="Udaipur">Udaipur</option>
            </select>
          </div>

          {/* Date filter */}
          <div>
            <input
              type="date"
              value={dateFilter}
              onChange={e => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#E8DFC8] bg-[#FAF7F2] text-[#143823]"
            />
          </div>
        </div>
      </div>

      {/* Appointments Master Table */}
      <div className="bg-white rounded-3xl border border-[#E8DFC8] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="bg-[#FAF7F2] border-b border-[#E8DFC8] text-[#8C8479] uppercase text-[10px] font-bold">
                <th className="py-3.5 px-4">Booking ID</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Artist</th>
                <th className="py-3.5 px-4">Service</th>
                <th className="py-3.5 px-4">Date & Slot</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFE9DC]">
              {appointments.map(apt => (
                <tr key={apt.id} className="hover:bg-[#FAF7F2]/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#8C6D38]">{apt.bookingId}</td>
                  <td className="py-3.5 px-4">
                    <strong className="text-[#143823] block">{apt.userName}</strong>
                    <span className="text-[11px] text-[#7A7369]">{apt.userPhone}</span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-[#143823]">{apt.artistName}</td>
                  <td className="py-3.5 px-4 text-[#5C554E]">{apt.serviceName}</td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-[#143823]">{apt.date}</span>
                    <span className="block text-[11px] text-[#7A7369]">{apt.timeSlot}</span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#143823]">₹{apt.totalAmount?.toLocaleString('en-IN')}</td>
                  <td className="py-3.5 px-4">{getStatusBadge(apt.appointmentStatus)}</td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedAppointment(apt)}
                        className="px-2.5 py-1 rounded-lg border border-[#D4AF37]/50 text-[#143823] text-[11px] font-semibold hover:bg-[#FAF7F2]"
                      >
                        Details
                      </button>

                      <button
                        onClick={() => {
                          setStatusChangeModalApt(apt);
                          setNewStatus(apt.appointmentStatus);
                        }}
                        className="px-2.5 py-1 rounded-lg border border-stone-300 text-stone-700 text-[11px] font-medium hover:bg-stone-50"
                        title="Override Status"
                      >
                        Status
                      </button>

                      <button
                        onClick={() => {
                          setReassignModalApt(apt);
                          setNewArtistId(artists[0]?.id || '');
                        }}
                        className="px-2.5 py-1 rounded-lg border border-purple-300 text-purple-800 text-[11px] font-medium hover:bg-purple-50"
                        title="Reassign Artist"
                      >
                        Reassign
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {selectedAppointment && (
        <Modal
          isOpen={!!selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
          title={`Booking File: ${selectedAppointment.bookingId}`}
          subtitle={`Platform Status: ${selectedAppointment.appointmentStatus}`}
        >
          <div className="space-y-4 text-xs font-sans">
            <div className="grid grid-cols-2 gap-4 pb-3 border-b border-[#E8DFC8]">
              <div>
                <span className="text-[#8C8479] font-bold uppercase text-[10px]">Client</span>
                <strong className="text-sm text-[#143823] block">{selectedAppointment.userName}</strong>
                <p className="text-[#7A7369]">{selectedAppointment.userPhone} • {selectedAppointment.userEmail}</p>
              </div>
              <div>
                <span className="text-[#8C8479] font-bold uppercase text-[10px]">Assigned Artist</span>
                <strong className="text-sm text-[#143823] block">{selectedAppointment.artistName}</strong>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pb-3 border-b border-[#E8DFC8]">
              <div>
                <span className="text-[#8C8479] font-bold uppercase text-[10px]">Ceremony & Date</span>
                <p className="text-sm font-bold text-[#143823]">{selectedAppointment.date} ({selectedAppointment.timeSlot})</p>
                <p className="text-[#7A7369]">{selectedAppointment.serviceName}</p>
              </div>
              <div>
                <span className="text-[#8C8479] font-bold uppercase text-[10px]">Guest Count & Type</span>
                <p className="text-sm text-[#143823]">{selectedAppointment.numberOfPeople} Person(s) • {selectedAppointment.eventType}</p>
              </div>
            </div>

            <div className="pb-3 border-b border-[#E8DFC8]">
              <span className="text-[#8C8479] font-bold uppercase text-[10px]">Venue Location</span>
              <p className="text-sm text-[#143823]">{selectedAppointment.address || selectedAppointment.location}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <span className="text-[#8C8479] font-bold uppercase text-[10px]">Payment Ledger</span>
                <p className="text-sm font-bold text-emerald-800">{selectedAppointment.paymentStatus} ({selectedAppointment.paymentMethod})</p>
                {selectedAppointment.transactionId && <span className="font-mono text-[10px] text-[#7A7369]">{selectedAppointment.transactionId}</span>}
              </div>
              <div className="text-right">
                <span className="text-[#8C8479] font-bold uppercase text-[10px]">Total Fee</span>
                <p className="font-serif text-xl font-black text-[#143823]">₹{selectedAppointment.totalAmount?.toLocaleString('en-IN')}</p>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Reassign Artist Modal (Prompt Item 25) */}
      {reassignModalApt && (
        <Modal
          isOpen={!!reassignModalApt}
          onClose={() => setReassignModalApt(null)}
          title={`Reassign Booking ${reassignModalApt.bookingId}`}
          subtitle={`Current Artist: ${reassignModalApt.artistName}`}
        >
          <form onSubmit={handleReassignSubmit} className="space-y-4 text-xs font-sans">
            <div>
              <label className="block text-xs font-bold text-[#143823] uppercase mb-1">
                Select New Verified Artist *
              </label>
              <select
                value={newArtistId}
                onChange={e => setNewArtistId(e.target.value)}
                required
                className="w-full p-3 rounded-xl border border-[#E8DFC8] bg-white text-sm"
              >
                {artists.filter(a => a.id !== reassignModalApt.artistId).map(a => (
                  <option key={a.id} value={a.id}>{a.name} ({a.location} • ★ {a.rating})</option>
                ))}
              </select>
            </div>

            <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 text-xs">
              📌 The new artist will receive an instant high-priority in-app notification of the assignment.
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E8DFC8]">
              <button
                type="button"
                onClick={() => setReassignModalApt(null)}
                className="px-4 py-2 text-xs font-semibold text-[#5C554E]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#143823] text-[#F3E5AB] font-bold text-xs shadow-md hover:bg-[#1C4B30]"
              >
                Confirm Reassignment
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Override Status Modal */}
      {statusChangeModalApt && (
        <Modal
          isOpen={!!statusChangeModalApt}
          onClose={() => setStatusChangeModalApt(null)}
          title={`Override Status: ${statusChangeModalApt.bookingId}`}
          subtitle="Super Admin Administrative Override"
        >
          <div className="space-y-4 text-xs font-sans">
            <div>
              <label className="block text-xs font-bold text-[#143823] uppercase mb-1">
                New Status
              </label>
              <select
                value={newStatus}
                onChange={e => setNewStatus(e.target.value)}
                className="w-full p-3 rounded-xl border border-[#E8DFC8] bg-white text-sm"
              >
                <option value="PENDING">PENDING</option>
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="CANCELLED">CANCELLED</option>
                <option value="REJECTED">REJECTED</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E8DFC8]">
              <button
                type="button"
                onClick={() => setStatusChangeModalApt(null)}
                className="px-4 py-2 text-xs font-semibold text-[#5C554E]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleStatusChangeSubmit}
                className="px-5 py-2.5 rounded-xl bg-[#143823] text-[#F3E5AB] font-bold text-xs shadow-md hover:bg-[#1C4B30]"
              >
                Save Status
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
