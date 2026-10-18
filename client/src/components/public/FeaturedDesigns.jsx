import React, { useEffect, useState } from 'react';
import { Heart, Sparkles, Eye, ArrowRight } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Modal from '../common/Modal';

export default function FeaturedDesigns({ onNavigate, onOpenBooking }) {
  const [designs, setDesigns] = useState([]);
  const [categories, setCategories] = useState(['All', 'Bridal', 'Arabic', 'Traditional', 'Minimal', 'Indo-Arabic', 'Engagement', 'Feet', 'Kids', 'Festival']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDesign, setSelectedDesign] = useState(null);
  const { user, isAuthenticated } = useAuth();
  const { toastSuccess, toastInfo } = useToast();

  useEffect(() => {
    api.getDesigns({ category: selectedCategory === 'All' ? undefined : selectedCategory })
      .then(res => {
        if (res.success) setDesigns(res.data.slice(0, 8));
      })
      .catch(() => {});
  }, [selectedCategory]);

  const handleLike = async (e, designId) => {
    e.stopPropagation();
    try {
      const res = await api.likeDesign(designId);
      if (res.success) {
        setDesigns(prev => prev.map(d => d.id === designId ? { ...d, likes: res.likes } : d));
        toastSuccess('Design liked!');
      }
    } catch {
      toastInfo('Liked!');
    }
  };

  const handleToggleFavorite = async (e, designId) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      toastInfo('Please login to save to your favorites');
      onNavigate('login');
      return;
    }
    try {
      const res = await api.toggleFavorite(user.id, designId);
      if (res.success) {
        toastSuccess(res.favorited ? 'Saved to Favorites!' : 'Removed from Favorites');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className="py-20 bg-[#FAF7F2] border-t border-[#E8DFC8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#143823]/10 border border-[#D4AF37]/30 text-[#143823] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Masterpiece Gallery</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#143823] tracking-tight">
            Featured Mehndi Designs
          </h2>
          <p className="text-sm sm:text-base text-[#6B645C]">
            Explore handcrafted heirloom patterns across Bridal, Arabic, Indo-Arabic, and Contemporary motifs.
          </p>
        </div>

        {/* Categories Pills */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-[#143823] text-[#F3E5AB] shadow-md shadow-[#143823]/20 scale-105'
                  : 'bg-white border border-[#E8DFC8] text-[#5C554E] hover:border-[#D4AF37] hover:text-[#143823]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Designs Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {designs.map(design => (
            <div
              key={design.id}
              onClick={() => setSelectedDesign(design)}
              className="group relative rounded-2xl overflow-hidden bg-white border border-[#E8DFC8] shadow-sm hover:shadow-xl hover:border-[#D4AF37] transition-all cursor-pointer flex flex-col"
            >
              <div className="relative aspect-square overflow-hidden bg-stone-100">
                <img
                  src={design.imageUrl}
                  alt={design.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 text-white">
                  <p className="font-serif font-bold text-sm leading-snug">{design.title}</p>
                  <p className="text-[11px] text-[#F3E5AB] font-sans">by {design.artistName}</p>
                </div>

                {/* Like Button */}
                <button
                  onClick={(e) => handleLike(e, design.id)}
                  className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-black/40 hover:bg-[#143823] backdrop-blur-sm text-white flex items-center justify-center transition-colors"
                  title="Like Design"
                >
                  <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                </button>

                {/* Category Tag */}
                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-[#FAF7F2]/90 backdrop-blur-sm border border-[#D4AF37]/30 text-[10px] font-bold text-[#143823]">
                  {design.category}
                </div>
              </div>

              <div className="p-3 flex items-center justify-between text-xs">
                <span className="font-medium text-[#143823] truncate max-w-[120px]">
                  {design.title}
                </span>
                <span className="text-[11px] text-[#7A7369] flex items-center gap-1 font-semibold">
                  <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
                  {design.likes}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button
            onClick={() => onNavigate('designs')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-[#D4AF37]/50 text-[#143823] font-semibold text-sm hover:bg-white hover:border-[#143823] transition-all"
          >
            <span>Explore All 20+ Gallery Designs</span>
            <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
          </button>
        </div>
      </div>

      {/* Design Detail Modal */}
      {selectedDesign && (
        <Modal
          isOpen={!!selectedDesign}
          onClose={() => setSelectedDesign(null)}
          title={selectedDesign.title}
          subtitle={`By ${selectedDesign.artistName} • Category: ${selectedDesign.category}`}
          maxWidth="max-w-xl"
        >
          <div className="space-y-4">
            <div className="rounded-2xl overflow-hidden max-h-96 bg-black flex items-center justify-center">
              <img
                src={selectedDesign.imageUrl}
                alt={selectedDesign.title}
                className="w-full h-full object-contain"
              />
            </div>

            <p className="text-sm text-[#5C554E] leading-relaxed">
              {selectedDesign.description || 'Intricately handcrafted organic henna artwork designed for celebratory perfection.'}
            </p>

            <div className="flex items-center justify-between pt-3 border-t border-[#E8DFC8]">
              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => handleLike(e, selectedDesign.id)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-[#D4AF37]/40 hover:bg-[#FAF7F2] text-xs font-semibold text-[#143823]"
                >
                  <Heart className="w-4 h-4 text-rose-500 fill-current" />
                  <span>{selectedDesign.likes} Likes</span>
                </button>

                <button
                  onClick={(e) => handleToggleFavorite(e, selectedDesign.id)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-[#143823]/30 hover:bg-[#143823] hover:text-[#F3E5AB] text-xs font-semibold text-[#143823] transition-colors"
                >
                  <span>Save to Favorites</span>
                </button>
              </div>

              <button
                onClick={() => {
                  setSelectedDesign(null);
                  onOpenBooking();
                }}
                className="px-4 py-2 rounded-xl bg-[#143823] hover:bg-[#1C4B30] text-[#F3E5AB] text-xs font-bold shadow-md shadow-[#143823]/20"
              >
                Book This Style
              </button>
            </div>
          </div>
        </Modal>
      )}
    </section>
  );
}
