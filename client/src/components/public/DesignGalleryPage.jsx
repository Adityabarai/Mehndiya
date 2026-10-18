import React, { useState, useEffect } from 'react';
import { Heart, Search, Sparkles, Eye, Filter, ArrowRight } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Modal from '../common/Modal';
import EmptyState from '../common/EmptyState';

export default function DesignGalleryPage({ onNavigate, onOpenBooking }) {
  const [designs, setDesigns] = useState([]);
  const [categories, setCategories] = useState([
    'All',
    'Bridal',
    'Arabic',
    'Traditional',
    'Minimal',
    'Indo-Arabic',
    'Engagement',
    'Feet',
    'Kids',
    'Festival'
  ]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const { user, isAuthenticated } = useAuth();
  const { toastSuccess, toastInfo } = useToast();

  useEffect(() => {
    const params = {};
    if (selectedCategory !== 'All') params.category = selectedCategory;
    if (search) params.search = search;

    api.getDesigns(params)
      .then(res => {
        if (res.success) setDesigns(res.data);
      })
      .catch(console.error);

    if (user) {
      api.getUserFavorites(user.id)
        .then(res => {
          if (res.success) setFavorites(res.data.map(d => d.id));
        })
        .catch(() => {});
    }
  }, [selectedCategory, search, user]);

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
      toastInfo('Please login to save designs to your favorites');
      onNavigate('login');
      return;
    }
    try {
      const res = await api.toggleFavorite(user.id, designId);
      if (res.success) {
        if (res.favorited) {
          setFavorites(prev => [...prev, designId]);
          toastSuccess('Saved to Favorites!');
        } else {
          setFavorites(prev => prev.filter(id => id !== designId));
          toastInfo('Removed from Favorites');
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#143823]/10 border border-[#D4AF37]/30 text-[#143823] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Signature Lookbook</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#143823] tracking-tight">
            Mehndi Design Gallery
          </h1>
          <p className="text-sm text-[#6B645C] max-w-2xl">
            Browse our curated library of authentic bridal heirlooms, contemporary Arabic vines, traditional Marwari motifs, and minimalist accents.
          </p>
        </div>

        {/* Search & Categories Bar */}
        <div className="bg-white p-5 rounded-3xl border border-[#E8DFC8] shadow-sm mb-10 space-y-4">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-[#8C8479] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search design title, category, or artist..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E8DFC8] text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 bg-[#FAF7F2]"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#143823] text-[#F3E5AB] shadow-md shadow-[#143823]/20'
                    : 'bg-[#FAF7F2] text-[#5C554E] hover:text-[#143823] border border-[#E8DFC8]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Design Grid */}
        {designs.length === 0 ? (
          <EmptyState
            title="No Designs Found"
            description="No mehndi designs match your selected category and search query. Try another search term."
            icon={Search}
            actionText="View All Designs"
            onAction={() => { setSelectedCategory('All'); setSearch(''); }}
          />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {designs.map(design => {
              const isFav = favorites.includes(design.id);
              return (
                <div
                  key={design.id}
                  onClick={() => setSelectedDesign(design)}
                  className="group bg-white rounded-3xl overflow-hidden border border-[#E8DFC8] shadow-sm hover:shadow-xl hover:border-[#D4AF37] transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="relative aspect-square overflow-hidden bg-stone-100">
                    <img
                      src={design.imageUrl}
                      alt={design.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Category Pill */}
                    <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-[#FAF7F2]/90 backdrop-blur-sm border border-[#D4AF37]/30 text-[10px] font-bold text-[#143823]">
                      {design.category}
                    </div>

                    {/* Action buttons overlay */}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      <button
                        onClick={(e) => handleToggleFavorite(e, design.id)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm transition-all ${
                          isFav
                            ? 'bg-rose-500 text-white'
                            : 'bg-black/40 text-white hover:bg-black/70'
                        }`}
                        title="Save to Favorites"
                      >
                        <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 text-white">
                      <p className="font-serif font-bold text-sm leading-snug">{design.title}</p>
                      <p className="text-[11px] text-[#F3E5AB]">By {design.artistName}</p>
                    </div>
                  </div>

                  <div className="p-4 flex items-center justify-between text-xs">
                    <div>
                      <h4 className="font-bold text-[#143823] truncate max-w-[130px]">
                        {design.title}
                      </h4>
                      <p className="text-[10px] text-[#7A7369]">{design.artistName}</p>
                    </div>

                    <button
                      onClick={(e) => handleLike(e, design.id)}
                      className="flex items-center gap-1 text-[#7A7369] hover:text-rose-500 font-semibold"
                    >
                      <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                      <span>{design.likes}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
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
                  <span>{favorites.includes(selectedDesign.id) ? 'Favorited ❤️' : 'Save to Favorites'}</span>
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
    </div>
  );
}
