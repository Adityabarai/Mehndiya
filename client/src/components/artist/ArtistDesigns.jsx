import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, Plus, Trash2, Heart, Image as ImageIcon } from 'lucide-react';
import { api } from '../../services/api';
import Modal from '../common/Modal';
import { useToast } from '../../context/ToastContext';

export default function ArtistDesigns() {
  const { artistProfile, user } = useAuth();
  const { toastSuccess, toastError } = useToast();
  const artistId = artistProfile?.id || 'art-1';

  const [designs, setDesigns] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New design form
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Bridal');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);

  const fetchDesigns = () => {
    api.getDesigns({ artistId })
      .then(res => {
        if (res.success) setDesigns(res.data);
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetchDesigns();
  }, [artistId]);

  const handleAddDesign = async (e) => {
    e.preventDefault();
    if (!title || !imageUrl) return;
    setUploading(true);
    try {
      const res = await api.addDesign({
        title,
        category,
        imageUrl,
        description,
        artistId,
        artistName: artistProfile?.name || user?.name || 'Priya Sharma'
      });
      if (res.success) {
        toastSuccess('New design added to your showcase gallery!');
        setIsAddModalOpen(false);
        setTitle('');
        setImageUrl('');
        setDescription('');
        fetchDesigns();
      }
    } catch (err) {
      toastError(err.message || 'Failed to upload');
    } finally {
      setUploading(false);
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

  const categories = ['Bridal', 'Arabic', 'Traditional', 'Minimal', 'Indo-Arabic', 'Engagement', 'Feet', 'Kids', 'Festival'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#143823]">
            My Design Portfolio
          </h1>
          <p className="text-xs sm:text-sm text-[#6B645C]">
            Upload high-resolution photos of your signature henna patterns to attract clients.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#143823] text-[#F3E5AB] font-bold text-xs shadow-md shadow-[#143823]/20 flex items-center gap-1.5 hover:bg-[#1C4B30] transition-all"
        >
          <Plus className="w-4 h-4 text-[#D4AF37]" />
          <span>Upload New Design</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {designs.map(design => (
          <div
            key={design.id}
            className="bg-white rounded-3xl overflow-hidden border border-[#E8DFC8] shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="relative aspect-square overflow-hidden bg-stone-100">
              <img src={design.imageUrl} alt={design.title} className="w-full h-full object-cover" />
              <button
                onClick={() => handleDelete(design.id)}
                className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-md hover:bg-rose-700 transition-colors"
                title="Delete Design"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/60 text-white text-[10px] font-bold">
                {design.category}
              </div>
            </div>

            <div className="p-4 space-y-1 text-xs">
              <h4 className="font-bold text-[#143823] truncate">{design.title}</h4>
              <p className="text-[11px] text-[#7A7369] flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
                <span>{design.likes} Client Likes</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {isAddModalOpen && (
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Upload Mehndi Design to Gallery"
          subtitle="Showcase your craftsmanship to potential brides"
        >
          <form onSubmit={handleAddDesign} className="space-y-4 text-xs font-sans">
            <div>
              <label className="block text-xs font-bold text-[#143823] uppercase mb-1">
                Design Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
                placeholder="e.g. Royal Lotus Bridal Forearms"
                className="w-full p-2.5 rounded-xl border border-[#E8DFC8] text-sm bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#143823] uppercase mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#E8DFC8] text-sm bg-white"
              >
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
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
                placeholder="https://images.unsplash.com/..."
                className="w-full p-2.5 rounded-xl border border-[#E8DFC8] text-sm bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#143823] uppercase mb-1">
                Description / Highlights
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Describe intricacy, motifs used, and ceremony suitability..."
                className="w-full p-2.5 rounded-xl border border-[#E8DFC8] text-sm bg-white"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E8DFC8]">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-[#7A7369]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={uploading}
                className="px-5 py-2.5 rounded-xl bg-[#143823] text-[#F3E5AB] font-bold text-xs shadow-md hover:bg-[#1C4B30]"
              >
                {uploading ? 'Adding...' : 'Add to Portfolio'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
