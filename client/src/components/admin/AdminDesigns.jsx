import React, { useState, useEffect } from 'react';
import { Sparkles, Plus, Trash2, Heart, Star, Check } from 'lucide-react';
import { api } from '../../services/api';
import Modal from '../common/Modal';
import { useToast } from '../../context/ToastContext';

export default function AdminDesigns() {
  const { toastSuccess, toastError } = useToast();
  const [designs, setDesigns] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Bridal');
  const [imageUrl, setImageUrl] = useState('');
  const [artistName, setArtistName] = useState('Priya Sharma');
  const [description, setDescription] = useState('');

  const fetchDesigns = () => {
    api.getDesigns({ category: categoryFilter === 'All' ? undefined : categoryFilter })
      .then(res => {
        if (res.success) setDesigns(res.data);
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetchDesigns();
  }, [categoryFilter]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.addDesign({
        title,
        category,
        imageUrl,
        artistName,
        artistId: 'art-1',
        description
      });
      if (res.success) {
        toastSuccess('Design added to platform gallery!');
        setIsModalOpen(false);
        fetchDesigns();
      }
    } catch (err) {
      toastError(err.message || 'Failed to add design');
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await api.deleteDesign(id);
      if (res.success) {
        toastSuccess('Design removed');
        fetchDesigns();
      }
    } catch (err) {
      toastError(err.message || 'Failed to delete');
    }
  };

  const categories = ['All', 'Bridal', 'Arabic', 'Traditional', 'Minimal', 'Indo-Arabic', 'Engagement', 'Feet', 'Kids', 'Festival'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#143823]">
            Design Gallery Management
          </h1>
          <p className="text-xs sm:text-sm text-[#6B645C]">
            Curate verified mehndi designs, manage category tags, and feature top masterpieces.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#143823] text-[#F3E5AB] font-bold text-xs shadow-md shadow-[#143823]/20 flex items-center gap-1.5 hover:bg-[#1C4B30] transition-all"
        >
          <Plus className="w-4 h-4 text-[#D4AF37]" />
          <span>Upload Design</span>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar border-b border-[#E8DFC8]">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`pb-3 px-3.5 text-xs font-bold whitespace-nowrap transition-all ${
              categoryFilter === cat
                ? 'text-[#143823] border-b-2 border-[#D4AF37]'
                : 'text-[#7A7369] hover:text-[#143823]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {designs.map(d => (
          <div
            key={d.id}
            className="bg-white rounded-3xl overflow-hidden border border-[#E8DFC8] shadow-sm flex flex-col justify-between"
          >
            <div className="relative aspect-square overflow-hidden bg-stone-100">
              <img src={d.imageUrl} alt={d.title} className="w-full h-full object-cover" />
              <button
                onClick={() => handleDelete(d.id)}
                className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-md hover:bg-rose-700 transition-colors"
                title="Remove Design"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-[#143823]/90 text-[#F3E5AB] text-[10px] font-bold">
                {d.category}
              </div>
            </div>

            <div className="p-4 space-y-1 text-xs">
              <h4 className="font-bold text-[#143823] truncate">{d.title}</h4>
              <p className="text-[11px] text-[#7A7369]">Artist: {d.artistName}</p>
              <p className="text-[11px] text-amber-700 font-semibold">{d.likes || 0} Likes</p>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Curate & Publish New Mehndi Design"
        >
          <form onSubmit={handleCreate} className="space-y-4 text-xs font-sans">
            <div>
              <label className="block text-xs font-bold text-[#143823] uppercase mb-1">
                Design Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
                className="w-full p-2.5 rounded-xl border border-[#E8DFC8] text-sm bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#143823] uppercase mb-1">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E8DFC8] text-sm bg-white"
                >
                  {categories.filter(c => c !== 'All').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#143823] uppercase mb-1">
                  Credited Artist
                </label>
                <input
                  type="text"
                  value={artistName}
                  onChange={e => setArtistName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E8DFC8] text-sm bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#143823] uppercase mb-1">
                Image URL *
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={e => setImageUrl(e.target.value)}
                required
                className="w-full p-2.5 rounded-xl border border-[#E8DFC8] text-sm bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#143823] uppercase mb-1">
                Description / Motif Details
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#E8DFC8] text-sm bg-white"
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
                Publish Design
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
