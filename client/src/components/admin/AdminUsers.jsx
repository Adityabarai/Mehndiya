import React, { useState, useEffect } from 'react';
import { Search, UserCheck, UserX, Trash2, Calendar, Phone, Mail, Shield } from 'lucide-react';
import { api } from '../../services/api';
import Modal from '../common/Modal';
import ConfirmModal from '../common/ConfirmModal';
import { useToast } from '../../context/ToastContext';

export default function AdminUsers() {
  const { toastSuccess, toastError } = useToast();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  // Modals
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteModalUser, setDeleteModalUser] = useState(null);

  const fetchUsers = () => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (roleFilter !== 'all') params.role = roleFilter;
    if (statusFilter !== 'all') params.status = statusFilter;

    api.getAdminUsers(params)
      .then(res => {
        if (res.success) setUsers(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, [search, roleFilter, statusFilter]);

  const handleToggleStatus = async (userObj) => {
    const newStatus = userObj.status === 'active' ? 'inactive' : 'active';
    try {
      const res = await api.updateUserStatus(userObj.id, newStatus);
      if (res.success) {
        toastSuccess(`User status changed to ${newStatus}`);
        fetchUsers();
      }
    } catch (err) {
      toastError(err.message || 'Status update failed');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModalUser) return;
    try {
      const res = await api.deleteUser(deleteModalUser.id);
      if (res.success) {
        toastSuccess('User removed');
        fetchUsers();
      }
    } catch (err) {
      toastError(err.message || 'Failed to delete');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#143823]">
            User & Customer Directory
          </h1>
          <p className="text-xs sm:text-sm text-[#6B645C]">
            Manage client profiles, account activation states, and view booking history.
          </p>
        </div>
      </div>

      {/* Toolbar Search & Filter */}
      <div className="bg-white p-4 rounded-2xl border border-[#E8DFC8] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#8C8479] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, email, or phone..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E8DFC8] bg-[#FAF7F2] text-[#143823] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-[#E8DFC8] bg-[#FAF7F2] text-[#143823]"
          >
            <option value="all">All Roles</option>
            <option value="USER">Customer</option>
            <option value="ARTIST">Artist</option>
            <option value="ADMIN">Admin</option>
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-[#E8DFC8] bg-[#FAF7F2] text-[#143823]"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Users Table (Prompt Item 22) */}
      <div className="bg-white rounded-3xl border border-[#E8DFC8] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="bg-[#FAF7F2] border-b border-[#E8DFC8] text-[#8C8479] uppercase text-[10px] font-bold">
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Phone</th>
                <th className="py-3.5 px-4">Registered Date</th>
                <th className="py-3.5 px-4">Bookings</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFE9DC]">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-[#FAF7F2]/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover ring-1 ring-[#D4AF37]/50" />
                      <div>
                        <strong className="text-[#143823] block text-sm">{u.name}</strong>
                        <span className="text-[#7A7369] text-[11px]">{u.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                      u.role === 'ADMIN'
                        ? 'bg-purple-100 text-purple-800'
                        : u.role === 'ARTIST'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[#5C554E]">{u.phone || 'N/A'}</td>
                  <td className="py-3.5 px-4 text-[#7A7369]">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-[#143823]">{u.totalAppointments || 0}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      u.status === 'active'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedUser(u)}
                        className="px-2.5 py-1 rounded-lg border border-[#D4AF37]/50 text-[#143823] hover:bg-[#FAF7F2] text-[11px] font-semibold"
                        title="View User Details"
                      >
                        Details
                      </button>
                      
                      {u.role !== 'ADMIN' && (
                        <>
                          <button
                            onClick={() => handleToggleStatus(u)}
                            className={`p-1.5 rounded-lg text-xs transition-colors ${
                              u.status === 'active'
                                ? 'text-amber-700 hover:bg-amber-50'
                                : 'text-emerald-700 hover:bg-emerald-50'
                            }`}
                            title={u.status === 'active' ? 'Deactivate User' : 'Activate User'}
                          >
                            {u.status === 'active' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                          </button>

                          <button
                            onClick={() => setDeleteModalUser(u)}
                            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
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

      {/* User Details Modal */}
      {selectedUser && (
        <Modal
          isOpen={!!selectedUser}
          onClose={() => setSelectedUser(null)}
          title={`User Profile: ${selectedUser.name}`}
          subtitle={`Account ID: ${selectedUser.id}`}
        >
          <div className="space-y-4 text-xs font-sans">
            <div className="flex items-center gap-4 pb-4 border-b border-[#E8DFC8]">
              <img src={selectedUser.avatar} alt={selectedUser.name} className="w-16 h-16 rounded-2xl object-cover ring-2 ring-[#D4AF37]" />
              <div>
                <h3 className="font-serif font-bold text-lg text-[#143823]">{selectedUser.name}</h3>
                <p className="text-xs text-[#7A7369]">{selectedUser.email}</p>
                <div className="flex gap-2 mt-1">
                  <span className="px-2 py-0.5 rounded-full bg-[#143823]/10 text-[#143823] font-bold text-[10px] uppercase">
                    Role: {selectedUser.role}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] uppercase">
                    Status: {selectedUser.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[#8C8479] font-bold uppercase text-[10px]">Phone</span>
                <p className="text-sm text-[#143823] font-semibold">{selectedUser.phone || 'N/A'}</p>
              </div>
              <div>
                <span className="text-[#8C8479] font-bold uppercase text-[10px]">Registration Date</span>
                <p className="text-sm text-[#143823]">{new Date(selectedUser.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <span className="text-[#8C8479] font-bold uppercase text-[10px]">Total Appointments</span>
                <p className="text-sm text-[#143823] font-bold">{selectedUser.totalAppointments || 0}</p>
              </div>
              <div>
                <span className="text-[#8C8479] font-bold uppercase text-[10px]">Last Active / Booking</span>
                <p className="text-sm text-[#143823]">{selectedUser.lastBookingDate || 'N/A'}</p>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalUser && (
        <ConfirmModal
          isOpen={!!deleteModalUser}
          onClose={() => setDeleteModalUser(null)}
          onConfirm={handleDeleteConfirm}
          title={`Delete User ${deleteModalUser.name}?`}
          message="Are you sure you want to delete this user account? This action will permanently remove their records."
          confirmText="Delete User"
          isDanger={true}
        />
      )}
    </div>
  );
}
