import React, { useState, useEffect } from 'react';
import { Layers, Plus, Edit3, Trash2, Clock, Check } from 'lucide-react';
import { api } from '../../services/api';
import Modal from '../common/Modal';
import ConfirmModal from '../common/ConfirmModal';
import { useToast } from '../../context/ToastContext';

export default function AdminServices() {
  const { toastSuccess, toastError } = useToast();
  const [services, setServices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [deleteModalService, setDeleteModalService] = useState(null);

  // Form
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Bridal');
  const [basePrice, setBasePrice] = useState(3000);
  const [duration, setDuration] = useState('3 - 4 Hours');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');

  const fetchServices = () => {
    api.getServices({ all: 'true' })
      .then(res => {
        if (res.success) setServices(res.data);
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleOpenAdd = () => {
    setEditingService(null);
    setName('');
    setCategory('Bridal');
    setBasePrice(3500);
    setDuration('3 - 4 Hours');
    setDescription('');
    setImage('https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?auto=format&fit=crop&w=600&q=80');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (srv) => {
    setEditingService(srv);
    setName(srv.name);
    setCategory(srv.category);
    setBasePrice(srv.basePrice);
    setDuration(srv.duration);
    setDescription(srv.description);
    setImage(srv.image);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingService) {
        const res = await api.updateService(editingService.id, {
          name, category, basePrice, duration, description, image
        });
        if (res.success) toastSuccess('Service package updated!');
      } else {
        const res = await api.createService({
          name, category, basePrice, duration, description, image
        });
        if (res.success) toastSuccess('New service package published!');
      }
      setIsModalOpen(false);
      fetchServices();
    } catch (err) {
      toastError(err.message || 'Operation failed');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModalService) return;
    try {
      const res = await api.deleteService(deleteModalService.id);
      if (res.success) {
        toastSuccess('Service deleted');
        fetchServices();
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
            Service Packages Management
          </h1>
          <p className="text-xs sm:text-sm text-[#6B645C]">
            Create, update, and manage official platform mehndi packages and baseline prices.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-[#143823] text-[#F3E5AB] font-bold text-xs shadow-md shadow-[#143823]/20 flex items-center gap-1.5 hover:bg-[#1C4B30] transition-all"
        >
          <Plus className="w-4 h-4 text-[#D4AF37]" />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map(srv => (
          <div
            key={srv.id}
            className="bg-white rounded-3xl p-6 border border-[#E8DFC8] shadow-sm flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-[#FAF7F2] border border-[#D4AF37]/30 text-[10px] font-bold text-[#143823]">
                  {srv.category}
                </span>
                <span className="text-xs text-[#8C8479] flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#D4AF37]" />
                  {srv.duration}
                </span>
              </div>

              <h3 className="font-serif text-lg font-bold text-[#143823]">{srv.name}</h3>
              <p className="text-xs text-[#6B645C] line-clamp-2 leading-relaxed">{srv.description}</p>
            </div>

            <div className="pt-3 border-t border-[#EFE9DC] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#8C8479] uppercase font-bold block">Base Price</span>
                <span className="font-serif text-xl font-bold text-[#143823]">
                  ₹{srv.basePrice?.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenEdit(srv)}
                  className="p-2 rounded-xl text-stone-600 hover:bg-[#FAF7F2] transition-colors"
                  title="Edit Service"
                >
                  <Edit3 className="w-4 h-4 text-[#143823]" />
                </button>
                <button
                  onClick={() => setDeleteModalService(srv)}
                  className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Delete Service"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingService ? 'Edit Service Package' : 'Create New Service Package'}
        >
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
            <div>
              <label className="block text-xs font-bold text-[#143823] uppercase mb-1">
                Service Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="w-full p-2.5 rounded-xl border border-[#E8DFC8] bg-white text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#143823] uppercase mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E8DFC8] bg-white text-sm"
                >
                  <option value="Bridal">Bridal</option>
                  <option value="Engagement">Engagement</option>
                  <option value="Arabic">Arabic</option>
                  <option value="Party">Party</option>
                  <option value="Minimal">Minimal</option>
                  <option value="Festival">Festival</option>
                  <option value="Home Service">Home Service</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#143823] uppercase mb-1">
                  Base Price (₹) *
                </label>
                <input
                  type="number"
                  value={basePrice}
                  onChange={e => setBasePrice(Number(e.target.value))}
                  required
                  className="w-full p-2.5 rounded-xl border border-[#E8DFC8] bg-white text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#143823] uppercase mb-1">
                  Duration
                </label>
                <input
                  type="text"
                  value={duration}
                  onChange={e => setDuration(e.target.value)}
                  placeholder="e.g. 4 - 6 Hours"
                  className="w-full p-2.5 rounded-xl border border-[#E8DFC8] bg-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#143823] uppercase mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  value={image}
                  onChange={e => setImage(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E8DFC8] bg-white text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#143823] uppercase mb-1">
                Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#E8DFC8] bg-white text-sm"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E8DFC8]">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-[#5C554E]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#143823] text-[#F3E5AB] font-bold text-xs shadow-md"
              >
                {editingService ? 'Save Package' : 'Publish Service'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Modal */}
      {deleteModalService && (
        <ConfirmModal
          isOpen={!!deleteModalService}
          onClose={() => setDeleteModalService(null)}
          onConfirm={handleDeleteConfirm}
          title={`Delete ${deleteModalService.name}?`}
          message="Are you sure you want to remove this service package? Existing bookings will retain their records."
          confirmText="Delete Package"
          isDanger={true}
        />
      )}
    </div>
  );
}
