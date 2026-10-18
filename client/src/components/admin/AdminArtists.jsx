import React, { useState, useEffect } from 'react';
import { 
  Palette, 
  ShieldCheck, 
  Check, 
  X, 
  Eye, 
  Star, 
  MapPin, 
  Search, 
  Filter, 
  DollarSign,
  AlertCircle,
  Plus,
  Trash2
} from 'lucide-react';
import { api } from '../../services/api';
import Modal from '../common/Modal';
import ConfirmModal from '../common/ConfirmModal';
import { useToast } from '../../context/ToastContext';

export default function AdminArtists() {
  const { toastSuccess, toastError } = useToast();
  const [artists, setArtists] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Modals
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [approveConfirmArtist, setApproveConfirmArtist] = useState(null);
  const [rejectConfirmArtist, setRejectConfirmArtist] = useState(null);

  const fetchArtists = () => {
    setLoading(true);
    const params = {};
    if (statusFilter !== 'all') params.status = statusFilter;
    if (search) params.search = search;

    api.getAdminArtists(params)
      .then(res => {
        if (res.success) setArtists(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchArtists();
  }, [statusFilter, search]);

  const handleApprove = async () => {
    if (!approveConfirmArtist) return;
    try {
      const res = await api.approveArtist(approveConfirmArtist.id);
      if (res.success) {
        toastSuccess(`${approveConfirmArtist.name} has been approved and verified!`);
        fetchArtists();
      }
    } catch (err) {
      toastError(err.message || 'Approval failed');
    }
  };

  const handleReject = async () => {
    if (!rejectConfirmArtist) return;
    try {
      const res = await api.rejectArtist(rejectConfirmArtist.id);
      if (res.success) {
        toastSuccess(`${rejectConfirmArtist.name}'s application was rejected.`);
        fetchArtists();
      }
    } catch (err) {
      toastError(err.message || 'Rejection failed');
    }
  };

  const handleToggleVerify = async (artistObj) => {
    try {
      const res = await api.verifyArtist(artistObj.id);
      if (res.success) {
        toastSuccess(`Verified status toggled for ${artistObj.name}`);
        fetchArtists();
      }
    } catch (err) {
      toastError(err.message || 'Verification toggle failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#143823]">
            Artist Verification & Management
          </h1>
          <p className="text-xs sm:text-sm text-[#6B645C]">
            Approve applicant artists, assign verification badges, and oversee partner earnings.
          </p>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E8DFC8] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#8C8479] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search artist name or location..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E8DFC8] bg-[#FAF7F2] text-[#143823] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-[#E8DFC8] bg-[#FAF7F2] text-[#143823]"
          >
            <option value="all">All Approval Statuses</option>
            <option value="pending">Pending Verification</option>
            <option value="approved">Approved & Active</option>
            <option value="verified">Verified Badged Only</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Artists Table */}
      <div className="bg-white rounded-3xl border border-[#E8DFC8] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="bg-[#FAF7F2] border-b border-[#E8DFC8] text-[#8C8479] uppercase text-[10px] font-bold">
                <th className="py-3.5 px-4">Artist Profile</th>
                <th className="py-3.5 px-4">Experience & City</th>
                <th className="py-3.5 px-4">Rating</th>
                <th className="py-3.5 px-4">Bookings</th>
                <th className="py-3.5 px-4">Total Revenue</th>
                <th className="py-3.5 px-4">Approval Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFE9DC]">
              {artists.map(art => (
                <tr key={art.id} className="hover:bg-[#FAF7F2]/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img src={art.profileImage} alt={art.name} className="w-9 h-9 rounded-full object-cover ring-1 ring-[#D4AF37]" />
                        {art.verified && (
                          <div className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-[#143823] text-[#D4AF37]">
                            <ShieldCheck className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                      <div>
                        <strong className="text-[#143823] block text-sm">{art.name}</strong>
                        <span className="text-[11px] text-[#7A7369]">{art.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-[#143823]">{art.location}</span>
                    <span className="block text-[11px] text-[#7A7369]">{art.experience} Exp</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-amber-600 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      {art.rating}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#143823]">
                    {art.totalBookings || 0}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#143823]">
                    ₹{(art.totalEarnings || 0).toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      art.approvalStatus === 'approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : art.approvalStatus === 'pending'
                        ? 'bg-amber-100 text-amber-800 animate-pulse'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {art.approvalStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedArtist(art)}
                        className="px-2.5 py-1 rounded-lg border border-[#D4AF37]/50 text-[#143823] text-[11px] font-semibold hover:bg-[#FAF7F2]"
                      >
                        Details
                      </button>

                      <button
                        onClick={() => handleToggleVerify(art)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                          art.verified
                            ? 'bg-[#143823] text-[#F3E5AB]'
                            : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                        }`}
                        title="Toggle Verified Badge"
                      >
                        {art.verified ? 'Verified ✓' : 'Verify'}
                      </button>

                      {art.approvalStatus === 'pending' && (
                        <>
                          <button
                            onClick={() => setApproveConfirmArtist(art)}
                            className="p-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                            title="Approve Artist"
                          >
                            <Check className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => setRejectConfirmArtist(art)}
                            className="p-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition-colors"
                            title="Reject Artist"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {selectedArtist && (
        <Modal
          isOpen={!!selectedArtist}
          onClose={() => setSelectedArtist(null)}
          title={`Artist Dossier: ${selectedArtist.name}`}
          subtitle={`Status: ${selectedArtist.approvalStatus} • ${selectedArtist.location}`}
        >
          <div className="space-y-4 text-xs font-sans">
            <div className="flex items-center gap-4 pb-4 border-b border-[#E8DFC8]">
              <img src={selectedArtist.profileImage} alt={selectedArtist.name} className="w-16 h-16 rounded-2xl object-cover ring-2 ring-[#D4AF37]" />
              <div>
                <h3 className="font-serif font-bold text-lg text-[#143823]">{selectedArtist.name}</h3>
                <p className="text-xs text-[#7A7369]">{selectedArtist.experience} Experience • {selectedArtist.location}</p>
                <div className="flex gap-2 mt-1">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    Rating: {selectedArtist.rating} ★ ({selectedArtist.reviewCount || 0} reviews)
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                    Starts ₹{selectedArtist.startingPrice}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <span className="text-[#8C8479] font-bold uppercase text-[10px] block mb-1">Artist Bio</span>
              <p className="text-xs text-[#5C554E] leading-relaxed">{selectedArtist.about}</p>
            </div>

            <div>
              <span className="text-[#8C8479] font-bold uppercase text-[10px] block mb-1">Specializations</span>
              <p className="font-semibold text-[#143823]">{selectedArtist.specializations?.join(', ')}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#E8DFC8]">
              <div>
                <span className="text-[#8C8479] font-bold uppercase text-[10px]">Contact Phone</span>
                <p className="text-sm text-[#143823] font-semibold">{selectedArtist.phone}</p>
              </div>
              <div>
                <span className="text-[#8C8479] font-bold uppercase text-[10px]">Home Visit Facility</span>
                <p className="text-sm text-[#143823] font-semibold">{selectedArtist.homeService ? 'Available (Yes)' : 'Studio Only'}</p>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Approve Confirm Modal */}
      {approveConfirmArtist && (
        <ConfirmModal
          isOpen={!!approveConfirmArtist}
          onClose={() => setApproveConfirmArtist(null)}
          onConfirm={handleApprove}
          title={`Approve & Verify ${approveConfirmArtist.name}?`}
          message="Approving this artist will activate their public profile and permit them to receive customer bookings. They will receive an immediate in-app confirmation notification."
          confirmText="Approve Artist"
        />
      )}

      {/* Reject Confirm Modal */}
      {rejectConfirmArtist && (
        <ConfirmModal
          isOpen={!!rejectConfirmArtist}
          onClose={() => setRejectConfirmArtist(null)}
          onConfirm={handleReject}
          title={`Reject Application for ${rejectConfirmArtist.name}?`}
          message="Are you sure you want to decline this artist's registration application?"
          confirmText="Reject Application"
          isDanger={true}
        />
      )}
    </div>
  );
}
